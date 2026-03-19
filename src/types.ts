export interface VuosiArvot {
    [year: string]: number;
}

export interface YllapitoKulut {
    sahko: VuosiArvot;
    lammitys: VuosiArvot;
    vesi: VuosiArvot;
    huolto: VuosiArvot;
    vero: VuosiArvot;
    laina: VuosiArvot;
    muut: VuosiArvot;
}

export interface Pisteet {
    [kriteeri: string]: number;
}

export interface Kiinteisto {
    id: string;
    nimi: string;
    osoite: string;
    pinta_ala: number;
    kayttotarkoitus: string;
    rakennusvuosi: number;
    suojelukohde: boolean;

    pisteet: Pisteet;
    oma_salkku: string;

    yllapitokulut: YllapitoKulut;

    tasearvo: VuosiArvot;
    vuokrausaste_m2: VuosiArvot;
    neliövuokra: VuosiArvot;
}