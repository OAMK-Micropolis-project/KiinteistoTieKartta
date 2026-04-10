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
  useEffect(() => {
  async function load() {
    const settings = await window.settings.load();
    console.log("Last opened file:", settings.lastFilePath);
  }

  load();
}, []);
const [hoverId, setHoverId] = useState<string | null>(null);

type TalousEntry = {
  Vuosi: number;
  YllapitoKulut: Record<string, number>;
};

function getYllapitoKulutNewest(
  talous: TalousEntry[]
): Record<string, number> | null {
  if (talous.length === 0) return null;

  const newest = talous.reduce((latest, current) =>
    current.Vuosi > latest.Vuosi ? current : latest
  );

  return newest.YllapitoKulut;
}
function sumYllapitoKulutExceptTasearvo(
  yllapitokulut: Record<string, number>
): number {
  return Object.entries(yllapitokulut)
    .filter(([key]) => key !== "Tasearvo")
    .reduce((sum, [, value]) => sum + value, 0);
}
const summaryBoxes = [
  { name: "KIINTEISTÖJÄ", value: realEstates.length },
  { name: "KOKONAISPINTA-ALA", value: realEstates.reduce( (sum, k) => sum + (k.pinta_ala ?? 0), 0) +" m²" },
  { name: "TASEARVO YHTEENSÄ", value: "NaN" /*realEstates.reduce((sum,k) => sum + ((getYllapitoKulutNewest(k)).Tasearvo) ?? 0),0) */},
  { name: "YLLÄPITÖKULUT / V", value: "NaN" /*realEstates.reduce((sum,k) => sum + ((sumYllapitoKulutExceptTasearvo(getYllapitoKulutNewest(k))) ?? 0),0) */},
  { name: "VUOKRATULOT / V", value: "NaN" },
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
            <span style={estateNumber}></span>
            <span style={estateNumber}>{estate.pinta_ala} m²</span>
            <span style={estateNumber}></span>
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