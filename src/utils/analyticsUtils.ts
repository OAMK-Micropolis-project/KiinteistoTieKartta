import type { Kiinteisto } from "../types";

/**
 * Lukee arvon JSON-rakenteesta:
 *
 * Vanha malli:
 *   { "2023": 5000 }
 *
 * Uusi malli (oikea):
 *   { "vuosi": 2023, "kulut": 5000 }
 */
export function getValue(obj: any): number {
    if (!obj) return 0;

    // Uusi backend-malli: { vuosi: 2023, kulut: 5000 }
    if ("kulut" in obj) {
        return typeof obj.kulut === "number" ? obj.kulut : 0;
    }

    // Tyhjä objekti → 0
    if (Object.keys(obj).length === 0) return 0;

    // Vanha mock-malli: { "2023": 5000 }
    const years = Object.keys(obj)
        .map(Number)
        .filter((n) => !Number.isNaN(n));

    if (years.length > 0) {
        const latest = Math.max(...years);
        return obj[String(latest)] ?? 0;
    }

    return 0;
}

/**
 * Laskee kiinteistön ylläpitokustannukset yhteensä (€/v).
 */
export function laskeYllapito(k: Kiinteisto): number {
    return Object.values(k.yllapitokulut).reduce(
        (sum, record) => sum + getValue(record),
        0
    );
}

/**
 * Laskee pisteet (painottamaton summa).
 * HUOM! Kun backend alkaa palauttaa "total_points", vaihda siihen.
 */
export function laskePisteet(k: Kiinteisto): number {
    return Object.values(k.pisteet).reduce((sum, p) => sum + p, 0);
}

/**
 * Palauttaa tasearvon oikealla tavalla
 */
export function laskeTasearvo(k: Kiinteisto): number {
    return getValue(k.tasearvo);
}

/**
 * Laskee käyttöasteen prosentteina:
 * (vuokratut m² / pinta-ala) * 100
 */
export function laskeKayttoaste(k: Kiinteisto): number {
    const vuokrattu = getValue(k.vuokrausaste_m2);
    if (!k.pinta_ala || k.pinta_ala === 0) return 0;

    return Math.round((vuokrattu / k.pinta_ala) * 100);
}