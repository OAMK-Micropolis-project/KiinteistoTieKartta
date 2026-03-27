import * as kiinteisto from "../kiinteisto.js";

let kiinteistot: kiinteisto.kiinteisto[] = [];

export function getData(): kiinteisto.kiinteisto[] {
  return kiinteistot;
}

export function getDataById(id: number): kiinteisto.kiinteisto | null {
  for (const k of kiinteistot) {
    if (k.id === id) {
      return k;
    }
  }
  return null;
}

export function addData(newData: kiinteisto.kiinteisto): void {
  newData.id =
    kiinteistot.length > 0 ? Math.max(...kiinteistot.map((k) => k.id)) + 1 : 1;
  kiinteistot.push(newData);
  updateDataFile();
}

export function updateData(
  id: number,
  updatedData: kiinteisto.kiinteisto,
): void {
  for (let i = 0; i < kiinteistot.length; i++) {
    if (kiinteistot[i]?.id === id) {
      kiinteistot[i] = { ...kiinteistot[i], ...updatedData, id };
      updateDataFile();
      return;
    }
  }
}

export function deleteData(id: number): void {
  for (let i = 0; i < kiinteistot.length; i++) {
    if (Number(kiinteistot[i]?.id) === id) {
      kiinteistot.splice(i, 1);
      break;
    }
  }
  updateDataFile();
}

export async function initializeData(): Promise<number> {
  try {
    const jsonString = await window.electronFs.readFile();
    console.log("Data source initialized successfully");
    console.log(jsonString)
    kiinteistot = JSON.parse(jsonString) as kiinteisto.kiinteisto[];
    return 1;
  } catch (err) {
    console.error("Error initializing data source:", err);
    return 0;
  }
}

export async function updateDataFile(): Promise<void> {
  try {
    await window.electronFs.writeFile(JSON.stringify(kiinteistot));
    console.log("Data file updated successfully");
  } catch (err) {
    console.error("Error updating data file:", err);
  }
}
