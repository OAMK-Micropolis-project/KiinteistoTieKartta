import { useState } from 'react'
import Toolbar from './components/Toolbar'
import './App.css'

const summaryBoxes = [
  {name: "KIINTEISTÖJÄ", value: "NaN"},
  {name: "KOKONAISPINTA-ALA", value: "NaN"},
  {name: "TASEARVO YHTEENSÄ", value: "NaN"},
  {name: "YLLÄPITÖKULUT / V", value: "NaN"},
  {name: "VUOKRATULOT / V", value: "NaN"},
];
const realEstates =[
  {estateName: "esim 1", portfolio: "A", points: 200, area: "1000 m^2", balanceValue: "1,9M€"},
  {estateName: "esim 2", portfolio: "B", points: 200, area: "1000 m^2", balanceValue: "1,9M€"},
  {estateName: "esim 3", portfolio: "C", points: 200, area: "1000 m^2", balanceValue: "1,9M€"},
  {estateName: "esim 4", portfolio: "D", points: 200, area: "1000 m^2", balanceValue: "1,9M€"},
];
function App() {

  return (
    <>
    <Toolbar/>

    <div className="content">
      <div>
        <span className='title'>Kiinteistösalkku</span>
      </div>
      
      <div className="boxesContainer">
        {summaryBoxes.map((box,i) => (
          <div key={i} className="box">
            <span className='name'>{box.name}</span>
            <span className='value'>{box.value}</span>
          </div>
        ))}
      </div>
      
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
          <div key={i} 
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
          </div>
        ))}
      </div>

    </div>
    </>
  )
}

export default App
