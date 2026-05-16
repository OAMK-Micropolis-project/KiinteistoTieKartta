import { useState } from "react";
import type { Toimenpide } from "../types";
import { cardStyle, sectionTitle } from "../styles";
import { theme } from "../theme";

type Props = {
  onSave: (t: Toimenpide) => void;
  onClose: () => void;
  initial?: Toimenpide;
  mode?: "add" | "edit";
};

export default function ToimenpideModal({ onSave, onClose, initial, mode = "add" }: Props) {

  const [otsikko, setOtsikko] = useState(initial?.otsikko ?? "");
  const [kuvaus, setKuvaus] = useState(initial?.kuvaus ?? "");
  const [kustannukset, setKustannukset] = useState(initial?.kustannukset?.toString() ?? "");
  const [suunniteltuPvm, setSuunniteltuPvm] = useState(initial?.suunniteltuPvm ?? "");
  const [tehtyPvm, setTehtyPvm] = useState(initial?.tehtyPvm ?? "");


  function handleSave() {
    if (!otsikko.trim()) return;

    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      otsikko,
      kuvaus: kuvaus || undefined,
      kustannukset: Number(kustannukset) || 0,
      suunniteltuPvm: suunniteltuPvm || undefined,
      tehtyPvm: tehtyPvm || undefined,
    });

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

  const textareaStyle: React.CSSProperties = {
    padding: "6px 8px",
    borderRadius: 6,
    border: `1px solid ${theme.colors.border}`,
    fontSize: "0.9rem",
    width: "100%",
    marginBottom: 8,
    fontFamily: "inherit",
    resize: "vertical",
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
      <div style={{ ...cardStyle, width: 420, maxHeight: "88vh", overflowY: "auto" }}>

        <h3 style={sectionTitle}>
          {mode === "edit" ? "Muokkaa toimenpidettä" : "Lisää toimenpide"}
        </h3>

        {/* Perustiedot */}
        <div style={dividerStyle}>Perustiedot</div>

        <div>
          <p style={labelStyle}>Toimenpiteen otsikko</p>
          <input
            placeholder="Toimenpiteen otsikko"
            value={otsikko}
            onChange={(e) => setOtsikko(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <p style={labelStyle}>Tarkempi kuvaus (valinnainen)</p>
          <textarea
            placeholder="Tarkempi kuvaus (valinnainen)"
            value={kuvaus}
            onChange={(e) => setKuvaus(e.target.value)}
            rows={3}
            style={textareaStyle}
          />
        </div>

        {/* Kustannukset */}
        <div style={dividerStyle}>Kustannukset</div>

        <div>
          <p style={labelStyle}>Kustannusarvio (€)</p>
          <input
            type="number"
            placeholder="0"
            value={kustannukset}
            onChange={(e) => setKustannukset(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Aikataulutus */}
        <div style={dividerStyle}>Aikataulutus</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <p style={labelStyle}>Suunniteltu päivämäärä</p>
            <input
              type="date"
              value={suunniteltuPvm}
              onChange={(e) => setSuunniteltuPvm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <p style={labelStyle}>Toteutunut päivämäärä</p>
            <input
              type="date"
              value={tehtyPvm}
              onChange={(e) => setTehtyPvm(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button type="button" onClick={onClose}>
            Peruuta
          </button>

          <button type="button" onClick={handleSave}>
            Tallenna
          </button>
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
