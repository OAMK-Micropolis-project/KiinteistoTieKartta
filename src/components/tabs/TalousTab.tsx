import { useMemo, useState } from "react";
import { cardStyle, sectionTitle } from "../../styles";
import { theme } from "../../theme";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import InfoRow from "../InfoRow";
import VuokrakulutModal from "../VuokrakulutModal";
import YllapitokulutModal from "../YllapitokulutModal";
import { ErrorBoundary } from "../ErrorBoundary";
import Tooltip from "../Tooltip";

interface Props {
  item: Kiinteisto;
  latestYear: number;
  onUpdate: (item: Kiinteisto) => void;
}

function fmt(value: number) {
  return `${value.toLocaleString("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function fmtDec(value: number, decimals = 2) {
  return `${value.toFixed(decimals)} €`;
}

// sums only numeric fixed fields, plus sums muutKulut if present
function calcYllapitoTotal(data: Record<string, any>): number {
  const FIXED = ["sahko", "lammitys", "vesi", "huolto", "vero", "laina"];
  const fixed = FIXED.reduce((sum, k) => sum + (Number(data?.[k]) || 0), 0);
  const extra = Object.values(
    (data?.muutKulut as Record<string, number>) ?? {},
  ).reduce((s, v) => s + (Number(v) || 0), 0);
  return Math.round(fixed + extra);
}

function yearsIndex(item: Kiinteisto) {
  return Array.from(
    new Set([
      ...Object.keys(item.yllapitokulut ?? {}),
      ...Object.keys(item.vuokrakulut ?? {}),
    ]),
  )
    .map(Number)
    .sort((a, b) => b - a);
}
// tooltip helper
function TT({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <Tooltip label={<div style={{ whiteSpace: "pre-wrap" }}>{text}</div>}>
      <span>{children}</span>
    </Tooltip>
  );
}

export default function TalousTab({ item, latestYear, onUpdate }: Props) {
  const years = useMemo(() => yearsIndex(item), [item]);

  const [selectedYear, setSelectedYear] = useState<number>(
    years[0] ?? latestYear ?? new Date().getFullYear(),
  );
  const [viewMode, setViewMode] = useState<"year" | "month">("year");

  // modals
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

  const rentedM2 = (vuokra?.vuokrattu ?? vuokra?.vuokrausaste_m2 ?? 0) as number;
  const kokonaisvuokra = (vuokra?.kokonaisvuokra ?? 0) as number;

  const neliovuokra = rentedM2 > 0 ? kokonaisvuokra / vuokra.vuokrattavissa / 12 : 0;

  const kuukausitulo = Math.round(vuokratulot / 12);
  const tulosColor = tulos >= 0 ? theme.colors.accent : "#d32f2f";

  // year pill styles
  function pill(active: boolean): React.CSSProperties {
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
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* YEAR FILTER */}
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            paddingBottom: 12,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={pill(y === selectedYear)}
            >
              {y}
            </button>
          ))}
        </div>

        {/* VIEW MODE */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setViewMode("year")}
            style={pill(viewMode === "year")}
          >
            Vuosi
          </button>
          <button
            onClick={() => setViewMode("month")}
            style={pill(viewMode === "month")}
          >
            Kuukausi
          </button>
        </div>

        {/* CONTENT */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* YLLÄPITO */}
          <div style={{ ...cardStyle, overflow: "visible" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={sectionTitle}>Ylläpitokulut</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    const updated = { ...(item.yllapitokulut ?? {}) };
                    delete updated[selectedYear];
                    onUpdate({ ...item, yllapitokulut: updated });
                    setSelectedYear(years[0] ?? latestYear);
                  }}
                  style={{ color: "#d32f2f" }}
                >
                  ✕ Poista
                </button>

                <button onClick={() => setShowYllapitoModal(true)}>
                  + Lisää vuosi
                </button>
                <button onClick={() => setShowYllapitoModal(true)}>
                  ✎ Muokkaa
                </button>
              </div>
            </div>

            {!yllapito ? (
              <p style={{ color: theme.colors.textMuted }}>
                Ei tietoja vuodelle {selectedYear}.
              </p>
            ) : (
              <>
                {divider("Kiinteät kulut")}
                <InfoRow label="Sähkö" value={fmt(yllapito.sahko ?? 0)} />
                <InfoRow label="Lämmitys" value={fmt(yllapito.lammitys ?? 0)} />
                <InfoRow label="Vesi" value={fmt(yllapito.vesi ?? 0)} />
                <InfoRow label="Huolto" value={fmt(yllapito.huolto ?? 0)} />
                <InfoRow
                  label="Kiinteistövero"
                  value={fmt(yllapito.vero ?? 0)}
                />
                <InfoRow label="Laina" value={fmt(yllapito.laina ?? 0)} />

                {Object.keys(yllapito.muutKulut ?? {}).length > 0 && (
                  <>
                    {divider("Muut kulut")}
                    {Object.entries(yllapito.muutKulut ?? {}).map(
                      ([nimi, summa]) => (
                        <InfoRow
                          key={nimi}
                          label={nimi}
                          value={fmt(Number(summa) || 0)}
                        />
                      ),
                    )}
                  </>
                )}

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
                  <span>
                    <TT
                      text={
                        `Ylläpitokulut yhteensä (${selectedYear})\n` +
                        `= (sahko + lammitys + vesi + huolto + vero + laina)\n` +
                        `+ Σ(muutKulut)\n` +
                        `= calcYllapitoTotal(yllapito)`
                      }
                    >
                      {fmt(calcYllapitoTotal(yllapito))}
                    </TT>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* VUOKRA */}
          <div style={{ ...cardStyle, overflow: "visible" }}>
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
                    const updated = { ...(item.vuokrakulut ?? {}) };
                    delete updated[selectedYear];
                    onUpdate({ ...item, vuokrakulut: updated });
                    setSelectedYear(years[0] ?? latestYear);
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

            {!vuokra ? (
              <p style={{ color: theme.colors.textMuted }}>
                Ei vuokratietoja vuodelle {selectedYear}.
              </p>
            ) : (
              <>
                {divider("Vuokratulot")}
                <InfoRow
                  label="Vuokrattavissa"
                  value={`${vuokra.vuokrattavissa ?? "—"} m²`}
                />
                <InfoRow label="Vuokrattu" value={`${rentedM2} m²`} />

                <InfoRow
                  label={
                    <TT
                      text={
                        `Neliövuokra (€/m²/kk)\n` +
                        `= kokonaisvuokra / vuokrattu / 12\n` +
                        `Jos vuokrattu <= 0 → 0`
                      }
                    >
                      Neliövuokra
                    </TT>
                  }
                  value={
                    <TT
                      text={
                        `Neliövuokra (${selectedYear})\n` +
                        `= ${kokonaisvuokra} / ${vuokra.vuokrattavissa} / 12`
                      }
                    >
                      {`${fmtDec(neliovuokra)} /m²`}
                    </TT>
                  }
                />

                <InfoRow
                  label={
                    <TT
                      text={
                        `Käyttöaste (%)\n` +
                        `= (vuokrattu m² / pinta-ala) * 100`
                      }
                    >
                      Käyttöaste
                    </TT>
                  }
                  value={
                    <TT
                      text={`Käyttöaste (${selectedYear}) = ${kayttoaste} %`}
                    >{`${kayttoaste} %`}</TT>
                  }
                />

                <InfoRow
                  label={
                    <TT
                      text={
                        `Vuokratulot\n` +
                        `= vuokrattu m² * neliövuokra * 12 (vuositaso)\n` +
                        `Kuukausitaso = vuositulot / 12`
                      }
                    >
                      Vuokratulot
                    </TT>
                  }
                  value={
                    <TT
                      text={
                        viewMode === "year"
                          ? `Vuositulot (${selectedYear}) = ${fmt(vuokratulot)}`
                          : `Kuukausitulot (${selectedYear}) = round(${fmt(vuokratulot)} / 12) = ${fmt(kuukausitulo)}`
                      }
                    >
                      {viewMode === "year"
                        ? `${fmt(vuokratulot)} / vuosi`
                        : `${fmt(kuukausitulo)} / kk`}
                    </TT>
                  }
                />

                {toimenpiteetYhteensa > 0 && (
                  <>
                    {divider("Toimenpiteet")}
                    <InfoRow
                      label={
                        <TT
                          text={`Toimenpiteet ${selectedYear}\n= Σ toimenpiteiden kustannukset kyseiseltä vuodelta`}
                        >
                          Toimenpiteet {selectedYear}
                        </TT>
                      }
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
                      <TT
                        text={
                          `Tilikauden tulos (${selectedYear})\n` +
                          `= vuokratulot − kulutYhteensa\n` +
                          `= ${fmt(vuokratulot)} − ${fmt(kulutYhteensa)}\n` +
                          `= ${Math.round(tulos).toLocaleString("fi-FI")} €`
                        }
                      >
                        <>
                          {tulos >= 0 ? "+" : ""}
                          {Math.round(tulos).toLocaleString("fi-FI")} €
                        </>
                      </TT>
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
            existingYears={years}
            existingRentalYears={Object.keys(item.vuokrakulut ?? {}).map(
              Number,
            )}
            allYears={Object.entries(item.vuokrakulut ?? {}).map(
              ([y, data]) => ({
                year: Number(y),
                data,
              }),
            )}
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
            existingYears={years}
            existingRentalYears={Object.keys(item.vuokrakulut ?? {}).map(
              Number,
            )}
            allYears={Object.entries(item.vuokrakulut ?? {}).map(
              ([y, data]) => ({
                year: Number(y),
                data,
              }),
            )}
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
