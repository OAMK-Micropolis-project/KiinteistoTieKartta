import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import FileButton from "./Pathfinderbutton";

import { useKiinteistot } from "../context/useKiinteistot";

import {
  toolbar,
  headerBlock,
  headerTitle,
  headerSubtitle,
  toolbarNav,
  toolbarItem,
  toolbarLabel,
  toolbarIcon,
  toolbarItemActive,
  toolbarItemHover,
  propertyHeader,
  filterButtons,
  filterBtn,
  filterBtnPortfolio,
  propertyScroll,
  toolbarBottom,
  searchContainer,
  searchIcon,
  searchInput,
} from "./Toolbar.styles";

export default function Toolbar() {
  const { kiinteistot } = useKiinteistot();
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const tools = [
    { id: "summary", label: "Yhteenveto", path: "/" },
    { id: "analytics", label: "Analytiikka", path: "/analytics" },
    { id: "addProperty", label: "Lisää kiinteistö", path: "/add" },
  ];

  const [activeSalkut, setActiveSalkut] = useState<
    Set<"A" | "B" | "C" | "D">
  >(new Set(["A", "B", "C", "D"]));

  function toggleSalkku(salkku: "A" | "B" | "C" | "D") {
    setActiveSalkut(prev => {
      const next = new Set(prev);
      next.has(salkku) ? next.delete(salkku) : next.add(salkku);
      return next;
    });
  }

  const filteredKiinteistot = useMemo(() => {
    return kiinteistot.filter(k => activeSalkut.has(k.oma_salkku))
    .filter((k) => k.nimi.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [kiinteistot, activeSalkut, searchQuery]);

  return (
    <div style={toolbar}>
      {/* HEADER */}
      <div style={headerBlock}>
        <span style={headerTitle}>Kiinteistösalkku</span>
        <span style={headerSubtitle}>HALLINTAJÄRJESTELMÄ</span>
      </div>

      {/* NAVIGATION */}
      <span style={headerSubtitle}>NÄKYMÄT</span>

      <nav style={toolbarNav} aria-label="Primary">
        {tools.map(tool => (
          <NavLink
            key={tool.id}
            to={tool.path}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive : {}),
              ...(hoverId === tool.id ? toolbarItemHover() : {}),
            })}
            onMouseEnter={() => setHoverId(tool.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <span style={toolbarIcon}>●</span>
            <span style={toolbarLabel}>{tool.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* PROPERTY HEADER + FILTERS */}
      <div style={propertyHeader}>
        <span style={headerSubtitle}>KIINTEISTÖT</span>

        <div style={filterButtons}>
          {(["A", "B", "C", "D"] as const).map(s => (
            <button
              key={s}
              onClick={() => toggleSalkku(s)}
              title={`Salkku ${s}`}
              style={{
                ...filterBtn,
                ...filterBtnPortfolio(s, activeSalkut.has(s)),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {/* SEARCH FIELD */}
      <div style={searchContainer}>
        <span style={searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Hae kiinteistöjä…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInput}
        />
      </div>
      {/* PROPERTY LIST */}
      {filteredKiinteistot.length === 0 && (
        <div style={toolbarItem}>
          <span style={toolbarLabel}>Ei kiinteistöjä</span>
        </div>
      )}

      <div style={propertyScroll}>
        {filteredKiinteistot.map(k => (
          <NavLink
            key={k.id}
            to={`/detail/${k.id}`}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive : {}),
              ...(hoverId === String(k.id) ? toolbarItemHover() : {}),
            })}
            onMouseEnter={() => setHoverId(String(k.id))}
            onMouseLeave={() => setHoverId(null)}
          >
            <span style={toolbarLabel}>{k.nimi}</span>
          </NavLink>
        ))}
      </div>

      {/* BOTTOM BUTTON */}
      <div style={toolbarBottom}>
        <FileButton />
      </div>
    </div>
  );
}
