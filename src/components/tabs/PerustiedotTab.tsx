import { badgeStyle } from "../../styles";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import DetailCard from "../DetailCard";
import { ErrorBoundary } from "../ErrorBoundary";
import Tooltip from "../Tooltip";
import ValueDisplay from "../ValueDisplay";

interface Props {
  item: Kiinteisto;
  latestYear: number;
}

export default function PerustiedotTab({ item, latestYear }: Props) {
  const { yllapitoYhteensa, vuokratulot, kayttoaste } = computeFinancials(
    item,
    latestYear,
  );

  // // === DETAILED DEBUG LOGGING ===
  // console.group('🔍 PerustiedotTab Detailed Debug');
  // console.log('📦 item.id:', item.id);
  // console.log('📦 latestYear:', latestYear, typeof latestYear);
  // console.log('---');
  // console.log('📊 Vuokrakulut access:');
  // console.log('  item.vuokrakulut:', item.vuokrakulut);
  // console.log('  Object.keys:', Object.keys(item.vuokrakulut || {}));
  // console.log('  item.vuokrakulut[latestYear]:', item.vuokrakulut?.[latestYear]);
  // console.log('  tasearvo:', item.vuokrakulut?.[latestYear]?.tasearvo);
  // console.log('  rakennusArvo:', item.vuokrakulut?.[latestYear]?.rakennusArvo);
  // console.log('---');
  // console.log('📊 Yllapitokulut access:');
  // console.log('  item.yllapitokulut:', item.yllapitokulut);
  // console.log('  Object.keys:', Object.keys(item.yllapitokulut || {}));
  // console.log('  item.yllapitokulut[latestYear]:', item.yllapitokulut?.[latestYear]);
  // console.log('---');
  // console.log('📈 Computed values:');
  // console.log('  yllapitoYhteensa:', yllapitoYhteensa);
  // console.log('  vuokratulot:', vuokratulot);
  // console.log('  kayttoaste:', kayttoaste);
  // console.log('---');
  // console.log('📍 Rent usage calculation:');
  // console.log('  vuokrausaste_m2:', item.vuokrakulut?.[latestYear]?.vuokrausaste_m2);
  // console.log('  neliovuokra:', item.vuokrakulut?.[latestYear]?.neliovuokra);
  // console.log('  pinta_ala:', item.pinta_ala);
  // console.groupEnd();
  // // === END DEBUG ===

  const vuokrattu = item.vuokrakulut?.[latestYear]?.vuokrattu ?? 0;
  const vuokrattavissa = item.vuokrakulut?.[latestYear]?.vuokrattavissa ?? 0;
  const kokonaisvuokra = item.vuokrakulut?.[latestYear]?.kokonaisvuokra ?? 0;

  const neliövuokra = vuokrattavissa > 0 ? kokonaisvuokra / vuokrattavissa : 0;

  return (
    <ErrorBoundary>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          overflow: "visible",
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
              "Hiilijalanjälki",
              `${(item.hiilijalanjalki ?? 0).toLocaleString("fi-FI")} kg CO₂`,
            ],

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
                  {(
                    item.vuokrakulut?.[latestYear]?.tasearvo ?? 0
                  ).toLocaleString("fi-FI")}{" "}
                  €
                </span>
              </Tooltip>,
            ],

            [
              "  - Rakennus arvo",
              <span>
                {(
                  item.vuokrakulut?.[latestYear]?.rakennusArvo ?? 0
                ).toLocaleString("fi-FI")}{" "}
                €
              </span>,
            ],

            [
              "  - Maapohja arvo",
              <span>
                {(
                  item.vuokrakulut?.[latestYear]?.maapohjaArvo ?? 0
                ).toLocaleString("fi-FI")}{" "}
                €
              </span>,
            ],

            [
              "  - Liittymisarvo",
              <span>
                {(
                  item.vuokrakulut?.[latestYear]?.liittymisarvo ?? 0
                ).toLocaleString("fi-FI")}{" "}
                €
              </span>,
            ],

            [
              "Ylläpitokulut / v",
              <ValueDisplay
                value={yllapitoYhteensa ?? 0}
                unit="€"
                tooltip={{
                  label: `Ylläpitokulut (${latestYear})`,
                  formula:
                    "= sähkö + lämmitys + vesi + huolto + vero + laina + ...",
                }}
                breakdown={[
                  {
                    label: "Sähkö",
                    value: item.yllapitokulut?.[latestYear]?.sahko ?? 0,
                  },
                  {
                    label: "Lämmitys",
                    value: item.yllapitokulut?.[latestYear]?.lammitys ?? 0,
                  },
                  {
                    label: "Vesi",
                    value: item.yllapitokulut?.[latestYear]?.vesi ?? 0,
                  },
                  {
                    label: "Huolto",
                    value: item.yllapitokulut?.[latestYear]?.huolto ?? 0,
                  },
                  {
                    label: "Verot",
                    value: item.yllapitokulut?.[latestYear]?.vero ?? 0,
                  },
                  {
                    label: "Lainakulut",
                    value: item.yllapitokulut?.[latestYear]?.laina ?? 0,
                  },
                  {
                    label: "Muut",
                    value: item.yllapitokulut?.[latestYear]?.muut ?? 0,
                  },
                ]}
              />,
            ],

            [
              "Vuokratulot / v",

              <ValueDisplay
                value={vuokratulot ?? 0}
                unit="€"
                tooltip={{
                  label: `Vuokratulot / v (${latestYear})`,
                  formula: "= vuokrattu m² × neliövuokra €/m² × 12 kk",
                }}
                breakdown={[
                  {
                    label: "Vuokrattavissa m²",
                    value: item.vuokrakulut?.[latestYear]?.vuokrattavissa ?? 0,
                    unit: "m²",
                  },
                  {
                    label: "Vuokrattu m²",
                    value: vuokrattu,
                    unit: "m²",
                  },
                  {
                    label: "Neliövuokra",
                    value: Number(neliövuokra.toFixed(2)),
                    unit: "€/m²",
                  },
                ]}
              />,
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
