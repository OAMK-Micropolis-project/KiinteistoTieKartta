"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronFs', {
    readFile: async () => electron_1.ipcRenderer.invoke('read-file'),
    writeFile: async (data) => electron_1.ipcRenderer.invoke('write-file', data),
});
