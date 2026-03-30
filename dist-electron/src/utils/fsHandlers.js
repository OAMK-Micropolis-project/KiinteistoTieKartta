"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerFsHandlers;
const electron_1 = require("electron");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const targetFilePath = (0, path_1.join)(__dirname, '../../../../tmpdata.json');
function registerFsHandlers() {
    electron_1.ipcMain.handle('read-file', async () => {
        try {
            const data = await (0, promises_1.readFile)(targetFilePath, 'utf8');
            console.log(data);
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
}
