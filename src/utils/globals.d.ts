export interface ElectronFsAPI {
  readFile(): Promise<string>;
  writeFile(data: string): Promise<void>;
  openFile: () => Promise<string | null>;
}
export interface SettingsAPI {
  load(): Promise<{ lastFilePath: string | null }>;
  save(data: { lastFilePath: string | null }): Promise<void>;
}

declare global {
  interface Window {
    settings: SettingsAPI;
    electronFs: ElectronFsAPI;
  }
}

export {};
