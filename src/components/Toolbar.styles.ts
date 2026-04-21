// Toolbar.styles.ts
import type { CSSProperties } from "react";
import { theme } from "../theme";

/* =========================================================
   TOOLBAR – PÄÄLAYOUT
   ========================================================= */

/**
 * Vasemman reunan kiinteä toolbar
 * - Koko näkymän korkuinen
 * - Värit ja varjot tulevat teemasta
 */
export const toolbar: CSSProperties = {
    fontFamily: '"Roboto", sans-serif',

    position: "fixed",
    top: 0,
    left: 0,

    display: "flex",
    flexDirection: "column",
    width: "clamp(200px, 33vw, 320px)",
    height: "100vh",

    background: theme.colors.text, // tumma pohja
    color: theme.colors.surface,

    padding: "16px",
    gap: "12px",
    boxSizing: "border-box",

    borderRight: "none",//`1px solid ${theme.colors.border}`,
    boxShadow: "0 0 20px rgba(0,0,0,0,0.15)",//theme.shadowStrong,

    overflow: "hidden",
};

/**
 * Alareunaan ankkuroidut elementit (esim. asetukset)
 */


export const toolbarBottom: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // ✅ vierekkäin
  gap: "8px",
  paddingTop: "8px",
  flexShrink: 0,                   // ✅ ei katoa
};


/* =========================================================
   HEADER / KIINTEISTÖN NIMI
   ========================================================= */

export const headerBlock: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",

    paddingBottom: "8px",
    marginBottom: "12px",

    borderBottom: `2px solid ${theme.colors.border}`,
};

export const headerTitle: CSSProperties = {
    fontSize: "clamp(20px, 3.8vw, 38px)",
    fontWeight: 600,
    color: theme.colors.surface,
    margin: 0,
};

export const headerSubtitle: CSSProperties = {
    fontSize: "clamp(12px, 0.8vw, 28px)",
    color: theme.colors.textMuted,
};

/* =========================================================
   NAVIGAATIO
   ========================================================= */

export const toolbarNav: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    flexShrink: 1,
};

/**
 * Scrollattava kiinteistölista
 */
export const propertyScroll: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    marginBottom: "8px",
};

/* =========================================================
   NAVIGAATIOITEMI
   ========================================================= */

export const toolbarItem: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",

    padding: "10px 12px",
    borderRadius: "8px",

    background: "transparent",
    border: "none",
    color: theme.colors.textMuted,

    cursor: "pointer",
    textAlign: "left",
    textDecoration: "none",

    transition: "background 0.15s ease, color 0.15s ease",
};

export function toolbarItemHover(): CSSProperties {
    return {
        background: theme.colors.accentLight,
        color: theme.colors.accent,
    };
}

export function toolbarItemActive(): CSSProperties {
    return {
        background: theme.colors.accentLight,
        color: theme.colors.accent,
        outline: `1px solid ${theme.colors.accent}`,
    };
}

/* =========================================================
   IKONI + TEKSTI
   ========================================================= */

export const toolbarIcon: CSSProperties = {
    width: "26px",
    height: "26px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "6px",
    background: theme.colors.border,
    color: theme.colors.textMuted,

    fontSize: "10px",
};

export function toolbarIconActive(): CSSProperties {
    return {
        background: theme.colors.accent,
        color: theme.colors.surface,
    };
}

export const toolbarLabel: CSSProperties = {
    fontSize: "clamp(12px, 1.2vw, 16px)",
    fontWeight: 500,
};

/* =========================================================
   HAKU
   ========================================================= */

export const searchContainer: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",

    width: "100%",
    padding: "6px 10px",

    background: theme.colors.surface,
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
};

export const searchInput: CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",

    color: theme.colors.text,
    fontSize: "14px",
};

export const searchIcon: CSSProperties = {
    color: theme.colors.textMuted,
    fontSize: "14px",
};

/* =========================================================
   SÄHKÖINEN SÄÄTÖ / Salkkufiltterit
   ========================================================= */

/**
 * Salkkukohtaiset suodatinpainikkeet
 * Värit tulevat suoraan theme.colors.salkku
 */
export function filterBtnPortfolio(
    salkku: "A" | "B" | "C" | "D",
    active: boolean
): CSSProperties {
    const cfg = theme.colors.salkku[salkku];

    return {
        background: active ? cfg.color : cfg.bg,
        color: active ? theme.colors.surface : cfg.color,
        borderRadius: "6px",
        fontWeight: 600,
        cursor: "pointer",
    };
}

/* =========================
   FILTER ROW
========================= */

export const filterRow: CSSProperties = {
  display: "flex",
  gap: "6px",
  marginTop: "6px",
};

/* =========================
   EMPTY STATE
========================= */

export const emptyState: CSSProperties = {
  padding: "8px",
  opacity: 0.6,
  fontSize: "14px",
};

/* =========================
   REFRESH BUTTON
========================= */

export const refreshButton: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "6px",
  background: theme.colors.surface,
  color: theme.colors.textMuted,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

export const refreshButtonDisabled: CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};

/* =========================
   LAST REFRESH LABEL
========================= */

export const lastRefreshLabel: CSSProperties = {
  fontSize: "12px",
  color: theme.colors.textMuted,
  paddingLeft: "10px",
};

/* =========================
   RIGHT-SIDE BUTTON GROUP
========================= */

export const toolbarBottomActions: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};