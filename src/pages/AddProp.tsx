import React, { useState, useEffect, useMemo, useRef } from "react";
import "./AddProp.css";
import { useNavigate, useParams } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import { type NewKiinteistoInput, type Pisteet } from "../types";
import { ArviointiParametrit } from "../context/arviointiParametrit";

type FormData = {
  nimi: string;
  osoite: string;
  kayttotarkoitus: string;
  bruttopintaAla: number;
  rakennusvuosi: number;
  hiilijalanjalki: number;
  tasearvo: number;
  rakennusArvo: number;
  maapohjaArvo: number;
  liittymisarvo: number;
  vuokrattu: number;
  suojelukohde: "Ei" | "Kyllä";
  yllapito: {
    sahko: number;
    lammitus: number;
    vesi: number;
    huolto: number;
    kiinteistovero: number;
    laina: number;
  };
  kunto: Pisteet;
};

function makeEmptyForm(): FormData {
  return {
    nimi: "",
    osoite: "",
    kayttotarkoitus: "",
    bruttopintaAla: 0,
    rakennusvuosi: 0,
    hiilijalanjalki: 0,
    tasearvo: 0,
    rakennusArvo: 0,
    maapohjaArvo: 0,
    liittymisarvo: 0,
    vuokrattu: 0,
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
    ) as Pisteet,
  };
}

