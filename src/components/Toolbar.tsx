import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";

import { useKiinteistot } from "../context/useKiinteistot";

import {
    toolbar,
    toolbarBottom,
    headerBlock,
    headerTitle,
    headerSubtitle,
    toolbarNav,
    toolbarItem,
    toolbarItemActive,
    toolbarItemHover,
    toolbarIcon,
    toolbarIconActive,
    toolbarLabel,
    propertyScroll,
    searchContainer,
    searchInput,
    searchIcon,
    filterBtnPortfolio,
} from "./Toolbar.styles";

export default function Toolbar() {
  const { kiinteistot } = useKiinteistot();

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeSalkut, setActiveSalkut] = useState<
    Set<"A" | "B" | "C" | "D">
  >(new Set(["A", "B", "C", "D"]));

  const tools = [
    { id: "summary", label: "Yhteenveto", path: "/" },
    { id: "analytics", label: "Analytiikka", path: "/analytics" },
    { id: "add", label: "Lisää kiinteistö", path: "/add" },
  ];

  function toggleSalkku(s: "A" | "B" | "C" | "D") {
    setActiveSalkut((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }

  const filteredKiinteistot = useMemo(() => {
    return kiinteistot
      .filter((k) => activeSalkut.has(k.oma_salkku as any))
      .filter((k) =>
        k.nimi.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [kiinteistot, activeSalkut, searchQuery]);

  return (
    <nav style={toolbar}>
      {/* ================= HEADER ================= */}
      <div style={headerBlock}>
        <h1 style={headerTitle}>Kiinteistösalkku</h1>
        <div style={headerSubtitle}>Hallintajärjestelmä</div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <div style={toolbarNav}>
        {tools.map((tool) => (
          <NavLink
            key={tool.id}
            to={tool.path}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive() : {}),
              ...(hoverId === tool.id
                ? toolbarItemHover()
                : {}),
            })}
            onMouseEnter={() => setHoverId(tool.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <div
              style={{
                ...toolbarIcon,
                ...(hoverId === tool.id
                  ? toolbarIconActive()
                  : {}),
              }}
            >
              ●
            </div>
            <span style={toolbarLabel}>{tool.label}</span>
          </NavLink>
        ))}
      </div>

      {/* ================= PROPERTY HEADER ================= */}

      <div>
        <strong>Kiinteistöt</strong>

        <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
          {(["A", "B", "C", "D"] as const).map((s) => (
            <button
              key={s}
              onClick={() => toggleSalkku(s)}
              title={`Salkku ${s}`}
              style={filterBtnPortfolio(
                s,
                activeSalkut.has(s)
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div style={searchContainer}>
        <span style={searchIcon}>🔍</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInput}
          placeholder="Hae kiinteistöä"
        />
      </div>

      {/* ================= PROPERTY LIST ================= */}
      <div style={propertyScroll}>
        {filteredKiinteistot.length === 0 && (
          <div style={{ padding: "8px", opacity: 0.6 }}>
            Ei kiinteistöjä
          </div>
        )}

        {filteredKiinteistot.map((k) => (
          <NavLink
            key={k.id}
            to={`/detail/${k.id}`}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive() : {}),
              ...(hoverId === String(k.id)
                ? toolbarItemHover()
                : {}),
            })}
            onMouseEnter={() => setHoverId(String(k.id))}
            onMouseLeave={() => setHoverId(null)}
          >
            <span style={toolbarLabel}>{k.nimi}</span>
          </NavLink>
        ))}
      </div>

      {/* ================= BOTTOM ================= */}
      <div style={toolbarBottom}>
        {/* esim. asetukset / logout */}
      </div>
    </nav>
  );
}