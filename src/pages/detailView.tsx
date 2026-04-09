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
    gridContainer
} from "../styles";

export default function DetailView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const radarChartRef = useRef<Chart | null>(null);

    const item = useKiinteistot().getById(Number(id));
    const year = Math.max(
        ...Object.keys(item?.yllapitokulut || {}).map(Number),
        ...Object.keys(item?.vuokrakulut || {}).map(Number),
    );

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
                            ["Tasearvo (€)", laskeTasearvo(item, year)],
                            ["Ylläpitokustannukset (€ / v)", laskeYllapito(item, year)],
                            ["Käyttöaste (%)", laskeKayttoaste(item, year) + "%"],
                            ["Pisteet yhteensä", laskePisteet(item)],
                        ]}
                    />

                    {/* Ylläpitokustannukset */}
                    <DetailCard
                        title="Ylläpitokustannusten erittely"
                        rows={Object.entries(item.yllapitokulut[year] ?? {}).map(([key, val]) => [
                            key,
                            (val ?? 0) // OIKEIN — EI enää vuotta
                        ])}
                    />

                    {/* Vuokraustiedot */}
                    <DetailCard
                        title="Vuokraustiedot"
                        rows={[
                            ["Vuokrattu m²", (item.vuokrakulut[year]?.vuokrausaste_m2 ?? 0)],
                            ["Neliövuokra (€ / m²)", (item.vuokrakulut[year]?.neliövuokra ?? 0)],
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
function DetailCard({ title, rows }: { title: string; rows: [string, string | number][] }) {
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