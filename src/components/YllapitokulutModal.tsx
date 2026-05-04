import { useEffect, useState } from "react";
import type { Kiinteisto, YllapitoKulut } from "../types";
import { cardStyle, sectionTitle } from "../styles";
import { theme } from "../theme";

interface Props {
  open: boolean;
  item: Kiinteisto;
  year: number;
  onClose: () => void;
  onSave: (year: number, data: YllapitoKulut) => void;
}

const FIXED_FIELDS: { key: keyof Omit<YllapitoKulut, "muut" | "muutKulut">; label: string }[] = [
  { key: "sahko",    label: "Sähkö" },
  { key: "lammitys", label: "Lämmitys" },
  { key: "vesi",     label: "Vesi" },
  { key: "huolto",   label: "Huolto" },
  { key: "vero",     label: "Kiinteistövero" },
  { key: "laina",    label: "Laina" },
];

function emptyYllapito(): YllapitoKulut {
  return { sahko: 0, lammitys: 0, vesi: 0, huolto: 0, vero: 0, laina: 0, muut: 0, muutKulut: {} };
}

function calcMuutTotal(muutKulut: Record<string, number>): number {
  return Object.values(muutKulut).reduce((a, b) => a + b, 0);
}

function calcTotal(data: YllapitoKulut): number {
  const fixed = FIXED_FIELDS.reduce((sum, { key }) => sum + (data[key] ?? 0), 0);
  const extra = calcMuutTotal(data.muutKulut ?? {});
  return Math.round(fixed + extra);
}

export default function YllapitokulutModal({ open, item, year, onClose, onSave }: Props) {
  const [local, setLocal] = useState<YllapitoKulut>(emptyYllapito());
  const [newRowNimi, setNewRowNimi] = useState("");
  const [newRowSumma, setNewRowSumma] = useState("");

  // Sync state when modal opens or year changes
  useEffect(() => {
    if (open) {
      setLocal(item.yllapitokulut?.[year] ?? emptyYllapito());
      setNewRowNimi("");
      setNewRowSumma("");
    }
  }, [open, year, item]);

  if (!open) return null;

  function updateFixed(key: keyof Omit<YllapitoKulut, "muut" | "muutKulut">, value: string) {
    setLocal((prev) => ({ ...prev, [key]: Math.round(Number(value) || 0) }));
  }

  function addExtraRow() {
    if (!newRowNimi.trim()) return;
    const updatedMuutKulut = {
      ...(local.muutKulut ?? {}),
      [newRowNimi.trim()]: Math.round(Number(newRowSumma) || 0),
    };
    setLocal((prev) => ({
      ...prev,
      muutKulut: updatedMuutKulut,
      muut: calcMuutTotal(updatedMuutKulut),
    }));
    setNewRowNimi("");
    setNewRowSumma("");
  }

  function removeExtraRow(nimi: string) {
    const updatedMuutKulut = { ...(local.muutKulut ?? {}) };
    delete updatedMuutKulut[nimi];
    setLocal((prev) => ({
      ...prev,
      muutKulut: updatedMuutKulut,
      muut: calcMuutTotal(updatedMuutKulut),
    }));
  }

  function handleSave() {
    onSave(year, local);
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    padding: "6px 8px",
    borderRadius: 6,
    border: `1px solid ${theme.colors.border}`,
    fontSize: "0.9rem",
    width: "100%",
    marginBottom: 8,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    color: theme.colors.textMuted,
    marginBottom: 2,
  };

  const dividerStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: "16px 0 8px",
    paddingBottom: 4,
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, width: 500, maxHeight: "88vh", overflowY: "auto" }}>
        <h3 style={sectionTitle}>Ylläpitokulut – {year}</h3>

        {/* Fixed cost fields in a 2-col grid */}
        <div style={dividerStyle}>Kiinteät kulut</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          {FIXED_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <p style={labelStyle}>{label} (€)</p>
              <input
                type="number"
                value={local[key] || ""}
                placeholder="0"
                onChange={(e) => updateFixed(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        {/* Other costs — user-named rows */}
        <div style={dividerStyle}>Muut kulut</div>

        {/* Existing extra rows */}
        {Object.entries(local.muutKulut ?? {}).length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: theme.colors.textMuted, marginBottom: 8 }}>
            Ei lisättyjä kuluja.
          </p>
        ) : (
          <div style={{ marginBottom: 12 }}>
            {Object.entries(local.muutKulut ?? {}).map(([nimi, summa]) => (
              <div
                key={nimi}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: theme.colors.bg,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>{nimi}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {Math.round(summa).toLocaleString("fi-FI")} €
                  </span>
                  <button
                    onClick={() => removeExtraRow(nimi)}
                    title={`Poista ${nimi}`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#d32f2f",
                      fontSize: "1rem",
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new extra row */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 2 }}>
            <p style={labelStyle}>Kulun nimi</p>
            <input
              placeholder="esim. Siivous"
              value={newRowNimi}
              onChange={(e) => setNewRowNimi(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExtraRow()}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={labelStyle}>Summa (€)</p>
            <input
              type="number"
              placeholder="0"
              value={newRowSumma}
              onChange={(e) => setNewRowSumma(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExtraRow()}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          <button
            onClick={addExtraRow}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.surface,
              cursor: "pointer",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            + Lisää
          </button>
        </div>

        {/* Running total */}
        <div style={{
          marginTop: 16,
          padding: "10px 12px",
          borderRadius: 8,
          background: theme.colors.accentLight,
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
        }}>
          <span>Yhteensä</span>
          <span>{calcTotal(local).toLocaleString("fi-FI")} €</span>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button type="button" onClick={onClose}>Peruuta</button>
          <button type="button" onClick={handleSave}>Tallenna</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
