import { useState } from "react";
import { cardStyle, sectionTitle } from "../../styles";
import type { Kiinteisto, VuokraKulut } from "../../types";
import { computeFinancials, laskeKuukausitulo } from "../../utils/kiinteistoUtils";
import { theme } from "../../theme";
import InfoRow from "../InfoRow";
import Yllapitokulut from "../Yllapitokulut";
import VuokrakulutModal from "../VuokrakulutModal";

interface Props {
  item: Kiinteisto;
  latestYear: number;
  onUpdate: (item: Kiinteisto) => void;
}

function fmt(value: number) {
  return `${Math.round(value).toLocaleString("fi-FI")} €`;
}

export default function TalousTab({ item, latestYear, onUpdate }: Props) {
  // Year navigation for rental data
  const allVuokraYears = Object.keys(item.vuokrakulut ?? {})
    .map(Number)
    .sort((a, b) => b - a); // newest first

  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  type ViewMode = "year" | "month";
  const [viewMode, setViewMode] = useState<ViewMode>("year");

  const { vuokratulot, kayttoaste, kulutYhteensa, tulos, toimenpiteetYhteensa } =
    computeFinancials(item, selectedYear);

  const vuokra = item.vuokrakulut[selectedYear];

  const [showModal, setShowModal] = useState(false);
  const [editingYear, setEditingYear] = useState<number | null>(null);

  const existingYears = allVuokraYears;

  function handleSave(year: number, data: VuokraKulut) {
    onUpdate({
      ...item,
      vuokrakulut: { ...item.vuokrakulut, [year]: data },
    });
  }

  function handleDelete(year: number) {
    const updated = { ...item.vuokrakulut };
    delete updated[year];
    onUpdate({ ...item, vuokrakulut: updated });
    // If deleted year was selected, fall back to latestYear
    if (selectedYear === year) setSelectedYear(latestYear);
  }

  const tulosColor = tulos >= 0 ? theme.colors.accent : "#d32f2f";

  const vuositulo = vuokratulot;
  const kuukausitulo = laskeKuukausitulo(vuokratulot);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

      {/* Maintenance expenses — add/edit/delete via YllapitoModal */}
      <Yllapitokulut
        title="Ylläpitokulut (€/v)"
        item={item}
      />

      {/* Rental information */}
      <div style={cardStyle}>

        {/* Header with add button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={sectionTitle}>Vuokraustiedot</h3>
          <div>
            <button onClick={() => setViewMode("year")}>Vuosi</button>
            <button onClick={() => setViewMode("month")}>Kuukausi</button>
          </div>
          <button onClick={() => setShowModal(true)}>+ Lisää vuosi</button>
        </div>

        {/* Year tabs — shown if more than one year exists */}
        {allVuokraYears.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {allVuokraYears.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                style={{
                  padding: "3px 12px",
                  borderRadius: 20,
                  border: `1px solid ${selectedYear === y ? theme.colors.accent : theme.colors.border}`,
                  background: selectedYear === y ? theme.colors.accentLight : theme.colors.surface,
                  color: selectedYear === y ? theme.colors.accent : theme.colors.textMuted,
                  fontWeight: selectedYear === y ? 700 : 400,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Edit / delete for selected year */}
        {vuokra && (
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <button onClick={() => setEditingYear(selectedYear)}>✎ Muokkaa</button>
            <button
              onClick={() => handleDelete(selectedYear)}
              style={{ color: "#d32f2f" }}
            >
              ✕ Poista
            </button>
          </div>
        )}

        {vuokra ? (
          <>
            {/* Rental income section */}
            <div style={{
              fontSize: "0.78rem", fontWeight: 700, color: theme.colors.textMuted,
              textTransform: "uppercase", letterSpacing: 1, marginBottom: 4
            }}>
              Vuokratulot
            </div>
            <InfoRow label="Vuokrattavissa" value={`${vuokra.vuokrattavissa ?? "—"} m²`} />
            <InfoRow label="Vuokrattu" value={`${vuokra.vuokrattu ?? vuokra.vuokrausaste_m2} m²`} />
            <InfoRow label="Neliövuokra" value={`${vuokra.neliövuokra} €/m²`} />
            <InfoRow label="Käyttöaste" value={`${kayttoaste} %`} />
            <InfoRow
              label="Vuokratulot"
              value={
                viewMode === "year"
                  ? `${fmt(vuositulo)} / vuosi`
                  : `${fmt(kuukausitulo)} / kk`
              }
            />

            {/* Fixed costs section */}
            <div style={{
              fontSize: "0.78rem", fontWeight: 700, color: theme.colors.textMuted,
              textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 4px"
            }}>
              Kiinteät kulut
            </div>
            <InfoRow label="Ylläpitokorjaukset" value={fmt(vuokra.yllapitoKorjaukset ?? 0)} />
            <InfoRow label="Maavuokra" value={fmt(vuokra.maavuokra ?? 0)} />
            <InfoRow label="Vakuutus" value={fmt(vuokra.vakuutus ?? 0)} />

            {/* Actions cost for this year — read-only, auto-summed */}
            {toimenpiteetYhteensa > 0 && (
              <>
                <div style={{
                  fontSize: "0.78rem", fontWeight: 700, color: theme.colors.textMuted,
                  textTransform: "uppercase", letterSpacing: 1, margin: "12px 0 4px"
                }}>
                  Toimenpiteet
                </div>
                <InfoRow
                  label={`Toimenpiteet ${selectedYear}`}
                  value={fmt(toimenpiteetYhteensa)}
                />
              </>
            )}

            {/* Financial period result */}
            <div style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: `2px solid ${theme.colors.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem" }}>
                <span>Tilikauden tulos</span>
                <span style={{ color: tulosColor }}>
                  {tulos >= 0 ? "+" : ""}{Math.round(tulos).toLocaleString("fi-FI")} €
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: theme.colors.textMuted, marginTop: 4 }}>
                Vuokratulot {fmt(vuokratulot)} − kulut yhteensä {fmt(kulutYhteensa)}
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: theme.colors.textMuted }}>
            Ei vuokratietoja vuodelle {selectedYear}.
          </p>
        )}
      </div>

      {/* Add modal */}
      {showModal && (
        <VuokrakulutModal
          mode="add"
          existingYears={existingYears}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Edit modal */}
      {editingYear != null && (
        <VuokrakulutModal
          mode="edit"
          existingYears={existingYears}
          initial={{ year: editingYear, data: item.vuokrakulut[editingYear] }}
          onSave={handleSave}
          onClose={() => setEditingYear(null)}
        />
      )}
    </div>
  );
}
