import React, { useState } from "react";
import "./AddProp.css";
import { useNavigate } from "react-router-dom";

// Ryhmän providerin hook
import { useKiinteistot } from "../context/useKiinteistot";
import type { Kiinteisto } from "../types";

const AddProp: React.FC = () => {
  const { kiinteistot, addKiinteisto } = useKiinteistot();
  const navigate = useNavigate();

  // Lomakedata
  const [formData, setFormData] = useState({
    nimi: "",
    osoite: "",
    kayttotarkoitus: "",
    bruttopintaAla: 0,
    rakennusvuosi: 0,
    tasearvo: 0,
    vuokrattu: 0,
    neliovuokra: 0,
    suojelukohde: "Ei",

    yllapito: {
      sahko: 0,
      lammitus: 0,
      vesi: 0,
      huolto: 0,
      kiinteistovero: 0,
      laina: 0,
    },

    kunto: {
      ika: 3,
      vesikatto: 3,
      sadevesi: 3,
      salaoja: 3,
      julkisivu: 3,
      ikkunat: 3,
      ovet: 3,
      vaippa: 3,
      tontti: 3,
      lattia: 3,
      sisailma: 3,
      yleisilme: 3,
      lammitys: 3,
      lammlaitteet: 3,
      kayttovesi: 3,
      viemari: 3,
      iv: 3,
      peruskorjaus: 3,
      toimivuus: 3,
      kayttoaste_piste: 3,
      tulevaisuus: 3,
      investointi: 3,
    },
  });

  // Input-käsittelijä
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Ylläpitokulut
    if (name.startsWith("yllapito.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        yllapito: { ...prev.yllapito, [key]: Number(value) },
      }));
      return;
    }

    // Normaalit kentät
    setFormData((prev) => ({
      ...prev,
      [name]: name === "kayttotarkoitus" || name === "suojelukohde"
        ? value
        : isNaN(Number(value))
          ? value
          : Number(value),
    }));
  };

  // Sliderien muutos
  const changeSlider = (field: string, val: number) => {
    setFormData((prev) => ({
      ...prev,
      kunto: { ...prev.kunto, [field]: val },
    }));
  };

  // Lomakkeen lähetys
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const year = new Date().getFullYear();

    const newId =
      kiinteistot.length === 0
        ? 1
        : Math.max(...kiinteistot.map((k) => k.id)) + 1;

    // OIKEA dataformaatti providerille + DetailView:lle
    const uusi: Kiinteisto = {
      id: newId,
      nimi: formData.nimi,
      osoite: formData.osoite,
      kayttotarkoitus: formData.kayttotarkoitus,
      pinta_ala: formData.bruttopintaAla,
      rakennusvuosi: formData.rakennusvuosi,
      suojelukohde: formData.suojelukohde === "Kyllä",
      oma_salkku: "A",

      pisteet: { ...formData.kunto },

      yllapitokulut: {
        [year]: {
          sahko: formData.yllapito.sahko,
          lammitys: formData.yllapito.lammitus,
          vesi: formData.yllapito.vesi,
          huolto: formData.yllapito.huolto,
          vero: formData.yllapito.kiinteistovero,
          laina: formData.yllapito.laina,
          muut: 0,
        },
      },

      vuokrakulut: {
        [year]: {
          tasearvo: formData.tasearvo,
          vuokrausaste_m2: formData.vuokrattu,
          neliövuokra: formData.neliovuokra,
          sahkonkulutus: 0,
          lammitysenergia: 0,
          vedenkulutus: 0,
        },
      },

      oma_perusteet: "",
      toimenpiteet: [],
    };

    addKiinteisto(uusi);

    alert("Kiinteistö lisätty!");
    navigate("/");
  };

  return (
    <div className="addprop-container">
      <div className="card-container">
        <h2>Lisää kiinteistö</h2>

        <form onSubmit={handleSubmit}>

          {/* --- Perustiedot --- */}
          <div className="section-title">Perustiedot</div>

          <div className="grid-2col">

            <div className="grid-item">
              <label>Kiinteistön nimi *</label>
              <input
                name="nimi"
                value={formData.nimi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-item">
              <label>Osoite</label>
              <input
                name="osoite"
                value={formData.osoite}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Käyttötarkoitus</label>
              <select
                name="kayttotarkoitus"
                value={formData.kayttotarkoitus}
                onChange={handleChange}
              >
                <option value="">Valitse...</option>
                <option value="Julkinen kiinteistö">Julkinen kiinteistö</option>
                <option value="Asuinrakennus">Asuinrakennus</option>
                <option value="Yrityskiinteistö">Yrityskiinteistö</option>
                <option value="Muu">Muu</option>
              </select>
            </div>

            <div className="grid-item">
              <label>Bruttopinta-ala (m²)</label>
              <input
                type="number"
                name="bruttopintaAla"
                value={formData.bruttopintaAla}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Rakennusvuosi</label>
              <input
                type="number"
                name="rakennusvuosi"
                value={formData.rakennusvuosi}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Tasearvo (€)</label>
              <input
                type="number"
                name="tasearvo"
                value={formData.tasearvo}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Vuokralla olevat m²</label>
              <input
                type="number"
                name="vuokrattu"
                value={formData.vuokrattu}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Neliövuokra (€/m²)</label>
              <input
                type="number"
                name="neliovuokra"
                value={formData.neliovuokra}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Suojelukohde</label>
              <select
                name="suojelukohde"
                value={formData.suojelukohde}
                onChange={handleChange}
              >
                <option value="Ei">Ei</option>
                <option value="Kyllä">Kyllä</option>
              </select>
            </div>
          </div>

          {/* --- Ylläpitokustannukset --- */}
          <div className="section-title">Ylläpitokustannukset (€/v)</div>

          <div className="grid-2col">
            <div className="grid-item">
              <label>Sähkökustannus</label>
              <input name="yllapito.sahko" type="number" value={formData.yllapito.sahko} onChange={handleChange} />
            </div>

            <div className="grid-item">
              <label>Lämmityskustannus</label>
              <input name="yllapito.lammitus" type="number" value={formData.yllapito.lammitus} onChange={handleChange} />
            </div>

            <div className="grid-item">
              <label>Vesikustannus</label>
              <input name="yllapito.vesi" type="number" value={formData.yllapito.vesi} onChange={handleChange} />
            </div>

            <div className="grid-item">
              <label>Huoltokustannus</label>
              <input name="yllapito.huolto" type="number" value={formData.yllapito.huolto} onChange={handleChange} />
            </div>

            <div className="grid-item">
              <label>Kiinteistövero</label>
              <input name="yllapito.kiinteistovero" type="number" value={formData.yllapito.kiinteistovero} onChange={handleChange} />
            </div>

            <div className="grid-item">
              <label>Lainakustannukset</label>
              <input name="yllapito.laina" type="number" value={formData.yllapito.laina} onChange={handleChange} />
            </div>
          </div>

          {/* --- Kuntoarvio --- */}
          <div className="section-title">Kuntoarvio</div>

          <div className="slider-grid">

            {[
              ["Kiinteistön ikä", "ika"],
              ["Vesikaton kunto ja kaltevuus", "vesikatto"],
              ["Sadevesijärjestelmät", "sadevesi"],
              ["Salaoja ja seinänvierustat", "salaoja"],
              ["Julkisivuverhouksen kunto", "julkisivu"],
              ["Ikkunat – laatu ja kunto", "ikkunat"],
              ["Ulko-ovet – laatu ja kunto", "ovet"],
              ["Rakennusvaipan U-arvo", "vaippa"],
              ["Tontin korkeusasema ja kuivatus", "tontti"],
              ["Lattiapinnan korkeus maastoon nähden", "lattia"],
              ["Sisäilmaongelmat", "sisailma"],
              ["Yleisilme sisätiloilta", "yleisilme"],
              ["Lämmitysmuoto", "lammitys"],
              ["Lämmityslaitteiden kunto", "lammlaitteet"],
              ["Käyttövesiputkistot", "kayttovesi"],
              ["Viemäriputkisto", "viemari"],
              ["IV-järjestelmä", "iv"],
              ["Peruskorjaus viim. 15v", "peruskorjaus"],
              ["Toimivuus käyttötarkoitukseen", "toimivuus"],
              ["Rakennuksen käyttöaste", "kayttoaste_piste"],
              ["Tulevaisuuden käyttöaste", "tulevaisuus"],
              ["Kannattaako investoida", "investointi"],
            ].map(([label, field]) => (
              <div className="slider-item" key={field}>
                <label>{label}</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={(formData.kunto as { [key: string]: number })[field]}
                  onChange={(e) => changeSlider(field, Number(e.target.value))}
                />
                <span>{(formData.kunto as { [key: string]: number })[field]}</span>
              </div>
            ))}

          </div>

          <button className="save-button" type="submit">
            Tallenna
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProp;
