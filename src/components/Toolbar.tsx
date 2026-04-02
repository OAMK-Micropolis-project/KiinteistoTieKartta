import React from "react";
import { NavLink } from "react-router-dom";
import "./Toolbar.css";
import FileButton from "./Pathfinderbutton";

// tuodaan ryhmän provider-hook
import { useKiinteistot } from "../context/useKiinteistot";

export default function Toolbar() {
  const { kiinteistot } = useKiinteistot();

  const tools = [
    { id: "summary", label: "Yhteenveto", path: "/" },
    { id: "analytics", label: "Analytiikka", path: "/analytics" },
    { id: "addProperty", label: "Lisää kiinteistö", path: "/add" },
  ];

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
            <span className="toolbarIcon">●</span>
            <span className="toolbarLabel">{tool.label}</span>
          </NavLink>
        ))}
      </nav>

      <span className="headerSubtitle">KIINTEISTÖT</span>

      {kiinteistot.length === 0 && (
        <div className="toolbarItem">
          <span className="toolbarLabel">Ei kiinteistöjä</span>
        </div>
      )}

      {/* 🔥 Näytetään kaikki kiinteistöt providerista */}
      {kiinteistot.map((k) => (
        <NavLink
          key={k.id}
          to={`/detail/${k.id}`}
          className="toolbarItem"
        >
          <span className="toolbarLabel">{k.nimi}</span>
        </NavLink>
      ))}
      <div className="toolbarBottom">
        <FileButton/>
      </div>
    </div>
  );
}