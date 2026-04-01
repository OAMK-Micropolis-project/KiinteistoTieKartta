"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerFsHandlers;
const electron_1 = require("electron");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const settingsFile = (0, path_1.join)(electron_1.app.getPath("userData"), "settings.json");
const targetFilePath = (0, path_1.join)(__dirname, '../../../../tmpdata.json');
function registerFsHandlers() {
    electron_1.ipcMain.handle('read-file', async () => {
        try {
            const data = await (0, promises_1.readFile)(targetFilePath, 'utf8');
            return data;
        }
        catch (err) {
            console.error("Error reading file:", err);
            throw err;
        }
    });
    electron_1.ipcMain.handle('write-file', async (_event, data) => {
        try {
            await (0, promises_1.writeFile)(targetFilePath, data, 'utf8');
        }
        catch (err) {
            console.error("Error writing file:", err);
            throw err;
        }
    });
    electron_1.ipcMain.handle("open-file-dialog", async () => {
        const result = await electron_1.dialog.showOpenDialog({
            properties: ["openFile"],
        });
        if (result.canceled)
            return null;
        return result.filePaths[0];
    });
    electron_1.ipcMain.handle("load-settings", async () => {
        try {
            const json = await (0, promises_1.readFile)(settingsFile, "utf8");
            return JSON.parse(json);
        }
        catch {
            // If file doesn't exist, return defaults
            return { lastFilePath: null };
        }
    });
    electron_1.ipcMain.handle("save-settings", async (_e, settings) => {
        await (0, promises_1.writeFile)(settingsFile, JSON.stringify(settings, null, 2));
        return true;
    });
}
