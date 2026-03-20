import { theme } from "./theme";

// =========================
// COMMON UI STYLES
// =========================

export const cardStyle = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: "20px",
    marginBottom: "30px",
    boxShadow: theme.shadow,
};

export const sectionTitle = {
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "14px",
    color: theme.colors.text,
};

export const tableStyle = {
    width: "100%",
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
}

export const backButton = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    cursor: "pointer",
    marginBottom: "20px",
};
