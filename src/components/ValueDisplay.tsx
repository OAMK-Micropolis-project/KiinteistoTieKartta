import React from "react";
import { theme } from "../theme";
import Tooltip from "./Tooltip";

/**
 * Displays a financial value with optional breakdown/composition.
 * Instead of showing just "€12,345" with a formula tooltip,
 * shows the value plus what it consists of.
 *
 * Usage:
 * <ValueDisplay
 *   value={12345}
 *   label="Ylläpitokulut yhteensä"
 *   tooltip={{
 *     label: "Ylläpitokulut (2024)",
 *     formula: "= sähkö + lämmitys + vesi + huolto + vero + laina"
 *   }}
 *   breakdown={[
 *     { label: "Sähkö", value: 2000 },
 *     { label: "Lämmitys", value: 3500 },
 *     { label: "Vesi", value: 800 },
 *     { label: "Huolto", value: 2000 },
 *     { label: "Vero", value: 2000 },
 *     { label: "Laina", value: 1045 }
 *   ]}
 * />
 */

interface BreakdownItem {
  label: string;
  value: number;
  unit?: string; // optional unit for this item, e.g. "€", "kWh", "m²"
}

interface ValueDisplayProps {
  value: number;
  label?: string;
  unit?: string; // "€", "%", "kWh", "m²" etc
  tooltip?: {
    label: string;
    formula: string;
  };
  breakdown?: BreakdownItem[];
  precision?: number; // decimal places
}

export default function ValueDisplay({
  value,
  label,
  unit,
  tooltip,
  breakdown,
  precision = 0,
}: ValueDisplayProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);

  const formatted = value.toLocaleString("fi-FI", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  const hasBreakdown = breakdown && breakdown.length > 0;

  // Tooltip content: formula + optional breakdown hint
  const tooltipText = tooltip
    ? `${tooltip.label}\n${tooltip.formula}${
        hasBreakdown ? "\n\n💡 Klikkaa nähdäksesi erittelyn" : ""
      }`
    : undefined;

  return (
    <div style={{ position: "relative" }}>
      <Tooltip label={tooltipText}>
        <div
          onClick={() => hasBreakdown && setShowBreakdown(!showBreakdown)}
          style={{
            cursor: hasBreakdown ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <strong>
            {formatted} {unit}
          </strong>
          {hasBreakdown && (
            <span
              style={{
                fontSize: "0.75rem",
                color: theme.colors.textMuted,
                userSelect: "none",
              }}
            >
              {showBreakdown ? "▼" : "▶"}
            </span>
          )}
        </div>
      </Tooltip>

      {/* Breakdown details */}
      {showBreakdown && hasBreakdown && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            background: theme.colors.accentLight,
            borderRadius: 6,
            fontSize: "0.85rem",
            borderLeft: `3px solid ${theme.colors.primary}`,
          }}
        >
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: idx < breakdown.length - 1 ? 4 : 0,
              }}
            >
              <span style={{ color: theme.colors.textMuted }}>{item.label}</span>
              <span style={{ fontWeight: 500 }}>
                {item.value.toLocaleString("fi-FI", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                {item.unit || unit}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 6,
              paddingTop: 6,
              borderTop: `1px solid ${theme.colors.border}`,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>Yhteensä</span>
            <span>{formatted} {unit}</span>
          </div>
        </div>
      )}
    </div>
  );
}
