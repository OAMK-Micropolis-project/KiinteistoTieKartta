import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Kiinteisto } from "../types";
import { useKiinteistot } from "../context/useKiinteistot";

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
    mainHeader,
    chartCard,
    chartCanvas,
    flexContainer,
    flexChartContainer,
    badgeStyle,
} from "../styles";

// Chart-renderöinnit on erotettu omiin tiedostoihin
import { renderYllapitoChart } from "../charts/chartYllapito";
import { renderKriteeritChart } from "../charts/chartKriteerit";
import { renderMaintenanceChart } from "../charts/maintenanceChart";
import { renderCriteriaComparisonChart } from "../charts/criteriaComparisonChart";

export default function AnalyticsView() {
    const navigate = useNavigate();
    const { kiinteistot } = useKiinteistot();

    /**
     * Valitaan uusin vuosi, jota käytetään laskentafunktioissa.
     * Tämä pitää näkymän automaattisesti ajan tasalla,
     * vaikka dataan lisättäisiin uusia vuosia.
     */
    const year = Math.max(
        ...kiinteistot.flatMap((k) => [
            ...Object.keys(k.yllapitokulut).map(Number),
            ...Object.keys(k.vuokrakulut).map(Number),
        ])
    );

    /**
     * Valittu pistekriteeri kriteerivertailu-charttia varten
     */
    const [selectedCriteria, setSelectedCriteria] = useState<string>("ika");

    /**
     * Taulukon lajittelun tila
     */
    const [sortKey, setSortKey] = useState<string>("nimi");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    /**
     * Lajittelee kiinteistöt valitun sarakkeen ja suunnan mukaan.
     * Laskennalliset arvot käsitellään erikseen util-funktioiden avulla.
     */
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

    /**
     * Päivittää lajittelun:
     * - sama otsikko → vaihda suuntaa
     * - eri otsikko → uusi sarake, oletus nouseva
     */
    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDirection("asc");
        }
    }

    /**
     * Pieni apufunktio taulukon headerien luontiin
     */
    const header = (label: string, key: string) => (
        <th
            style={thStyle as React.CSSProperties}
            onClick={() => handleSort(key)}
        >
            {label}
        </th>
    );

    /**
     * Renderöidään perus-chartit aina, kun kiinteistöt muuttuvat.
     * Canvasien koot määritellään CSS:n kautta → dynaaminen resize.
     */
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

    /**
     * Kriteerivertailu-chart päivittyy myös,
     * kun käyttäjä vaihtaa kriteeriä
     */
    useEffect(() => {
        if (kiinteistot.length === 0) return;

        try {
            renderCriteriaComparisonChart(
                "criteriaChart",
                kiinteistot,
                selectedCriteria
            );
        } catch (err) {
            console.error("Criteria chart error:", err);
        }
    }, [kiinteistot, selectedCriteria]);

    return (
        <div style={flexContainer}>
            <h1 style={mainHeader}>Analytiikka</h1>
            <p style={sectionTitle}>Vertailunäkymät koko salkusta</p>

            {/* ================== CHART-NÄKYMÄ ================== */}
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
                    <div style={sectionTitle}>
                        Ylläpitokulut per kiinteistö (salkkuvärit)
                    </div>
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
                        {Object.keys(kiinteistot[0]?.pisteet ?? {}).map(
                            (key) => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            )
                        )}
                    </select>

                    <canvas id="criteriaChart" style={chartCanvas} />
                </div>
            </div>

            {/* ================== YHTEENVETOTAULUKKO ================== */}
            <div style={{ ...cardStyle}}>
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
                                <td style={{ ...tdStyle, ...badgeStyle(k.oma_salkku as "A" | "B" | "C" | "D") }}>
                                    {k.oma_salkku}
                                </td>
                                <td style={tdStyle}>{laskePisteet(k)}</td>
                                <td style={tdStyle}>{k.pinta_ala}</td>
                                <td style={tdStyle}>{laskeTasearvo(k, year)}</td>
                                <td style={tdStyle}>{laskeYllapito(k, year)}</td>
                                <td style={tdStyle}>
                                    {laskeKayttoaste(k, year)} %
                                </td>
                                <td style={tdStyle}>{k.rakennusvuosi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}