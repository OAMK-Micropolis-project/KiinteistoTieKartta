import { ArviointiParametrit } from "../context/arviointiParametrit";
import type { Kiinteisto, Toimenpide, YllapitoKulut } from "../types";

// ── Toimenpide helpers ────────────────────────────────────────────────────────

export function sortByPlannedDate(a: Toimenpide, b: Toimenpide): number {
  if (!a.suunniteltuPvm) return 1;
  if (!b.suunniteltuPvm) return -1;
  return a.suunniteltuPvm.localeCompare(b.suunniteltuPvm);
}

export function isOverdue(t: Toimenpide): boolean {
  if (!t.suunniteltuPvm || t.tehtyPvm) return false;
  const today = new Date().toISOString().slice(0, 10);
  return t.suunniteltuPvm < today;
}

// ── Ylläpito total ────────────────────────────────────────────────────────────

export const FIXED_KEYS = ["sahko", "lammitys", "vesi", "huolto", "vero", "laina", "muut"] as const;
export type FixedKey = typeof FIXED_KEYS[number];

export const FIXED_LABELS: Record<FixedKey, string> = {
  sahko: "Sähkö",
  lammitys: "Lämmitys",
  vesi: "Vesi",
  huolto: "Huolto",
  vero: "Kiinteistövero",
  laina: "Laina",
  muut: "Muut",
};

export function yllapitoTotal(data: YllapitoKulut): number {
  const fixed = FIXED_KEYS.reduce((sum, k) => sum + (data[k] ?? 0), 0);
  const extra = data.muutKulut
    ? Object.values(data.muutKulut).reduce((s, v) => s + v, 0)
    : 0;
  return Math.round(fixed + extra);
}

// ── Toimenpiteet costs grouped by year ───────────────────────────────────────

export function toimenpiteetByYear(item: Kiinteisto): Record<number, number> {
  const result: Record<number, number> = {};
  for (const t of item.toimenpiteet) {
    const dateStr = t.suunniteltuPvm ?? t.tehtyPvm;
    if (!dateStr) continue;
    const year = Number(dateStr.slice(0, 4));
    result[year] = (result[year] ?? 0) + t.kustannukset;
  }
  return result;
}

// ── Financial derived values ──────────────────────────────────────────────────

export interface Financials {
  yllapitoYhteensa: number;     // maintenance expenses
  toimenpiteetYhteensa: number; // actions cost for the year (auto from toimenpiteet)
  vuokratulot: number;          // vuokrattu m² × neliövuokra × 12
  kayttoaste: number;           // vuokrattu / vuokrattavissa %
  kulutYhteensa: number;        // yllapito + toimenpiteet + korjaukset + maavuokra + vakuutus
  tulos: number;                // vuokratulot − kulutYhteensa
}

export function computeFinancials(item: Kiinteisto, year: number): Financials {
  const yllapito = item.yllapitokulut[year];
  const vuokra = item.vuokrakulut[year];

  const yllapitoYhteensa = yllapito ? yllapitoTotal(yllapito) : 0;

  const toimenpiteetYhteensa = Math.round(toimenpiteetByYear(item)[year] ?? 0);

  // Income: rented m² × price per m² × 12 months
  const vuokrattu = vuokra?.vuokrattu ?? vuokra?.vuokrausaste_m2 ?? 0; // fallback for legacy data
  const vuokratulot = vuokra?.neliövuokra
    ? Math.round(vuokrattu * vuokra.neliövuokra * 12)
    : 0;

  // Occupancy: rented / available
  const vuokrattavissa = vuokra?.vuokrattavissa ?? item.pinta_ala;
  const kayttoaste = vuokrattavissa > 0
    ? Math.round((vuokrattu / vuokrattavissa) * 100)
    : 0;

  const kulutYhteensa =
    yllapitoYhteensa +
    toimenpiteetYhteensa +
    Math.round(vuokra?.yllapitoKorjaukset ?? 0) +
    Math.round(vuokra?.maavuokra ?? 0) +
    Math.round(vuokra?.vakuutus ?? 0);

  const tulos = vuokratulot - kulutYhteensa;

  return { yllapitoYhteensa, toimenpiteetYhteensa, vuokratulot, kayttoaste, kulutYhteensa, tulos };
}

export function laskeKuukausitulo(vuositulo: number): number {
  return +(vuositulo / 12).toFixed(2);
}

// ── Arviointi ─────────────────────────────────────────────────────────────────

export interface ArviointiRivi {
  key: string;
  label: string;
  arvo: number;
  paino: number;
  painotettu: number;
}

export function computeArviointiRivit(item: Kiinteisto): ArviointiRivi[] {
  return Object.entries(ArviointiParametrit).map(([key, { nimi, paino }]) => {
    const arvo = item.pisteet[key as keyof typeof item.pisteet] ?? 0;
    return { key, label: nimi, arvo, paino, painotettu: arvo * paino };
  });
}