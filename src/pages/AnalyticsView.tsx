import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Kiinteisto } from "../types";

import {
    laskeKayttoaste,
    laskePisteet,
    laskeYllapito,
    laskeTasearvo,
} from "../utils/analyticsUtils";

import {
    cardStyle,
    tableStyle,
    thStyle,
    tdStyle,
    sectionTitle,
    gridContainer,
    /*gridContainer2,*/
    mainHeader,
    chartsGrid,
    chartCard,
    chartCanvas,
} from "../styles";

// Ulkoiset chart-funktiot
import { renderYllapitoChart } from "../charts/chartYllapito";
import { renderKriteeritChart } from "../charts/chartKriteerit";
import { renderMaintenanceChart } from "../charts/maintenanceChart";
import { renderCriteriaComparisonChart } from "../charts/criteriaComparisonChart";
import { useKiinteistot } from "../context/useKiinteistot";

export default function AnalyticsView() {
    const properties = useKiinteistot().kiinteistot;
    const year = Math.max(
        ...properties.flatMap(k => [
            ...Object.keys(k.yllapitokulut).map(Number),
            ...Object.keys(k.vuokrakulut).map(Number)
        ])
    );
    const [selectedCriteria, setSelectedCriteria] = useState<string>("ika");
    const [sortKey, setSortKey] = useState("nimi");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate();

    // =============================
    // SORT LOGIC 
    // =============================
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
                    A = laskeTasearvo(a, year);
                    B = laskeTasearvo(b, year);
                    break;
                case "kayttoaste":
                    A = laskeKayttoaste(a, year);
                    B = laskeKayttoaste(b, year);
                    break;
                case "yllapito":
                    A = laskeYllapito(a, year);
                    B = laskeYllapito(b, year);
                    break;
                default:
                    A = (a as unknown as Record<string, string | number>)[sortKey];
                    B = (b as unknown as Record<string, string | number>)[sortKey];
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

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    const header = (text: string, key: string) => (
        <th style={thStyle as React.CSSProperties} onClick={() => handleSort(key)}>
            {text}
        </th>
    );

    // =============================
    // CHART CALLS (kiinteistötiedot -> chartit)
    // =============================
    useEffect(() => {
        try {
            if (properties.length === 0) return;

            renderYllapitoChart("chartYllapito", properties);
            renderKriteeritChart("chartKriteerit", properties);
            renderMaintenanceChart("maintenanceChart", properties);
        } catch (error) {
            console.error("Error rendering charts:", error);
        }
    }, [properties]);

    useEffect(() => {
        try {
            if (properties.length === 0) return;

            renderCriteriaComparisonChart("criteriaChart", properties, selectedCriteria);
        } catch (error) {
            console.error("Error rendering criteria comparison chart:", error);
        }
    }, [properties, selectedCriteria]);

    // =============================
    // RENDER
    // =============================
    return (
      <div style={gridContainer}>
        <h1 style={mainHeader}>Analytiikka</h1>
        <p style={sectionTitle}>Vertailunäkymät koko salkusta</p>

        <div style={chartsGrid}>

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
                        padding: "6px 10px",
                        marginBottom: "12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                >
                    {Object.keys(properties[0]?.pisteet ?? {}).map(key => (
                        <option key={key}>{key}</option>
                    ))}
                </select>

                <canvas id="criteriaChart" style={chartCanvas} />
            </div>

        </div>

        {/* ---------------- Yhteenvetotaulukko ---------------- */}
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
                            <td style={tdStyle}>{laskeTasearvo(p, year)}</td>
                            <td style={tdStyle}>{laskeYllapito(p, year)}</td>
                            <td style={tdStyle}>{laskeKayttoaste(p, year)}%</td>
                            <td style={tdStyle}>{p.rakennusvuosi}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>        
      </div>
    );
}