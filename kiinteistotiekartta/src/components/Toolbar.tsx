import React, { useState } from "react";
import "./Toolbar.css";

type Tool = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

const tools: Tool[] = [
  { id: "summary", label: "Yhteenveto" },
  { id: "analytics", label: "Analytiikka" },
  { id: "addProperty", label: "Lisää kiinteistö" },
];

export default function Toolbar() {
  const [active, setActive] = useState<string>("summary");

  return (
    <div className="toolbar">
      <div className="headerBlock">
        <span className="headerTitle">Kiinteistösalkku</span>
        <span className="headerSubtitle">HALLINTAJÄRJESTELMÄ</span>
      </div>
      <span className="headerSubtitle">NÄKYMÄT</span>
      <nav className="toolbarNav" aria-label="Primary">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`toolbarItem ${active === tool.id ? "isActive" : ""}`}
            onClick={() => setActive(tool.id)}
            aria-pressed={active === tool.id}
          >
            <span className="toolbarIcon" aria-hidden="true">●</span>
            <span className="toolbarLabel">{tool.label}</span>
          </button>
        ))}
        <span className="headerSubtitle">KIINTEISTÖT</span>
      </nav>
    </div>
  );
}