import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronFs', {
    readFile: async () => ipcRenderer.invoke('read-file'),
    writeFile: async (data) => ipcRenderer.invoke('write-file', data),
    openFile: () => ipcRenderer.invoke("open-file-dialog"),
    saveFilePath: (path) => ipcRenderer.invoke("save-file-path", path),
    getFilePath: () => ipcRenderer.invoke("get-file-path"),
});
