import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import AnalyticsView from "./pages/AnalyticsView.tsx";
import DetailView from "./pages/detailView";
import "./App.css";
import "./utils/chartSetup";
import PointsBarChart from "./components/charts/Barchart";
import Layout from "./components/Layout";
import AddProp from "./pages/AddProp";
import DonutChart from "./components/charts/DonutChart";
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
} from "./SummaryView.styles";


function HomePage() {
  const realEstates = useKiinteistot().kiinteistot;
  function getNewestYear(obj: Record<string, any>): number | null {
    const years = Object.keys(obj).map(Number);
    if (years.length === 0) return null;
    return Math.max(...years);
  };

  useEffect(() => {
  async function load() {
    const settings = await window.settings.load();
    console.log("Last opened file:", settings.lastFilePath);
  }

  load();
}, []);
const [hoverId, setHoverId] = useState<string | null>(null);

function getPisteetSum(pisteet: Record<string, number>): number {
  return Object.values(pisteet).reduce((sum, v) => sum + v, 0);
}
function getNewestTasearvo(
  vuokrakulut: Record<string, any>
): number {
  const years = Object.keys(vuokrakulut).map(Number);
  if (years.length === 0) return 0;

  const newestYear = Math.max(...years);
  return vuokrakulut[newestYear]?.tasearvo ?? 0;
}
function getNewestYllapitoKulut(k: any): Record<string, number> | null {
  const year = getNewestYear(k.yllapitokulut);
  if (!year) return null;
  return k.yllapitokulut[year];
}
function getNewestVuokrakulut(k: any): Record<string, number> | null {
  const year = getNewestYear(k.vuokrakulut);
  if (!year) return null;
  return k.vuokrakulut[year];
}
function sumYllapitoKulutExceptTasearvo(obj: Record<string, number>): number {
  return Object.entries(obj)
    .filter(([key]) => key !== "Tasearvo")
    .reduce((sum, [, value]) => sum + value, 0);
}
const summaryBoxes = [
  {
    name: "KIINTEISTÖJÄ",
    value: realEstates.length
  },

  {
    name: "KOKONAISPINTA-ALA",
    value:
      realEstates.reduce((sum, k) => sum + (k.pinta_ala ?? 0), 0) + " m²"
  },

  {
    name: "TASEARVO YHTEENSÄ",
    value: realEstates.reduce((sum, k) => {
      const newest = getNewestVuokrakulut(k);
      return sum + (newest?.tasearvo ?? 0);
    }, 0) + "€"
  },

  {
    name: "YLLÄPITÖKULUT / V",
    value: realEstates.reduce((sum, k) => {
      const newest = getNewestYllapitoKulut(k);
      return sum + (newest ? sumYllapitoKulutExceptTasearvo(newest) : 0);
    }, 0) + "€"
  },

  {
    name: "VUOKRATULOT / V",
    value: realEstates.reduce((sum, k) => {
      const newest = getNewestVuokrakulut(k);
      if (!newest) return sum;

      // Example calculation: neliövuokra * pinta_ala
      return sum + (newest.neliövuokra ?? 0) * (k.pinta_ala ?? 0);
    }, 0) + "€"
  }
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
              ...(hoverId === String(estate.id) ? portfolioItemHover() : {})
            }}
            onMouseEnter={() => setHoverId(String(estate.id))}
            onMouseLeave={() => setHoverId(null)}
          >
            <span style={estateName}>{estate.nimi}</span>
            <span style={portfolioCell}>{estate.oma_salkku}</span>
            <span style={estateNumber}>{getPisteetSum(estate.pisteet)}</span>
            <span style={estateNumber}>{estate.pinta_ala} m²</span>
            <span style={estateNumber}>{getNewestTasearvo(estate.vuokrakulut)}</span>
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