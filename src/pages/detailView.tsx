import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import { backButton, badgeStyle, flexContainer } from "../styles";
import KuntoarviointiTab from "../components/tabs/KuntoarviointiTab";
import PerustiedotTab from "../components/tabs/PerustiedotTab";
import TalousTab from "../components/tabs/TalousTab";
import ToimenpiteetTab from "../components/tabs/ToimenpiteetTab";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "perustiedot" | "kuntoarviointi" | "toimenpiteet" | "talous";

const TABS: Tab[] = ["perustiedot", "kuntoarviointi", "toimenpiteet", "talous"];

// ── Component ─────────────────────────────────────────────────────────────────

export default function DetailView() {
  const { id } = useParams();
  const { getById, update, getLatestYear } = useKiinteistot();
  const navigate = useNavigate();

  const item = getById(Number(id));
  const latestYear = getLatestYear();

  const [activeTab, setActiveTab] = useState<Tab>("perustiedot");

  // Guard: hooks above, render guard below (rules of hooks satisfied)
  if (!item) return <p>Kiinteistöä ei löytynyt.</p>;

  return (
    <div style={flexContainer}>
      {/* Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <button style={backButton} onClick={() => navigate(-1)}>
          ← Takaisin
        </button>
        <div style={{display: "flex", gap: "12px"}}>
          <button
            style={backButton}
            onClick={() => navigate(`/add/${item.id}`)}
          >
            ✎ Muokkaa
          </button>

          <button
            style={{
              ...backButton,
              backgroundColor: "#b91c1c",
              color: "#fff",
              border: "none",
            }}
            onClick={() => handleDelete()}
          >
            🗑 Poista
          </button>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1>{item.nimi}</h1>
        <p>{item.osoite}</p>
        <span style={badgeStyle(item.oma_salkku as "A" | "B" | "C" | "D")}>
          Salkku {item.oma_salkku}
        </span>
      </div>

      {/* Tab bar — issue #6: accessible buttons with ARIA */}
      <div role="tablist" style={{ display: "flex", gap: "16px" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom:
                activeTab === tab ? "2px solid #2e68a6" : "2px solid transparent",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab panels — issue #2: each tab in its own component */}
      {activeTab === "perustiedot" && (
        <PerustiedotTab item={item} latestYear={latestYear} />
      )}
      {activeTab === "kuntoarviointi" && <KuntoarviointiTab item={item} />}
      {activeTab === "toimenpiteet" && (
        <ToimenpiteetTab item={item} onUpdate={update} />
      )}
      {activeTab === "talous" && (
        <TalousTab item={item} latestYear={latestYear} />
      )}
    </div>
  );
}

