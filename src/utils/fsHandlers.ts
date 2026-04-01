import { dialog, ipcMain, app } from "electron";
import { join } from "path";
import { readFile, writeFile} from "fs/promises";

const settingsFile = join(app.getPath("userData"), "settings.json");
const targetFilePath = join(__dirname, '../../../../tmpdata.json')

export default function registerFsHandlers() {
  ipcMain.handle('read-file', async (): Promise<string> => {
    try {
      const data = await readFile(targetFilePath, 'utf8')
      return data
    } catch (err) {
      console.error("Error reading file:", err)
      throw err
    }
  })

  ipcMain.handle('write-file', async (_event, data: string): Promise<void> => {
    try {
      await writeFile(targetFilePath, data, 'utf8')
    } catch (err) {
      console.error("Error writing file:", err)
      throw err
    }
  })

  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (result.canceled) return null;
      return result.filePaths[0];
    });
  ipcMain.handle("load-settings", async () => {
    try {
      const json = await readFile(settingsFile, "utf8");
      return JSON.parse(json);
    } catch {
      // If file doesn't exist, return defaults
      return { lastFilePath: null };
    }
  });

  ipcMain.handle("save-settings", async (_e, settings) => {
    await writeFile(settingsFile, JSON.stringify(settings, null, 2));
    return true;
  });

}