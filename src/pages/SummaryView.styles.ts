import { theme } from "../theme";
import type { CSSProperties } from "react";

/*=========================
   YearFilter
======================== */

export const yearFilterContainer: CSSProperties = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  overflowX: "auto",
  paddingBottom: "4px",
};

export function yearFilterButton(active: boolean): CSSProperties {
  return {
    padding: "4px 10px",
    borderRadius: "6px",

    border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
    background: active ? theme.colors.accent : theme.colors.surfaceMuted,
    color: active ? theme.colors.surface : theme.colors.text,

    cursor: "pointer",
    fontWeight: active ? 600 : 400,

    transition: "background 0.15s ease, color 0.15s ease, border 0.15s ease",
  };
}

/* ========================
   BOXES
======================== */

export const boxesContainer: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  gap: "16px",
  marginTop: "20px",
};

export const box: CSSProperties = {
  flex: 1,
  minWidth: "180px",
  height: "clamp(40px, 10vh, 260px)",
  backgroundColor: theme.colors.surface,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "12px",
  borderRadius: "10px",

  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "break-word",

  boxShadow: theme.shadowStrong,
};

export const boxName: CSSProperties = {
  fontSize: "clamp(6px, 1.2vw, 28px)",
  color: theme.colors.textMuted,
  alignSelf: "center",
};

export const boxValue: CSSProperties = {
  fontSize: "clamp(6px, 2vw, 40px)",
  fontWeight: "bold",
  color: theme.colors.text,
  alignSelf: "center",
};

export const boxTitle: CSSProperties = {
  fontSize: "clamp(20px, 4vw, 40px)",
  fontWeight: 600,
};

/* ========================
   REAL ESTATE LIST
======================== */

export const realEstatesContainer: CSSProperties = {
  flex: 2,
  minWidth: "350px",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.colors.surface,
  padding: "10px",
  marginTop: "20px",
  borderRadius: "10px",
  overflowX: "hidden",
  boxShadow: theme.shadowStrong,
};

export const realEstateTitle: CSSProperties = {
  flex: 1,
  fontSize: "clamp(6px, 1.2vw, 28px)",
  textAlign: "center",
  color: theme.colors.textMuted,
};

export const realEstateTitle2: CSSProperties = {
  flex: 2,
  fontSize: "clamp(6px, 1.2vw, 28px)",
  color: theme.colors.textMuted,
};

export const realEstateRowTitles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "nowrap",
  padding: "14px 16px",
  gap: "16px",
  borderBottom: `2px solid ${theme.colors.textMuted}`,
};

export const realEstateRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "nowrap",
  textDecoration: "none",
  color: "inherit",

  padding: "14px 16px",
  borderRadius: "10px",
  marginTop: "clamp(8px, 1vw, 16px)",
  gap: "16px",

  minWidth: "350px",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-all",

  boxShadow: theme.shadow,
};

/* ========================
   REAL ESTATE ROW CONTENT
======================== */

export const estateName: CSSProperties = {
  flex: 2,
  fontSize: "clamp(20px, 1.5vw, 40px)",
  fontWeight: 600,
  textAlign: "left",
};

export const portfolioCell: CSSProperties = {
  flex: 1,
  fontSize: "clamp(20px, 1.3vw, 40px)",
  fontWeight: 600,
  textAlign: "center",
};

export const estateNumber: CSSProperties = portfolioCell;

/* ========================
   PORTFOLIO BACKGROUNDS
   (replaces .portfolioA, B, C, D)
======================== */

export function portfolioRowStyle(
  salkku?: "A" | "B" | "C" | "D"
): CSSProperties {
  switch (salkku) {
    case "A":
      return { background: theme.colors.salkku.A.bg };
    case "B":
      return { background: theme.colors.salkku.B.bg };
    case "C":
      return { background: theme.colors.salkku.C.bg };
    case "D":
      return { background: theme.colors.salkku.D.bg };
    default:
      return { background: "#1f2430" };
  }
}
export function portfolioItemHover() : CSSProperties{
    return {
        filter: "brightness(0.9)",
    };
}
export function salkkuBadge(salkku: "A" | "B" | "C" | "D"): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    minWidth: "32px",
    height: "32px",
    padding: "0 12px",

    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",

    background: theme.colors.salkku[salkku].color,

    lineHeight: 1,
    boxSizing: "border-box",
  };
}

/* ========================
   SECOND ROW (CHARTS + LIST)
======================== */

export const secondRowContainer: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  gap: "20px",
  alignItems: "flex-start",
  justifyContent: "center",
  boxSizing: "border-box",
};

export const chartContainer: CSSProperties = {
  flex: 1,
  minWidth: "300px",
  background: theme.colors.surface,
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  height: "350px",
  boxSizing: "border-box",
  boxShadow: theme.shadowStrong,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};