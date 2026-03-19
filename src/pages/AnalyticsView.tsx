import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import type{ Kiinteisto } from "../types";
import { INITIAL_DATA } from "../mock/initialData";

import {
    laskePisteet,
    laskeYllapito,
    laskeKayttoaste,
    laskeTasearvo,
} from "../utils/analyticsUtils";

export default function AnalyticsView() {
    const [properties] = useState<Kiinteisto[]>(INITIAL_DATA);
    const [chartError, setChartError] = useState<string | null>(null);

    const yllapitoCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const kriteeritCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const yllapitoChartRef = useRef<Chart | null>(null);
    const kriteeritChartRef = useRef<Chart | null>(null);

    // Tuhoaa Chart.js-instanssit, kun komponentti unmountataan
    useEffect(() => {
        return () => {
            yllapitoChartRef.current?.destroy();
            yllapitoChartRef.current = null;

            kriteeritChartRef.current?.destroy();
            kriteeritChartRef.current = null;
        };
    }, []);

    // ---------- YLLÄPITOKULUT KAAVIO ----------
    useEffect(() => {
        if (!properties.length) return;
        if (chartError) return;

        const canvas = yllapitoCanvasRef.current;
        if (!canvas) return;

        try {
            const chartData = {
                labels: properties.map((p) => p.nimi),
                datasets: [
                    {
                        label: "Ylläpitokulut (€ / v)",
                        data: properties.map((p) => laskeYllapito(p)),
                        backgroundColor: "rgba(46, 104, 166, 0.7)",
                        borderRadius: 6,
                    },
                ],
            };

const existingChart = yllapitoChartRef.current;
        const shouldRecreate = existingChart && !existingChart.canvas?.ownerDocument;

        if (shouldRecreate) {
            existingChart.destroy();
            yllapitoChartRef.current = null;
        }

        if (yllapitoChartRef.current) {
                yllapitoChartRef.current.data = chartData;
                yllapitoChartRef.current.update();
                return;
            }

            yllapitoChartRef.current = new Chart(canvas, {
                type: "bar",
                data: chartData,
                options: {
                    scales: {
                        y: { beginAtZero: true },
                    },
                },
            });
        } catch (error) {
            // Säilytä virhe näytetään UI:ssa ja jatketaan ilman kaavioita
            console.error("Chart rendering error (yllapito):", error);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setChartError(String(error));
        }
    }, [properties, chartError]);

    // ---------- PISTEIDEN JAKAUMA KAAVIO ----------
    useEffect(() => {
        if (!properties.length) return;
        if (chartError) return;

        const canvas = kriteeritCanvasRef.current;
        if (!canvas) return;

        try {
            // Valitaan 6 kriteeriä esimerkkinä
            const KRITEERIT = ["ika", "vesikatto", "sadevesi", "julkisivu", "ikkunat", "ovet"];

            const chartData = {
                labels: KRITEERIT,
                datasets: properties.map((p, idx) => ({
                    label: p.nimi,
                    data: KRITEERIT.map((k) => p.pisteet[k] ?? 0),
                    backgroundColor: `rgba(${80 + idx * 30}, ${120 - idx * 25}, ${160 + idx * 10}, 0.7)`,
                })),
            };

const existingChart = kriteeritChartRef.current;
        const shouldRecreate = existingChart && !existingChart.canvas?.ownerDocument;

        if (shouldRecreate) {
            existingChart.destroy();
            kriteeritChartRef.current = null;
        }

        if (kriteeritChartRef.current) {
                kriteeritChartRef.current.data = chartData;
                kriteeritChartRef.current.update();
                return;
            }

            kriteeritChartRef.current = new Chart(canvas, {
                type: "bar",
                data: chartData,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            min: 0,
                            max: 5,
                            ticks: { stepSize: 1 },
                        },
                    },
                },
            });
        } catch (error) {
            console.error("Chart rendering error (kriteerit):", error);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setChartError(String(error));
        }
    }, [properties, chartError]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Analytiikka</h1>
            <p>Vertailunäkymät koko salkusta</p>

            {/* ---------- YLLÄPITOKULUT ---------- */}
            <section>
                <h3>Ylläpitokulut salkuittain (€/v)</h3>
                <canvas ref={yllapitoCanvasRef} style={{ maxHeight: "300px" }} />
            </section>

            {/* ---------- PISTEIDEN JAKAUMA ---------- */}
            <section style={{ marginTop: "40px" }}>
                <h3>Pisteiden jakauma kriteereittäin</h3>
                <canvas ref={kriteeritCanvasRef} style={{ maxHeight: "300px" }} />
            </section>

            {chartError ? (
                <section style={{ marginTop: "24px", padding: "12px", background: "#fee", border: "1px solid #f99", borderRadius: "8px" }}>
                    <strong>Kaavioiden piirto epäonnistui:</strong>
                    <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#333" }}>{chartError}</div>
                    <div style={{ marginTop: "8px" }}>
                        Tarkista selaimen konsoli tarkempia virheilmoituksia varten.
                    </div>
                </section>
            ) : null}

            {/* ---------- TAULUKKO ---------- */}
            <section style={{ marginTop: "40px" }}>
                <h3>Yhteenvetotaulukko</h3>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Kiinteistö</th>
                            <th>Salkku</th>
                            <th>Pisteet</th>
                            <th>m²</th>
                            <th>Tasearvo (€)</th>
                            <th>Ylläpito (€ / v)</th>
                            <th>Käyttöaste (%)</th>
                            <th>Rakv.</th>
                        </tr>
                    </thead>

                    <tbody>
                        {properties.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nimi}</td>
                                <td>{p.oma_salkku ?? "-"}</td>
                                <td>{laskePisteet(p)}</td>
                                <td>{p.pinta_ala}</td>
                                <td>{laskeTasearvo(p)}</td>
                                <td>{laskeYllapito(p)}</td>
                                <td>{laskeKayttoaste(p)}%</td>
                                <td>{p.rakennusvuosi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}