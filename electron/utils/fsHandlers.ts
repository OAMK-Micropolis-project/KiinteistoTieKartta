import { app, dialog, ipcMain } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type Settings = {
  lastFilePath: string | null;
};

const settingsFile = join(app.getPath("userData"), "settings.json");

export default function registerFsHandlers() {
  async function loadSettings(): Promise<Settings> {
    try {
      const json = await readFile(settingsFile, "utf8");
      return JSON.parse(json) as Settings;
    } catch {
      return { lastFilePath: null };
    }
  }

  async function saveSettings(settings: Settings) {
    await writeFile(settingsFile, JSON.stringify(settings, null, 2));
  }

  ipcMain.handle("read-file", async () => {
    const settings = await loadSettings();

    if (!settings.lastFilePath) {
      throw new Error("No file selected. lastFilePath is null.");
    }

    return readFile(settings.lastFilePath, "utf8");
  });

  ipcMain.handle("write-file", async (_event, data: string) => {
    const settings = await loadSettings();

    if (!settings.lastFilePath) {
      throw new Error("Cannot write: lastFilePath is null.");
    }

    await writeFile(settings.lastFilePath, data, "utf8");
  });

  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (result.canceled) {
      return null;
    }

    const filePath = result.filePaths[0] ?? null;
    const settings = await loadSettings();
    settings.lastFilePath = filePath;
    await saveSettings(settings);

    return filePath;
  });

  ipcMain.handle("load-settings", async () => loadSettings());

  ipcMain.handle("save-settings", async (_event, settings: Settings) => {
    await saveSettings(settings);
    return true;
  });
}
