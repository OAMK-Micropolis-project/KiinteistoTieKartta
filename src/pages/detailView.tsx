import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import {
    backButton,
    badgeStyle,
    cardStyle,
    chartCanvas,
    chartCard,
    flexContainer,
    mainHeader,
    sectionTitle,
    tableStyle,
    tdStyle,
} from "../styles";
import type { Kiinteisto } from "../types";

type Tab = "perustiedot" | "kuntoarviointi" | "toimenpiteet" | "talous";

const ARVIOINTI_KRITEERIT: {
    key: string;
    label: string;
    paino: number;
}[] = [
        { key: "ika", label: "Kiinteistön ikä", paino: 3 },
        { key: "vesikatto", label: "Vesikaton kunto ja kaltevuus", paino: 2 },
        { key: "sadevesi", label: "Sadevesijärjestelmät", paino: 1 },
        { key: "salaoja", label: "Salaoja ja seinänvierustat", paino: 2 },
        { key: "julkisivu", label: "Julkisivuverhouksen kunto", paino: 1.3 },
        { key: "ikkunat", label: "Ikkunat – laatu ja kunto", paino: 1.3 },
        { key: "ovet", label: "Ulko-ovet – laatu ja kunto", paino: 1.3 },
        { key: "vaippa", label: "Rakennusvaipan U-arvo", paino: 3 },
        { key: "tontti", label: "Tontin korkeusasema ja kuivatus", paino: 3 },
        { key: "lattia", label: "Lattiapinnan korkeus maastoon nähden", paino: 2 },
        { key: "sisailma", label: "Sisäilmaongelmat", paino: 2 },
        { key: "yleisilme", label: "Yleisilme sisätiloilta", paino: 1.5 },
        { key: "lammitys", label: "Lämmitysmuoto", paino: 3 },
        { key: "lammlaitteet", label: "Lämmityslaitteiden kunto", paino: 2 },
        { key: "kayttovesi", label: "Käyttövesiputkistot", paino: 2 },
        { key: "viemari", label: "Viemäriputkisto", paino: 3 },
        { key: "iv", label: "IV-järjestelmä", paino: 3 },
        { key: "peruskorjaus", label: "Peruskorjaus viim. 15v", paino: 2 },
        { key: "toimivuus", label: "Toimivuus käyttötarkoitukseen", paino: 3 },
        { key: "kayttoaste_piste", label: "Rakennuksen käyttöaste", paino: 4 },
        { key: "tulevaisuus", label: "Tulevaisuuden käyttöaste", paino: 4 },
        { key: "investointi", label: "Kannattaako investoida", paino: 5 },
    ];

