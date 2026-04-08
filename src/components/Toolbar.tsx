
import { NavLink } from "react-router-dom";
import "./Toolbar.css";
import FileButton from "./Pathfinderbutton";
import {useState, useMemo} from "react";

// tuodaan ryhmän provider-hook
import { useKiinteistot } from "../context/useKiinteistot";

export default function Toolbar() {
  const { kiinteistot } = useKiinteistot();
  const tools = [
    { id: "summary", label: "Yhteenveto", path: "/" },
    { id: "analytics", label: "Analytiikka", path: "/analytics" },
    { id: "addProperty", label: "Lisää kiinteistö", path: "/add" },
  ];
  const [activeSalkut, setActiveSalkut] = useState<
    Set<"A" | "B" | "C" | "D">
    >(new Set(["A","B","C","D"]));

  function toggleSalkku(salkku: "A" | "B" | "C" | "D") {
    setActiveSalkut(prev => {
      const next = new Set(prev);
      next.has(salkku) ? next.delete(salkku) : next.add(salkku);
      return next;
    });
  }
  const filteredKiinteistot = useMemo(() => {
    return kiinteistot.filter(k =>
      activeSalkut.has(k.oma_salkku)
    );
  }, [kiinteistot, activeSalkut]);


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
      <div className="propertyHeader">
        <span className="headerSubtitle">KIINTEISTÖT</span>
        <div className="filterButtons">
            
            {(["A", "B", "C", "D"] as const).map(s => (
              <button
                key={s}
                className={`filterBtn ${activeSalkut.has(s) ? "active" : ""}`}
                onClick={() => toggleSalkku(s)}
                title={`Salkku ${s}`}
              >
                {s}
              </button>
            ))}
        </div>
      </div>

      {filteredKiinteistot.length === 0 && (
        <div className="toolbarItem">
          <span className="toolbarLabel">Ei kiinteistöjä</span>
        </div>
      )}
      <div className="propertyScroll">
      {/* 🔥 Näytetään kaikki kiinteistöt providerista */}
      {filteredKiinteistot.map((k) => (
        <NavLink
          key={k.id}
          to={`/detail/${k.id}`}
          className={({ isActive }) => 
            `toolbarItem ${isActive ? "isActive" : ""}`
          }
        >
          <span className="toolbarLabel">{k.nimi}</span>
        </NavLink>
      ))}
      </div>
      <div className="toolbarBottom">
        <FileButton/>
      </div>
    </div>
  );
}