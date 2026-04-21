import React from "react";
import { cardStyle, sectionTitle, tableStyle, tdStyle } from "../styles";

// Shared card with a label/value table – used by PerustiedotTab
interface Props {
  title: string;
  rows: [string, React.ReactNode][];
}

export default function DetailCard({ title, rows }: Props) {
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