export default function DetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getById } = useKiinteistot();

    const item = getById(Number(id));
    const [activeTab, setActiveTab] = useState<Tab>("perustiedot");

    // Radar-chartin elinkaaren hallinta
    const radarRef = useRef<Chart | null>(null);

    /* --------------------------------------------------
       Hookit kutsutaan AINA – guardit vasta tämän jälkeen
    -------------------------------------------------- */
    useEffect(() => {
        if (!item) return;
        if (activeTab !== "kuntoarviointi") return;

        const canvas = document.getElementById(
            "radarChart"
        ) as HTMLCanvasElement | null;
        if (!canvas) return;

        radarRef.current?.destroy();

        radarRef.current = new Chart(canvas, {
            type: "radar",
            data: {
                labels: Object.keys(item.pisteet),
                datasets: [
                    {
                        data: Object.values(item.pisteet),
                        backgroundColor: "rgba(46,104,166,0.25)",
                        borderColor: "rgba(46,104,166,0.9)",
                        borderWidth: 2,
                        pointRadius: 3,
                    },
                ],
            },
            options: {
                scales: {
                    r: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 },
                    },
                },
                plugins: { legend: { display: false } },
            },
        });

        return () => radarRef.current?.destroy();
    }, [activeTab, item]);

    /* --------------------------------------------------
       Guard render – EI ennen hookeja
    -------------------------------------------------- */
    if (!item) {
        return <p>Kiinteistöä ei löytynyt.</p>;
    }

    /* --------------------------------------------------
       Laskennat types.ts:n mukaan
    -------------------------------------------------- */
    const latestYear = Math.max(
        ...Object.keys(item.yllapitokulut).map(Number),
        ...Object.keys(item.vuokrakulut).map(Number)
    );

    const yllapito = item.yllapitokulut[latestYear];
    const vuokra = item.vuokrakulut[latestYear];

    const yllapitoYhteensa = yllapito
        ? Object.values(yllapito).reduce((sum, val) => sum + val, 0)
        : 0;

    const vuokratulot =
        vuokra && vuokra.vuokrausaste_m2 && vuokra.neliövuokra
            ? vuokra.vuokrausaste_m2 * vuokra.neliövuokra * 12
            : 0;

    const kayttoaste =
        vuokra && item.pinta_ala > 0
            ? Math.round(
                (vuokra.vuokrausaste_m2 / item.pinta_ala) * 100
            )
            : 0;

    const arviointiRivit = ARVIOINTI_KRITEERIT.map((k) => {
        const arvo = item.pisteet[k.key] ?? 0;
        const painotettu = arvo * k.paino;
        return {
            ...k,
            arvo,
            painotettu,
        };
    });

    const arviointiYhteensa = arviointiRivit.reduce(
        (sum, r) => sum + r.painotettu,
        0
    );


    return (
        <div style={flexContainer}>
            {/* ================= HEADER ================= */}
            <div>
                <button style={backButton} onClick={() => navigate(-1)}>
                    ← Takaisin
                </button>

                <h1 style={mainHeader}>{item.nimi}</h1>
                <p style={sectionTitle}>{item.osoite}</p>

                <span
                    style={badgeStyle(
                        item.oma_salkku as "A" | "B" | "C" | "D"
                    )}
                >
                    Salkku {item.oma_salkku}
                </span>
            </div>

            {/* ================= TABIT ================= */}
            <div style={{ display: "flex", gap: "16px" }}>
                {(
                    ["perustiedot", "kuntoarviointi", "toimenpiteet", "talous"] as Tab[]
                ).map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            cursor: "pointer",
                            fontWeight: activeTab === tab ? 600 : 400,
                            borderBottom:
                                activeTab === tab
                                    ? "2px solid #2e68a6"
                                    : "none",
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </div>
                ))}
            </div>

            {/* ================= PERUSTIEDOT ================= */}
            {activeTab === "perustiedot" && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                    }}
                >
                    <DetailCard
                        title="Kiinteistön tiedot"
                        rows={[
                            ["Pinta-ala", `${item.pinta_ala} m²`],
                            ["Rakennusvuosi", item.rakennusvuosi],
                            ["Käyttötarkoitus", item.kayttotarkoitus],
                            [
                                "Suojelukohde",
                                item.suojelukohde ? "Kyllä" : "Ei",
                            ],
                            ["Tasearvo", vuokra?.tasearvo ?? "—"],
                            ["Ylläpitokulut / v", yllapitoYhteensa],
                            ["Vuokratulot / v", vuokratulot],
                            ["Käyttöaste", `${kayttoaste} %`],
                        ]}
                    />

                    <DetailCard
                        title="Salkutus"
                        rows={[
                            [
                                "Pisteet",
                                Object.values(item.pisteet).reduce(
                                    (a, b) => a + b,
                                    0
                                ),
                            ],
                            ["Salkku", item.oma_salkku],
                        ]}
                    />
                </div>
            )}

            {/* ================= KUNTOARVIOINTI ================= */}
            {activeTab === "kuntoarviointi" && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.5fr 1fr",
                        gap: "20px",
                    }}
                >
                    {/* ================= ARVIOINTIPISTEET ================= */}
                    <div style={cardStyle}>
                        <h3 style={sectionTitle}>Arviointipisteet (painotettu)</h3>

                        {arviointiRivit.map((r) => {
                            const prosentti = Math.min(
                                (r.arvo / 5) * 100,
                                100
                            );

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
                                            {r.arvo}/5 × {r.paino} ={" "}
                                            {r.painotettu.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div
                                        style={{
                                            height: "6px",
                                            background: "#e0e0e0",
                                            borderRadius: "4px",
                                        }}
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
                                </div>
                            );
                        })}

                        <hr style={{ margin: "12px 0" }} />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: 600,
                            }}
                        >
                            <span>Yhteensä</span>
                            <span>{arviointiYhteensa.toFixed(1)} pistettä</span>
                        </div>
                    </div>

                    {/* ================= RADAR ================= */}
                    <div style={chartCard}>
                        <h3 style={sectionTitle}>Pisteprofiili</h3>
                        <canvas id="radarChart" style={chartCanvas} />
                    </div>
                </div>
            )}
            {/* ================= TOIMENPITEET ================= */}
            {activeTab === "toimenpiteet" && (
                <div style={cardStyle}>
                    <h3 style={sectionTitle}>Suunnitellut toimenpiteet</h3>

                    {item.toimenpiteet.length === 0 ? (
                        <p>Ei kirjattuja toimenpiteitä.</p>
                    ) : (
                        item.toimenpiteet.map((t, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: "12px 0",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                                    {index + 1}. {t.kuvaus}
                                </div>

                                <div
                                    style={{
                                        fontSize: "0.9rem",
                                        color: "#666",
                                    }}
                                >
                                    {t.kustannukset
                                        ? t.kustannukset
                                        : "Ei kustannusarviota"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ================= TALOUS ================= */}
            {activeTab === "talous" && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                    }}
                >
                    {/* ========= YLLÄPITOKULUT ========= */}

                    <YllapitokulutCard
                        title="Ylläpitokulut (€/v)"
                        item={item}
                    />


                    {/* ========= VUOKRAUSTIEDOT ========= */}
                    <div style={cardStyle}>
                        <h3 style={sectionTitle}>Vuokraustiedot</h3>

                        {vuokra ? (
                            <>
                                <InfoRow
                                    label="Vuokralla olevat m²"
                                    value={`${vuokra.vuokrausaste_m2} m²`}
                                />
                                <InfoRow
                                    label="Neliövuokra"
                                    value={`${vuokra.neliövuokra} €/m²`}
                                />
                                <InfoRow
                                    label="Käyttöaste"
                                    value={`${kayttoaste} %`}
                                />
                                <InfoRow
                                    label="Vuokratulot / v"
                                    value={`${Math.round(vuokratulot / 1000)} k€`}
                                />
                            </>
                        ) : (
                            <p>Ei vuokratietoja.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
            }}
        >
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}

/* =========================================================
   YLEINEN DETAIL CARD – KÄYTETÄÄN SEKÄ PERUSTIEDOT-OSIOSSA ETTÄ YLLÄPITOKULUT-TAULUKOSSA
   ========================================================= */
function DetailCard({
    title,
    rows,
}: {
    title: string;
    rows: [string, string | number][];
}) {
    return (
        <div style={cardStyle}>
            <h3 style={sectionTitle}>{title}</h3>
            <table style={tableStyle}>
                <tbody>
                    {rows.map(([label, value]) => (
                        <tr key={label}>
                            <td style={tdStyle}>{label}</td>
                            <td style={tdStyle}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function YllapitokulutCard({
    title,
    item,
}: {
    title: string;
    item: Kiinteisto;
}) {
    const [yearOffset, setYearOffset] = useState(0);

    /* --- Kaikki vuodet datasta --- */
    const allYears = Object.keys(item.yllapitokulut ?? {})
        .map(Number)
        .sort((a, b) => a - b);

    if (allYears.length === 0) {
        return (
            <div style={chartCard}>
                <div style={sectionTitle}>{title}</div>
                <p>Ei kustannustietoja saatavilla.</p>
            </div>
        );
    }

    /* --- Nykyinen vuosi = uusin --- */
    const currentYear = allYears[allYears.length - 1];

    /* --- Historia = kaikki muut --- */
    const historyYears = allYears
        .filter((y) => y !== currentYear)
        .sort((a, b) => b - a); // Uusin ensin

    /* --- Näytetään 2 historiavuotta kerrallaan --- */
    const historySlice = historyYears.slice(
        yearOffset,
        yearOffset + 2
    );

    const displayYears = [currentYear, ...historySlice];

    const canGoBack = yearOffset > 0;
    const canGoForward = yearOffset + 2 < historyYears.length;

    /* --- Kululajit --- */
    const costKeys =
        Object.values(item.yllapitokulut ?? {}).length > 0
            ? [
                ...new Set(
                    Object.values(item.yllapitokulut).flatMap((yearData) =>
                        Object.keys(yearData)
                    )
                ),
            ]
            : [];

    return (
        <div style={chartCard}>
            <div style={sectionTitle}>{title}</div>

            {/* Navigointi koskee vain historiaa */}
            <div
                style={{
                    marginBottom: "12px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                }}
            >
                <button
                    onClick={() =>
                        setYearOffset(Math.max(0, yearOffset - 1))
                    }
                    disabled={!canGoBack}
                >
                    ← Uudemmat
                </button>

                <span style={{ fontSize: "12px", color: "#666" }}>
                    Nykyinen: {currentYear} · Historia:{" "}
                    {historySlice[0] ?? "-"} –{" "}
                    {historySlice[historySlice.length - 1] ?? "-"}
                </span>

                <button
                    onClick={() => setYearOffset(yearOffset + 1)}
                    disabled={!canGoForward}
                >
                    Vanhemmat →
                </button>
            </div>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th></th>
                        {displayYears.map((year) => (
                            <th
                                key={year}
                                style={{
                                    ...tdStyle,
                                    fontWeight:
                                        year === currentYear
                                            ? 700
                                            : 400,
                                }}
                            >
                                {year}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {costKeys.map((costKey) => (
                        <tr key={costKey}>
                            <td
                                style={{
                                    ...tdStyle,
                                    fontWeight: 600,
                                }}
                            >
                                {costKey}
                            </td>

                            {displayYears.map((year) => {
                                const value =
                                    item.yllapitokulut?.[year]?.[
                                    costKey as keyof typeof item.yllapitokulut[number]
                                    ] ?? 0;

                                return (
                                    <td
                                        key={year}
                                        style={{
                                            ...tdStyle,
                                            textAlign: "center",
                                            fontWeight:
                                                year === currentYear
                                                    ? 700
                                                    : 400,
                                        }}
                                    >
                                        {value
                                            ? `${Math.round(
                                                value / 1000
                                            )} k€`
                                            : "—"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}