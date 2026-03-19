export default function AnalyticsView() {
  return (
    <div style={{ padding: "20px" }}>

      <div className="page-title">Analytiikka</div>
      <div className="page-sub">Vertailunäkymät koko salkusta</div>
      

      {/** ========== YLLÄPITOKULUT SALKUITTAIN ========== */}
      <div className="chart-grid">
        <div className="card">
          <h3 className="card-title">Ylläpitokulut salkuittain (€/v)</h3>
          <div className="chart-placeholder">Kaavio</div>
        </div>

        {/** ========== PISTEIDEN JAKAUMA KRITEEREITTÄIN ========== */}
        <div className="card">
          <div className="card-title">Pisteiden jakauma kriteereittäin</div>
          <div className="chart-placeholder">Kaavio</div>
        </div>
      </div>

      {/** ========== YHTEENVETOTAULUKKO ========== */}
      <div className="card">
        <div className="card-title">Yhteenvetotaulukko</div>

        <table className="data-table" id="analyticsTable">
          <thead>
            <tr>
              <th>Kiinteistö</th>
              <th>Salkku</th>
              <th>Pisteet</th>
              <th>m²</th>
              <th>Tasearvo (€)</th>
              <th>Ylläpito (€ / V)</th>
              <th>Käyttöaste (%)</th>
              <th>RAKV.</th>
            </tr>
          </thead>
          <tbody>
            {/* Data täytetään myöhemmin */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
