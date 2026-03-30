export interface kiinteisto {
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
  toimenpiteet: Toimenpiteet[];
  yllapitokulut: Yllapitokulut;
  tasearvo: vuosi_kulut;
  vuokrausaste_m2: vuosi_kulut;
  neliovuokra: vuosi_kulut;
  sahkonkulutus: vuosi_kulut;
  lammitysenergia: vuosi_kulut;
  vedenkulutus: vuosi_kulut;
}

export interface Pisteet {
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
}

export interface Toimenpiteet {
  kuvaus: string;
  kustannukset: vuosi_kulut;
}

export interface Yllapitokulut {
  sahko: vuosi_kulut;
  lammitys: vuosi_kulut;
  vesi: vuosi_kulut;
  huolto: vuosi_kulut;
  vero: vuosi_kulut;
  laina: vuosi_kulut;
  muut: vuosi_kulut;
}

export interface vuosi_kulut {
  vuosi: number;
  arvo: number;
}