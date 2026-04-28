import { BrowserWindow, dialog, ipcMain } from "electron";
import { writeFile } from "node:fs/promises";
import path from "node:path";

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

export default function registerPdfHandlers() {
  ipcMain.handle(
    "choose-save-pdf-path",
    async (event, payload: { suggestedFileName: string }) => {
      const ownerWindow = BrowserWindow.fromWebContents(event.sender) ?? undefined;
      const options = {
        title: "Tallenna PDF",
        defaultPath: `${sanitizeFileName(payload.suggestedFileName)}.pdf`,
        filters: [{ name: "PDF", extensions: ["pdf"] }],
      };

      const result = ownerWindow
        ? await dialog.showSaveDialog(ownerWindow, options)
        : await dialog.showSaveDialog(options);

      if (result.canceled || !result.filePath) {
        return null;
      }

      return result.filePath;
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
      } finally {
        if (!pdfWindow.isDestroyed()) {
          pdfWindow.destroy();
        }
      }
    },
  );
}
