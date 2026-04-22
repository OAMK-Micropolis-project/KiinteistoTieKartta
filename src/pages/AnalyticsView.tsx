import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import type { Kiinteisto } from "../types";

import {
    badgeStyle,
    cardStyle,
    chartCanvas,
    chartCard,
    flexChartContainer,
    flexContainer,
    mainHeader,
    sectionTitle,
    tableStyle,
    tdStyle,
    thStyle,
} from "../styles";

import { renderKriteeritChart } from "../charts/chartKriteerit";
import { renderYllapitoChart } from "../charts/chartYllapito";
import { renderCriteriaComparisonChart } from "../charts/criteriaComparisonChart";
import { renderMaintenanceChart } from "../charts/maintenanceChart";

export default function AnalyticsView() {
    const {
        kiinteistot,
        getLatestYear,
        calYllapito,
        calKayttoaste,
        calPainotutPisteet,
    } = useKiinteistot();

    const year = getLatestYear();
    const navigate = useNavigate();

    const [selectedCriteria, setSelectedCriteria] = useState<string>("ika");
    const [sortKey, setSortKey] = useState<string>("nimi");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // ── Sorting ───────────────────────────────────────────────────────────────

    function sortData(data: Kiinteisto[]) {
        return [...data].sort((a, b) => {
            let A: string | number;
            let B: string | number;

            switch (sortKey) {
                case "pisteet":
                    A = calPainotutPisteet(a);
                    B = calPainotutPisteet(b);
                    break;
                case "tasearvo":
                    A = a.vuokrakulut[year]?.tasearvo ?? 0;
                    B = b.vuokrakulut[year]?.tasearvo ?? 0;
                    break;
                case "kayttoaste":
                    A = calKayttoaste(a, year);
                    B = calKayttoaste(b, year);
                    break;
                case "yllapito":
                    A = calYllapito(a, year);
                    B = calYllapito(b, year);
                    break;
                default:
                    A = (a as any)[sortKey];
                    B = (b as any)[sortKey];
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

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    const header = (label: string, key: string) => (
        <th style={thStyle} onClick={() => handleSort(key)}>
            {label}
        </th>
    );

    // ── Charts ────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (kiinteistot.length === 0) return;
        try {
            renderYllapitoChart("chartYllapito", kiinteistot);
            renderKriteeritChart("chartKriteerit", kiinteistot);
            renderMaintenanceChart("maintenanceChart", kiinteistot);
        } catch (err) {
            console.error("Chart rendering error:", err);
        }
    }, [kiinteistot]);

    useEffect(() => {
        if (kiinteistot.length === 0) return;
        try {
            renderCriteriaComparisonChart("criteriaChart", kiinteistot, selectedCriteria);
        } catch (err) {
            console.error("Criteria chart error:", err);
        }
    }, [kiinteistot, selectedCriteria]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={flexContainer}>
            <div>
                <h1 style={mainHeader}>Analytiikka</h1>
                <p style={sectionTitle}>Vertailunäkymät koko salkusta</p>
            </div>

            {/* Charts */}
            <div style={flexChartContainer}>
                <div style={chartCard}>
                    <div style={sectionTitle}>Ylläpitokulut salkuittain (€/v)</div>
                    <canvas id="chartYllapito" style={chartCanvas} />
                </div>

                <div style={chartCard}>
                    <div style={sectionTitle}>Pisteiden jakauma kriteereittäin</div>
                    <canvas id="chartKriteerit" style={chartCanvas} />
                </div>

                <div style={chartCard}>
                    <div style={sectionTitle}>Ylläpitokulut per kiinteistö (salkkuvärit)</div>
                    <canvas id="maintenanceChart" style={chartCanvas} />
                </div>

                <div style={chartCard}>
                    <div style={sectionTitle}>Kriteerivertailu</div>
                    <select
                        value={selectedCriteria}
                        onChange={(e) => setSelectedCriteria(e.target.value)}
                        style={{
                            width: "fit-content",
                            padding: "6px 10px",
                            marginBottom: "12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {Object.keys(kiinteistot[0]?.pisteet ?? {}).map((key) => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                    <canvas id="criteriaChart" style={chartCanvas} />
                </div>
            </div>

            {/* Summary table */}
            <div style={cardStyle}>
                <div style={sectionTitle}>Yhteenvetotaulukko</div>
                <table style={tableStyle}>
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
                        {sortData(kiinteistot).map((k) => (
                            <tr
                                key={k.id}
                                onClick={() => navigate(`/detail/${k.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <td style={tdStyle}>{k.nimi}</td>
                                <td style={{ ...tdStyle, ...badgeStyle(k.oma_salkku) }}>
                                    {k.oma_salkku}
                                </td>
                                <td style={tdStyle}>{k.painotetutPisteet.toFixed(1)}</td>
                                <td style={tdStyle}>{k.pinta_ala}</td>
                                <td style={tdStyle}>{k.vuokrakulut[year]?.tasearvo ?? 0}</td>
                                <td style={tdStyle}>{calYllapito(k, year)}</td>
                                <td style={tdStyle}>{calKayttoaste(k, year).toFixed(1)} %</td>
                                <td style={tdStyle}>{k.rakennusvuosi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
