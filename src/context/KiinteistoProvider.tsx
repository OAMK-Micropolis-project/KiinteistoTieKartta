import { useEffect, useState } from "react";
import type { Kiinteisto } from "../types";
import { KiinteistoContext } from "./KiinteistoContext";

export type KiinteistoContextType = {
  kiinteistot: Kiinteisto[];
  something: () => void;
};

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

  function something() {}

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
    <KiinteistoContext.Provider value={{kiinteistot, something}}>
      {children}
    </KiinteistoContext.Provider>
  );
}

