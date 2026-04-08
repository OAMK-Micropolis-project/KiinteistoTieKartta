interface Pisteet {
    [kriteeri: string]: number;
}

interface Talous {
    Vuosi: number;
    YllapitoKulut: YllapitoKulut;
}

interface YllapitoKulut {
    Tasearvo: number;
    Vuokrausaste_m2: number;
    Neliövuokra: number;
    Sahkonkulutus: number;
    Lammitysenergia: number;
    Vedenkulutus: number;
    sahko: number;
    lammitys: number;
    vesi: number;
    huolto: number;
    vero: number;
    laina: number;
    muut: number;
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
    oma_salkku: string;
    oma_perusteet: string;
    toimenpiteet: { kuvaus: string; kustannukset: string }[];
    talous: Talous[];
}

export type KiinteistoStore = {
    kiinteistot: Kiinteisto[];
    getById: (id: number) => Kiinteisto | undefined;
    addKiinteisto: (newKiinteisto: Kiinteisto) => void;
    updateKiinteisto: (updated: Kiinteisto) => void;
    deleteKiinteisto: (id: number) => void;
};