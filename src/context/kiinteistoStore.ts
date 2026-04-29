import { type Kiinteisto, type NewKiinteistoInput } from "../types";

export type KiinteistoStore = {
  kiinteistot: Kiinteisto[];
  filteredKiinteistot: Kiinteisto[];
  activeSalkut: Set<"A" | "B" | "C" | "D">;
  toggleSalkku: (s: "A" | "B" | "C" | "D") => void;
  
  add: (newKiinteisto: NewKiinteistoInput) => void;
  update: (updated: Kiinteisto) => void;
  remove: (id: number) => void;
  deleteKiinteistoWithBackup: (id: number) => void;
  restoreKiinteisto: (id: number) => void;

  refresh: () => Promise<void>;
  lastRefresh: Date | null;

  getById: (id: number) => Kiinteisto | undefined;
  getLatestYear: () => number;

  calAllTasearvo: (year: number) => number;
  calAllVuokra: (year: number) => number;
  calAllYllapito: (year: number) => number;
  calKayttoaste: (k: Kiinteisto, year: number) => number;
  calNumberOfKiinteistot: () => number;
  calPainotutPisteet: (k: Kiinteisto) => number;
  calAllPintaAla: () => number;
  calVuokra: (k: Kiinteisto, year: number) => number;
  calYllapito: (k: Kiinteisto, year: number) => number;

  evalSalkku: (k: Kiinteisto) => "A" | "B" | "C" | "D";
};