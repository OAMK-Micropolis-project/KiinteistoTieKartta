export type YllapitoKulut = {
    sahko: number;
    lammitys: number;
    vesi: number;
    huolto: number;
    vero: number;
    laina: number;
    muut: number;
    muutKulut?: { [nimi: string]: number };
};

export type VuokraKulut = {
    // Perustiedot
    tasearvo: number;
    vuokrausaste_m2: number;
    neliövuokra: number;

    // Kulutus
    sahkonkulutus: number;
    lammitysenergia: number;
    vedenkulutus: number;

    // Kiinteät kulut
    yllapitoKorjaukset: number;
    maavuokra: number;
    vakuutus: number;

    // Vuokratulot — m² values, income derived from these
    vuokrattu: number;       // rented m²
    vuokrattavissa: number;  // available m²
    // kokonaisvuokra is NOT stored — always derived as vuokrattu * neliövuokra * 12
};

type Pisteet = {
    ika: number;
    vesikatto: number;
    sadevesi: number;
    salaoja: number;
    julkisivu: number;
    ikkunat: number;
    ovet: number;
    vaippa: number;
    tontti: number;
    lattia: number;
    sisailma: number;
    yleisilme: number;
    lammitys: number;
    lammlaitteet: number;
    kayttovesi: number;
    viemari: number;
    iv: number;
    peruskorjaus: number;
    toimivuus: number;
    kayttoaste_piste: number;
    tulevaisuus: number;
    investointi: number;
};

export interface Toimenpide {
    id: string;
    otsikko: string;
    kuvaus?: string;
    kustannukset: number;
    suunniteltuPvm?: string; // YYYY-MM-DD
    tehtyPvm?: string;       // YYYY-MM-DD
}

export interface Kiinteisto {
    id: number;
    nimi: string;
    osoite: string;
    pinta_ala: number;
    kayttotarkoitus: string;
    rakennusvuosi: number;
    suojelukohde: boolean;

    pisteet: Pisteet;
    painotetutPisteet: number;

    oma_salkku: "A" | "B" | "C" | "D";
    oma_perusteet: string;
    toimenpiteet: Toimenpide[];

    yllapitokulut: { [year: number]: YllapitoKulut };
    vuokrakulut: { [year: number]: VuokraKulut };
}

export type NewKiinteistoInput = Omit<Kiinteisto, "id" | "painotetutPisteet" | "oma_salkku">;