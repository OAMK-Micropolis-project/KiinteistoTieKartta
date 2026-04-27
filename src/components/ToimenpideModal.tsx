import { useState } from "react";
import type { Toimenpide } from "../types";
import { cardStyle, sectionTitle } from "../styles";

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


  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, width: 420 }}>

        <h3 style={sectionTitle}>
          {mode === "edit" ? "Muokkaa toimenpidettä" : "Lisää toimenpide"}
        </h3>

        <div>
          <p style={{ marginBottom: "4px" }}>Toimenpiteen otsikko</p>
          <input
            placeholder="Toimenpiteen otsikko"
            value={otsikko}
            onChange={(e) => setOtsikko(e.target.value)}
          />
        </div>
        <div>
          <p style={{ marginBottom: "4px" }}>Tarkempi kuvaus (valinnainen)</p>
          <textarea
            placeholder="Tarkempi kuvaus (valinnainen)"
            value={kuvaus}
            onChange={(e) => setKuvaus(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <p style={{ marginBottom: "4px" }}>Kustannusarvio (€)</p>
          <input
            type="number"
            placeholder="Kustannusarvio (€)"
            value={kustannukset}
            onChange={(e) => setKustannukset(e.target.value)}
          />
        </div>
        <div>
          <p style={{ marginBottom: "4px" }}>Suunniteltu päivämäärä</p>
          <input
            type="date"
            value={suunniteltuPvm}
            onChange={(e) => setSuunniteltuPvm(e.target.value)}
          />
        </div>
        <div>
          <p style={{ marginBottom: "4px" }}>Toteutunut päivämäärä</p>
          <input
            type="date"
            value={tehtyPvm}
            onChange={(e) => setTehtyPvm(e.target.value)}
          />
        </div>

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
