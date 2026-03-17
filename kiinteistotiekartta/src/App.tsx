import { useState } from 'react'
import Toolbar from './components/Toolbar'
import './App.css'

    const summaryBoxes = [
      {name: "KIINTEISTÖJÄ", value: "NaN"},
      {name: "KOKONAISPINTA-ALA", value: "NaN"},
      {name: "TASEARVO YHTEENSÄ", value: "NaN"},
      {name: "YLLÄPITÖKULUT/V", value: "NaN"},
      {name: "VUOKRATULOT/V", value: "NaN"},
    ];
function App() {

  return (
    <>
    <Toolbar/>

    <div className="content">
      <div>
        <h1>Kiinteistösalkku</h1>
      </div>
      
      <div className="boxes-container">
        {summaryBoxes.map((box,i) => (
          <div key={i} className="box">
            <span className='name'>{box.name}</span>
            <span className='value'>{box.value}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default App
