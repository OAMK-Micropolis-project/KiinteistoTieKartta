import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronFs', {
  readFile: async (): Promise<string> => ipcRenderer.invoke('read-file'),
  writeFile: async (data: string): Promise<void> => ipcRenderer.invoke('write-file', data),
} as const)
