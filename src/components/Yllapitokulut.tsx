import { useState } from "react";
import type { Kiinteisto } from "../types";
import { chartCard, sectionTitle, tableStyle, tdStyle } from "../styles";

// Multi-year maintenance cost table used by TalousTab
interface Props {
  title: string;
  item: Kiinteisto;
}

export default function Yllapitokulut({ title, item }: Props) {
  const [yearOffset, setYearOffset] = useState(0);

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

  

  const currentYear = allYears[allYears.length - 1];

  const historyYears = allYears
    .filter((y) => y !== currentYear)
    .sort((a, b) => b - a);

  const historySlice = historyYears.slice(yearOffset, yearOffset + 2);
  const displayYears = [currentYear, ...historySlice];

  const canGoBack = yearOffset > 0;
  const canGoForward = yearOffset + 2 < historyYears.length;

  const costKeys =
    Object.values(item.yllapitokulut ?? {}).length > 0
      ? [
          ...new Set(
            Object.values(item.yllapitokulut).flatMap((yearData) =>
              Object.keys(yearData),
            ),
          ),
        ]
      : [];

  return (
    <div style={chartCard}>
      <div style={sectionTitle}>{title}</div>

      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setYearOffset(Math.max(0, yearOffset - 1))}
          disabled={!canGoBack}
        >
          ← Uudemmat
        </button>

        <span style={{ fontSize: "12px", color: "#666" }}>
          Nykyinen: {currentYear} · Historia: {historySlice[0] ?? "-"} –{" "}
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
            <th />
            {displayYears.map((year) => (
              <th
                key={year}
                style={{
                  ...tdStyle,
                  fontWeight: year === currentYear ? 700 : 400,
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
              <td style={{ ...tdStyle, fontWeight: 600 }}>{costKey}</td>

              {displayYears.map((year) => {
                const value =
                  item.yllapitokulut?.[year]?.[
                    costKey as keyof (typeof item.yllapitokulut)[number]
                  ] ?? 0;

                return (
                  <td
                    key={year}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: year === currentYear ? 700 : 400,
                    }}
                  >
                    {value ? `${Math.round(value / 1000)} k€` : "—"}
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
