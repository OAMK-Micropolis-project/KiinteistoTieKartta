// toolbarStyles.ts
import type { CSSProperties } from "react";
import { theme } from "./theme";

/* =========================
   TOOLBAR LAYOUT
========================= */

export const toolbar: CSSProperties = {
  fontFamily: '"Roboto", sans-serif',

  position: "fixed",
  top: 0,
  left: 0,
  width: "clamp(200px, 33vw, 320px)",
  height: "100vh",

  background: "#20242e",
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",
  padding: "16px",
  gap: "12px",

  color: "#fff",
  borderRight: "1px solid #1e293b",
  overflow: "hidden",
};

export const toolbarBottom: CSSProperties = {
  marginTop: "auto",
  width: "100%",
};

/* =========================
   PROPERTY HEADER
========================= */

export const propertyHeader: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",

  width: "100%",
  minHeight: "28px",
  paddingRight: "4px",

  boxSizing: "border-box",
};

/* =========================
   NAVIGATION
========================= */

export const toolbarNav: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
};

/* Scrollable property list */
export const propertyScroll: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  background: "#20242e",
};

/* =========================
   NAV ITEMS
========================= */

export const toolbarItem: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",

  textDecoration: "none",
  background: "transparent",
  border: "none",
  color: "#cbd5e1",

  padding: "10px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  textAlign: "left",

  transition: "background 0.15s ease, color 0.15s ease",
};

export function toolbarItemHover(): CSSProperties {
  return {
    background: "rgba(99, 102, 241, 0.15)",
    color: "#ffffff",
  };
}

export function toolbarItemActive(): CSSProperties {
  return {
    background: "rgba(99, 102, 241, 0.15)",
    color: "#ffffff",
    outline: "1px solid rgba(99, 102, 241, 0.4)",
  };
}

/* =========================
   ICON & LABEL
========================= */

export const toolbarIcon: CSSProperties = {
  width: "26px",
  height: "26px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "6px",
  background: "#1e293b",

  fontSize: "10px",
  color: "#94a3b8",
};

export function toolbarIconActive(): CSSProperties {
  return {
    background: "#6366f1",
    color: "#ffffff",
  };
}

export const toolbarLabel: CSSProperties = {
  fontSize: "clamp(6px, 2.5vw, 28px)",
  fontWeight: 500,
};

/* =========================
   HEADER
========================= */

export const headerBlock: CSSProperties = {
  flexShrink: 0,

  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",

  paddingBottom: "8px",
  marginBottom: "12px",
  borderBottom: "2px solid #cacccf",

  width: "100%",
};

export const headerTitle: CSSProperties = {
  fontSize: "clamp(20px, 3.8vw, 38px)",
  fontWeight: 600,
  color: "#ffffff",
  margin: 0,
};

export const headerSubtitle: CSSProperties = {
  fontSize: "clamp(12px, 0.8vw, 28px)",
  color: "#888d96",
  marginTop: "4px",
};

/* =========================
   FILTER BUTTONS
========================= */

export const filterButtons: CSSProperties = {
  display: "flex",
  gap: "6px",
};

export const filterBtn: CSSProperties = {
  width: "26px",
  height: "26px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "6px",
  background: "#1e293b",
  color: "#94a3b8",

  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",

  transition:
    "background 0.15s ease, color 0.15s ease, transform 0.05s ease",
};

export const filterBtnActive: CSSProperties = {
  background: "#6366f1",
  color: "#ffffff",
};

/* =========================
   PORTFOLIO FILTER COLORS
========================= */

export function filterBtnPortfolio(
  salkku: "A" | "B" | "C" | "D",
  active: boolean
): CSSProperties {
  const base = {
    A: { bg: "rgba(59,130,246,0.15)", solid: "#3b82f6" },
    B: { bg: "rgba(34,197,94,0.15)", solid: "#22c55e" },
    C: { bg: "rgba(234,179,8,0.15)", solid: "#eab308" },
    D: { bg: "rgba(239,68,68,0.15)", solid: "#ef4444" },
  }[salkku];

  return {
    background: active ? base.solid : base.bg,
    color: active ? "#ffffff" : base.solid,
  };
}