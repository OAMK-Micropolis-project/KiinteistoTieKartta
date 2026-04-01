import { ipcMain } from "electron";
import { join } from "path";
import { readFile, writeFile} from "fs/promises";

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
}