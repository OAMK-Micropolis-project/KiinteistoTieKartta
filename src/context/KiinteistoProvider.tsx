import { useEffect, useState } from "react";
import type { Kiinteisto } from "../types";
import { KiinteistoContext } from "./KiinteistoContext";

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

  function getById(id: number) {
    return kiinteistot.find(k => k.id === id);
  }

  function addKiinteisto(newKiinteisto: Kiinteisto) {
    setKiinteistot(prev => [...prev, newKiinteisto]);
  }

  function updateKiinteisto(updated: Kiinteisto) {
    setKiinteistot(prev => prev.map(k => k.id === updated.id ? updated : k));
  }

  function deleteKiinteisto(id: number) {
    setKiinteistot(prev => prev.filter(k => k.id !== id));
  }

  function saveData() {
    window.electronFs.writeFile(JSON.stringify(kiinteistot));
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
    kiinteistot,
    getById,
    addKiinteisto,
    updateKiinteisto,
    deleteKiinteisto,
    saveData
  }

  return (
    <KiinteistoContext.Provider value={store}>
      {children}
    </KiinteistoContext.Provider>
  );
}
