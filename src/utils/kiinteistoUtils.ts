import { ArviointiParametrit } from "../context/arviointiParametrit";
import type { Kiinteisto, Toimenpide } from "../types";

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

// ── Financial derived values ──────────────────────────────────────────────────

export interface Financials {
  yllapitoYhteensa: number;
  vuokratulot: number;
  kayttoaste: number;
}

export function computeFinancials(
  item: Kiinteisto,
  latestYear: number,
): Financials {
  const yllapito = item.yllapitokulut[latestYear];
  const vuokra = item.vuokrakulut[latestYear];

  const yllapitoYhteensa = yllapito
    ? Object.values(yllapito).reduce((sum, val) => sum + val, 0)
    : 0;

  const vuokratulot =
    vuokra?.vuokrausaste_m2 && vuokra?.neliövuokra
      ? vuokra.vuokrausaste_m2 * vuokra.neliövuokra * 12
      : 0;

  const kayttoaste =
    vuokra && item.pinta_ala > 0
      ? Math.round((vuokra.vuokrausaste_m2 / item.pinta_ala) * 100)
      : 0;

  return { yllapitoYhteensa, vuokratulot, kayttoaste };
}

// ── Arviointi (assessment scoring) ───────────────────────────────────────────

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
