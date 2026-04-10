import { useEffect, useRef, useState } from "react";
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
import type { Kiinteisto } from "../types";

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
                    <KustannuksetCard
                        title="Ylläpitokustannusten erittely"
                        item={item}
                        />

                    {/* Vuokraustiedot */}
                    <DetailCard
                        title="Vuokraustiedot"
                        rows={[
                            ["Vuokrattu m²", item.vuokrakulut[2023]?.vuokrausaste_m2 ?? 0],
                            ["Neliövuokra (€ / m²)", item.vuokrakulut[2023]?.neliövuokra],
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

    // Convert object to array of years from yllapitokulut
    const allYears = [...new Set(Object.keys(item.yllapitokulut ?? {}).map(Number))].sort((a: number, b: number) => a - b);

    // Extract cost keys from yllapitokulut
    const costKeys = allYears.length > 0 
      ? [...new Set(Object.values(item.yllapitokulut ?? {}).flatMap((costs) => Object.keys(costs as unknown as Record<string, number>)))].sort()
      : [];

    // Get the 3 years to display
    const displayYears = allYears.slice(yearOffset, yearOffset + 3);
    const canGoBack = yearOffset > 0;
    const canGoForward = yearOffset + 3 < allYears.length;

    return (
        <div style={chartCard}>
            <div style={sectionTitle}>{title}</div>
            {allYears.length === 0 ? (
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
                            {displayYears[0] ?? ""} - {displayYears[displayYears.length - 1] ?? ""}
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
                                {displayYears.map((year) => (
                                    <th key={year} style={tdStyle}>{year}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {costKeys.map((costKey) => (
                                <tr key={costKey}>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{costKey}</td>
                                    {displayYears.map((year) => {
                                        const costs = item.yllapitokulut?.[year] as unknown as Record<string, number> | undefined;
                                        const value = costs?.[costKey] ?? 0;
                                        return (
                                            <td key={year} style={{ ...tdStyle, textAlign: "center" }}>
                                                {String(value)}
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