// styles.ts
import { theme } from "./theme";
import type { CSSProperties } from "react";

// =========================
// COMMON UI STYLES
// =========================
/*
export const gridContainer = {
    display: "grid",
    gridTemplateRows: "auto auto",
    gap: "10px",
}*/
export const gridContainer: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
};

export const gridContainer2 = {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
};

export const pageContainer = {
    width: "100%",
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
};

export const cardStyle = {
    width: "auto",
    maxWidth: "100%",
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: "10px",
    boxShadow: theme.shadow,
};

export const chartsGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(400px, 1fr))",
    gap: "20px",
    width: "100%",
};

export const chartCard: CSSProperties = {
    ...cardStyle,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "20px",
};

export const chartCanvas: CSSProperties = {
    width: "100%",
    height: "300px",
};

export const mainHeader = {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "4px",
    color: theme.colors.text,
};

export const sectionTitle = {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "2px",
    color: theme.colors.text,
};

export const tableStyle: CSSProperties = {
    width: "auto",
    borderCollapse: "collapse",
    marginTop: "10px",
};

export const thStyle = {
    padding: "10px 0",
    fontWeight: 600,
    fontSize: ".9rem",
    textAlign: "left",
    borderBottom: `2px solid ${theme.colors.border}`,
    color: theme.colors.textMuted,
    cursor: "pointer",
};

export const tdStyle = {
    padding: "10px 0",
    borderBottom: `1px solid ${theme.colors.border}`,
    fontSize: ".95rem",
};

export function badgeStyle(salkku: "A" | "B" | "C" | "D") {
    return {
        display: "inline-block",
        padding: "6px 16px",
        borderRadius: "20px",
        background: theme.colors.salkku[salkku].bg,
        color: theme.colors.salkku[salkku].color,
        fontWeight: 600,
        marginTop: "10px",
    };
};

export const backButton = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    cursor: "pointer",
    marginBottom: "20px",
};
