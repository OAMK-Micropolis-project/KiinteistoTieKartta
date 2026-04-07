import { dialog, ipcMain, app } from "electron";
import { join } from "path";
import { readFile, writeFile} from "fs/promises";

const settingsFile = join(app.getPath("userData"), "settings.json");

export default function registerFsHandlers() {

  async function loadSettings() {
    try {
      const json = await readFile(settingsFile, "utf8");
      return JSON.parse(json) as { lastFilePath: string | null };
    } catch {
      return { lastFilePath: null };
    }
  }

  async function saveSettings(settings: { lastFilePath: string | null }) {
    await writeFile(settingsFile, JSON.stringify(settings, null, 2));
  }

  ipcMain.handle("read-file", async () => {
    const settings = await loadSettings();

    if (!settings.lastFilePath) {
      throw new Error("No file selected. lastFilePath is null.");
    }

    try {
      const data = await readFile(settings.lastFilePath, "utf8");
      return data;
    } catch (err) {
      console.error("Error reading file:", err);
      throw err;
    }
  });

  ipcMain.handle("write-file", async (_event, data: string) => {
    const settings = await loadSettings();

    if (!settings.lastFilePath) {
      throw new Error("Cannot write: lastFilePath is null.");
    }

    try {
      await writeFile(settings.lastFilePath, data, "utf8");
    } catch (err) {
      console.error("Error writing file:", err);
      throw err;
    }
  });


  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (result.canceled) return null;

    const filePath = result.filePaths[0];

    const settings = await loadSettings();
    settings.lastFilePath = filePath;
    await saveSettings(settings);

    return filePath;
  });


  ipcMain.handle("load-settings", async () => {
    return loadSettings();
  });

  ipcMain.handle("save-settings", async (_e, settings) => {
    await saveSettings(settings);
    return true;
  });
}
