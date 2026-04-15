import { useEffect, useState } from "react";
import type { Kiinteisto, NewKiinteistoInput } from "../types";
import { ArviointiParametrit } from "./arviointiParametrit";
import { KiinteistoContext } from "./KiinteistoContext";
import type { KiinteistoStore } from "./kiinteistoStore";

export function KiinteistoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

  function getAll() {
    return [...kiinteistot];
  }

  async function persist(kiinteistot: Kiinteisto[]) {
    try {
      await window.electronFs.writeFile(JSON.stringify(kiinteistot));
    } catch (err) {
      console.error("Failed to persist data", err);
      await window.settings.save({ lastFilePath: null });
    }
  }

  function getById(id: number) {
    return kiinteistot.find((k) => k.id === id);
  }

  function calAllPintaAla() {
    return kiinteistot.reduce((total, k) => total + k.pinta_ala, 0);
  }

  function getLatestYear() {
    const years = kiinteistot.flatMap((k) => [
      ...Object.keys(k.yllapitokulut ?? {}).map(Number),
      ...Object.keys(k.vuokrakulut ?? {}).map(Number),
    ]);

    return years.length > 0 ? Math.max(...years) : new Date().getFullYear();
  }

  function calNumberOfKiinteistot() {
    return kiinteistot.length;
  }

  function calAllTasearvo(year: number) {
    return kiinteistot.reduce(
      (total, k) => total + (k.vuokrakulut[year]?.tasearvo ?? 0),
      0,
    );
  }

  function calYllapito(k: Kiinteisto, year: number) {
    const kulut = Object.values(k.yllapitokulut[year] ?? {}).filter(
      (v) => typeof v === "number",
    ) as number[];
    if (kulut) return kulut.reduce((sum, y) => sum + y, 0);
    return 0;
  }

  function calAllYllapito(year: number) {
    return kiinteistot.reduce((total, k) => {
      const kulut = calYllapito(k, year);
      if (kulut) return total + kulut;
      return total;
    }, 0);
  }

  function calVuokra(k: Kiinteisto, year: number) {
    const vuokrausaste = k.vuokrakulut[year]?.vuokrausaste_m2 ?? 0;
    const neliövuokra = k.vuokrakulut[year]?.neliövuokra ?? 0;
    return vuokrausaste * neliövuokra;
  }

  function calAllVuokra(year: number) {
    return kiinteistot.reduce((total, k) => {
      const kulut = calVuokra(k, year);
      if (kulut) return total + kulut;
      return total;
    }, 0);
  }

  function calPainotutPisteet(k: Kiinteisto) {
    if (!k || !k.pisteet) return 0;
    return Object.entries(k.pisteet).reduce((sum, [key, value]) => {
      const weight = ArviointiParametrit[key]?.paino ?? 0;
      return sum + value * weight;
    }, 0);
  }

  function evalSalkku(k: Kiinteisto) {
    const weightedPisteet = k.painotetutPisteet ?? calPainotutPisteet(k);
    if (weightedPisteet >= 225) return "A";
    if (weightedPisteet >= 175) return "B";
    if (weightedPisteet >= 125) return "C";
    return "D";
  }

  function calKayttoaste(k: Kiinteisto, year: number) {
    const vuokrausaste = k.vuokrakulut[year]?.vuokrausaste_m2;
    return (vuokrausaste / k.pinta_ala) * 100;
  }

  function add(newKiinteisto: NewKiinteistoInput) {
    const id =
      kiinteistot.length > 0
        ? Math.max(...kiinteistot.map((k) => k.id)) + 1
        : 1;
    const painotetutPisteet = calPainotutPisteet({
      ...newKiinteisto,
      id,
      painotetutPisteet: 0,
      oma_salkku: "D",
    });
    const oma_salkku = evalSalkku({
      ...newKiinteisto,
      id,
      painotetutPisteet,
      oma_salkku: "D",
    });

    const created: Kiinteisto = {
      ...newKiinteisto,
      id,
      painotetutPisteet,
      oma_salkku,
    };

    const newList = [...kiinteistot, created];
    setKiinteistot(newList);
    persist(newList);
  }

  function update(updated: Kiinteisto) {
    const newList = kiinteistot.map((k) => (k.id === updated.id ? updated : k));
    setKiinteistot(newList);
    persist(newList);
  }

  function remove(id: number) {
    const newList = kiinteistot.filter((k) => k.id !== id);
    setKiinteistot(newList);
    persist(newList);
  }

  function normalizeKiinteisto(raw: any): Kiinteisto | null {
    try {
      return {
        id: Number(raw.id),
        nimi: String(raw.nimi ?? ""),
        osoite: String(raw.osoite ?? ""),
        pinta_ala: Number(raw.pinta_ala ?? 0),
        rakennusvuosi: Number(raw.rakennusvuosi ?? 0),
        suojelukohde: Boolean(raw.suojelukohde),
        oma_salkku: raw.oma_salkku ?? "D",
        oma_perusteet: String(raw.oma_perusteet ?? ""),
        toimenpiteet: Array.isArray(raw.toimenpiteet) ? raw.toimenpiteet : [],

        pisteet:
          raw.pisteet && typeof raw.pisteet === "object"
            ? raw.pisteet
            : {},

        yllapitokulut:
          raw.yllapitokulut && typeof raw.yllapitokulut === "object"
            ? raw.yllapitokulut
            : {},

        vuokrakulut:
          raw.vuokrakulut && typeof raw.vuokrakulut === "object"
            ? raw.vuokrakulut
            : {},

        painotetutPisteet: Number(raw.painotetutPisteet ?? 0),
      };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function initData() {
      try {
        const content = await window.electronFs.readFile();

        if (!content) {
          setKiinteistot([]);
          return;
        }

        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          throw new Error("Root JSON is not an array");
        }

        const safeData = parsed
          .map(normalizeKiinteisto)
          .filter((k): k is Kiinteisto => k !== null);

        setKiinteistot(safeData);
        console.log("Data loaded safely");
      } catch (err) {
        console.error("Invalid data file, resetting", err);

        // 🔥 Recovery step
        await window.settings.save({ lastFilePath: null });
        setKiinteistot([]);
      }
    }

    initData();
  }, []);

  const store: KiinteistoStore = {
    kiinteistot: getAll(),
    add,
    update,
    remove,

    getById,
    getLatestYear,

    calAllTasearvo,
    calAllVuokra,
    calAllYllapito,
    calKayttoaste,
    calNumberOfKiinteistot,
    calPainotutPisteet,
    calAllPintaAla,
    calVuokra,
    calYllapito,

    evalSalkku,
  };

  return (
    <KiinteistoContext.Provider value={store}>
      {children}
    </KiinteistoContext.Provider>
  );
}
