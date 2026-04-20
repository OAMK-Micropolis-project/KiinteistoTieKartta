"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerPdfExportHandlers;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const electron_1 = require("electron");
const PDF_WINDOW_SIZE = {
    width: 794,
    height: 1123,
};
function buildDefaultPdfPath(fileName) {
    const safeFileName = (fileName?.trim() || "export").replace(/[<>:"/\\|?*]+/g, "_");
    return node_path_1.default.join(electron_1.app.getPath("documents"), `${safeFileName}.pdf`);
}
function buildPrintWindowUrl(route, readyToken) {
    const search = new URLSearchParams({ printReadyToken: readyToken }).toString();
    const routeWithSearch = `${route}?${search}`;
    if (process.env.VITE_DEV_SERVER_URL) {
        return `${process.env.VITE_DEV_SERVER_URL}#${routeWithSearch}`;
    }
    const indexUrl = (0, node_url_1.pathToFileURL)(node_path_1.default.join(__dirname, "../dist/index.html")).toString();
    return `${indexUrl}#${routeWithSearch}`;
}
function waitForPrintReady(printWindow, readyToken) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error("Timed out while waiting for the print page to finish rendering."));
        }, 15000);
        const onReady = (_event, receivedToken) => {
            if (receivedToken !== readyToken) {
                return;
            }
            cleanup();
            resolve();
        };
        const onClosed = () => {
            cleanup();
            reject(new Error("Print window was closed before the PDF was generated."));
        };
        function cleanup() {
            clearTimeout(timeout);
            electron_1.ipcMain.off("pdf-export-ready", onReady);
            printWindow.off("closed", onClosed);
        }
        electron_1.ipcMain.on("pdf-export-ready", onReady);
        printWindow.on("closed", onClosed);
    });
}
function registerPdfExportHandlers() {
    electron_1.ipcMain.handle("export-page-to-pdf", async (_event, options = {}) => {
        const { canceled, filePath } = await electron_1.dialog.showSaveDialog({
            defaultPath: buildDefaultPdfPath(options.fileName),
            filters: [{ name: "PDF", extensions: ["pdf"] }],
        });
        if (canceled || !filePath) {
            return null;
        }
        const readyToken = (0, node_crypto_1.randomUUID)();
        const printWindow = new electron_1.BrowserWindow({
            show: false,
            width: PDF_WINDOW_SIZE.width,
            height: PDF_WINDOW_SIZE.height,
            backgroundColor: "#ffffff",
            autoHideMenuBar: true,
            webPreferences: {
                preload: node_path_1.default.join(__dirname, "./preload.js"),
                backgroundThrottling: false,
            },
        });
        try {
            const readyPromise = waitForPrintReady(printWindow, readyToken);
            await printWindow.loadURL(buildPrintWindowUrl(options.route ?? "/print/summary", readyToken));
            await readyPromise;
            const pdfBuffer = await printWindow.webContents.printToPDF({
                printBackground: true,
                preferCSSPageSize: true,
                pageSize: "A4",
                landscape: options.orientation === "landscape",
                margins: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            });
            await (0, promises_1.writeFile)(filePath, pdfBuffer);
            return filePath;
        }
        finally {
            if (!printWindow.isDestroyed()) {
                printWindow.destroy();
            }
        }
    });
}
