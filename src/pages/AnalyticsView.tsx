import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";

import type { Kiinteisto } from "../types";
import { INITIAL_DATA } from "../mock/initialData";

import {
    laskeKayttoaste,
    laskePisteet,
    laskeYllapito,
    laskeTasearvo
} from "../utils/analyticsUtils";

import {
    cardStyle,
    tableStyle,
    thStyle,
    tdStyle,
    sectionTitle
} from "../styles";

// ✅ UUSI – Maintenance Chart -moduuli
import { renderMaintenanceChart } from "../charts/maintenanceChart";

export default function AnalyticsView() {
    const [properties, setProperties] = useState<Kiinteisto[]>([]);
    const navigate = useNavigate();

    useEffect(() => setProperties(INITIAL_DATA), []);

    // =============================
    // SORT LOGIC
    // =============================
    const [sortKey, setSortKey] = useState("nimi");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    function sortData(data: Kiinteisto[]) {
        return [...data].sort((a, b) => {
            let A: string | number;
            let B: string | number;

            switch (sortKey) {
                case "pisteet":
                    A = laskePisteet(a);
                    B = laskePisteet(b);
                    break;
                case "tasearvo":
                    A = laskeTasearvo(a);
                    B = laskeTasearvo(b);
                    break;
                case "kayttoaste":
                    A = laskeKayttoaste(a);
                    B = laskeKayttoaste(b);
                    break;
                case "yllapito":
                    A = laskeYllapito(a);
                    B = laskeYllapito(b);
                    break;
                default:
                    A = (a as any)[sortKey];
                    B = (b as any)[sortKey];
                    break;
            }

            if (typeof A === "string") {
                return sortDirection === "asc"
                    ? A.localeCompare(B as string)
                    : (B as string).localeCompare(A);
            }

            return sortDirection === "asc"
                ? Number(A) - Number(B)
                : Number(B) - Number(A);
        });
    }

    // =============================
    // CHART 1: YLLÄPITOKULUT
    // =============================
    useEffect(() => {
        if (!properties.length) return;

        new Chart(document.getElementById("chartYllapito") as HTMLCanvasElement, {
            type: "bar",
            data: {
                labels: properties.map((p) => p.nimi),
                datasets: [
                    {
                        label: "Ylläpitokulut (€ / v)",
                        data: properties.map(laskeYllapito),
                        backgroundColor: "rgba(46, 104, 166, 0.7)",
                        borderRadius: 6,
                    },
                ],
            }
        });
    }, [properties]);

    // =============================
    // CHART 2: KRITEERIPISTEET
    // =============================
    useEffect(() => {
        if (!properties.length) return;

        const KRITEERIT = ["ika", "vesikatto", "sadevesi", "julkisivu", "ikkunat", "ovet"];

        new Chart(document.getElementById("chartKriteerit") as HTMLCanvasElement, {
            type: "bar",
            data: {
                labels: KRITEERIT,
                datasets: properties.map((p, i) => ({
                    label: p.nimi,
                    data: KRITEERIT.map((k) => p.pisteet[k] ?? 0),
                    backgroundColor: `rgba(${80 + i * 30}, ${120 - i * 20}, ${160 + i * 15}, 0.7)`
                }))
            }
        });
    }, [properties]);

    // =============================
    // CHART 3: MAINTENANCE CHART
    // =============================
    useEffect(() => {
        if (properties.length > 0) {
            renderMaintenanceChart("maintenanceChart", properties);
        }
    }, [properties]);

    // =============================
    // RENDER
    // =============================
    return (
        <div style={{ padding: "20px" }}>
            <h1>Analytiikka</h1>
            <p style={{ color: "#7a756c" }}>Vertailunäkymät koko salkusta</p>

            {/* ---------------- YLLÄPITO KAAVIO ---------------- */}
            <div style={cardStyle}>
                <div style={sectionTitle}>Ylläpitokulut salkuittain (€/v)</div>
                <canvas id="chartYllapito" height={130}></canvas>
            </div>

            {/* ---------------- PISTEIDEN JAKAUMA ---------------- */}
            <div style={cardStyle}>
                <div style={sectionTitle}>Pisteiden jakauma kriteereittäin</div>
                <canvas id="chartKriteerit" height={130}></canvas>
            </div>

            {/* ---------------- MAINTENANCE CHART ---------------- */}
            <div style={cardStyle}>
                <div style={sectionTitle}>Ylläpitokulut per kiinteistö (salkkuvärit)</div>
                <canvas id="maintenanceChart" height={130}></canvas>
            </div>

            {/* ---------------- YHTEENVETOTAULUKKO ---------------- */}
            <div style={cardStyle}>
                <div style={sectionTitle}>Yhteenvetotaulukko</div>

                <table style={tableStyle as React.CSSProperties}>
                    <thead>
                        <tr>
                            {header("Kiinteistö", "nimi")}
                            {header("Salkku", "oma_salkku")}
                            {header("Pisteet", "pisteet")}
                            {header("m²", "pinta_ala")}
                            {header("Tasearvo (€)", "tasearvo")}
                            {header("Ylläpito (€ / v)", "yllapito")}
                            {header("Käyttöaste (%)", "kayttoaste")}
                            {header("Rakv.", "rakennusvuosi")}
                        </tr>
                    </thead>

                    <tbody>
                        {sortData(properties).map((p) => (
                            <tr
                                key={p.id}
                                onClick={() => navigate(`/detail/${p.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <td style={tdStyle}>{p.nimi}</td>
                                <td style={tdStyle}>{p.oma_salkku}</td>
                                <td style={tdStyle}>{laskePisteet(p)}</td>
                                <td style={tdStyle}>{p.pinta_ala}</td>
                                <td style={tdStyle}>{laskeTasearvo(p)}</td>
                                <td style={tdStyle}>{laskeYllapito(p)}</td>
                                <td style={tdStyle}>{laskeKayttoaste(p)}%</td>
                                <td style={tdStyle}>{p.rakennusvuosi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // =============================
    // DYNAMIC TABLE HEADER
    // =============================
    function header(label: string, key: string) {
        return (
            <th onClick={() => handleSort(key)} style={thStyle as React.CSSProperties}>
                {label} {sortKey === key && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
        );
    }
}