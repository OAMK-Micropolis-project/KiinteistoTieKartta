import { useState } from "react";
import type { Toimenpide } from "../types";
import { cardStyle, sectionTitle } from "../styles";

type Props = {
  onSave: (t: Toimenpide) => void;
  onClose: () => void;
};

export default function ToimenpideModal({ onSave, onClose }: Props) {
  const [otsikko, setOtsikko] = useState("");
  const [kuvaus, setKuvaus] = useState("");
  const [kustannukset, setKustannukset] = useState("");
  const [suunniteltuPvm, setSuunniteltuPvm] = useState("");

  function handleSave() {
    if (!otsikko.trim()) return;

    onSave({
      otsikko,
      kuvaus: kuvaus || undefined,
      kustannukset: Number(kustannukset) || 0,
      suunniteltuPvm: suunniteltuPvm || undefined,
    });

    onClose();
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, width: 420 }}>
        <h3 style={sectionTitle}>Lisää toimenpide</h3>

        <input
          placeholder="Toimenpiteen otsikko"
          value={otsikko}
          onChange={(e) => setOtsikko(e.target.value)}
        />

        <textarea
          placeholder="Tarkempi kuvaus (valinnainen)"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
          rows={3}
        />

        <input
          type="number"
          placeholder="Kustannusarvio (€)"
          value={kustannukset}
          onChange={(e) => setKustannukset(e.target.value)}
        />

        <input
          type="date"
          value={suunniteltuPvm}
          onChange={(e) => setSuunniteltuPvm(e.target.value)}
        />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
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
