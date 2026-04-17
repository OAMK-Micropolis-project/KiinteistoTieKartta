"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronFs', {
    readFile: async () => electron_1.ipcRenderer.invoke('read-file'),
    writeFile: async (data) => electron_1.ipcRenderer.invoke('write-file', data),
    openFile: () => electron_1.ipcRenderer.invoke("open-file-dialog"),
    saveFilePath: (path) => electron_1.ipcRenderer.invoke("save-file-path", path),
    getFilePath: () => electron_1.ipcRenderer.invoke("get-file-path"),
});
electron_1.contextBridge.exposeInMainWorld("settings", {
    load: () => electron_1.ipcRenderer.invoke("load-settings"),
    save: (data) => electron_1.ipcRenderer.invoke("save-settings", data),
});
