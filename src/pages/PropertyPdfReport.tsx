import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import {
  computeArviointiRivit,
  computeFinancials,
  sortByPlannedDate,
} from "../utils/kiinteistoUtils";
import "./PropertyPdfReport.css";
import { backButton, badgeStyle } from "../styles";

const MAINTENANCE_ROWS = [
  { key: "sahko", label: "Sähkö" },
  { key: "lammitys", label: "Lämmitys" },
  { key: "vesi", label: "Vesi" },
  { key: "huolto", label: "Huolto" },
  { key: "vero", label: "Vero" },
  { key: "laina", label: "Laina" },
  { key: "muut", label: "Muut" },
] as const;

const YEARS_PER_TABLE = 4;

export default function PropertyPdfReport() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getById } = useKiinteistot();
  const [isExporting, setIsExporting] = useState(false);

  const item = getById(Number(id));
  const isPrintMode = searchParams.get("print") === "1";

  useEffect(() => {
    document.documentElement.classList.add("pdf-report-root");
    document.body.classList.add("pdf-report-body");

    return () => {
      document.documentElement.classList.remove("pdf-report-root");
      document.body.classList.remove("pdf-report-body");
    };
  }, []);

  const years = useMemo(() => {
    if (!item) {
      return [];
    }

    return [
      ...new Set([
        ...Object.keys(item.yllapitokulut ?? {}).map(Number),
        ...Object.keys(item.vuokrakulut ?? {}).map(Number),
      ]),
    ].sort((a, b) => a - b);
  }, [item]);

  const latestYear = years.at(-1) ?? new Date().getFullYear();
  const latestVuokra = item?.vuokrakulut[latestYear];
  const arviointiRivit = item ? computeArviointiRivit(item) : [];
  const financials = item ? computeFinancials(item, latestYear) : null;
  const hasElectronPdf = Boolean(window.electronPdf);
  const maintenanceYearGroups: number[][] = [];

  for (let index = 0; index < years.length; index += YEARS_PER_TABLE) {
    maintenanceYearGroups.push(years.slice(index, index + YEARS_PER_TABLE));
  }

  async function handleExportPdf() {
    if (!item || !window.electronPdf) {
      return;
    }

    setIsExporting(true);

    try {
      const baseUrl = window.location.href.split("#")[0];
      const route = `${baseUrl}#/detail/${item.id}/pdf?print=1`;
      const outputPath = await window.electronPdf.chooseSavePdfPath(
        `kiinteisto-${item.nimi}-${item.id}`,
      );

      if (!outputPath) {
        return;
      }

      await window.electronPdf.exportKiinteistoPdf(route, outputPath);
    } catch (error) {
      console.error("PDF:n vienti epäonnistui:", error);
    } finally {
      setIsExporting(false);
    }
  }

  if (!item) {
    return (
      <main className="pdf-report-page" data-pdf-ready="false">
        <div className="pdf-empty-state">Kiinteistöä ei löytynyt.</div>
      </main>
    );
  }

  return (
    <main className="pdf-report-page" data-pdf-ready="true">
      {!isPrintMode && (
        <div className="pdf-preview-toolbar">
          <button
            style={backButton}
            type="button"
            onClick={() => navigate(`/detail/${item.id}`)}
          >
            ← Takaisin
          </button>
          <button
            style={backButton}
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting || !hasElectronPdf}
          >
            {isExporting ? "Viedään PDF..." : "Tallenna PDF"}
          </button>
        </div>
      )}

      {!isPrintMode && !hasElectronPdf && (
        <div className="pdf-runtime-warning">
          PDF-vienti ei ole käytettävissä. Electron preload ei ole rekisteröinyt
          `window.electronPdf`-rajapintaa.
        </div>
      )}

      <section className="pdf-paper">
        <header className="pdf-header">
          <div>
            <h1>{item.nimi}</h1>
            <p>{item.osoite}</p>
          </div>

          {/* <div className="pdf-badge">Salkku {item.oma_salkku}</div> */}
          <div style={badgeStyle(item.oma_salkku as "A" | "B" | "C" | "D")}>
            Salkku {item.oma_salkku}
          </div>
        </header>

        <section className="pdf-summary-grid">
          <article className="pdf-card">
            <h3>Perustiedot</h3>
            <dl className="pdf-definition-list">
              <div>
                <dt>Pinta-ala</dt>
                <dd>{item.pinta_ala ? item.pinta_ala + " m²" : "-"}</dd>
              </div>
              <div>
                <dt>Rakennusvuosi</dt>
                <dd>{item.rakennusvuosi || "-"}</dd>
              </div>
              <div>
                <dt>Käyttötarkoitus</dt>
                <dd>{item.kayttotarkoitus || "-"}</dd>
              </div>
              <div>
                <dt>Suojelukohde</dt>
                <dd>{item.suojelukohde ? "Kyllä" : "Ei"}</dd>
              </div>
              <div>
                <dt>Tarkasteluvuosi</dt>
                <dd>{latestYear}</dd>
              </div>
              <div>
                <dt>Pisteet</dt>
                <dd>{item.painotetutPisteet.toFixed(1)}</dd>
              </div>
            </dl>
          </article>

          <article className="pdf-card">
            <h3>Talouden yhteenveto</h3>
            <dl className="pdf-definition-list">
              <div>
                <dt>Tasearvo</dt>
                <dd>
                  {latestVuokra?.tasearvo
                    ? formatNumber(latestVuokra.tasearvo) + " €"
                    : "-"}
                </dd>
              </div>
              <div>
                <dt>Ylläpitokulut / v</dt>
                <dd>
                  {financials?.yllapitoYhteensa
                    ? formatNumber(financials.yllapitoYhteensa) + " €"
                    : "-"}
                </dd>
              </div>
              <div>
                <dt>Vuokralla olevat m²</dt>
                <dd>
                  {latestVuokra?.vuokrausaste_m2
                    ? latestVuokra.vuokrausaste_m2 + " m²"
                    : "-"}
                </dd>
              </div>
              <div>
                <dt>Neliövuokra</dt>
                <dd>
                  {latestVuokra?.neliovuokra
                    ? latestVuokra.neliovuokra + " €/m²"
                    : "-"}
                </dd>
              </div>
              <div>
                <dt>Vuokratulot / v</dt>
                <dd>
                  {financials?.vuokratulot
                    ? formatNumber(financials.vuokratulot) + " €"
                    : "-"}
                </dd>
              </div>
              <div>
                <dt>Käyttöaste</dt>
                <dd>
                  {financials?.kayttoaste !== undefined
                    ? financials.kayttoaste + " %"
                    : "-"}
                </dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="pdf-card">
          <div className="pdf-section-heading">
            <div>
              <h3>Kuntoarviointi</h3>
              <p>Kaikki pisteet taulukkona ilman kaaviota.</p>
            </div>
          </div>

          <table className="pdf-data-table">
            <thead>
              <tr>
                <th>Kriteeri</th>
                <th>Arvo</th>
                <th>Paino</th>
                <th>Painotettu</th>
              </tr>
            </thead>
            <tbody>
              {arviointiRivit.map((row) => (
                <tr key={row.key}>
                  <th>{row.label}</th>
                  <td>{row.arvo.toFixed(1)}</td>
                  <td>{formatDecimal(row.paino)}</td>
                  <td>{formatDecimal(row.painotettu)}</td>
                </tr>
              ))}
              <tr className="pdf-total-row">
                <th>Yhteensä</th>
                <td colSpan={2} />
                <td>{item.painotetutPisteet.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {item.toimenpiteet.length > 0 && (
          <section className="pdf-card">
            <div className="pdf-section-heading">
              <div>
                <h3>Toimenpiteet</h3>
                <p>Kustannukset ja päivämäärät ilman muokkaustoimintoja.</p>
              </div>
            </div>

            <table className="pdf-data-table">
              <thead>
                <tr>
                  <th>Toimenpide</th>
                  <th>Kustannus</th>
                  <th>Suunniteltu</th>
                  <th>Tehty</th>
                </tr>
              </thead>
              <tbody>
                {[...item.toimenpiteet].sort(sortByPlannedDate).map((step) => (
                  <tr key={step.id}>
                    <th>{step.otsikko}</th>
                    <td>
                      {step.kustannukset
                        ? formatNumber(step.kustannukset) + " €"
                        : "-"}
                    </td>
                    <td>{step.suunniteltuPvm || "-"}</td>
                    <td>{step.tehtyPvm || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {maintenanceYearGroups.length === 0 ? (
          <section className="pdf-card">
            <div className="pdf-section-heading">
              <div>
                <h3>Ylläpitokulut</h3>
              </div>
            </div>
            <div className="pdf-empty-state">
              Ei kustannustietoja saatavilla.
            </div>
          </section>
        ) : (
          maintenanceYearGroups.map((group, index) => (
            <section className="pdf-card">
              <div className="pdf-section-heading">
                <div>
                  <h3>
                    {index === 0 ? "Ylläpitokulut" : "Ylläpitokulut (jatkuu)"}
                  </h3>
                  <p>
                    Vuodet {group[0]}-{group[group.length - 1]}
                  </p>
                </div>
              </div>

              <table className="pdf-data-table">
                <thead>
                  <tr>
                    <th>Erä</th>
                    {group.map((year) => (
                      <th key={year}>{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MAINTENANCE_ROWS.map(({ key, label }) => (
                    <tr key={key}>
                      <th>{label}</th>
                      {group.map((year) => (
                        <td key={`${year}-${key}`}>
                          {item.yllapitokulut?.[year]?.[key] !== undefined
                            ? formatNumber(item.yllapitokulut[year][key]) + " €"
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="pdf-total-row">
                    <th>Yhteensä</th>
                    {group.map((year) => (
                      <td key={`total-${year}`}>
                        {item.yllapitokulut?.[year] !== undefined
                          ? formatNumber(
                              Object.values(item.yllapitokulut[year]).reduce(
                                (sum, value) => sum + value,
                                0,
                              ),
                            ) + " €"
                          : "-"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>
          ))
        )}
      </section>
    </main>
  );
}

function formatNumber(value?: number) {
  if (value === undefined || value === null) {
    return "-";
  }

  return new Intl.NumberFormat("fi-FI", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

function formatDecimal(value?: number) {
  if (value === undefined || value === null) {
    return "-";
  }

  return new Intl.NumberFormat("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}
