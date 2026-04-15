import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import AnalyticsView from "./pages/AnalyticsView.tsx";
import DetailView from "./pages/detailView";
import "./utils/chartSetup";
import PointsBarChart from "./components/charts/Barchart";
import Layout from "./components/Layout";
import AddProp from "./pages/AddProp";
import DonutChart from "./components/charts/DonutChart";
import formatNumberShort from "./utils/formatUtils";
import { useKiinteistot } from "./context/useKiinteistot.ts";
import { useEffect, useState } from "react";
import {
  boxesContainer,
  box,
  boxName,
  boxValue,
  boxTitle,
  secondRowContainer,
  realEstatesContainer,
  realEstateRow,
  realEstateRowTitles,
  realEstateTitle,
  realEstateTitle2,
  estateName,
  estateNumber,
  portfolioCell,
  chartContainer,
  portfolioRowStyle,
  portfolioItemHover,
  salkkuBadge,
} from "./SummaryView.styles";

function HomePage() {
  const store = useKiinteistot();
  const realEstates = store.kiinteistot;
  const year = store.getLatestYear();

  useEffect(() => {
    async function load() {
      const settings = await window.settings.load();
      console.log("Last opened file:", settings.lastFilePath);
    }

    load();
  }, []);

  const [hoverId, setHoverId] = useState<string | null>(null);

  const summaryBoxes = [
    {
      name: "KIINTEISTÖJÄ",
      value: formatNumberShort(realEstates.length),
    },

    {
      name: "KOKONAISPINTA-ALA",
      value: formatNumberShort(store.calAllPintaAla()) + " m²",
    },

    {
      name: "TASEARVO YHTEENSÄ",
      value: formatNumberShort(store.calAllTasearvo(year)) + "€",
    },

    {
      name: "YLLÄPITÖKULUT / V",
      value: formatNumberShort(store.calAllYllapito(year)) + "€",
    },

    {
      name: "VUOKRATULOT / V",
      value: formatNumberShort(store.calAllVuokra(year)) + "€",
    },
  ];

  return (
    <>
      <span style={boxTitle}>Kiinteistösalkku</span>

      {/* SUMMARY BOXES */}
      <div style={boxesContainer}>
        {summaryBoxes.map((boxItem, i) => (
          <div key={i} style={box}>
            <span style={boxName}>{boxItem.name}</span>
            <span style={boxValue}>{boxItem.value}</span>
          </div>
        ))}
      </div>

      {/* SECOND ROW */}
      <div style={secondRowContainer}>
        {/* REAL ESTATE LIST */}
        <div style={realEstatesContainer}>
          <span style={realEstateTitle2}>KAIKKI KIINTEISTÖT</span>

          <div style={realEstateRowTitles}>
            <span style={realEstateTitle2}>NIMI</span>
            <span style={realEstateTitle}>SALKKU</span>
            <span style={realEstateTitle}>PISTEET</span>
            <span style={realEstateTitle}>PINTA-ALA</span>
            <span style={realEstateTitle}>TASEARVO</span>
          </div>

          {realEstates.map((estate) => (
            <NavLink
              key={estate.id}
              to={"detail/" + estate.id.toString()}
              style={{
                ...realEstateRow,
                ...portfolioRowStyle(estate.oma_salkku),
                ...(hoverId === String(estate.id) ? portfolioItemHover() : {}),
              }}
              onMouseEnter={() => setHoverId(String(estate.id))}
              onMouseLeave={() => setHoverId(null)}
            >
              <span style={estateName}>{estate.nimi}</span>
              <span style={portfolioCell}>
                <span style={salkkuBadge(estate.oma_salkku)}>
                  {estate.oma_salkku}
                </span>
              </span>
              <span style={estateNumber}>
                {(estate.painotetutPisteet ?? 0).toLocaleString("fi-FI")}
              </span>
              <span style={estateNumber}>
                {estate.pinta_ala.toLocaleString("fi-FI")} m²
              </span>
              <span style={estateNumber}>
                {formatNumberShort(estate.vuokrakulut[year]?.tasearvo ?? 0)}{" "}
                €
              </span>
            </NavLink>
          ))}
        </div>

        {/* CHARTS */}
        <div>
          <div style={chartContainer}>
            <DonutChart />
          </div>

          <div style={chartContainer}>
            <PointsBarChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/detail/:id" element={<DetailView />} />
          <Route path="/add" element={<AddProp />} />
        </Route>
      </Routes>
    </Router>
  );
}
