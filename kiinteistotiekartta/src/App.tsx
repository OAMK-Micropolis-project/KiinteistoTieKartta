import { useState } from 'react'
import Toolbar from './components/Toolbar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <h1>Kiinteistösalkku</h1>
    </div>
    <Toolbar/>
    <div className="boxes-container">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="box">
          Box {n}
        </div>
      ))}
    </div>
    </>
  )
}

export default App
