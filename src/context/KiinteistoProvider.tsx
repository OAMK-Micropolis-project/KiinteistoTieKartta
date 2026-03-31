import { useEffect, useState } from "react";
import type { Kiinteisto } from "../types";
import { KiinteistoContext } from "./KiinteistoContext";

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

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

  return (
    <KiinteistoContext.Provider value={kiinteistot}>
      {children}
    </KiinteistoContext.Provider>
  );
}

