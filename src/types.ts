type YllapitoKulut = {
    sahko: number;
    lammitys: number;
    vesi: number;
    huolto: number;
    vero: number;
    laina: number;
    muut: number;
}

type VuokraKulut = {
    tasearvo: number;
    vuokrausaste_m2: number;
    neliövuokra: number;
    sahkonkulutus: number;
    lammitysenergia: number;
    vedenkulutus: number;
}

type Pisteet = {
    ika: number,
    vesikatto: number,
    sadevesi: number,
    salaoja: number,
    julkisivu: number,
    ikkunat: number,
    ovet: number,
    vaippa: number,
    tontti: number,
    lattia: number,
    sisailma: number,
    yleisilme: number,
    lammitys: number,
    lammlaitteet: number,
    kayttovesi: number,
    viemari: number,
    iv: number,
    peruskorjaus: number,
    toimivuus: number,
    kayttoaste_piste: number,
    tulevaisuus: number,
    investointi: number,
}

interface Toimenpide {
    kuvaus: string;
    kustannukset: string;
    tila: boolean;
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

    yllapitokulut: { [key: number]: YllapitoKulut };
    vuokrakulut: { [key: number]: VuokraKulut };
}

export type NewKiinteistoInput = Omit<Kiinteisto, "id" | "painotetutPisteet" | "oma_salkku">;