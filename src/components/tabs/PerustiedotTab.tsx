import { badgeStyle } from "../../styles";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import DetailCard from "../DetailCard";
import { ErrorBoundary } from "../ErrorBoundary";
import Tooltip from "../Tooltip";

interface Props {
  item: Kiinteisto;
  latestYear: number;
}

export default function PerustiedotTab({ item, latestYear }: Props) {
  const { yllapitoYhteensa, vuokratulot, kayttoaste } = computeFinancials(
    item,
    latestYear,
  );

  return (
    <ErrorBoundary>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", overflow: "visible" }}>
        <DetailCard
          title="Kiinteistön tiedot"
          rows={[
            ["Pinta-ala", item.pinta_ala ?? "Ei tietoa"],
            ["Rakennusvuosi", item.rakennusvuosi ?? "Ei tietoa"],
            ["Käyttötarkoitus", item.kayttotarkoitus ?? "Ei tietoa"],
            ["Suojelukohde", item.suojelukohde ? "Kyllä" : "Ei"],
            ["Hiilijalanjälki", `${(item.hiilijalanjälki ?? 0).toLocaleString("fi-FI")} kg CO₂/v`],

            [
              "Tasearvo",
              <Tooltip
                label={
                  `Tasearvo (${latestYear})\n` +
                  `= vuokrakulut[${latestYear}].tasearvo\n` +
                  `(jos puuttuu → 0)`
                }
              >
                <span>
                  {(item.vuokrakulut?.[latestYear]?.tasearvo ?? 0).toLocaleString("fi-FI")} €
                </span>
              </Tooltip>,
            ],

            [
              "  - Rakennus arvo",
              <span>
                {(item.vuokrakulut?.[latestYear]?.rakennusArvo ?? 0).toLocaleString("fi-FI")} €
              </span>,
            ],

            [
              "  - Maapohja arvo",
              <span>
                {(item.vuokrakulut?.[latestYear]?.maapohjaArvo ?? 0).toLocaleString("fi-FI")} €
              </span>,
            ],

            [
              "  - Liittymisarvo",
              <span>
                {(item.vuokrakulut?.[latestYear]?.liittymisarvo ?? 0).toLocaleString("fi-FI")} €
              </span>,
            ],

            [
              "Ylläpitokulut / v",
              <Tooltip
                label={
                  `Ylläpitokulut (${latestYear})\n` +
                  `= Σ yllapitokulut[${latestYear}][kululaji]\n` +
                  `esim. sahko + lammitys + vesi + huolto + ...`
                }
              >
                <span>{(yllapitoYhteensa ?? 0).toLocaleString("fi-FI")} €</span>
              </Tooltip>,
            ],

            [
              "Vuokratulot / v",
              <Tooltip
                label={
                  `Vuokratulot / v (${latestYear})\n` +
                  `= vuokrausaste_m2 * neliövuokra * 12\n` +
                  `(jos puuttuu → 0)`
                }
              >
                <span>{(vuokratulot ?? 0).toLocaleString("fi-FI")} €</span>
              </Tooltip>,
            ],

            [
              "Käyttöaste (%)",
              <Tooltip
                label={
                  `Käyttöaste (%) (${latestYear})\n` +
                  `= (vuokrausaste_m2 / pinta_ala) * 100\n` +
                  `pyöristetään kokonaisluvuksi`
                }
              >
                <span>{(kayttoaste ?? 0).toLocaleString("fi-FI")} %</span>
              </Tooltip>,
            ],
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
              item.toimenpiteet?.length > 0
                ? item.toimenpiteet.map((t) => t.otsikko).join(", ")
                : "Ei kirjattuja toimenpiteitä",
            ],
          ]}
        />
      </div>
    </ErrorBoundary>
  );
}