const AddProp: React.FC = () => {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const previousYearRef = useRef<number | null>(null);

  const { id } = useParams<{ id?: string }>();
  const editId = id ? Number(id) : null;

  const store = useKiinteistot();
  const navigate = useNavigate();

  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [yearTouched, setYearTouched] = useState(false);

  // EDIT MODE snapshot (ei dependencyyn)
  const existing = editId ? store.getById(editId) : null;
  const isEditMode = Boolean(existing);

  // Saatavilla olevat vuodet (editissä)
  const availableYears = useMemo(() => {
    if (!existing) return [];
    const y = new Set<number>([
      ...Object.keys(existing.yllapitokulut ?? {}).map(Number),
      ...Object.keys(existing.vuokrakulut ?? {}).map(Number),
    ]);
    return Array.from(y).sort((a, b) => b - a);
  }, [existing]);

  // Valittu vuosi (addissa voi syöttää uuden)
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const now = new Date().getFullYear();
    return availableYears[0] ?? now;
  });

  const yearOptions = useMemo(() => {
    const set = new Set<number>(availableYears);
    if (isEditMode) set.add(selectedYear);
    return Array.from(set).sort((a, b) => b - a);
  }, [availableYears, selectedYear, isEditMode]);

  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // ADD MODE
    if (!editId) {
      setFormData(makeEmptyForm());
      previousYearRef.current = null;
      return;
    }

    // EDIT MODE - Initialize with first available year
    const current = store.getById(editId);
    if (!current) return;

    const yll = current.yllapitokulut?.[selectedYear];
    const vua = current.vuokrakulut?.[selectedYear];

    setFormData({
      nimi: current.nimi,
      osoite: current.osoite,
      kayttotarkoitus: current.kayttotarkoitus ?? "",
      bruttopintaAla: current.pinta_ala,
      rakennusvuosi: current.rakennusvuosi,
      hiilijalanjalki: current.hiilijalanjalki ?? 0,

      tasearvo: vua?.tasearvo ?? 0,
      rakennusArvo: vua?.rakennusArvo ?? 0,
      maapohjaArvo: vua?.maapohjaArvo ?? 0,
      liittymisarvo: vua?.liittymisarvo ?? 0,
      vuokrattu: vua?.vuokrausaste_m2 ?? 0,

      suojelukohde: current.suojelukohde ? "Kyllä" : "Ei",

      yllapito: {
        sahko: yll?.sahko ?? 0,
        lammitus: yll?.lammitys ?? 0,
        vesi: yll?.vesi ?? 0,
        huolto: yll?.huolto ?? 0,
        kiinteistovero: yll?.vero ?? 0,
        laina: yll?.laina ?? 0,
      },

      kunto: { ...current.pisteet },
    });
    
    previousYearRef.current = selectedYear;

    const t = setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => clearTimeout(t);    
  }, [editId, selectedYear]);
  
  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("yllapito.")) {
      const key = name.split(".")[1] as keyof FormData["yllapito"];
      setFormData((prev) =>
        prev
          ? { ...prev, yllapito: { ...prev.yllapito, [key]: Number(value) } }
          : prev,
      );
      return;
    }

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "kayttotarkoitus" || name === "suojelukohde"
                ? value
                : isNaN(Number(value))
                  ? value
                  : Number(value),
          }
        : prev,
    );
  };

  const changeSlider = (field: string, val: number) => {
    setFormData((prev) =>
      prev ? { ...prev, kunto: { ...prev.kunto, [field]: val } } : prev,
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const year = selectedYear;
    const base = editId ? store.getById(editId) : null;

    const uusi: NewKiinteistoInput = {
      nimi: formData.nimi,
      osoite: formData.osoite,
      kayttotarkoitus: formData.kayttotarkoitus,
      pinta_ala: formData.bruttopintaAla,
      rakennusvuosi: formData.rakennusvuosi,
      hiilijalanjalki: formData.hiilijalanjalki,
      suojelukohde: formData.suojelukohde === "Kyllä",
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
          muutKulut: {},
        },
      },

      vuokrakulut: {
        [year]: {
          tasearvo: formData.tasearvo,
          rakennusArvo: formData.rakennusArvo,
          maapohjaArvo: formData.maapohjaArvo,
          liittymisarvo: formData.liittymisarvo,
          vuokrausaste_m2: formData.vuokrattu,
          neliovuokra: 0,
          kokonaisvuokra: 0,
          sahkonkulutus: 0,
          lammitysenergia: 0,
          vedenkulutus: 0,
          yllapitoKorjaukset: 0,
          maavuokra: 0,
          vakuutus: 0,
          vuokrattu: 0,
          vuokrattavissa: 0,
        },
      },

      oma_perusteet: base?.oma_perusteet ?? "",
      toimenpiteet: base?.toimenpiteet ?? [],
    };

    if (editId && base) {
      store.update({
        ...base,
        ...uusi,
        id: base.id,
        painotetutPisteet: store.calPainotutPisteet({
          ...base,
          pisteet: uusi.pisteet,
        }),
        oma_salkku: store.evalSalkku({ ...base, pisteet: uusi.pisteet }),
      });
      navigate(`/detail/${base.id}`);
      return;
    }

    store.add(uusi);
    navigate("/");
  };

  return (
    <div className="addprop-container">
      <h2>{editId ? "Muokkaa kiinteistöä" : "Lisää uusi kiinteistö"}</h2>
      
      <div className="card-container">
        <form onSubmit={handleSubmit}>
          <div className="grid-2col">
            <div className="grid-item">
              <label>Kiinteistön Nimi</label>
              <input
                ref={firstInputRef}
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
                type="numeric"
                name="bruttopintaAla"
                value={formData.bruttopintaAla}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Rakennusvuosi</label>
              <input
                type="numeric"
                name="rakennusvuosi"
                value={formData.rakennusvuosi}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Tasearvo (€)</label>
              <input
                type="numeric"
                name="tasearvo"
                value={formData.tasearvo}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Rakennus arvo (€)</label>
              <input
                type="numeric"
                name="rakennusArvo"
                value={formData.rakennusArvo}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Maapohja arvo (€)</label>
              <input
                type="numeric"
                name="maapohjaArvo"
                value={formData.maapohjaArvo}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Liittymisarvo (€)</label>
              <input
                type="numeric"
                name="liittymisarvo"
                value={formData.liittymisarvo}
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

            <div className="grid-item">
              <label>Hiilijalanjälki (kg CO₂)</label>
              <input
                type="numeric"
                name="hiilijalanjalki"
                value={formData.hiilijalanjalki}
                onChange={handleChange}
              />
            </div>

            <div className="grid-item">
              <label>Vuosi</label>

              {isEditMode ? (
                <>
                  <div className="year-row">
                    <select
                      className="year-select"
                      value={selectedYear}
                      onChange={(e) => {
                        setYearTouched(true);
                        setSelectedYear(Number(e.target.value));
                      }}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>

                    <span className="year-separator">tai</span>

                    <input
                      className="year-input year-input--full"
                      type="numeric"
                      value={newYear}
                      min={1900}
                      max={2100}
                      style={{ width: "110px" }}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                    />

                    <button
                      className="year-add-button"
                      type="button"
                      onClick={() => {
                        setYearTouched(true);
                        setSelectedYear(newYear);
                      }}
                    >
                      Lisää vuosi
                    </button>
                  </div>

                  <small className="year-help">
                    Valitse olemassa oleva vuosi dropdownista tai lisää uusi
                    vuosi ja tallenna.
                  </small>
                </>
              ) : (
                <input
                  className="year-input year-input--compact"
                  type="numeric"
                  value={selectedYear}
                  min={1900}
                  max={2100}
                  onChange={(e) => {
                    setYearTouched(true);
                    setSelectedYear(Number(e.target.value));
                  }}
                />
              )}
            </div>
          </div>

          <div className="section-title">Ylläpitokustannukset (€/v)</div>

          <div className="grid-2col">
            <div className="grid-item">
              <label>Sähkökustannus</label>
              <input
                name="yllapito.sahko"
                type="numeric"
                value={formData.yllapito.sahko}
                onChange={handleChange}
              />
            </div>
            <div className="grid-item">
              <label>Lämmityskustannus</label>
              <input
                name="yllapito.lammitus"
                type="numeric"
                value={formData.yllapito.lammitus}
                onChange={handleChange}
              />
            </div>
            <div className="grid-item">
              <label>Vesikustannus</label>
              <input
                name="yllapito.vesi"
                type="numeric"
                value={formData.yllapito.vesi}
                onChange={handleChange}
              />
            </div>
            <div className="grid-item">
              <label>Huoltokustannus</label>
              <input
                name="yllapito.huolto"
                type="numeric"
                value={formData.yllapito.huolto}
                onChange={handleChange}
              />
            </div>
            <div className="grid-item">
              <label>Kiinteistövero</label>
              <input
                name="yllapito.kiinteistovero"
                type="numeric"
                value={formData.yllapito.kiinteistovero}
                onChange={handleChange}
              />
            </div>
            <div className="grid-item">
              <label>Lainakustannukset</label>
              <input
                name="yllapito.laina"
                type="numeric"
                value={formData.yllapito.laina}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="section-title">Kuntoarvio</div>

          <div className="slider-grid">
            {Object.entries(ArviointiParametrit).map(([field, { nimi }]) => (
              <div className="slider-item" key={field}>
                <label>{nimi}</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={(formData.kunto as Record<string, number>)[field]}
                  onChange={(e) => changeSlider(field, Number(e.target.value))}
                />
                <span>{(formData.kunto as Record<string, number>)[field]}</span>
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
