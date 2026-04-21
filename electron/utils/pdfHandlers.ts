import { BrowserWindow, dialog, ipcMain } from "electron";
import { writeFile } from "node:fs/promises";
import path from "path";

export default function registerPdfHandlers() {
  function sanitizeFileName(value: string) {
    const cleaned = value
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .trim();

    return cleaned || "kiinteisto";
  }

  async function waitForReportReady(win: BrowserWindow) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const ready = await win.webContents.executeJavaScript(
        'document.querySelector("[data-pdf-ready=\\"true\\"]") !== null',
      );

      if (ready) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("PDF report did not become ready in time");
  }

  ipcMain.handle(
    "choose-save-pdf-path",
    async (event, payload: { suggestedFileName: string }) => {
      const ownerWindow = BrowserWindow.fromWebContents(event.sender) ?? undefined;
      const options = {
        title: "Tallenna PDF",
        defaultPath: `${sanitizeFileName(payload.suggestedFileName)}.pdf`,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      };

      let canceled = false;
      let filePath: string | undefined;

      try {
        const result = ownerWindow
          ? await dialog.showSaveDialog(ownerWindow, options)
          : await dialog.showSaveDialog(options);

        canceled = result.canceled;
        filePath = result.filePath;
      } catch (error) {
        console.error("choose-save-pdf-path failed", error);
        return null;
      }

      if (canceled || !filePath) {
        console.warn("choose-save-pdf-path returned no path", {
          canceled,
          filePath,
          hasOwnerWindow: Boolean(ownerWindow),
        });
        return null;
      }

      return filePath;
    },
  );

  ipcMain.handle(
    "export-kiinteisto-pdf",
    async (_event, payload: { route: string; outputPath: string }) => {
      const pdfWindow = new BrowserWindow({
        show: false,
        backgroundColor: "#ffffff",
        webPreferences: {
          preload: path.join(__dirname, "../preload.js"),
        },
      });

      try {
        await pdfWindow.loadURL(payload.route);
        await waitForReportReady(pdfWindow);

        const pdfBuffer = await pdfWindow.webContents.printToPDF({
          printBackground: true,
          preferCSSPageSize: true,
          pageSize: "A4",
        });

        await writeFile(payload.outputPath, pdfBuffer);
        return payload.outputPath;
      } catch (error) {
        console.error("export-kiinteisto-pdf failed", error);
        throw error;
      } finally {
        if (!pdfWindow.isDestroyed()) {
          pdfWindow.destroy();
        }
      }
    },
  );
}