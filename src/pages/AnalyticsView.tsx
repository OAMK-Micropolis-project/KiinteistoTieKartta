import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import type { Kiinteisto } from "../types";
import { theme } from "../theme";

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

type Salkku = "A" | "B" | "C" | "D";

export default function AnalyticsView() {
    const {
        kiinteistot,
        filteredKiinteistot,
        activeSalkut,
        toggleSalkku,
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
            return sortDirection === "asc" ? Number(A) - Number(B) : Number(B) - Number(A);
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
            {sortKey === key && (
                <span style={{ marginLeft: 4, fontSize: "0.75rem" }}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                </span>
            )}
        </th>
    );

    // ── Charts — re-render when filtered data or criteria changes ─────────────

    useEffect(() => {
        if (filteredKiinteistot.length === 0) return;
        try {
            renderYllapitoChart("chartYllapito", filteredKiinteistot);
            renderKriteeritChart("chartKriteerit", filteredKiinteistot);
            renderMaintenanceChart("maintenanceChart", filteredKiinteistot);
        } catch (err) {
            console.error("Chart rendering error:", err);
        }
    }, [filteredKiinteistot]);

    useEffect(() => {
        if (filteredKiinteistot.length === 0) return;
        try {
            renderCriteriaComparisonChart("criteriaChart", filteredKiinteistot, selectedCriteria);
        } catch (err) {
            console.error("Criteria chart error:", err);
        }
    }, [filteredKiinteistot, selectedCriteria]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div style={flexContainer}>
            <div>
                <h1 style={mainHeader}>Analytiikka</h1>
                <p style={sectionTitle}>Vertailunäkymät koko salkusta</p>
            </div>

            {/* Portfolio filter — same buttons, same context, same state as Toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.9rem", color: theme.colors.textMuted, marginRight: 4 }}>
                    Salkku:
                </span>

                {(["A", "B", "C", "D"] as Salkku[]).map((s) => {
                    const active = activeSalkut.has(s);
                    const colors = theme.colors.salkku[s];
                    return (
                        <button
                            key={s}
                            onClick={() => toggleSalkku(s)}
                            style={{
                                padding: "5px 16px",
                                borderRadius: "20px",
                                border: `2px solid ${active ? colors.color : theme.colors.border}`,
                                background: active ? colors.bg : theme.colors.surface,
                                color: active ? colors.color : theme.colors.textMuted,
                                fontWeight: active ? 700 : 400,
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                transition: "all 0.15s",
                            }}
                        >
                            {s}
                        </button>
                    );
                })}

                <span style={{ marginLeft: "auto", fontSize: "0.85rem", color: theme.colors.textMuted }}>
                    {filteredKiinteistot.length} / {kiinteistot.length} kiinteistöä
                </span>
            </div>

            {/* Empty state */}
            {filteredKiinteistot.length === 0 && (
                <div style={{ ...cardStyle, textAlign: "center", color: theme.colors.textMuted, padding: "32px" }}>
                    Ei kiinteistöjä valituissa salkuissa.
                </div>
            )}

            {/* Charts */}
            {filteredKiinteistot.length > 0 && (
                <div style={flexChartContainer}>
                    <div style={chartCard}>
                        <div style={sectionTitle}>Ylläpitokulut salkuittain (€/v)</div>
                        <div style={{ position: "relative", height: "280px" }}>
                            <canvas id="chartYllapito" style={chartCanvas} />
                        </div>
                    </div>

                    <div style={chartCard}>
                        <div style={sectionTitle}>Pisteiden jakauma kriteereittäin</div>
                        <div style={{ position: "relative", height: "280px" }}>
                            <canvas id="chartKriteerit" style={chartCanvas} />
                        </div>
                    </div>

                    <div style={chartCard}>
                        <div style={sectionTitle}>Ylläpitokulut per kiinteistö (salkkuvärit)</div>
                        <div style={{ position: "relative", height: "280px" }}>
                            <canvas id="maintenanceChart" style={chartCanvas} />
                        </div>
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
                        <div style={{ position: "relative", height: "280px" }}>
                            <canvas id="criteriaChart" style={chartCanvas} />
                        </div>
                    </div>
                </div>
            )}

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
                        {filteredKiinteistot.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: theme.colors.textMuted }}>
                                    Ei tuloksia
                                </td>
                            </tr>
                        ) : (
                            sortData(filteredKiinteistot).map((k) => (
                                <tr
                                    key={k.id}
                                    onClick={() => navigate(`/detail/${k.id}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={tdStyle}>{k.nimi}</td>
                                    <td style={{ ...tdStyle, ...badgeStyle(k.oma_salkku) }}>{k.oma_salkku}</td>
                                    <td style={tdStyle}>{k.painotetutPisteet.toFixed(1)}</td>
                                    <td style={tdStyle}>{k.pinta_ala}</td>
                                    <td style={tdStyle}>{k.vuokrakulut[year]?.tasearvo ?? 0}</td>
                                    <td style={tdStyle}>{calYllapito(k, year)}</td>
                                    <td style={tdStyle}>{calKayttoaste(k, year).toFixed(1)} %</td>
                                    <td style={tdStyle}>{k.rakennusvuosi}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
