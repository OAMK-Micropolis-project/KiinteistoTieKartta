import { useEffect, useState } from "react";
import type { Kiinteisto } from "../types";
import { KiinteistoContext } from "./KiinteistoContext";

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

  function getAll() {
    return [...kiinteistot];
  }

  function persistKiinteistot(kiinteistot: Kiinteisto[]) {
    void window.electronFs.writeFile(JSON.stringify(kiinteistot));
  }

  function getById(id: number) {
    return kiinteistot.find(k => k.id === id);
  }

  function addKiinteisto(newKiinteisto: Kiinteisto) {
    const newList = [...kiinteistot, newKiinteisto];
    setKiinteistot(newList);
    persistKiinteistot(newList);
  }

  function updateKiinteisto(updated: Kiinteisto) {
    const newList = kiinteistot.map(k => k.id === updated.id ? updated : k);
    setKiinteistot(newList);
    persistKiinteistot(newList);
  }

  function deleteKiinteisto(id: number) {
    const newList = kiinteistot.filter(k => k.id !== id);
    setKiinteistot(newList);
    persistKiinteistot(newList);
  }

  useEffect(() => {
    async function initData() {
      const result = await window.electronFs.readFile()
      if (result) {
        const kiinteistot = JSON.parse(result) as Kiinteisto[];
        setKiinteistot(kiinteistot);
        console.log("Data initialized successfully");
      } else {
        console.error("Failed to initialize data");
      }
    }
    initData();
  }, []);

  const store = {
    kiinteistot: getAll(),
    getById,
    addKiinteisto,
    updateKiinteisto,
    deleteKiinteisto,
  }

  return (
    <KiinteistoContext.Provider value={store}>
      {children}
    </KiinteistoContext.Provider>
  );
}
