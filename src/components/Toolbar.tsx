
import { NavLink } from "react-router-dom";
import "./Toolbar.css";
import { useKiinteistot } from "../context/useKiinteistot";

const tools = [
  { id: "summary", label: "Yhteenveto", path: "/" },
  { id: "analytics", label: "Analytiikka", path: "/analytics" },
  { id: "addProperty", label: "Lisää kiinteistö", path: "/add-property" },
];
// const estates= [
//   { id: "1", label: "kiinteistö 1", path: "/detail/1" },
//   { id: "2", label: "kiinteistö 2", path: "/detail/2" },
//   { id: "3", label: "kiinteistö 3", path: "/detail/3" },
//   { id: "4", label: "kiinteistö 4", path: `/detail/4` },
// ];

export default function Toolbar() {
  const estates = useKiinteistot().kiinteistot

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
      </nav>
        <span className="headerSubtitle">KIINTEISTÖT</span>
              <nav className="toolbarNav" aria-label="Primary">
                {estates.map((estate) => (
                  <NavLink
                    key={estate.id}
                    to={`/detail/${estate.id}`}
                    className={({ isActive }) =>
                      `toolbarItem ${isActive ? "isActive" : ""}`
                    }
                  >
                    <span className="toolbarIcon" aria-hidden="true">●</span>
                    <span className="toolbarLabel">{estate.nimi}</span>
                  </NavLink>
                ))}
      </nav>
    </div>
  );
}