import { useState } from "react";
import type { Kiinteisto, YllapitoKulut } from "../types";
import {
  chartCard,
  sectionTitle,
  tableStyle,
  thStyle,
  tdStyle,
  tableWrapper,
} from "../styles";

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
        <h3 style={sectionTitle}>{title}</h3>
        <p>Ei ylläpitokuluja saatavilla.</p>
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

  const costKeys = Object.keys(item.yllapitokulut[currentYear] ?? {}).filter(
    (key): key is Exclude<keyof YllapitoKulut, "muutKulut"> =>
      key !== "muutKulut",
  );

  return (
    <div style={chartCard}>
      <h3 style={sectionTitle}>{title}</h3>

      {/* Year navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px",
        }}
      >
        <button
          onClick={() => setYearOffset(Math.max(0, yearOffset - 1))}
          disabled={!canGoBack}
        >
          ← Uudemmat
        </button>

        <span>Nykyinen: {currentYear}</span>

        <button
          onClick={() => setYearOffset(yearOffset + 1)}
          disabled={!canGoForward}
        >
          Vanhemmat →
        </button>
      </div>

      {/* Table */}
      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Kulu</th>
              {displayYears.map((year) => (
                <th key={year} style={thStyle}>
                  {year}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {costKeys.map((costKey) => (
              <tr key={costKey}>
                <td style={tdStyle}>{costKey}</td>

                {displayYears.map((year) => {
                  const value = item.yllapitokulut[year]?.[costKey] ?? 0;

                  return (
                    <td key={year} style={tdStyle}>
                      {value > 0 ? `${value} €` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
