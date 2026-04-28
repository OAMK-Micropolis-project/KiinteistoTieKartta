"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerPdfHandlers;
const electron_1 = require("electron");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
function sanitizeFileName(value) {
    const cleaned = value
        .replace(/[\\/:*?"<>|]+/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    return cleaned || "kiinteisto";
}
async function waitForReportReady(win) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
        const ready = await win.webContents.executeJavaScript('document.querySelector("[data-pdf-ready=\\"true\\"]") !== null');
        if (ready) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error("PDF report did not become ready in time");
}
function registerPdfHandlers() {
    electron_1.ipcMain.handle("choose-save-pdf-path", async (event, payload) => {
        const ownerWindow = electron_1.BrowserWindow.fromWebContents(event.sender) ?? undefined;
        const options = {
            title: "Tallenna PDF",
            defaultPath: `${sanitizeFileName(payload.suggestedFileName)}.pdf`,
            filters: [{ name: "PDF", extensions: ["pdf"] }],
        };
        const result = ownerWindow
            ? await electron_1.dialog.showSaveDialog(ownerWindow, options)
            : await electron_1.dialog.showSaveDialog(options);
        if (result.canceled || !result.filePath) {
            return null;
        }
        return result.filePath;
    });
    electron_1.ipcMain.handle("export-kiinteisto-pdf", async (_event, payload) => {
        const pdfWindow = new electron_1.BrowserWindow({
            show: false,
            backgroundColor: "#ffffff",
            webPreferences: {
                preload: node_path_1.default.join(__dirname, "../preload.js"),
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
            await (0, promises_1.writeFile)(payload.outputPath, pdfBuffer);
            return payload.outputPath;
        }
        finally {
            if (!pdfWindow.isDestroyed()) {
                pdfWindow.destroy();
            }
        }
    });
}
