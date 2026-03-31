import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PropertyView.css";

export default function PropertyView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const list = JSON.parse(localStorage.getItem("kiinteistot") || "[]");
  const item = list[Number(id)];

  if (!item) {
    return <div style={{ padding: 20 }}>Ei kiinteistöä löytynyt.</div>;
  }

  // =============================
  // 1. Lasketaan kuntoarviopisteet (22 kohtaa)
  // =============================
  const total = Object.values(item.kuntoarvio || {})
    .map(Number)
    .reduce((a, b) => a + b, 0);

  function getSalkkuClass(total: number) {
    if (total >= 225) return "A";
    if (total >= 175) return "B";
    if (total >= 125) return "C";
    return "D";
  }

  const salkku = getSalkkuClass(total);

  // -----------------------------
  // 22 kuntoarviokohdetta listaksi
  // -----------------------------
  const kuntoarvioLabels: Record<string, string> = {
    ika: "Kiinteistön ikä",
    vesikatto: "Vesikaton kunto ja kaltevuus",
    sadevesi: "Sadevesijärjestelmät",
    salaojat: "Salaoja ja seinänvierustat",
    julkisivu: "Julkisivuverhouksen kunto",
    ikkunat: "Ikkunat – laatu ja kunto",
    ulkoovet: "Ulko-ovet – laatu ja kunto",
    uarvo: "Rakennusvaipan U-arvo",
    tonttikorkeus: "Tontin korkeusasema ja kuivatus",
    lattiakorkeus: "Lattiapinnan korkeus maastoon nähden",
    sisailma: "Sisäilmaongelmat",
    yleisilme: "Yleisilme sisätiloilta",
    lammitusmuoto: "Lämmitysmuoto",
    lammituslaitteet: "Lämmityslaitteiden kunto",
    kayttovesi: "Käyttövesiputkistot",
    viemari: "Viemäriputkisto",
    ivjarjestelma: "IV-järjestelmä",
    peruskorjaus: "Peruskorjaus viim. 15v",
    toimivuus: "Toimivuus käyttötarkoitukseen",
    kayttoaste_arvio: "Rakennuksen käyttöaste",
    tulevaisuus: "Tulevaisuuden käyttöaste",
    investointi: "Kannattaako investoida"
  };

  // =============================
  // POISTA KIINTEISTÖ
  // =============================
  const deleteProperty = () => {
    if (!confirm("Haluatko varmasti poistaa tämän kiinteistön?")) return;

    const updated = [...list];
    updated.splice(Number(id), 1);

    localStorage.setItem("kiinteistot", JSON.stringify(updated));
    window.dispatchEvent(new Event("kiinteisto-added"));

    navigate("/");
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="prop-container">
      <h2>{item.nimi}</h2>

      {/* =============================
          Salkkupistekortti
      ============================= */}
      <div className="score-card">
        <div className="score-big">{total}</div>
        <div className="score-class">Salkku {salkku}</div>
        <div className="score-desc">
          A ≥ 225 | B ≥ 175 | C ≥ 125 | D &lt; 125
        </div>
      </div>

      {/* =============================
          Perustiedot
      ============================= */}
      <div className="section">
        <h3>Perustiedot</h3>
        <p><strong>Nimi:</strong> {item.nimi}</p>
        <p><strong>Osoite:</strong> {item.osoite}</p>
        <p><strong>Käyttötarkoitus:</strong> {item.kayttotarkoitus}</p>
        <p><strong>Bruttopinta-ala:</strong> {item.bruttopintaAla} m²</p>
        <p><strong>Rakennusvuosi:</strong> {item.rakennusvuosi}</p>
        <p><strong>Tasearvo:</strong> {item.tasearvo} €</p>
        <p><strong>Vuokralla olevat m²:</strong> {item.vuokrattu}</p>
        <p><strong>Neliövuokra:</strong> {item.neliovuokra} €/m²</p>
        <p><strong>Suojelukohde:</strong> {item.suojelukohde}</p>
      </div>

      {/* =============================
          Ylläpitokustannukset
      ============================= */}
      <div className="section">
        <h3>Ylläpitokustannukset (€/v)</h3>
        <p><strong>Sähkö:</strong> {item.yllapitokustannukset.sahko}</p>
        <p><strong>Lämmitys:</strong> {item.yllapitokustannukset.lammitus}</p>
        <p><strong>Vesi:</strong> {item.yllapitokustannukset.vesi}</p>
        <p><strong>Huolto:</strong> {item.yllapitokustannukset.huolto}</p>
        <p><strong>Kiinteistövero:</strong> {item.yllapitokustannukset.kiinteistovero}</p>
        <p><strong>Laina:</strong> {item.yllapitokustannukset.laina}</p>
      </div>

      {/* =============================
          Kuntoarvio
      ============================= */}
      <div className="section">
        <h3>Kuntoarvio</h3>
        {Object.entries(item.kuntoarvio).map(([key, value]) => (
          <div key={key} className="kunto-row">
            <span className="kunto-label">{kuntoarvioLabels[key]}</span>
            <span className="kunto-value">{value} / 5</span>
          </div>
        ))}
      </div>

      {/*  POISTA KIINTEISTÖ */}
      <button className="delete-button" onClick={deleteProperty}>
        Poista kiinteistö
      </button>
    </div>
  );
}