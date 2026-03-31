import React from "react";
import { NavLink } from "react-router-dom";
import "./Toolbar.css";

export default function Toolbar() {

  // ---------------------------
  // Kiinteistölista (localStorage)
  // ---------------------------
  const [list, setList] = React.useState<any[]>([]);

  // Ladataan lista kun Toolbar avautuu
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("kiinteistot") || "[]");
    setList(stored);
  }, []);

  // Päivitetään lista heti kun "kiinteistö-added" -event lähetetään
  React.useEffect(() => {
    const refresh = () => {
      const stored = JSON.parse(localStorage.getItem("kiinteistot") || "[]");
      setList(stored);
    };

    window.addEventListener("kiinteisto-added", refresh);
    return () => window.removeEventListener("kiinteisto-added", refresh);
  }, []);

  // ---------------------------
  // Staattiset näkymät
  // ---------------------------
  const tools = [
    { id: "summary", label: "Yhteenveto", path: "/" },
    { id: "analytics", label: "Analytiikka", path: "/analytics" },
    { id: "addProperty", label: "Lisää kiinteistö", path: "/add" },
  ];

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="toolbar">
      <div className="headerBlock">
        <span className="headerTitle">Kiinteistösalkku</span>
        <span className="headerSubtitle">HALLINTAJÄRJESTELMÄ</span>
      </div>

      <span className="headerSubtitle">NÄKYMÄT</span>

      <nav className="toolbarNav" aria-label="Primary">
        
        {/* Staattiset sivut */}
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

        <span className="headerSubtitle">KIINTEISTÖT</span>

        {/* Jos ei kiinteistöjä */}
        {list.length === 0 && (
          <div className="toolbarItem">
            <span className="toolbarLabel">Ei kiinteistöjä</span>
          </div>
        )}

        {/* Dynaamisesti lisätyt kiinteistöt */}
        {list.map((item, i) => (
          <NavLink
            key={i}
            to={`/property/${i}`}
            className="toolbarItem"
          >
            <span className="toolbarLabel">{item.nimi}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
``