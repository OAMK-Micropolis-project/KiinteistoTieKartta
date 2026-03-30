export interface ElectronFsAPI {
  readFile(): Promise<string>;
  writeFile(data: string): Promise<void>;
}

declare global {
  interface Window {
    electronFs: ElectronFsAPI;
  }
}

export {};
