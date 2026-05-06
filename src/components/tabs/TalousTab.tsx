import { useState } from "react";
import { cardStyle, sectionTitle } from "../../styles";
import { theme } from "../../theme";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import InfoRow from "../InfoRow";
import VuokrakulutModal from "../VuokrakulutModal";
import YllapitokulutModal from "../YllapitokulutModal";
import { ErrorBoundary } from "../ErrorBoundary";

interface Props {
  item: Kiinteisto;
  latestYear: number;
  onUpdate: (item: Kiinteisto) => void;
}

function fmt(value: number) {
  return `${value.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function fmtDec(value: number, decimals = 2) {
  return `${value.toFixed(decimals)} €`;
}

// Correctly sums only numeric fixed fields, excluding the muutKulut object
function calcYllapitoTotal(
  data: ReturnType<typeof Object.values>[0] & Record<string, unknown>,
): number {
  const FIXED = ["sahko", "lammitys", "vesi", "huolto", "vero", "laina"];
  const fixed = FIXED.reduce((sum, k) => sum + (Number(data[k]) || 0), 0);
  const extra = Object.values(
    (data.muutKulut as Record<string, number>) ?? {},
  ).reduce((s, v) => s + v, 0);
  return Math.round(fixed + extra);
}

function yearsIndex(item: Kiinteisto) {
  return [
    ...new Set([
      ...Object.keys(item.yllapitokulut ?? {}),
      ...Object.keys(item.vuokrakulut ?? {}),
    ]),
  ]
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      yllapito: item.yllapitokulut?.[year] ?? null,
      vuokra: item.vuokrakulut?.[year] ?? null,
    }));
}

export default function TalousTab({ item, latestYear, onUpdate }: Props) {
  const years = yearsIndex(item);

  const [selectedYear, setSelectedYear] = useState<number>(latestYear);
  const [viewMode, setViewMode] = useState<"year" | "month">("year");

  // Modals
  const [showYllapitoModal, setShowYllapitoModal] = useState(false);
  const [showVuokraAddModal, setShowVuokraAddModal] = useState(false);
  const [editingVuokraYear, setEditingVuokraYear] = useState<number | null>(
    null,
  );

  const {
    vuokratulot,
    kayttoaste,
    kulutYhteensa,
    tulos,
    toimenpiteetYhteensa,
  } = computeFinancials(item, selectedYear);

  const yllapito = item.yllapitokulut?.[selectedYear];
  const vuokra = item.vuokrakulut?.[selectedYear];

  const neliövuokra =
    vuokra?.vuokrattavissa && vuokra.vuokrattavissa > 0
      ? vuokra.kokonaisvuokra / vuokra.vuokrattavissa
      : 0;

  const kuukausitulo = Math.round(vuokratulot / 12);
  const tulosColor = tulos >= 0 ? theme.colors.accent : "#d32f2f";

  // Year pill button style
  function yearBtn(y: number): React.CSSProperties {
    const active = y === selectedYear;
    return {
      padding: "3px 12px",
      borderRadius: 20,
      cursor: "pointer",
      fontSize: "0.85rem",
      border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
      background: active ? theme.colors.accentLight : theme.colors.surface,
      color: active ? theme.colors.accent : theme.colors.textMuted,
      fontWeight: active ? 700 : 400,
    };
  }

  function viewBtn(mode: "year" | "month"): React.CSSProperties {
    const active = viewMode === mode;
    return {
      padding: "3px 12px",
      borderRadius: 20,
      cursor: "pointer",
      fontSize: "0.85rem",
      border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
      background: active ? theme.colors.accentLight : theme.colors.surface,
      color: active ? theme.colors.accent : theme.colors.textMuted,
      fontWeight: active ? 700 : 400,
    };
  }

  const divider = (label: string) => (
    <div
      style={{
        fontSize: "0.78rem",
        fontWeight: 700,
        color: theme.colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: 1,
        margin: "12px 0 4px",
        paddingBottom: 4,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      {label}
    </div>
  );

  return (
    <ErrorBoundary>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* ── YEAR FILTER ───────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            paddingBottom: 12,
            borderBottom: `1px solid ${theme.colors.border}`,
            marginBottom: 4,
          }}
        >
          {years.map(({ year }) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              style={yearBtn(year)}
            >
              {year}
            </button>
          ))}
        </div>

        {/* ── VIEW MODE FILTER ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            paddingBottom: 12,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <button style={viewBtn("year")} onClick={() => setViewMode("year")}>
            Vuosi
          </button>
          <button style={viewBtn("month")} onClick={() => setViewMode("month")}>
            Kuukausi
          </button>
        </div>

        {/* ── CONTENT CARDS ─────────────────────────────────────────── */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
        >
          {/* ── MAINTENANCE EXPENSES ─────────────────────────────────── */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={sectionTitle}>Ylläpitokulut</h3>
              <button onClick={() => setShowYllapitoModal(true)}>✎ Muokkaa</button>
            </div>

            {!yllapito ? (
              <p style={{ color: theme.colors.textMuted }}>
                Ei tietoja vuodelle {selectedYear}.
              </p>
            ) : (
              <>
                {divider("Kiinteät kulut")}
                <InfoRow label="Sähkö" value={fmt(yllapito.sahko)} />
                <InfoRow label="Lämmitys" value={fmt(yllapito.lammitys)} />
                <InfoRow label="Vesi" value={fmt(yllapito.vesi)} />
                <InfoRow label="Huolto" value={fmt(yllapito.huolto)} />
                <InfoRow label="Kiinteistövero" value={fmt(yllapito.vero)} />
                <InfoRow label="Laina" value={fmt(yllapito.laina)} />

                {/* User-defined extra rows */}
                {Object.keys(yllapito.muutKulut ?? {}).length > 0 && (
                  <>
                    {divider("Muut kulut")}
                    {Object.entries(yllapito.muutKulut ?? {}).map(
                      ([nimi, summa]) => (
                        <InfoRow key={nimi} label={nimi} value={fmt(summa)} />
                      ),
                    )}
                  </>
                )}

                {/* Total */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: `2px solid ${theme.colors.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <span>Yhteensä</span>
                  <span>{fmt(calcYllapitoTotal(yllapito))}</span>
                </div>
              </>
            )}
          </div>

          {/* ── RENTAL INFORMATION ───────────────────────────────────── */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={sectionTitle}>Vuokraustiedot</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setEditingVuokraYear(selectedYear)}>
                  ✎ Muokkaa
                </button>
                <button
                  onClick={() => {
                    const updated = { ...item.vuokrakulut };
                    delete updated[selectedYear];
                    onUpdate({ ...item, vuokrakulut: updated });
                    setSelectedYear(latestYear);
                  }}
                  style={{ color: "#d32f2f" }}
                >
                  ✕ Poista
                </button>
                <button onClick={() => setShowVuokraAddModal(true)}>
                  + Lisää vuosi
                </button>
              </div>
            </div>

            {vuokra ? (
              <>
                {divider("Vuokratulot")}
                <InfoRow
                  label="Vuokrattavissa"
                  value={`${vuokra.vuokrattavissa ?? "—"} m²`}
                />
                <InfoRow
                  label="Vuokrattu"
                  value={`${vuokra.vuokrattu ?? vuokra.vuokrausaste_m2} m²`}
                />
                <InfoRow label="Neliövuokra" value={`${fmtDec(neliövuokra)} /m²`} />
                <InfoRow label="Käyttöaste" value={`${kayttoaste} %`} />
                <InfoRow
                  label="Vuokratulot"
                  value={
                    viewMode === "year"
                      ? `${fmt(vuokratulot)} / vuosi`
                      : `${fmt(kuukausitulo)} / kk`
                  }
                />

                {divider("Kiinteät kulut")}
                <InfoRow
                  label="Ylläpitokorjaukset"
                  value={fmt(vuokra.yllapitoKorjaukset ?? 0)}
                />
                <InfoRow label="Maavuokra" value={fmt(vuokra.maavuokra ?? 0)} />
                <InfoRow label="Vakuutus" value={fmt(vuokra.vakuutus ?? 0)} />

                {toimenpiteetYhteensa > 0 && (
                  <>
                    {divider("Toimenpiteet")}
                    <InfoRow
                      label={`Toimenpiteet ${selectedYear}`}
                      value={fmt(toimenpiteetYhteensa)}
                    />
                  </>
                )}

                {/* Financial period result */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: `2px solid ${theme.colors.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    <span>Tilikauden tulos</span>
                    <span style={{ color: tulosColor }}>
                      {tulos >= 0 ? "+" : ""}
                      {Math.round(tulos).toLocaleString("fi-FI")} €
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: theme.colors.textMuted,
                      marginTop: 4,
                    }}
                  >
                    Vuokratulot {fmt(vuokratulot)} − kulut {fmt(kulutYhteensa)}
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: theme.colors.textMuted }}>
                Ei vuokratietoja vuodelle {selectedYear}.
              </p>
            )}
          </div>
        </div>

        {/* ── MODALS ───────────────────────────────────────────────── */}
        <YllapitokulutModal
          open={showYllapitoModal}
          item={item}
          year={selectedYear}
          onClose={() => setShowYllapitoModal(false)}
          onSave={(year, data) =>
            onUpdate({
              ...item,
              yllapitokulut: { ...item.yllapitokulut, [year]: data },
            })
          }
        />

        {showVuokraAddModal && (
          <VuokrakulutModal
            mode="add"
            existingYears={years.map((y) => y.year)}
            onSave={(year, data) =>
              onUpdate({
                ...item,
                vuokrakulut: { ...item.vuokrakulut, [year]: data },
              })
            }
            onClose={() => setShowVuokraAddModal(false)}
          />
        )}

        {editingVuokraYear != null && (
          <VuokrakulutModal
            mode="edit"
            existingYears={years.map((y) => y.year)}
            initial={{
              year: editingVuokraYear,
              data: item.vuokrakulut[editingVuokraYear],
            }}
            onSave={(year, data) =>
              onUpdate({
                ...item,
                vuokrakulut: { ...item.vuokrakulut, [year]: data },
              })
            }
            onClose={() => setEditingVuokraYear(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
