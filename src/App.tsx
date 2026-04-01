import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import AnalyticsView from "./pages/AnalyticsView.tsx";
import DetailView from "./pages/detailView";
import './App.css'
import './utils/chartSetup'
import PointsBarChart from './components/charts/Barchart';
import Layout from "./components/Layout";
import DonutChart from "./components/charts/DonutChart";
import { useEffect } from "react";
const summaryBoxes = [
  {name: "KIINTEISTÖJÄ", value: "NaN"},
  {name: "KOKONAISPINTA-ALA", value: "NaN"},
  {name: "TASEARVO YHTEENSÄ", value: "NaN"},
  {name: "YLLÄPITÖKULUT / V", value: "NaN"},
  {name: "VUOKRATULOT / V", value: "NaN"},
];
const realEstates =[
  {estateName: "esim tooooooooooooooooooooooooooooooooooooooooooodellla pitkä nimi", portfolio: "A", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/1"},
  {estateName: "esim 2", portfolio: "B", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/2"},
  {estateName: "esim 3", portfolio: "C", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/3"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€", path: "detail/4"},
];
function HomePage() {
  useEffect(() => {
  async function load() {
    const settings = await window.settings.load();
    console.log("Last opened file:", settings.lastFilePath);
  }

  load();
}, []);
  return (
    <>
      <span className='title'>Kiinteistösalkku</span>
      <div className="boxesContainer">
        {summaryBoxes.map((box,i) => (
          <div key={i} className="box">
            <span className='name'>{box.name}</span>
            <span className='value'>{box.value}</span>
          </div>
        ))}
      </div>
      <div className='secondRowContainer'>
      <div className="realEstatesContainer">
        <span className="realEstateTitle2">KAIKKI KIINTEISTÖT</span>
        <div className='realEstateRowTitles'>
          <span className='realEstateTitle2'>NIMI</span>
          <span className='realEstateTitle'>SALKKU</span>
          <span className='realEstateTitle'>PISTEET</span>
          <span className='realEstateTitle'>PINTA-ALA</span>
          <span className='realEstateTitle'>TASEARVO</span>
        </div>
        {realEstates.map((estate,i) =>(
          <NavLink key={i} to={estate.path} 
          className={`realEstateRow ${
            estate.portfolio === "A" ? "portfolioA" :
            estate.portfolio === "B" ? "portfolioB" :
            estate.portfolio === "C" ? "portfolioC" :
            estate.portfolio === "D" ? "portfolioD" : "portfolioDefault"
          }`}>
            <span className='estateName'>{estate.estateName}</span>
            <span className='portfolio'>{estate.portfolio}</span>
            <span className='estateNumber'>{estate.points}</span>
            <span className='estateNumber'>{estate.area}</span>
            <span className='estateNumber'>{estate.balanceValue}</span>
          </NavLink>
        ))}
      </div>
      <div className="chartTower">
        <div className='chartContainer'>
        <DonutChart/>
        </div>
        <div className='chartContainer'>
        <PointsBarChart/>
        </div>
      </div>
      </div>
    
    </>
  )
}

export default function App() {
  return (
    <Router>
      {/* SIVUALUE */}
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/detail/:id" element={<DetailView />} />
        </Route>
      </Routes>

    </Router>
  );
}