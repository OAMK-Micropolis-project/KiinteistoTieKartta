import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronFs', {
  readFile: async (): Promise<string> => ipcRenderer.invoke('read-file'),
  writeFile: async (data: string): Promise<void> => ipcRenderer.invoke('write-file', data),
  openFile: () => ipcRenderer.invoke("open-file-dialog"),
  saveFilePath: (path: string) => ipcRenderer.invoke("save-file-path", path),
  getFilePath: () => ipcRenderer.invoke("get-file-path"),
} as const);

contextBridge.exposeInMainWorld("settings", {
  load: () => ipcRenderer.invoke("load-settings"),
  save: (data: string) => ipcRenderer.invoke("save-settings", data),
});

