import React, { useState } from "react";
import "./AddProp.css";

interface YllapitoKustannukset {
  sahko: number;
  lammitus: number;
  vesi: number;
  huolto: number;
  kiinteistovero: number;
  laina: number;
}

interface KuntoArvio {
  ika: number;
  vesikatto: number;
  sadevesi: number;
  salaojat: number;
  julkisivu: number;
  ikkunat: number;
  ulkoovet: number;
  uarvo: number;
  tonttikorkeus: number;
  lattiakorkeus: number;
  sisailma: number;
  yleisilme: number;
  lammitusmuoto: number;
  lammituslaitteet: number;
  kayttovesi: number;
  viemari: number;
  ivjarjestelma: number;
  peruskorjaus: number;
  toimivuus: number;
  kayttoaste_arvio: number;
  tulevaisuus: number;
  investointi: number;
}

interface KiinteistoForm {
  nimi: string;
  osoite: string;
  kayttotarkoitus: string;
  bruttopintaAla: number;
  rakennusvuosi: number;
  tasearvo: number;

  vuokrattu: number;
  neliovuokra: number;
  suojelukohde: string;

  yllapitokustannukset: YllapitoKustannukset;

  kuntoarvio: KuntoArvio;
}

const AddProp: React.FC = () => {
  const [formData, setFormData] = useState<KiinteistoForm>({
    nimi: "",
    osoite: "",
    kayttotarkoitus: "",

    bruttopintaAla: "" as unknown as number,
    rakennusvuosi: "" as unknown as number,
    tasearvo: "" as unknown as number,
    vuokrattu: "" as unknown as number,
    neliovuokra: "" as unknown as number,

    suojelukohde: "Ei",


    yllapitokustannukset: {
      sahko: "" as unknown as number,
      lammitus: "" as unknown as number,
      vesi: "" as unknown as number,
      huolto: "" as unknown as number,
      kiinteistovero: "" as unknown as number,
      laina: "" as unknown as number,
    },



    kuntoarvio: {
      ika: 3,
      vesikatto: 3,
      sadevesi: 3,
      salaojat: 3,
      julkisivu: 3,
      ikkunat: 3,
      ulkoovet: 3,
      uarvo: 3,
      tonttikorkeus: 3,
      lattiakorkeus: 3,
      sisailma: 3,
      yleisilme: 3,
      lammitusmuoto: 3,
      lammituslaitteet: 3,
      kayttovesi: 3,
      viemari: 3,
      ivjarjestelma: 3,
      peruskorjaus: 3,
      toimivuus: 3,
      kayttoaste_arvio: 3,
      tulevaisuus: 3,
      investointi: 3,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("ylläpito.")) {
      const key = name.split(".")[1] as keyof YllapitoKustannukset;

      setFormData((prev) => ({
        ...prev,
        yllapitokustannukset: {
          ...prev.yllapitokustannukset,
          [key]: Number(value),
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "nimi" || name === "osoite" || name === "kayttotarkoitus" || name === "suojelukohde"
        ? value
        : Number(value),
    }));
  };

  const updateSlider = (field: keyof KuntoArvio, value: number) => {
    setFormData((prev) => ({
      ...prev,
      kuntoarvio: { ...prev.kuntoarvio, [field]: value },
    }));
  };



const handleSubmit = (e: any) => {
  e.preventDefault();

  console.log("SUBMIT OK");

  // Haetaan aiemmat arvot
  const existing = JSON.parse(localStorage.getItem("kiinteistot") || "[]");

  // Lisätään uusi kiinteistö
  const uusi = {
    nimi: formData.nimi,
    osoite: formData.osoite,
    kayttotarkoitus: formData.kayttotarkoitus,
  };

  existing.push(uusi);

  // Tallennetaan
  localStorage.setItem("kiinteistot", JSON.stringify(existing));
  window.dispatchEvent(new Event("kiinteisto-added"));

  console.log("TALLENNETTU:", existing);

  alert("Kiinteistö lisätty!");
};




return (
  <div className="addprop-container">

    <div className="card-container">

      <h2>Lisää kiinteistö</h2>

      <form onSubmit={handleSubmit}>

        <div className="section-title">Perustiedot</div>

        <div className="grid-2col">
          <div className="grid-item">
            <label>Kiinteistön nimi *</label>
            <input name="nimi" value={formData.nimi} onChange={handleChange} required />
          </div>

          <div className="grid-item">
            <label>Osoite</label>
            <input name="osoite" value={formData.osoite} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Käyttötarkoitus</label>
            <select name="kayttotarkoitus" value={formData.kayttotarkoitus} onChange={handleChange}>
              <option value="">Valitse...</option>
              <option>Julkinen kiinteistö</option>
              <option>Asuinrakennus</option>
              <option>Yrityskiinteistö</option>
              <option>Muu</option>
            </select>
          </div>

          <div className="grid-item">
            <label>Bruttopinta-ala (m²)</label>
            <input type="number" name="bruttopintaAla" value={formData.bruttopintaAla} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Rakennusvuosi</label>
            <input type="number" name="rakennusvuosi" value={formData.rakennusvuosi} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Tasearvo (€)</label>
            <input type="number" name="tasearvo" value={formData.tasearvo} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Vuokralla olevat m²</label>
            <input type="number" name="vuokrattu" value={formData.vuokrattu} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Neliövuokra (€/m²)</label>
            <input type="number" name="neliovuokra" value={formData.neliovuokra} onChange={handleChange} />
          </div>

          <div className="grid-item">
            <label>Suojelukohde</label>
            <select name="suojelukohde" value={formData.suojelukohde} onChange={handleChange}>
              <option>Ei</option>
              <option>Kyllä</option>
            </select>
          </div>
        </div>

        <div className="section-title">Ylläpitokustannukset (€/v)</div>

        <div className="grid-2col">
          <div className="grid-item">
            <label>Sähkökustannus</label>
            <input name="ylläpito.sahko" type="number" value={formData.yllapitokustannukset.sahko} onChange={handleChange}/>
          </div>

          <div className="grid-item">
            <label>Lämmityskustannus</label>
            <input name="ylläpito.lammitus" type="number" value={formData.yllapitokustannukset.lammitus} onChange={handleChange}/>
          </div>

          <div className="grid-item">
            <label>Vesikustannus</label>
            <input name="ylläpito.vesi" type="number" value={formData.yllapitokustannukset.vesi} onChange={handleChange}/>
          </div>

          <div className="grid-item">
            <label>Huoltokustannus</label>
            <input name="ylläpito.huolto" type="number" value={formData.yllapitokustannukset.huolto} onChange={handleChange}/>
          </div>

          <div className="grid-item">
            <label>Kiinteistövero</label>
            <input name="ylläpito.kiinteistovero" type="number" value={formData.yllapitokustannukset.kiinteistovero} onChange={handleChange}/>
          </div>

          <div className="grid-item">
            <label>Lainakustannukset</label>
            <input name="ylläpito.laina" type="number" value={formData.yllapitokustannukset.laina} onChange={handleChange}/>
          </div>
        </div>

        <div className="section-title">Kuntoarvio</div>

        <div className="slider-grid">
          {[
            ["Kiinteistön ikä", "ika"],
            ["Vesikaton kunto ja kaltevuus", "vesikatto"],
            ["Sadevesijärjestelmät", "sadevesi"],
            ["Salaoja ja seinänvierustat", "salaojat"],
            ["Julkisivuverhouksen kunto", "julkisivu"],
            ["Ikkunat – laatu ja kunto", "ikkunat"],
            ["Ulko-ovet – laatu ja kunto", "ulkoovet"],
            ["Rakennusvaipan U-arvo", "uarvo"],
            ["Tontin korkeusasema ja kuivatus", "tonttikorkeus"],
            ["Lattiapinnan korkeus maastoon nähden", "lattiakorkeus"],
            ["Sisäilmaongelmat", "sisailma"],
            ["Yleisilme sisätiloilta", "yleisilme"],
            ["Lämmitysmuoto", "lammitusmuoto"],
            ["Lämmityslaitteiden kunto", "lammituslaitteet"],
            ["Käyttövesiputkistot", "kayttovesi"],
            ["Viemäriputkisto", "viemari"],
            ["IV-järjestelmä", "ivjarjestelma"],
            ["Peruskorjaus viim. 15v", "peruskorjaus"],
            ["Toimivuus käyttötarkoitukseen", "toimivuus"],
            ["Rakennuksen käyttöaste", "kayttoaste_arvio"],
            ["Tulevaisuuden käyttöaste", "tulevaisuus"],
            ["Kannattaako investoida", "investointi"],
          ].map(([label, field]) => (
            <div className="slider-item" key={field}>
              <label>{label}</label>
              <input
                type="range"
                min={1}
                max={5}
                value={(formData.kuntoarvio as any)[field]}
                onChange={(e) => updateSlider(field as keyof KuntoArvio, Number(e.target.value))}
              />
              <span>{(formData.kuntoarvio as any)[field]}</span>
            </div>
          ))}
        </div>

        <button className="save-button" type="submit">Tallenna</button>
      

      </form>

    </div> 

  </div>   
);
}

export default AddProp;
