import { NavLink } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import { useKiinteistot } from "../context/useKiinteistot";
import Tooltip from "./Tooltip";

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
    filterRow,
    emptyState,
    refreshButton,
    refreshButtonDisabled,
    lastRefreshLabel,
    filePathRow,
    filePathText,
    filePathMuted,
    copyPathButton,
} from "./Toolbar.styles";
import FileButton from "./Pathfinderbutton";

export default function Toolbar() {
  const {
    filteredKiinteistot,
    activeSalkut,
    toggleSalkku,
    refresh,
    lastRefresh,
  } = useKiinteistot();

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tools = [
    { id: "summary",   label: "Yhteenveto",      path: "/" },
    { id: "analytics", label: "Analytiikka",      path: "/analytics" },
    { id: "add",       label: "Lisää kiinteistö", path: "/add" },
  ];

  // Search is local-only — no need to lift it to context
  const visibleKiinteistot = useMemo(
    () => filteredKiinteistot.filter((k) =>
      k.nimi.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [filteredKiinteistot, searchQuery]
  );
  const [filePath, setFilePath] = useState<string | null>(null);
  const fileName = filePath?.split(/[\\/]/).pop();


  useEffect(() => {
    async function loadPath() {
      const settings = await window.settings.load();
      setFilePath(settings?.lastFilePath ?? null);
    }
    loadPath();
  }, []);
  return (
    <nav style={toolbar}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={headerBlock}>
        <h1 style={headerTitle}>Kiinteistösalkku</h1>
        <div style={headerSubtitle}>Hallintajärjestelmä</div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div style={toolbarNav}>
        {tools.map((tool) => (
          <NavLink
            key={tool.id}
            to={tool.path}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive() : {}),
              ...(hoverId === tool.id ? toolbarItemHover() : {}),
            })}
            onMouseEnter={() => setHoverId(tool.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <div style={{ ...toolbarIcon, ...(hoverId === tool.id ? toolbarIconActive() : {}) }}>
              ●
            </div>
            <span style={toolbarLabel}>{tool.label}</span>
          </NavLink>
        ))}
      </div>

      {/* ── Property header + portfolio filter ──────────────────────── */}
      <div>
        <strong>Kiinteistöt</strong>

        <div style={filterRow}>
          {(["A", "B", "C", "D"] as const).map((s) => (
            <button
              key={s}
              onClick={() => toggleSalkku(s)}
              title={`Salkku ${s}`}
              style={filterBtnPortfolio(s, activeSalkut.has(s))}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div style={searchContainer}>
        <span style={searchIcon}>🔍</span>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInput}
          placeholder="Hae kiinteistöä"
        />
      </div>

      {/* ── Property list ───────────────────────────────────────────── */}
      <div style={propertyScroll}>
        {visibleKiinteistot.length === 0 && (
          <div style={emptyState}>Ei kiinteistöjä</div>
        )}

        {visibleKiinteistot.map((k) => (
          <NavLink
            key={k.id}
            to={`/detail/${k.id}`}
            style={({ isActive }) => ({
              ...toolbarItem,
              ...(isActive ? toolbarItemActive() : {}),
              ...(hoverId === String(k.id) ? toolbarItemHover() : {}),
            })}
            onMouseEnter={() => setHoverId(String(k.id))}
            onMouseLeave={() => setHoverId(null)}
          >
            <span style={toolbarLabel}>{k.nimi}</span>
          </NavLink>
        ))}
      </div>

      {/* ── Bottom ──────────────────────────────────────────────────── */}
      <div style={toolbarBottom}>
        <FileButton />

        <button
          onClick={async () => {
            setIsRefreshing(true);
            await refresh();
            setIsRefreshing(false);
          }}
          disabled={isRefreshing}
          title="Päivitä tiedosto"
          style={{ ...refreshButton, ...(isRefreshing ? refreshButtonDisabled : {}) }}
        >
          {isRefreshing ? "Päivitetään…" : "Päivitä"}
        </button>

        {lastRefresh && (
          <span style={lastRefreshLabel}>
            Päivitetty:{" "}
            {lastRefresh.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        {filePath ? (
        <div style={filePathRow}>
          <Tooltip label={<div style={{ whiteSpace: "pre-wrap" }}>{filePath}</div>}>
            <span style={filePathText}>{fileName}</span>
          </Tooltip>

          <button
            type="button"
            style={copyPathButton}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(filePath);
              } catch {
                console.warn("Clipboard write failed");
              }
            }}
            title="Kopioi polku"
          >
            Kopioi
          </button>
        </div>
      ) : (
        <div style={filePathMuted}>Ei tiedostoa valittuna</div>
      )}

      </div>
    </nav>
  );
}
