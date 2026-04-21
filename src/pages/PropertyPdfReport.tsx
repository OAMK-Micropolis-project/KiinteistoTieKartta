import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useKiinteistot } from "../context/useKiinteistot";
import "./PropertyPdfReport.css";

const costRows = [
  { key: "sahko", label: "Sähkö" },
  { key: "lammitys", label: "Lämmitys" },
  { key: "vesi", label: "Vesi" },
  { key: "huolto", label: "Huolto" },
  { key: "vero", label: "Vero" },
  { key: "laina", label: "Laina" },
  { key: "muut", label: "Muut" },
] as const;

export default function PropertyPdfReport() {
  const { id } = useParams();
  const item = useKiinteistot().getById(Number(id));

  useEffect(() => {
    document.body.classList.add("pdf-report-body");

    return () => {
      document.body.classList.remove("pdf-report-body");
    };
  }, []);

  if (!item) {
    return (
      <main className="pdf-report-page" data-pdf-ready="false">
        <div className="pdf-empty-state">Kiinteistöä ei löytynyt.</div>
      </main>
    );
  }

  const years = Object.keys(item.yllapitokulut ?? {})
    .map(Number)
    .sort((a, b) => a - b);

  const latestYear = years.at(-1) ?? new Date().getFullYear();
  const latestMaintenance = item.yllapitokulut[latestYear];
  const latestRent = item.vuokrakulut[latestYear];

  const maintenanceTotals = years.map((year) => {
    const yearData = item.yllapitokulut[year];
    const total = yearData
      ? Object.values(yearData).reduce((sum, value) => sum + value, 0)
      : 0;

    return { year, total };
  });

  const totalMaintenance = latestMaintenance
    ? Object.values(latestMaintenance).reduce((sum, value) => sum + value, 0)
    : 0;

  const rentTotal =
    latestRent && latestRent.vuokrausaste_m2 && latestRent.neliövuokra
      ? latestRent.vuokrausaste_m2 * latestRent.neliövuokra * 12
      : 0;

  const usageRate =
    latestRent && item.pinta_ala > 0
      ? Math.round((latestRent.vuokrausaste_m2 / item.pinta_ala) * 100)
      : 0;

  return (
    <main className="pdf-report-page" data-pdf-ready="true">
      <header className="pdf-header">
        <div>
          <div className="pdf-kicker">Kiinteistöraportti</div>
          <h1>{item.nimi}</h1>
          <p>{item.osoite}</p>
        </div>

        <div className="pdf-badge">Salkku {item.oma_salkku}</div>
      </header>

      <section className="pdf-summary-grid">
        <article className="pdf-card">
          <h2>Perustiedot</h2>
          <dl className="pdf-definition-list">
            <div>
              <dt>Pinta-ala</dt>
              <dd>{formatNumber(item.pinta_ala)} m²</dd>
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
          </dl>
        </article>

        <article className="pdf-card">
          <h2>Taloustiedot</h2>
          <dl className="pdf-definition-list">
            <div>
              <dt>Vuosi</dt>
              <dd>{latestYear}</dd>
            </div>
            <div>
              <dt>Ylläpitokulut / v</dt>
              <dd>{formatThousands(totalMaintenance)}</dd>
            </div>
            <div>
              <dt>Vuokratulot / v</dt>
              <dd>{formatThousands(rentTotal)}</dd>
            </div>
            <div>
              <dt>Käyttöaste</dt>
              <dd>{usageRate} %</dd>
            </div>
            <div>
              <dt>Tasearvo</dt>
              <dd>{latestRent ? formatThousands(latestRent.tasearvo) : "-"}</dd>
            </div>
            <div>
              <dt>Pisteet</dt>
              <dd>{item.painotetutPisteet.toFixed(1)}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="pdf-maintenance-section">
        <div className="pdf-section-heading">
          <div>
            <h2>Ylläpitokulut</h2>
            <p>Kaikki vuodet rinnakkain, jotta muutokset näkyvät selvästi.</p>
          </div>
        </div>

        <div className="pdf-year-strip">
          {maintenanceTotals.map(({ year, total }, index) => {
            const previous = maintenanceTotals[index - 1]?.total ?? null;
            const delta = previous === null ? null : total - previous;

            return (
              <article key={year} className="pdf-year-card">
                <div className="pdf-year-label">{year}</div>
                <div className="pdf-year-value">{formatThousands(total)}</div>
                <div className="pdf-year-delta">
                  {delta === null ? "-" : formatDelta(delta)}
                </div>
              </article>
            );
          })}
        </div>

        <div className="pdf-table-wrap">
          <table className="pdf-maintenance-table">
            <thead>
              <tr>
                <th>Erä</th>
                {years.map((year) => (
                  <th key={year}>{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {costRows.map(({ key, label }) => (
                <tr key={key}>
                  <th>{label}</th>
                  {years.map((year) => {
                    const value = item.yllapitokulut?.[year]?.[key] ?? 0;
                    return <td key={`${year}-${key}`}>{formatThousands(value)}</td>;
                  })}
                </tr>
              ))}
              <tr className="pdf-total-row">
                <th>Yhteensä</th>
                {years.map((year) => {
                  const total =
                    maintenanceTotals.find((entry) => entry.year === year)?.total ?? 0;
                  return <td key={`total-${year}`}>{formatThousands(total)}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 }).format(value);
}

function formatThousands(value: number) {
  return `${new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 }).format(
    Math.round(value / 1000),
  )} k€`;
}

function formatDelta(value: number) {
  const formatted = `${new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 }).format(
    Math.round(Math.abs(value) / 1000),
  )} k€`;

  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}