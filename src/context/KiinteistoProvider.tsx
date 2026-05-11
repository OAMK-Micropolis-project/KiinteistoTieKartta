import { useEffect, useMemo, useState } from "react";
import type { Kiinteisto, NewKiinteistoInput } from "../types";
import { ArviointiParametrit } from "./arviointiParametrit";
import { KiinteistoContext } from "./KiinteistoContext";
import type { KiinteistoStore } from "./kiinteistoStore";

const ALL_SALKUT = new Set<"A" | "B" | "C" | "D">(["A", "B", "C", "D"]);

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, setKiinteistot] = useState<Kiinteisto[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [activeSalkut, setActiveSalkut] = useState<Set<"A" | "B" | "C" | "D">>(
    new Set(ALL_SALKUT)
  );

  // ── Portfolio filter ──────────────────────────────────────────────────────


  function toggleSalkku(s: "A" | "B" | "C" | "D") {
    setActiveSalkut(prev => {

      if (prev.size === ALL_SALKUT.size) {
        return new Set([s])
      }

      const next = new Set(prev);

      if (next.has(s)) {
        next.delete(s); // remove
      } else {
        next.add(s); // add
      }

      // Optional UX: if nothing selected, show all again
      if (next.size === 0) {
        return new Set(ALL_SALKUT);
      }

      return next;
    });
  }


  const filteredKiinteistot = useMemo(
    () => kiinteistot.filter((k) => activeSalkut.has(k.oma_salkku)),
    [kiinteistot, activeSalkut]
  );

  // ── Persistence ───────────────────────────────────────────────────────────

  async function persist(list: Kiinteisto[]) {
    try {
      await window.electronFs.writeFile(JSON.stringify(list));
    } catch (err) {
      console.error("Failed to persist data", err);
      await window.settings.save({ lastFilePath: null });
    }
  }

  // ── Calculations ──────────────────────────────────────────────────────────

  function getAll() {
    return [...kiinteistot];
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
    const neliovuokra = k.vuokrakulut[year]?.neliovuokra ?? 0;
    return vuokrausaste * neliovuokra;
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

  // ── CRUD ──────────────────────────────────────────────────────────────────

  function add(newKiinteisto: NewKiinteistoInput) {
    const id =
      kiinteistot.length > 0
        ? Math.max(...kiinteistot.map((k) => k.id)) + 1
        : 1;
    const painotetutPisteet = calPainotutPisteet({
      ...newKiinteisto, id, painotetutPisteet: 0, oma_salkku: "D",
    });
    const oma_salkku = evalSalkku({
      ...newKiinteisto, id, painotetutPisteet, oma_salkku: "D",
    });
    const created: Kiinteisto = { ...newKiinteisto, id, painotetutPisteet, oma_salkku };
    const newList = [...kiinteistot, created];
    setKiinteistot(newList);
    persist(newList);
  }

  function update(updated: Kiinteisto) {
    const painotetutPisteet = calPainotutPisteet(updated);
    const oma_salkku = evalSalkku({ ...updated, painotetutPisteet });
    const normalized: Kiinteisto = { ...updated, painotetutPisteet, oma_salkku };
    const newList = kiinteistot.map((k) => k.id === updated.id ? normalized : k);
    setKiinteistot(newList);
    persist(newList);
  }

  function remove(id: number) {
    const newList = kiinteistot.filter((k) => k.id !== id);
    setKiinteistot(newList);
    persist(newList);
  }

  // ── Data loading ──────────────────────────────────────────────────────────

  function normalizeKiinteisto(raw: any): Kiinteisto | null {
    try {
      const base: Kiinteisto = {
        id: Number(raw.id),
        nimi: String(raw.nimi ?? ""),
        osoite: String(raw.osoite ?? ""),
        kayttotarkoitus: String(raw.kayttotarkoitus ?? ""),
        pinta_ala: Number(raw.pinta_ala ?? 0),
        rakennusvuosi: Number(raw.rakennusvuosi ?? 0),
        suojelukohde: Boolean(raw.suojelukohde),
        pisteet: raw.pisteet && typeof raw.pisteet === "object" ? raw.pisteet : {},
        oma_perusteet: String(raw.oma_perusteet ?? ""),
        toimenpiteet: Array.isArray(raw.toimenpiteet)
          ? raw.toimenpiteet.map((t: any) => ({ ...t, id: t.id ?? crypto.randomUUID() }))
          : [],
        yllapitokulut: raw.yllapitokulut && typeof raw.yllapitokulut === "object" ? raw.yllapitokulut : {},
        vuokrakulut: raw.vuokrakulut && typeof raw.vuokrakulut === "object" ? raw.vuokrakulut : {},
        painotetutPisteet: 0,
        oma_salkku: "D",
        hiilijalanjalki: 0
      };
      const painotetutPisteet = calPainotutPisteet(base);
      const oma_salkku = evalSalkku({ ...base, painotetutPisteet });
      return { ...base, painotetutPisteet, oma_salkku };
    } catch (error) {
      console.error("Failed to normalize Kiinteisto:", error);
      return null;
    }
  }

  async function refresh() {
    try {
      const content = await window.electronFs.readFile();
      if (!content) { console.warn("No file content found during refresh"); return; }
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error("Invalid data format");
      const safeData = parsed
        .map(normalizeKiinteisto)
        .filter((k): k is Kiinteisto => k !== null);
      setKiinteistot(safeData);
      setLastRefresh(new Date());
      console.log("Data refreshed");
    } catch (err) {
      console.error("Refresh failed", err);
    }
  }

  // Initial load
  useEffect(() => { refresh(); }, []);

  // Poll every 60s
  useEffect(() => {
    let cancelled = false;
    async function pollFile() {
      try {
        const content = await window.electronFs.readFile();
        if (!content || cancelled) return;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) return;
        setKiinteistot((prev) => {
          const prevJson = JSON.stringify(prev);
          const nextJson = JSON.stringify(parsed);
          return prevJson !== nextJson ? parsed : prev;
        });
        setLastRefresh(new Date());
      } catch (err) {
        console.error("Poll failed", err);
        await window.settings.save({ lastFilePath: null });
        setKiinteistot([]);
      }
    }
    const interval = setInterval(pollFile, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // ── Store ─────────────────────────────────────────────────────────────────

  const store: KiinteistoStore = {
    kiinteistot: getAll(),
    filteredKiinteistot,
    activeSalkut,
    toggleSalkku,

    add,
    update,
    remove,

    refresh,
    lastRefresh,

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
