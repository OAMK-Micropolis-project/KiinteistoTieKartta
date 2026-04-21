import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArviointiParametrit } from "../context/arviointiParametrit";
import { useKiinteistot } from "../context/useKiinteistot";
import {
  backButton,
  badgeStyle,
  cardStyle,
  chartCanvas,
  chartCard,
  flexContainer,
  sectionTitle,
  tableStyle,
  tdStyle,
} from "../styles";
import type { Kiinteisto, Toimenpide } from "../types";
import ToimenpideModal from "../components/ToimenpideModal";

type Tab = "perustiedot" | "kuntoarviointi" | "toimenpiteet" | "talous";

export default function DetailView() {
  // const { id } = useParams();
  // const item = useKiinteistot().getById(Number(id));
  const latestYear = useKiinteistot().getLatestYear();
  const navigate = useNavigate();

  // const { update } = useKiinteistot();
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [openDescIndex, setOpenDescIndex] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("perustiedot");

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [editOtsikko, setEditOtsikko] = useState("");
  const [editKuvaus, setEditKuvaus] = useState("");
  const [editKustannus, setEditKustannus] = useState("");
  const [editSuunniteltuPvm, setEditSuunniteltuPvm] = useState("");
  const [editTehtyPvm, setEditTehtyPvm] = useState("");

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { getById, update } = useKiinteistot();
  const { id } = useParams();

  const item = getById(Number(id));

  // Radar-chartin elinkaaren hallinta
  const radarRef = useRef<Chart | null>(null);

  /* --------------------------------------------------
       Hookit kutsutaan AINA – guardit vasta tämän jälkeen
    -------------------------------------------------- */
  useEffect(() => {
    if (!item) return;
    if (activeTab !== "kuntoarviointi") return;

    const canvas = document.getElementById(
      "radarChart",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    radarRef.current?.destroy();

    radarRef.current = new Chart(canvas, {
      type: "radar",
      data: {
        labels: Object.keys(item.pisteet),
        datasets: [
          {
            data: Object.values(item.pisteet),
            backgroundColor: "rgba(46,104,166,0.25)",
            borderColor: "rgba(46,104,166,0.9)",
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => radarRef.current?.destroy();
  }, [activeTab, item]);

  /* --------------------------------------------------
       Guard render – EI ennen hookeja
    -------------------------------------------------- */
  if (!item) {
    return <p>Kiinteistöä ei löytynyt.</p>;
  }

  /* --------------------------------------------------
       Laskennat types.ts:n mukaan
    -------------------------------------------------- */
  const yllapito = item.yllapitokulut[latestYear];
  const vuokra = item.vuokrakulut[latestYear];

  const yllapitoYhteensa = yllapito
    ? Object.values(yllapito).reduce((sum, val) => sum + val, 0)
    : 0;

  const vuokratulot =
    vuokra && vuokra.vuokrausaste_m2 && vuokra.neliövuokra
      ? vuokra.vuokrausaste_m2 * vuokra.neliövuokra * 12
      : 0;

  const kayttoaste =
    vuokra && item.pinta_ala > 0
      ? Math.round((vuokra.vuokrausaste_m2 / item.pinta_ala) * 100)
      : 0;

  const arviointiRivit = Object.entries(ArviointiParametrit).map(
    ([key, { nimi, paino }]) => {
      const arvo = item.pisteet[key as keyof typeof item.pisteet] ?? 0;
      const painotettu = arvo * paino;
      return {
        key,
        label: nimi,
        arvo,
        paino,
        painotettu,
      };
    },
  );

  const arviointiYhteensa = arviointiRivit.reduce(
    (sum, r) => sum + r.painotettu,
    0,
  );

  function sortByPlannedDate(a: Toimenpide, b: Toimenpide) {
    if (!a.suunniteltuPvm) return 1;
    if (!b.suunniteltuPvm) return -1;
    return a.suunniteltuPvm.localeCompare(b.suunniteltuPvm);
  }

  function isOverdue(t: Toimenpide): boolean {
    if (!t.suunniteltuPvm) return false;
    if (t.tehtyPvm) return false;

    const today = new Date().toISOString().slice(0, 10);
    return t.suunniteltuPvm < today;
  }

  function startEdit(t: Toimenpide, index: number) {
    setEditIndex(index);
    setEditOtsikko(t.otsikko);
    setEditKuvaus(t.kuvaus ?? "");
    setEditKustannus(String(t.kustannukset));
    setEditSuunniteltuPvm(t.suunniteltuPvm ?? "");
    setEditTehtyPvm(t.tehtyPvm ?? "");
  }

  function saveEdit() {
    if (!item || editIndex === null) return;

    const updated = item.toimenpiteet.map((t, i) =>
      i === editIndex
        ? {
            ...t,
            otsikko: editOtsikko,
            kuvaus: editKuvaus || undefined,
            kustannukset: Number(editKustannus) || 0,
            suunniteltuPvm: editSuunniteltuPvm || undefined,
            tehtyPvm: editTehtyPvm || undefined,
          }
        : t,
    );

    update({
      ...item,
      toimenpiteet: updated,
    });

    setEditIndex(null);
  }

  function deleteToimenpide(index: number) {
    if (!item) return;

    const updated = item.toimenpiteet.filter((_, i) => i !== index);

    update({
      ...item,
      toimenpiteet: updated,
    });
  }

  return (
    <div style={flexContainer}>
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

        <button
          style={backButton}
          onClick={() => navigate(`/add?id=${item.id}`)}
        >
          ✎ Muokkaa
        </button>
      </div>
      {/* ================= HEADER ================= */}
      <div>
        <h1>{item.nimi}</h1>
        <p>{item.osoite}</p>

        <span style={badgeStyle(item.oma_salkku as "A" | "B" | "C" | "D")}>
          Salkku {item.oma_salkku}
        </span>
      </div>

      {/* ================= TABIT ================= */}
      <div style={{ display: "flex", gap: "16px" }}>
        {(
          ["perustiedot", "kuntoarviointi", "toimenpiteet", "talous"] as Tab[]
        ).map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              cursor: "pointer",
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? "2px solid #2e68a6" : "none",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* ================= PERUSTIEDOT ================= */}
      {activeTab === "perustiedot" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <DetailCard
            title="Kiinteistön tiedot"
            rows={[
              ["Pinta-ala", item.pinta_ala ?? "Ei tietoa"],
              ["Rakennusvuosi", item.rakennusvuosi ?? "Ei tietoa"],
              ["Käyttötarkoitus", item.kayttotarkoitus ?? "Ei tietoa"],
              ["Suojelukohde", item.suojelukohde ? "Kyllä" : "Ei"],
              [
                "Tasearvo",
                item.vuokrakulut[latestYear]?.tasearvo ?? "Ei saatavilla",
              ],
              ["Ylläpitokulut / v", yllapitoYhteensa ?? "Ei saatavilla"],
              ["Vuokratulot / v", vuokratulot ?? "Ei saatavilla"],
              ["Käyttöaste (%)", kayttoaste ?? "Ei tietoa"],
            ]}
          />

          <DetailCard
            title="Salkutus"
            rows={[
              [
                "Salkku",
                <span style={badgeStyle(item.oma_salkku)}>
                  {item.oma_salkku}
                </span>,
              ],
              ["Pisteet", item.painotetutPisteet.toFixed(1)],
              ["A > 225  •  B > 175  •  C > 125  •  D < 125", ""],
              [
                "Toimenpiteet",
                item.toimenpiteet && item.toimenpiteet.length > 0
                  ? item.toimenpiteet.map((t) => t.otsikko).join(", ")
                  : "Ei kirjattuja toimenpiteitä",
              ],
            ]}
          />
        </div>
      )}

      {/* ================= KUNTOARVIOINTI ================= */}
      {activeTab === "kuntoarviointi" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "20px",
          }}
        >
          {/* ================= ARVIOINTIPISTEET ================= */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Arviointipisteet (painotettu)</h3>

            {arviointiRivit.map((r) => {
              const prosentti = Math.min((r.arvo / 5) * 100, 100);

              return (
                <div key={r.key} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                      marginBottom: "4px",
                    }}
                  >
                    <span>{r.label}</span>
                    <span>
                      {r.arvo}/5 × {r.paino} = {r.painotettu.toFixed(1)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: "6px",
                      background: "#e0e0e0",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${prosentti}%`,
                        background: "#2d5a27",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                  <hr style={{ margin: "12px 0" }} />
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
              }}
            >
              <span>Yhteensä</span>
              <span>{arviointiYhteensa.toFixed(1)} pistettä</span>
            </div>
          </div>

          {/* ================= RADAR ================= */}
          <div style={chartCard}>
            <h3 style={sectionTitle}>Pisteprofiili</h3>
            <canvas id="radarChart" style={chartCanvas} />
          </div>
        </div>
      )}
      {/* ================= TOIMENPITEET ================= */}
      {activeTab === "toimenpiteet" && (
        <>
          {/* ===== LISÄÄ TOIMENPIDE ===== */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Toimenpiteet</h3>

            <button
              onClick={() => {
                setModalKey((k) => k + 1);
                setShowModal(true);
              }}
            >
              Lisää toimenpide
            </button>
          </div>

          {/* ===== MODAL ===== */}

          {showModal && (
            <ToimenpideModal
              key={modalKey}
              onClose={() => setShowModal(false)}
              onSave={(t) => {
                if (!item) return;

                update({
                  ...item,
                  toimenpiteet: [...item.toimenpiteet, t],
                });

                setShowModal(false);

                setSaveMessage("Toimenpide tallennettu");
                setTimeout(() => setSaveMessage(null), 2000);
              }}
            />
          )}

          {/* ===== LISTA ===== */}
          <div style={cardStyle}>
            {item.toimenpiteet.length === 0 && (
              <p>Ei kirjattuja toimenpiteitä.</p>
            )}

            {saveMessage && (
              <div style={{ color: "green", marginBottom: 12 }}>
                ✅ {saveMessage}
              </div>
            )}

            {[...item.toimenpiteet].sort(sortByPlannedDate).map((t, index) => {
              const overdue = isOverdue(t);
              const isOpen = openDescIndex === index;

              return (
                <div
                  key={index}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    border: "1px solid #ddd",
                    borderLeft: overdue
                      ? "6px solid #d32f2f"
                      : "6px solid transparent",
                    background: overdue ? "#fff5f5" : "transparent",
                  }}
                >
                  {editIndex === index ? (
                    <>
                      <input
                        value={editOtsikko}
                        onChange={(e) => setEditOtsikko(e.target.value)}
                      />
                      <textarea
                        value={editKuvaus}
                        onChange={(e) => setEditKuvaus(e.target.value)}
                      />
                      <input
                        type="number"
                        value={editKustannus}
                        onChange={(e) => setEditKustannus(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editSuunniteltuPvm}
                        onChange={(e) => setEditSuunniteltuPvm(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editTehtyPvm}
                        onChange={(e) => setEditTehtyPvm(e.target.value)}
                      />

                      <button onClick={saveEdit}>Tallenna</button>
                      <button onClick={() => setEditIndex(null)}>
                        Peruuta
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>{t.otsikko}</strong>

                      {t.kuvaus && (
                        <button
                          onClick={() =>
                            setOpenDescIndex(isOpen ? null : index)
                          }
                        >
                          {isOpen ? "Piilota kuvaus" : "Näytä kuvaus"}
                        </button>
                      )}

                      <div>Kustannus: {t.kustannukset} €</div>
                      {t.suunniteltuPvm && (
                        <div>Suunniteltu: {t.suunniteltuPvm}</div>
                      )}
                      {t.tehtyPvm && <div>✅ Tehty: {t.tehtyPvm}</div>}
                      {overdue && (
                        <div style={{ color: "#d32f2f" }}>⚠ Myöhässä</div>
                      )}

                      {isOpen && t.kuvaus && <div>{t.kuvaus}</div>}

                      <button onClick={() => startEdit(t, index)}>
                        Muokkaa
                      </button>

                      <button onClick={() => deleteToimenpide(index)}>
                        Poista
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ================= TALOUS ================= */}
      {activeTab === "talous" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* ========= YLLÄPITOKULUT ========= */}

          <Yllapitokulut title="Ylläpitokulut (€/v)" item={item} />

          {/* ========= VUOKRAUSTIEDOT ========= */}
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Vuokraustiedot</h3>

            {vuokra ? (
              <>
                <InfoRow
                  label="Vuokralla olevat m²"
                  value={`${vuokra.vuokrausaste_m2} m²`}
                />
                <InfoRow
                  label="Neliövuokra"
                  value={`${vuokra.neliövuokra} €/m²`}
                />
                <InfoRow label="Käyttöaste" value={`${kayttoaste} %`} />
                <InfoRow
                  label="Vuokratulot / v"
                  value={`${Math.round(vuokratulot / 1000)} k€`}
                />
              </>
            ) : (
              <p>Ei vuokratietoja.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* =========================================================
   YLEINEN DETAIL CARD – KÄYTETÄÄN SEKÄ PERUSTIEDOT-OSIOSSA ETTÄ YLLÄPITOKULUT-TAULUKOSSA
   ========================================================= */
function DetailCard({
  title,
  rows,
}: {
  title: string;
  rows: [string, React.ReactNode][];
}) {
  return (
    <div style={cardStyle}>
      <h3 style={sectionTitle}>{title}</h3>
      <table style={tableStyle}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={tdStyle}>{label}</td>
              <td style={tdStyle}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Yllapitokulut({ title, item }: { title: string; item: Kiinteisto }) {
  const [yearOffset, setYearOffset] = useState(0);

  /* --- Kaikki vuodet datasta --- */
  const allYears = Object.keys(item.yllapitokulut ?? {})
    .map(Number)
    .sort((a, b) => a - b);

  if (allYears.length === 0) {
    return (
      <div style={chartCard}>
        <div style={sectionTitle}>{title}</div>
        <p>Ei kustannustietoja saatavilla.</p>
      </div>
    );
  }

  /* --- Nykyinen vuosi = uusin --- */
  const currentYear = allYears[allYears.length - 1];

  /* --- Historia = kaikki muut --- */
  const historyYears = allYears
    .filter((y) => y !== currentYear)
    .sort((a, b) => b - a); // Uusin ensin

  /* --- Näytetään 2 historiavuotta kerrallaan --- */
  const historySlice = historyYears.slice(yearOffset, yearOffset + 2);

  const displayYears = [currentYear, ...historySlice];

  const canGoBack = yearOffset > 0;
  const canGoForward = yearOffset + 2 < historyYears.length;

  /* --- Kululajit --- */
  const costKeys =
    Object.values(item.yllapitokulut ?? {}).length > 0
      ? [
          ...new Set(
            Object.values(item.yllapitokulut).flatMap((yearData) =>
              Object.keys(yearData),
            ),
          ),
        ]
      : [];

  return (
    <div style={chartCard}>
      <div style={sectionTitle}>{title}</div>

      {/* Navigointi koskee vain historiaa */}
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setYearOffset(Math.max(0, yearOffset - 1))}
          disabled={!canGoBack}
        >
          ← Uudemmat
        </button>

        <span style={{ fontSize: "12px", color: "#666" }}>
          Nykyinen: {currentYear} · Historia: {historySlice[0] ?? "-"} –{" "}
          {historySlice[historySlice.length - 1] ?? "-"}
        </span>

        <button
          onClick={() => setYearOffset(yearOffset + 1)}
          disabled={!canGoForward}
        >
          Vanhemmat →
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th></th>
            {displayYears.map((year) => (
              <th
                key={year}
                style={{
                  ...tdStyle,
                  fontWeight: year === currentYear ? 700 : 400,
                }}
              >
                {year}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {costKeys.map((costKey) => (
            <tr key={costKey}>
              <td
                style={{
                  ...tdStyle,
                  fontWeight: 600,
                }}
              >
                {costKey}
              </td>

              {displayYears.map((year) => {
                const value =
                  item.yllapitokulut?.[year]?.[
                    costKey as keyof (typeof item.yllapitokulut)[number]
                  ] ?? 0;

                return (
                  <td
                    key={year}
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: year === currentYear ? 700 : 400,
                    }}
                  >
                    {value ? `${Math.round(value / 1000)} k€` : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
