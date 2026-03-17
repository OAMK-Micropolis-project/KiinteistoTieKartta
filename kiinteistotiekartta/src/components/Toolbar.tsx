import React, { useState } from "react";
import "./Toolbar.css";

type Tool = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

const tools: Tool[] = [
  { id: "home", label: "Home" },
  { id: "search", label: "Search" },
  { id: "add", label: "Add" },
  { id: "settings", label: "Settings" },
  { id: "help", label: "Help" },
];

export default function Toolbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState<string>("home");

  return (
    <aside className={`toolbar ${collapsed ? "toolbar--collapsed" : ""}`}>
      <button
        className="toolbar__toggle"
        aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? "›" : "‹"}
      </button>

      <nav className="toolbar__nav" aria-label="Primary">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`toolbar__item ${active === tool.id ? "is-active" : ""}`}
            onClick={() => setActive(tool.id)}
            aria-pressed={active === tool.id}
          >
            <span className="toolbar__icon" aria-hidden="true">●</span>
            <span className="toolbar__label">{tool.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}