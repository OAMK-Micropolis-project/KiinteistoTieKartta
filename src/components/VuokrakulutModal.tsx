import { useState } from "react";
import type { VuokraKulut } from "../types";
import { cardStyle } from "../styles";

type Props = {
  year: number;
  initial?: VuokraKulut;
  onSave: (year: number, data: VuokraKulut) => void;
  onClose: () => void;
};

export default function VuokrakulutModal({
  year,
  initial,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState<VuokraKulut>(
    initial ?? {
      tasearvo: 0,
      vuokrausaste_m2: 0,
      neliövuokra: 0,

      sahkonkulutus: 0,
      lammitysenergia: 0,
      vedenkulutus: 0,

      yllapitoKorjaukset: 0,
      maavuokra: 0,
      vakuutus: 0,

      vuokrattu: 0,
      vuokrattavissa: 0,
      kokonaisvuokra: 0, // ei käytetä lähteenä
    },
  );

  function update<K extends keyof VuokraKulut>(key: K, value: number) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const kokonaisvuokra = form.vuokrattu + form.vuokrattavissa;

  function handleSave() {
    onSave(year, {
      ...form,
      kokonaisvuokra, // asetetaan vain tallennuksessa
    });
    onClose();
  }

  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, width: 420 }}>
        <h3>Vuokrakulut ({year})</h3>

        {/* Vuokratulot */}
        <h4>Vuokratulot (€ / vuosi):</h4>
        <div>
          <label>Vuokrattu: </label>
          <input
            type="number"
            value={form.vuokrattu}
            onChange={(e) => update("vuokrattu", Number(e.target.value))}
          />
          <br />

          <label>Vuokrattavissa: </label>
          <input
            type="number"
            value={form.vuokrattavissa}
            onChange={(e) => update("vuokrattavissa", Number(e.target.value))}
          />

          <p>
            <strong>Kokonaisvuokra: </strong> {kokonaisvuokra.toFixed(1)} €
          </p>
        </div>

        <hr />

        <div>
          {/* Kiinteät kulut */}
          <h4>Kiinteät kulut</h4>

          <label>Ylläpito & korjaukset: </label>
          <input
            type="number"
            value={form.yllapitoKorjaukset}
            onChange={(e) =>
              update("yllapitoKorjaukset", Number(e.target.value))
            }
          />

          <br />

          <label>Maavuokra: </label>
          <input
            type="number"
            value={form.maavuokra}
            onChange={(e) => update("maavuokra", Number(e.target.value))}
          />

          <br />

          <label>Vakuutus: </label>
          <input
            type="number"
            value={form.vakuutus}
            onChange={(e) => update("vakuutus", Number(e.target.value))}
          />
        </div>

        <hr />

        <div>
          {/* Perustiedot */}
          <h4>Perustiedot</h4>

          <label>Tasearvo: </label>
          <input
            type="number"
            value={form.tasearvo}
            onChange={(e) => update("tasearvo", Number(e.target.value))}
          />
          <br />
          <label>Vuokrausaste (m²): </label>
          <input
            type="number"
            value={form.vuokrausaste_m2}
            onChange={(e) => update("vuokrausaste_m2", Number(e.target.value))}
          />
          <br />
          <label>Neliövuokra: </label>
          <input
            type="number"
            value={form.neliövuokra}
            onChange={(e) => update("neliövuokra", Number(e.target.value))}
          />
        </div>

        <hr />

        <div>
          {/* Kulutus */}
          <h4>Kulutus</h4>

          <label>Sähkönkulutus: </label>
          <input
            type="number"
            value={form.sahkonkulutus}
            onChange={(e) => update("sahkonkulutus", Number(e.target.value))}
          />
          <br />
          <label>Lämmitysenergia: </label>
          <input
            type="number"
            value={form.lammitysenergia}
            onChange={(e) => update("lammitysenergia", Number(e.target.value))}
          />
          <br />
          <label>Vedenkulutus: </label>
          <input
            type="number"
            value={form.vedenkulutus}
            onChange={(e) => update("vedenkulutus", Number(e.target.value))}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={onClose}>Peruuta</button>
          <button onClick={handleSave}>Tallenna</button>
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
};