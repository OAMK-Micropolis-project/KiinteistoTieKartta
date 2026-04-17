import type { Kiinteisto } from "../types";

/**
 * Laskee kiinteistön ylläpitokustannukset yhteensä (€/v).
 */
export function laskeYllapito(k: Kiinteisto, year: number): number {
    try {
        return Object.values(k.yllapitokulut[year] || {}).reduce(
            (sum, record) => sum + ( record ?? 0 ),
            0
        );
    } catch (error) {
        console.error(`Error calculating maintenance costs for ${k.nimi} in year ${year}:`, error);
        return 0;
    }
}

/**
 * Laskee pisteet (painottamaton summa).
 * HUOM! Kun backend alkaa palauttaa "total_points", vaihda siihen.
 */
export function laskePisteet(k: Kiinteisto): number {
    try {
        return Object.values(k.pisteet).reduce((sum, p) => sum + (p ?? 0), 0);
    } catch (error) {
        console.error(`Error calculating points for ${k.nimi}:`, error);
        return 0;
    }
}

/**
 * Palauttaa tasearvon oikealla tavalla
 */
export function laskeTasearvo(k: Kiinteisto, year: number): number {
    try {
        return k.vuokrakulut[year]?.tasearvo ?? 0;
    } catch (error) {
        console.error(`Error calculating tasearvo for ${k.nimi} in year ${year}:`, error);
        return 0;
    }
}

/**
 * Laskee käyttöasteen prosentteina:
 * (vuokratut m² / pinta-ala) * 100
 */
export function laskeKayttoaste(k: Kiinteisto, year: number): number {
    try {
        const vuokrattu = (k.vuokrakulut[year]?.vuokrausaste_m2 ?? 0);
        if (!k.pinta_ala || k.pinta_ala === 0) return 0;

        return Math.round((vuokrattu / k.pinta_ala) * 100);
    } catch (error) {
        console.error(`Error calculating usage rate for ${k.nimi} in year ${year}:`, error);
        return 0;
    }
}

export function getPainotetutPisteet(k: Kiinteisto): number {
    try {
        return k.painotetutPisteet ?? 0;
    } catch (error) {
        console.error(`Error getting weighted points for ${k.nimi}:`, error);
        return 0;
    }
}