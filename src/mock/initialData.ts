import type { Kiinteisto } from "../types";

export const INITIAL_DATA: Kiinteisto[] = [
    {
        id: "k1",
        nimi: "Kirjastotalo",
        osoite: "Katu 1",
        pinta_ala: 1500,
        kayttotarkoitus: "Julkinen rakennus",
        rakennusvuosi: 1998,
        suojelukohde: false,

        pisteet: {
            ika: 4,
            vesikatto: 4,
            sadevesi: 5,
            julkisivu: 4,
            ikkunat: 4,
            ovet: 4,
        },

        oma_salkku: "A",

        yllapitokulut: {
            sahko: { "2023": 5000 },
            lammitys: { "2023": 6200 },
            vesi: { "2023": 2000 },
            huolto: { "2023": 1800 },
            vero: { "2023": 1500 },
            laina: { "2023": 12000 },
            muut: {},
        },

        tasearvo: { "2023": 950000 },
        vuokrausaste_m2: { "2023": 300 },
        neliövuokra: { "2023": 12 },
    },

    {
        id: "k2",
        nimi: "Koulurakennus",
        osoite: "Opintie 3",
        pinta_ala: 2000,
        kayttotarkoitus: "Julkinen rakennus",
        rakennusvuosi: 2005,
        suojelukohde: false,

        pisteet: {
            ika: 5,
            vesikatto: 4,
            sadevesi: 4,
            julkisivu: 5,
            ikkunat: 4,
            ovet: 5,
        },

        oma_salkku: "A",

        yllapitokulut: {
            sahko: { "2023": 3500 },
            lammitys: { "2023": 9500 },
            vesi: { "2023": 2500 },
            huolto: { "2023": 3200 },
            vero: { "2023": 2400 },
            laina: { "2023": 18000 },
            muut: {},
        },

        tasearvo: { "2023": 1250000 },
        vuokrausaste_m2: { "2023": 800 },
        neliövuokra: { "2023": 10 },
    },

    {
        id: "k3",
        nimi: "Toimistokeskus",
        osoite: "Yritystie 12",
        pinta_ala: 1100,
        kayttotarkoitus: "Yrityskiinteistö",
        rakennusvuosi: 2010,
        suojelukohde: false,

        pisteet: {
            ika: 3,
            vesikatto: 3,
            sadevesi: 3,
            julkisivu: 2,
            ikkunat: 3,
            ovet: 3,
        },

        oma_salkku: "B",

        yllapitokulut: {
            sahko: { "2023": 4500 },
            lammitys: { "2023": 7000 },
            vesi: { "2023": 2100 },
            huolto: { "2023": 1900 },
            vero: { "2023": 900 },
            laina: { "2023": 9000 },
            muut: {},
        },

        tasearvo: { "2023": 800000 },
        vuokrausaste_m2: { "2023": 650 },
        neliövuokra: { "2023": 14 },
    },

    {
        id: "k4",
        nimi: "Varastohalli",
        osoite: "Teollisuuspolku 5",
        pinta_ala: 950,
        kayttotarkoitus: "Varasto",
        rakennusvuosi: 1982,
        suojelukohde: false,

        pisteet: {
            ika: 2,
            vesikatto: 2,
            sadevesi: 1,
            julkisivu: 1,
            ikkunat: 2,
            ovet: 2,
        },

        oma_salkku: "C",

        yllapitokulut: {
            sahko: { "2023": 3000 },
            lammitys: { "2023": 4000 },
            vesi: { "2023": 900 },
            huolto: { "2023": 1000 },
            vero: { "2023": 800 },
            laina: { "2023": 5000 },
            muut: {},
        },

        tasearvo: { "2023": 400000 },
        vuokrausaste_m2: { "2023": 300 },
        neliövuokra: { "2023": 8 },
    },

        {
        id: "k5",
        nimi: "Kiinteistö 5",
        osoite: "Kiinteistötie 5",
        pinta_ala: 1050,
        kayttotarkoitus: "Julkinen rakennus",
        rakennusvuosi: 1992,
        suojelukohde: false,

        pisteet: {
            ika: 3,
            vesikatto: 3,
            sadevesi: 2,
            julkisivu: 2,
            ikkunat: 3,
            ovet: 3,
        },

        oma_salkku: "C",

        yllapitokulut: {
            sahko: { "2023": 3000 },
            lammitys: { "2023": 4000 },
            vesi: { "2023": 900 },
            huolto: { "2023": 1000 },
            vero: { "2023": 800 },
            laina: { "2023": 5000 },
            muut: {},
        },

        tasearvo: { "2023": 400000 },
        vuokrausaste_m2: { "2023": 300 },
        neliövuokra: { "2023": 8 },
    }
];