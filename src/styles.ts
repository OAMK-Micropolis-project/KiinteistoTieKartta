// styles.ts
import type { CSSProperties } from "react";
import { theme } from "./theme";

/* =========================================================
   LAYOUT PERUSTYYLIT
   ========================================================= */

/**
 * Sivun pääkontti
 * - Pystysuuntainen asettelu
 * - Kaikki näkymät (detail, analytiikka, yhteenveto) rakentuvat tämän päälle
 */
export const flexContainer: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
};

/**
 * Yleinen flex-kontti chartteja varten
 * - Wrap mahdollistaa automaattisen rivittymisen
 * - Vähintään 2 charttia vierekkäin leveillä näytöillä
 */
export const flexChartContainer: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    width: "100%",
    alignItems: "stretch",
};

/**
 * Wrapper taulukoille pienillä näytöillä
 * - Mahdollistaa vaakasuuntaisen scrollin mobiilissa
 */
export const tableWrapper: CSSProperties = {
    width: "100%",
    overflowX: "auto",
};

/* =========================================================
   KORTIT (CARD UI)
   ========================================================= */

/**
 * Peruskortti koko sovelluksessa
 * - Käytetään detail-näkymissä, analytiikassa ja taulukoissa
 */
export const cardStyle: CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: "16px",
    boxShadow: theme.shadow,
    width: "auto",
};

/**
 * Chartin sisältävä kortti
 * - flex-basis 48 % = kaksi korttia per rivi
 * - minWidth estää liian pientä kutistumista
 */

export const chartCard: CSSProperties = {
    ...cardStyle,

    /* Joustava: 2 charttia per rivi kun tila riittää, 1 chartti kun ei ole tarpeeksi tilaa */
    flex: "1 1 clamp(320px, 45%, 48%)",

    minWidth: "320px",
    display: "flex",
    flexDirection: "column",
};


/**
 * Chart.js canvas
 * - width: 100 % takaa responsiivisen skaalautumisen
 * - korkeus rajoitetaan, jotta layout ei “räjähdä”
 */
export const chartCanvas: CSSProperties = {
    width: "100%",
    height: "280px",
};

/* =========================================================
   TYPOGRAFIA
   ========================================================= */

/**
 * Sivun pääotsikko (esim. Analytiikka, Kiinteistöt)
 */
export const mainHeader: CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: theme.colors.text,
};

/**
 * Osion otsikko korttien sisällä
 * (esim. “Ylläpitokulut”, “Pisteprofiili”)
 */
export const sectionTitle: CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: theme.colors.text,
};

/* =========================================================
   TAULUKOT
   ========================================================= */

/**
 * Yleinen taulukkotyyli
 */
export const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
};

/**
 * Taulukon otsikkosolut
 * - Klikattava (lajittelu)
 */
export const thStyle: CSSProperties = {
    padding: "10px 0",
    fontWeight: 600,
    fontSize: ".9rem",
    textAlign: "left",
    borderBottom: `2px solid ${theme.colors.border}`,
    color: theme.colors.textMuted,
    cursor: "pointer",
};

/**
 * Taulukon datasolut
 */
export const tdStyle: CSSProperties = {
    padding: "10px 0",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: ".95rem",
};

/* =========================================================
   MUUT UI-ELEMENTIT
   ========================================================= */

/**
 * Salkku-badge (A–D)
 * - Värit tulevat themestä
 */
export function badgeStyle(salkku: "A" | "B" | "C" | "D"): CSSProperties {
    return {
        display: "inline-block",
        width: "fit-content",
        padding: "6px 16px",
        borderRadius: "20px",
        background: theme.colors.salkku[salkku].bg,
        color: theme.colors.salkku[salkku].color,
        fontWeight: 600,
    };
}

/**
 * Takaisin-painike detail-näkymissä
 */
export const backButton: CSSProperties = {
    width: "fit-content",
    padding: "8px 16px",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    cursor: "pointer",
};