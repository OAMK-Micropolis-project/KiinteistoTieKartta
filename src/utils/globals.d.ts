export interface ElectronFsAPI {
  readFile(): Promise<string>;
  writeFile(data: string): Promise<void>;
  openFile: () => Promise<string | null>;
}
export interface SettingsAPI {
  load(): Promise<{ lastFilePath: string | null }>;
  save(data: { lastFilePath: string | null }): Promise<void>;
}
export interface ElectronPdfAPI {
  chooseSavePdfPath(suggestedFileName: string): Promise<string | null>;
  exportKiinteistoPdf(route: string, outputPath: string): Promise<string>;
}

declare global {
  interface Window {
    settings: SettingsAPI;
    electronFs: ElectronFsAPI;
    electronPdf: ElectronPdfAPI;
  }
}