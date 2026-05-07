import { cardStyle, chartCard, sectionTitle } from "../../styles";
import type { Kiinteisto } from "../../types";
import { computeArviointiRivit } from "../../utils/kiinteistoUtils";
import { ErrorBoundary } from "../ErrorBoundary";
import RadarChart from "../RadarChart";

interface Props {
  item: Kiinteisto;
}

export default function KuntoarviointiTab({ item }: Props) {
  const arviointiRivit = computeArviointiRivit(item);
  const arviointiYhteensa = arviointiRivit.reduce(
    (sum, r) => sum + r.painotettu,
    0,
  );

  return (
    <ErrorBoundary>
      <div
        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}
      >
        {/* Assessment scores with progress bars */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Arviointipisteet (painotettu)</h3>

          {arviointiRivit.map((r) => {
            const prosentti = Math.min((r.arvo / 5) * 100, 100);

            return (
              <div key={r.key} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    marginBottom: "4px",
                  }}
                >
                  <span>{r.label}</span>
                  <span>
                    {r.arvo}/5 × {r.paino} = {r.painotettu.toFixed(1)}
                  </span>
                </div>

                <div
                  style={{ height: "6px", background: "#e0e0e0", borderRadius: "4px" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${prosentti}%`,
                      background: "#2d5a27",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <hr style={{ margin: "12px 0" }} />
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
            <span>Yhteensä</span>
            <span>{arviointiYhteensa.toFixed(1)} pistettä</span>
          </div>
        </div>

        {/* Radar chart */}
        <div style={chartCard}>
          <h3 style={sectionTitle}>Pisteprofiili</h3>
          <RadarChart
            labels={Object.keys(item.pisteet)}
            data={Object.values(item.pisteet)}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
