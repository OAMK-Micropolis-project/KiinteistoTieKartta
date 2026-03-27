import type { Kiinteisto } from "../types";

export const INITIAL_DATA: Kiinteisto[] = [
    {
        "id": 1,
        "nimi": "Kiinteistö 1",
        "osoite": "Kiinteistökuja 1",
        "pinta_ala": 1500,
        "kayttotarkoitus": "Yrityskiinteistö",
        "rakennusvuosi": 2024,
        "suojelukohde": false,
        "pisteet": {
            "ika": 4,
            "vesikatto": 4,
            "sadevesi": 5,
            "salaoja": 5,
            "julkisivu": 4,
            "ikkunat": 4,
            "ovet": 5,
            "vaippa": 5,
            "tontti": 4,
            "lattia": 4,
            "sisailma": 5,
            "yleisilme": 5,
            "lammitys": 5,
            "lammlaitteet": 5,
            "kayttovesi": 5,
            "viemari": 5,
            "iv": 4,
            "peruskorjaus": 3,
            "toimivuus": 5,
            "kayttoaste_piste": 5,
            "tulevaisuus": 5,
            "investointi": 3
    },
    "oma_salkku": "A",
    "oma_perusteet": "Kiinteistön kunto ja käyttöaste on korkea, eikä siihen ole tulossa merkittäviä muutoksia lähivuosina",
    "toimenpiteet": [
        {
        "kuvaus": "Korkea käyttöaste, hyvä kuntoinen ei peruskorjaustarvetta seuraavaan 10 vuoteen",
        "kustannukset": {}
        }
    ],
    "yllapitokulut": {
      "sahko": {
        "vuosi": 2023,
        "kulut": 5000
      },
      "lammitys": {
        "vuosi": 2023,
      "kulut": 7000
      },
      "vesi": {
        "vuosi": 2023,
      "kulut": 2000
      },
      "huolto": {
        "vuosi": 2023,
        "kulut": 2000
      },
      "vero": {
        "vuosi": 2023,
        "kulut": 1500
      },
      "laina": {
        "vuosi": 2023,
        "kulut": 25000
      },
      "muut": {}
    },
    "tasearvo": {
      "vuosi": 2023,
      "kulut": 1000000
    },
    "vuokrausaste_m2": {
      "vuosi": 2023,
      "kulut": 100
    },
    "neliövuokra": {
      "vuosi": 2023,
      "kulut": 10
    },
    "sahkonkulutus": {},
    "lammitysenergia": {},
    "vedenkulutus": {}
  },
  {
    "id": 2,
    "nimi": "Kiinteistö 2",
    "osoite": "Kiinteistökuja 2",
    "pinta_ala": 2000,
    "kayttotarkoitus": "Yrityskiinteistö",
    "rakennusvuosi": 2024,
    "suojelukohde": false,
    "pisteet": {
      "ika": 4,
      "vesikatto": 4,
      "sadevesi": 4,
      "salaoja": 4,
      "julkisivu": 4,
      "ikkunat": 4,
      "ovet": 4,
      "vaippa": 4,
      "tontti": 4,
      "lattia": 4,
      "sisailma": 4,
      "yleisilme": 4,
      "lammitys": 4,
      "lammlaitteet": 4,
      "kayttovesi": 4,
      "viemari": 4,
      "iv": 4,
      "peruskorjaus": 4,
      "toimivuus": 4,
      "kayttoaste_piste": 4,
      "tulevaisuus": 4,
      "investointi": 3
    },
    "oma_salkku": "B",
    "oma_perusteet": "Kiinteistön kunto ja käyttöaste on korkea, eikä siihen ole tulossa merkittäviä muutoksia lähivuosina",
    "toimenpiteet": [
      {
        "kuvaus": "Korkea käyttöaste, hyvä kuntoinen ei peruskorjaustarvetta seuraavaan 10 vuoteen",
        "kustannukset": {}
      }
    ],
    "yllapitokulut": {
      "sahko": {
        "vuosi": 2023,
        "kulut": 3500
      },
      "lammitys": {
        "vuosi": 2023,
        "kulut": 9500
      },
      "vesi": {
        "vuosi": 2023,
        "kulut": 3000
      },
      "huolto": {
        "vuosi": 2023,
        "kulut": 2500
      },
      "vero": {
        "vuosi": 2023,
        "kulut": 2000
      },
      "laina": {
        "vuosi": 2023,
        "kulut": 21050
      },
      "muut": {}
    },
    "tasearvo": {
      "vuosi": 2023,
      "kulut": 750000
    },
    "vuokrausaste_m2": {
      "vuosi": 2023,
      "kulut": 422
    },
    "neliövuokra": {
      "vuosi": 2023,
      "kulut": 11
    },
    "sahkonkulutus": {},
    "lammitysenergia": {},
    "vedenkulutus": {}
  },
  {
    "id": 3,
    "nimi": "Mallikiinteistö",
    "osoite": "Kiinteistökuja 1",
    "pinta_ala": 1100,
    "kayttotarkoitus": "Yrityskiinteistö",
    "rakennusvuosi": 2024,
    "suojelukohde": false,
    "pisteet": {
      "ika": 3,
      "vesikatto": 3,
      "sadevesi": 3,
      "salaoja": 3,
      "julkisivu": 2,
      "ikkunat": 3,
      "ovet": 3,
      "vaippa": 2,
      "tontti": 3,
      "lattia": 3,
      "sisailma": 2,
      "yleisilme": 3,
      "lammitys": 3,
      "lammlaitteet": 3,
      "kayttovesi": 3,
      "viemari": 3,
      "iv": 3,
      "peruskorjaus": 3,
      "toimivuus": 3,
      "kayttoaste_piste": 3,
      "tulevaisuus": 3,
      "investointi": 3
    },
    "oma_salkku": "A",
    "oma_perusteet": "",
    "toimenpiteet": [],
    "yllapitokulut": {
      "sahko": {},
      "lammitys": {},
      "vesi": {},
      "huolto": {},
      "vero": {},
      "laina": {},
      "muut": {}
    },
    "tasearvo": {},
    "vuokrausaste_m2": {},
    "neliövuokra": {},
    "sahkonkulutus": {},
    "lammitysenergia": {},
    "vedenkulutus": {}
  },
  {
    "id": 4,
    "nimi": "Kiinteistö 4",
    "osoite": "Kiinteistökuja 4",
    "pinta_ala": 950,
    "kayttotarkoitus": "Yrityskiinteistö",
    "rakennusvuosi": 1976,
    "suojelukohde": false,
    "pisteet": {
      "ika": 2,
      "vesikatto": 2,
      "sadevesi": 1,
      "salaoja": 1,
      "julkisivu": 2,
      "ikkunat": 1,
      "ovet": 1,
      "vaippa": 1,
      "tontti": 2,
      "lattia": 2,
      "sisailma": 1,
      "yleisilme": 1,
      "lammitys": 2,
      "lammlaitteet": 2,
      "kayttovesi": 1,
      "viemari": 3,
      "iv": 1,
      "peruskorjaus": 3,
      "toimivuus": 3,
      "kayttoaste_piste": 1,
      "tulevaisuus": 1,
      "investointi": 3
    },
    "oma_salkku": "A",
    "oma_perusteet": "",
    "toimenpiteet": [],
    "yllapitokulut": {
      "sahko": {},
      "lammitys": {},
      "vesi": {},
      "huolto": {},
      "vero": {},
      "laina": {},
      "muut": {}
    },
    "tasearvo": {},
    "vuokrausaste_m2": {},
    "neliövuokra": {},
    "sahkonkulutus": {},
    "lammitysenergia": {},
    "vedenkulutus": {}
  }
]