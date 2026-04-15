import { useEffect, useState } from "react";
import type { Kiinteisto, NewKiinteistoInput } from "../types";
import { ArviointiParametrit } from "./arviointiParametrit";
import { KiinteistoContext } from "./KiinteistoContext";
import type { KiinteistoStore } from "./kiinteistoStore";

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);

  function getAll() {
    return [...kiinteistot];
  }

  function persist(kiinteistot: Kiinteisto[]) {
    void window.electronFs.writeFile(JSON.stringify(kiinteistot));
  }

  function getById(id: number) {
    return kiinteistot.find(k => k.id === id);
  }

  function calPintaAla() {
    return kiinteistot.reduce((total, k) => total + k.pinta_ala, 0);
  }

  function getLatestYear() {
    return Math.max(...kiinteistot.flatMap(k => [
      ...Object.keys(k.yllapitokulut).map(Number),
      ...Object.keys(k.vuokrakulut).map(Number)
    ]));
  }

  function calNumberOfKiinteistot() {
    return kiinteistot.length;
  }

  function calAllTasearvo(year: number) {
    return kiinteistot.reduce((total, k) => total + (k.vuokrakulut[year]?.tasearvo ?? 0), 0);
  }

  function calAllYllapito(year: number) {
    return kiinteistot.reduce((total, k) => {
      const kulut = calYllapito(k, year);
      if (kulut) return total + kulut
      return total;
    }, 0);
  }

  function calYllapito(k: Kiinteisto, year: number) {
    const kulut = Object.values(k.yllapitokulut[year] ?? {}).filter(v => typeof v === "number") as number[];
    if (kulut) return kulut.reduce((sum, y) => sum + y, 0);
    return 0;
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

  function calVuokra(k: Kiinteisto, year: number) {
    const vuokrausaste = k.vuokrakulut[year]?.vuokrausaste_m2 ?? 0;
    const neliövuokra = k.vuokrakulut[year]?.neliövuokra ?? 0;
    return vuokrausaste * neliövuokra;
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
    const id = kiinteistot.length > 0 ? Math.max(...kiinteistot.map(k => k.id)) + 1 : 1;
    const painotetutPisteet = calPainotutPisteet({ ...newKiinteisto, id, painotetutPisteet: 0, oma_salkku: "D" });
    const oma_salkku = evalSalkku({ ...newKiinteisto, id, painotetutPisteet, oma_salkku: "D" });

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
    const newList = kiinteistot.map(k => k.id === updated.id ? updated : k);
    setKiinteistot(newList);
    persist(newList);
  }

  function remove(id: number) {
    const newList = kiinteistot.filter(k => k.id !== id);
    setKiinteistot(newList);
    persist(newList);
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
    calPintaAla,
    calVuokra,
    calYllapito,

    evalSalkku
  }

  return (
    <KiinteistoContext.Provider value={store}>
      {children}
    </KiinteistoContext.Provider>
  );
}
