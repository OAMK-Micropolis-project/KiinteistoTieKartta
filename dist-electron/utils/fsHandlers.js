"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerFsHandlers;
const electron_1 = require("electron");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const settingsFile = (0, node_path_1.join)(electron_1.app.getPath("userData"), "settings.json");
function registerFsHandlers() {
    async function loadSettings() {
        try {
            const json = await (0, promises_1.readFile)(settingsFile, "utf8");
            return JSON.parse(json);
        }
        catch {
            return { lastFilePath: null };
        }
    }
    async function saveSettings(settings) {
        await (0, promises_1.writeFile)(settingsFile, JSON.stringify(settings, null, 2));
    }
    electron_1.ipcMain.handle("read-file", async () => {
        const settings = await loadSettings();
        if (!settings.lastFilePath) {
            throw new Error("No file selected. lastFilePath is null.");
        }
        return (0, promises_1.readFile)(settings.lastFilePath, "utf8");
    });
    electron_1.ipcMain.handle("write-file", async (_event, data) => {
        const settings = await loadSettings();
        if (!settings.lastFilePath) {
            throw new Error("Cannot write: lastFilePath is null.");
        }
        await (0, promises_1.writeFile)(settings.lastFilePath, data, "utf8");
    });
    electron_1.ipcMain.handle("open-file-dialog", async () => {
        const result = await electron_1.dialog.showOpenDialog({
            properties: ["openFile"],
        });
        if (result.canceled) {
            return null;
        }
        const filePath = result.filePaths[0] ?? null;
        const settings = await loadSettings();
        settings.lastFilePath = filePath;
        await saveSettings(settings);
        return filePath;
    });
    electron_1.ipcMain.handle("load-settings", async () => loadSettings());
    electron_1.ipcMain.handle("save-settings", async (_event, settings) => {
        await saveSettings(settings);
        return true;
    });
}
