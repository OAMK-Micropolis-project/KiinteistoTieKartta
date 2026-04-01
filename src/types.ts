interface VuosiArvot {
    [year: string]: number;
}

interface YllapitoKulut {
    sahko: VuosiArvot;
    lammitys: VuosiArvot;
    vesi: VuosiArvot;
    huolto: VuosiArvot;
    vero: VuosiArvot;
    laina: VuosiArvot;
    muut: VuosiArvot;
}

interface Pisteet {
    [kriteeri: string]: number;
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
    toimenpiteet: { kuvaus: string; kustannukset:{} }[];

    yllapitokulut: YllapitoKulut;
    tasearvo: VuosiArvot;
    vuokrausaste_m2: VuosiArvot;
    neliövuokra: VuosiArvot;
    sahkonkulutus: VuosiArvot;
    lammitysenergia: VuosiArvot;
    vedenkulutus: VuosiArvot;
}

export type KiinteistoStore = {
    kiinteistot: Kiinteisto[];
    getById: (id: number) => Kiinteisto | undefined;
    addKiinteisto: (newKiinteisto: Kiinteisto) => void;
    updateKiinteisto: (updated: Kiinteisto) => void;
    deleteKiinteisto: (id: number) => void;
    saveData: () => void;
};