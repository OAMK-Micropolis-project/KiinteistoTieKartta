import type { Kiinteisto, VuosiArvot } from "../types";

function getLatestYearValue(values: VuosiArvot): number {
    const years = Object.keys(values)
        .map((year) => Number(year))
        .filter((year) => !Number.isNaN(year));

    if (!years.length) return 0;

    const latest = Math.max(...years);
    return values[String(latest)] ?? 0;
}

/**
 * Laskee kiinteistön kokonaispisteet.
 * Lasketaan kaikki pisteet yhteen (painottamaton).
 */
export function laskePisteet(k: Kiinteisto): number {
    return Object.values(k.pisteet).reduce((sum, p) => sum + p, 0);
}

/**
 * Laskee ylläpitokulut (€/v)
 * Käytetään viimeisintä vuosiarvoa kustakin kululajista.
 */
export function laskeYllapito(k: Kiinteisto): number {
    const values = Object.values(k.yllapitokulut).map(getLatestYearValue);
    return values.reduce((a, b) => a + b, 0);
}

/**
 * Palauttaa tasearvon viimeisimmältä vuodelta.
 */
export function laskeTasearvo(k: Kiinteisto): number {
    return getLatestYearValue(k.tasearvo);
}

/**
 * Laskee käyttöasteen prosentteina
 * (vuokratut neliöt / kokonaisneliöt) * 100
 */
export function laskeKayttoaste(k: Kiinteisto): number {
    const vuokrattu = getLatestYearValue(k.vuokrausaste_m2);
    if (!k.pinta_ala || k.pinta_ala === 0) return 0;

    return Math.round((vuokrattu / k.pinta_ala) * 100);
}
