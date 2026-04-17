import React, { useState } from "react";
import "./AddProp.css";
import { useNavigate, useSearchParams } from "react-router-dom";


// Ryhmän providerin hook
import { useKiinteistot } from "../context/useKiinteistot";
import { type NewKiinteistoInput } from "../types";
import { ArviointiParametrit } from "../context/arviointiParametrit";

const AddProp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const editId = idParam ? Number(idParam) : null;

  const store = useKiinteistot();

  const existing = editId ? store.getById(editId) : null;
  const isEditMode = Boolean(existing);
  const { add } = useKiinteistot();
  const navigate = useNavigate();

  // Lomakedata
const [formData, setFormData] = useState(() => {
  if (!existing) {
    return {
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
      kunto: Object.fromEntries(
        Object.keys(ArviointiParametrit).map((k) => [k, 3]),
      ),
    };
  }

  const latestYear = store.getLatestYear();

  return {
    nimi: existing.nimi,
    osoite: existing.osoite,
    kayttotarkoitus: existing.kayttotarkoitus ?? "",
    bruttopintaAla: existing.pinta_ala,
    rakennusvuosi: existing.rakennusvuosi,
    tasearvo: existing.vuokrakulut?.[latestYear]?.tasearvo ?? 0,
    vuokrattu: existing.vuokrakulut?.[latestYear]?.vuokrausaste_m2 ?? 0,
    neliovuokra: existing.vuokrakulut?.[latestYear]?.neliövuokra ?? 0,
    suojelukohde: existing.suojelukohde ? "Kyllä" : "Ei",
    yllapito: {
      sahko: existing.yllapitokulut?.[latestYear]?.sahko ?? 0,
      lammitus: existing.yllapitokulut?.[latestYear]?.lammitys ?? 0,
      vesi: existing.yllapitokulut?.[latestYear]?.vesi ?? 0,
      huolto: existing.yllapitokulut?.[latestYear]?.huolto ?? 0,
      kiinteistovero: existing.yllapitokulut?.[latestYear]?.vero ?? 0,
      laina: existing.yllapitokulut?.[latestYear]?.laina ?? 0,
    },
    kunto: { ...existing.pisteet },
  };
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

    // OIKEA dataformaatti providerille + DetailView:lle
    const uusi: NewKiinteistoInput = {
      nimi: formData.nimi,
      osoite: formData.osoite,
      kayttotarkoitus: formData.kayttotarkoitus,
      pinta_ala: formData.bruttopintaAla,
      rakennusvuosi: formData.rakennusvuosi,
      suojelukohde: formData.suojelukohde === "Kyllä",

      pisteet: { ...formData.kunto },

      yllapitokulut: {
        ...(existing?.yllapitokulut ?? {}),
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
        ...(existing?.vuokrakulut ?? {}),
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

  if (isEditMode && existing) {
    store.update({
      ...existing,
      ...uusi,
      id: existing.id,
      painotetutPisteet: store.calPainotutPisteet({
        ...existing,
        pisteet: uusi.pisteet,
      }),
      oma_salkku: store.evalSalkku({
        ...existing,
        pisteet: uusi.pisteet,
      }),
    });

    alert("Kiinteistö päivitetty!");
  } else {
    store.add(uusi);
    alert("Kiinteistö lisätty!");
  }

  navigate("/");
  };

  return (
    <div className="addprop-container">
      <div className="card-container">
        <h2>{isEditMode ? "Muokkaa kiinteistöä" : "Lisää kiinteistö"}</h2>


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

            {Object.entries(ArviointiParametrit).map(([field, { nimi }]) => (
              <div className="slider-item" key={field}>
                <label>{nimi}</label>
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
          {isEditMode ? "Tallenna muutokset" : "Tallenna"}
        </button>

        </form>
      </div>
    </div>
  );
};

export default AddProp;
