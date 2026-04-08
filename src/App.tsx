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
import { useEffect } from "react";

function HomePage() {
  const realEstates = useKiinteistot().kiinteistot;
  useEffect(() => {
  async function load() {
    const settings = await window.settings.load();
    console.log("Last opened file:", settings.lastFilePath);
  }

  load();
}, []);

const summaryBoxes = [
  { name: "KIINTEISTÖJÄ", value: "NaN" /*realEstates.length*/ },
  { name: "KOKONAISPINTA-ALA", value: "NaN" /*realEstates.reduce( (sum, k) => sum + (k.pinta_ala ?? 0), 0) +" m²"*/ },
  { name: "TASEARVO YHTEENSÄ", value: "NaN" /*realEstates.reduce((sum,k) => sum + (k.pinta_ala ?? 0),0)*/ },
  { name: "YLLÄPITÖKULUT / V", value: "NaN" },
  { name: "VUOKRATULOT / V", value: "NaN" },
];

  return (
    <>
      <span className="title">Kiinteistösalkku</span>

      <div className="boxesContainer">
        {summaryBoxes.map((box, i) => (
          <div key={i} className="box">
            <span className="name">{box.name}</span>
            <span className="value">{box.value}</span>
          </div>
        ))}
      </div>

      <div className="secondRowContainer">
        <div className="realEstatesContainer">
          <span className="realEstateTitle2">KAIKKI KIINTEISTÖT</span>

          <div className="realEstateRowTitles">
            <span className="realEstateTitle2">NIMI</span>
            <span className="realEstateTitle">SALKKU</span>
            <span className="realEstateTitle">PISTEET</span>
            <span className="realEstateTitle">PINTA-ALA</span>
            <span className="realEstateTitle">TASEARVO</span>
          </div>

          {realEstates.map((estate, i) => (
            <NavLink
              key={i}
              to={"detail/" + estate.id.toString()}
              className={`realEstateRow ${
                estate.oma_salkku === "A"
                  ? "portfolioA"
                  : estate.oma_salkku === "B"
                  ? "portfolioB"
                  : estate.oma_salkku === "C"
                  ? "portfolioC"
                  : estate.oma_salkku === "D"
                  ? "portfolioD"
                  : "portfolioDefault"
              }`}
            >
              <span className="estateName">{estate.nimi}</span>
              <span className="portfolio">{estate.oma_salkku}</span>
              <span className="estateNumber">{/*estate.tasearvo["2023"]*/}</span>
              <span className="estateNumber">{estate.pinta_ala} m²</span>
              <span className="estateNumber">{/*estate.tasearvo["2023"]*/}</span>
            </NavLink>
          ))}
        </div>

        <div className="chartTower">
          <div className="chartContainer">
            <DonutChart />
          </div>
          <div className="chartContainer">
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