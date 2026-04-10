interface YllapitoKulut {
    sahko: number;
    lammitys: number;
    vesi: number;
    huolto: number;
    vero: number;
    laina: number;
    muut: number;
}

interface VuokraKulut {
    tasearvo: number;
    vuokrausaste_m2: number;
    neliövuokra: number;
    sahkonkulutus: number;
    lammitysenergia: number;
    vedenkulutus: number;
}

interface Pisteet {
    [kriteeri: string]: number;
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
    oma_salkku: string;
    oma_perusteet: string;
    toimenpiteet: Toimenpide[];

    yllapitokulut: { [key: number]: YllapitoKulut };
    vuokrakulut: { [key: number]: VuokraKulut };
}

export type KiinteistoStore = {
    kiinteistot: Kiinteisto[];
    getById: (id: number) => Kiinteisto | undefined;
    addKiinteisto: (newKiinteisto: Kiinteisto) => void;
    updateKiinteisto: (updated: Kiinteisto) => void;
    deleteKiinteisto: (id: number) => void;
};