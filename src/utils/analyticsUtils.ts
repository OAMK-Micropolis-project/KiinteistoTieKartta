import type { Kiinteisto } from "../types";

/**
 * Lukee arvon JSON-rakenteesta:
 * Uusi malli (oikea):
 * { "vuosi": 2023, "kulut": 5000 }
 */

/**
 * Laskee kiinteistön ylläpitokustannukset yhteensä (€/v).
 */
export function laskeYllapito(k: Kiinteisto): number {
    // return Object.values(k.talous[0].YllapitoKulut).reduce(
    //     (sum, record) => sum + record,
    //     0
    // );
    return 0;
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
    // return k.talous[0].YllapitoKulut.Tasearvo;
    return 0;
}

/**
 * Laskee käyttöasteen prosentteina:
 * (vuokratut m² / pinta-ala) * 100
 */
export function laskeKayttoaste(k: Kiinteisto): number {
    // const vuokrattu = k.talous[0].YllapitoKulut.Vuokrausaste_m2;
    // if (!k.pinta_ala || k.pinta_ala === 0) return 0;

    // return Math.round((vuokrattu / k.pinta_ala) * 100);
    return 0;
}