import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnalyticsView from "./pages/analyticsView";
import "./style.css";

function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Etusivu</h1>
      <p>Tämä on sovelluksen etusivu.</p>

      <Link to="/analytics">
        <button>Siirry Analytiikkaan</button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>

      {/* NAVIGAATIO */}
      <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "20px" }}>Etusivu</Link>
        <Link to="/analytics">Analytiikka</Link>
      </nav>

      {/* SIVUALUE */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<AnalyticsView />} />
      </Routes>

    </Router>
  );
}