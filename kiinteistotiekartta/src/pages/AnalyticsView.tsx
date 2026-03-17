export default function AnalyticsView() {
  return (
    <div style={{ padding: "20px" }}>

      <h1 className="page-title">Analytiikka</h1>
      <p className="page-sub">Vertailunäkymät koko kiinteistökannasta</p>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Kiinteistöjä</div>
          <div className="kpi-value">—</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Kokonaispinta-ala</div>
          <div className="kpi-value">—</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Tasearvo yhteensä</div>
          <div className="kpi-value">—</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3 className="card-title">Ylläpitokulut salkuittain (€/v)</h3>
          <div className="chart-placeholder">Kaavio</div>
        </div>

        <div className="card">
          <h3 className="card-title">Pisteiden jakauma kriteereittäin</h3>
          <div className="chart-placeholder">Kaavio</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Yhteenvetotaulukko</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Salkku</th>
              <th>Pisteet</th>
              <th>Pinta-ala</th>
              <th>Tasearvo</th>
              <th>Ylläpito (€)</th>
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
