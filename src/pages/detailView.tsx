import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { useKiinteistot } from "../context/useKiinteistot";

import {
    laskeKayttoaste,
    laskePisteet,
    laskeYllapito,
    laskeTasearvo
} from "../utils/analyticsUtils";

import {
    cardStyle,
    tableStyle,
    tdStyle,
    sectionTitle,
    badgeStyle,
    backButton,
    chartsGrid,
    chartCard,
    gridContainer,
    // thStyle
} from "../styles";

export default function DetailView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const radarChartRef = useRef<Chart | null>(null);

    const item = useKiinteistot().getById(Number(id));

    // ---------- RADAR-CHART ----------
    useEffect(() => {
        if (!item) return;
        if (radarChartRef.current) {
            radarChartRef.current.destroy();
        }
        const ctx = document.getElementById("radarChart") as HTMLCanvasElement;
        if (!ctx) return;

        radarChartRef.current = new Chart(ctx, {
            type: "radar",
            data: {
                labels: Object.keys(item.pisteet),
                datasets: [
                    {
                        label: item.nimi,
                        data: Object.values(item.pisteet),
                        backgroundColor: "rgba(46, 104, 166, 0.25)",
                        borderColor: "rgba(46, 104, 166, 0.9)",
                        borderWidth: 2
                    }
                ]
            },
            options: {
                scales: {
                    r: { min: 0, max: 5, ticks: { stepSize: 1 } }
                }
            }
        });
        return () => {
            radarChartRef.current?.destroy();
        };
    }, [item]);

    if (!item)
        return (
            <div style={{ padding: "20px" }}>
                <h2>Kiinteistöä ei löydy</h2>
            </div>
        );

    return (
        <>
            {/* Takaisin */}
            <button style={backButton} onClick={() => navigate(-1)}>
                ← Takaisin
            </button>

            {/* Otsikko */}
            <h1>{item.nimi}</h1>
            <p style={{ color: "#7a756c" }}>{item.osoite}</p>

            {/* Salkku-badge */}
            <span style={badgeStyle(item.oma_salkku as "A" | "B" | "C" | "D")}>Salkku {item.oma_salkku}</span>

            <div style={gridContainer}>
                <div style={chartsGrid}>
                    {/* Perustiedot */}
                    <DetailCard
                        title="Perustiedot"
                        rows={[
                            ["Kiinteistön nimi", item.nimi],
                            ["Osoite", item.osoite],
                            ["Pinta-ala (m²)", item.pinta_ala],
                            ["Rakennusvuosi", item.rakennusvuosi],
                            ["Käyttötarkoitus", item.kayttotarkoitus],
                        ]}
                    />

                    {/* Laskennalliset tiedot */}
                    <DetailCard
                        title="Laskennalliset tiedot"
                        rows={[
                            ["Tasearvo (€)", laskeTasearvo(item)],
                            ["Ylläpitokustannukset (€ / v)", laskeYllapito(item)],
                            ["Käyttöaste (%)", laskeKayttoaste(item) + "%"],
                            ["Pisteet yhteensä", laskePisteet(item)],
                        ]}
                    />

                    {/* Ylläpitokustannukset */}
                    <KustannuksetCard
                        title="Ylläpitokustannusten erittely"
                        item={item}
                        />

                    {/* Vuokraustiedot */}
                    <DetailCard
                        title="Vuokraustiedot"
                        rows={[
                            ["Vuokrattu m²", item.talous[0].YllapitoKulut.Vuokrausaste_m2],
                            ["Neliövuokra (€ / m²)", item.talous[0].YllapitoKulut.Neliövuokra],
                        ]}
                    />
                </div>

                {/* Pisteprofiili */}
                <div style={{ ...cardStyle, marginTop: "20px" }}>
                    <div style={sectionTitle}>Pisteprofiili</div>
                    <canvas id="radarChart" />
                </div>
            </div>
        </>
    );
}

/* Yleinen detail-korttikomponentti */
function DetailCard({ title, rows }: { title: string; rows: [string, number | string][] }) {
    return (
        <div style={chartCard}>
            <div style={sectionTitle}>{title}</div>
            <table style={tableStyle}>
                <tbody>
                    {rows.map(([label, value], idx) => (
                        <tr key={idx}>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{label}</td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
/* Yleinen KustannuksetCard-korttikomponentti */
function KustannuksetCard({ title, item }: { title: string; item: Kiinteisto }) {
    const [yearOffset, setYearOffset] = useState(0);

    // Collect all unique years and cost keys
    const allYears = [...new Set(item.talous.map(t => t.Vuosi))].sort((a, b) => a - b); // Ascending (oldest first)
    const costKeys = [...new Set(item.talous.flatMap(t => Object.keys(t.YllapitoKulut)))].sort();

    // Get the 3 years to display
    const displayYears = allYears.slice(yearOffset, yearOffset + 3);
    const canGoBack = yearOffset > 0;
    const canGoForward = yearOffset + 3 < allYears.length;

    return (
        <div style={chartCard}>
            <div style={sectionTitle}>{title}</div>
            {item.talous.length === 0 ? (
                <p>Ei kustannustietoja saatavilla.</p>
            ) : (
                <>
                    {/* Navigation buttons */}
                    <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                        <button
                            onClick={() => setYearOffset(Math.max(0, yearOffset - 1))}
                            disabled={!canGoBack}
                            style={{
                                padding: "6px 12px",
                                cursor: canGoBack ? "pointer" : "not-allowed",
                                opacity: canGoBack ? 1 : 0.5,
                            }}
                        >
                            ← Vanhemmat
                        </button>
                        <span style={{ alignSelf: "center", fontSize: "12px", color: "#666" }}>
                            {displayYears[0]} - {displayYears[displayYears.length - 1]}
                        </span>
                        <button
                            onClick={() => setYearOffset(yearOffset + 1)}
                            disabled={!canGoForward}
                            style={{
                                padding: "6px 12px",
                                cursor: canGoForward ? "pointer" : "not-allowed",
                                opacity: canGoForward ? 1 : 0.5,
                            }}
                        >
                            Uudemmat →
                        </button>
                    </div>

                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th></th>
                                {displayYears.map(year => (
                                    <th key={year} style={tdStyle}>{year}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {costKeys.map(costKey => (
                                <tr key={costKey}>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{costKey}</td>
                                    {displayYears.map(year => {
                                        const talousRecord = item.talous.find(t => t.Vuosi === year);
                                        const value = talousRecord?.YllapitoKulut[costKey as keyof typeof talousRecord.YllapitoKulut] ?? 0;
                                        return (
                                            <td key={year} style={{ ...tdStyle, textAlign: "center" }}>
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}