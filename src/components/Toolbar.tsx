import React from "react";
import { NavLink } from "react-router-dom";
import "./Toolbar.css";

const tools = [
  { id: "summary", label: "Yhteenveto", path: "/" },
  { id: "analytics", label: "Analytiikka", path: "/analytics" },
  { id: "addProperty", label: "Lisää kiinteistö", path: "/add-property" },
];

export default function Toolbar() {
  return (
    <div className="toolbar">
      <div className="headerBlock">
        <span className="headerTitle">Kiinteistösalkku</span>
        <span className="headerSubtitle">HALLINTAJÄRJESTELMÄ</span>
      </div>

      <span className="headerSubtitle">NÄKYMÄT</span>

      <nav className="toolbarNav" aria-label="Primary">
        {tools.map((tool) => (
          <NavLink
            key={tool.id}
            to={tool.path}
            className={({ isActive }) =>
              `toolbarItem ${isActive ? "isActive" : ""}`
            }
          >
            <span className="toolbarIcon" aria-hidden="true">●</span>
            <span className="toolbarLabel">{tool.label}</span>
          </NavLink>
        ))}

        <span className="headerSubtitle">KIINTEISTÖT</span>
      </nav>
    </div>
  );
}