import { useState } from "react";
import type { VuokraKulut } from "../types";
import { cardStyle, sectionTitle } from "../styles";
import { theme } from "../theme";

type Props = {
  onSave: (year: number, data: VuokraKulut) => void;
  onClose: () => void;
  initial?: { year: number; data: VuokraKulut };
  mode?: "add" | "edit";
  existingYears: number[];
};

function emptyVuokra(): VuokraKulut {
  return {
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
  };
}

export default function VuokrakulutModal({
  onSave,
  onClose,
  initial,
  mode = "add",
  existingYears,
}: Props) {
  const [year, setYear] = useState<number>(
    initial?.year ?? new Date().getFullYear()
  );
  const [form, setForm] = useState<VuokraKulut>(initial?.data ?? emptyVuokra());
  const [yearError, setYearError] = useState<string | null>(null);

  function update<K extends keyof VuokraKulut>(key: K, value: number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Derived — not stored
  const kokonaisvuokra = Math.round(form.vuokrattu * form.neliövuokra * 12);
  const kayttoaste = form.vuokrattavissa > 0
    ? Math.round((form.vuokrattu / form.vuokrattavissa) * 100)
    : 0;

  function handleSave() {
    if (mode === "add" && existingYears.includes(year)) {
      setYearError(`Vuodelle ${year} on jo tiedot. Valitse toinen vuosi.`);
      return;
    }
    // kokonaisvuokra is always derived — never stored in the data
    onSave(year, form);
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
      <div style={{ ...cardStyle, width: 480, maxHeight: "88vh", overflowY: "auto" }}>
        <h3 style={sectionTitle}>
          {mode === "edit" ? "Muokkaa vuokratietoja" : "Lisää vuokratiedot"}
        </h3>

        {/* Year selector */}
        <div style={{ marginBottom: 16 }}>
          <p style={labelStyle}>Tilikausi (vuosi)</p>
          <input
            type="number"
            value={year}
            disabled={mode === "edit"}
            onChange={(e) => { setYear(Number(e.target.value)); setYearError(null); }}
            style={{ ...inputStyle, width: 110 }}
          />
          {yearError && (
            <div style={{ color: "#d32f2f", fontSize: "0.8rem", marginTop: 2 }}>{yearError}</div>
          )}
        </div>

        {/* Vuokratulot */}
        <div style={dividerStyle}>Vuokratulot</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <p style={labelStyle}>Vuokrattu (m²)</p>
            <input type="number" value={form.vuokrattu || ""} placeholder="0"
              onChange={(e) => update("vuokrattu", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Vuokrattavissa (m²)</p>
            <input type="number" value={form.vuokrattavissa || ""} placeholder="0"
              onChange={(e) => update("vuokrattavissa", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Neliövuokra (€/m²)</p>
            <input type="number" value={form.neliövuokra || ""} placeholder="0"
              onChange={(e) => update("neliövuokra", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Vuokrausaste m² (legacy)</p>
            <input type="number" value={form.vuokrausaste_m2 || ""} placeholder="0"
              onChange={(e) => update("vuokrausaste_m2", Number(e.target.value))} style={inputStyle} />
          </div>
        </div>

        {/* Derived preview */}
        <div style={{
          background: theme.colors.accentLight,
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: "0.85rem",
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>Kokonaisvuokra / v</span>
          <strong>{kokonaisvuokra.toLocaleString("fi-FI")} €</strong>
          <span style={{ marginLeft: 16 }}>Käyttöaste</span>
          <strong>{kayttoaste} %</strong>
        </div>

        {/* Kiinteät kulut */}
        <div style={dividerStyle}>Kiinteät kulut</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <p style={labelStyle}>Ylläpito & korjaukset (€)</p>
            <input type="number" value={form.yllapitoKorjaukset || ""} placeholder="0"
              onChange={(e) => update("yllapitoKorjaukset", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Maavuokra (€)</p>
            <input type="number" value={form.maavuokra || ""} placeholder="0"
              onChange={(e) => update("maavuokra", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Vakuutus (€)</p>
            <input type="number" value={form.vakuutus || ""} placeholder="0"
              onChange={(e) => update("vakuutus", Number(e.target.value))} style={inputStyle} />
          </div>
        </div>

        {/* Perustiedot */}
        <div style={dividerStyle}>Perustiedot</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <p style={labelStyle}>Tasearvo (€)</p>
            <input type="number" value={form.tasearvo || ""} placeholder="0"
              onChange={(e) => update("tasearvo", Number(e.target.value))} style={inputStyle} />
          </div>
        </div>

        {/* Kulutus */}
        <div style={dividerStyle}>Kulutus</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div>
            <p style={labelStyle}>Sähkönkulutus (kWh)</p>
            <input type="number" value={form.sahkonkulutus || ""} placeholder="0"
              onChange={(e) => update("sahkonkulutus", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Lämmitysenergia (kWh)</p>
            <input type="number" value={form.lammitysenergia || ""} placeholder="0"
              onChange={(e) => update("lammitysenergia", Number(e.target.value))} style={inputStyle} />
          </div>
          <div>
            <p style={labelStyle}>Vedenkulutus (m³)</p>
            <input type="number" value={form.vedenkulutus || ""} placeholder="0"
              onChange={(e) => update("vedenkulutus", Number(e.target.value))} style={inputStyle} />
          </div>
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
