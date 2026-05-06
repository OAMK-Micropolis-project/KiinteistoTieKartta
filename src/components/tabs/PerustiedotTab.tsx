import { badgeStyle } from "../../styles";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import DetailCard from "../DetailCard";

interface Props {
  item: Kiinteisto;
  latestYear: number;
}

export default function PerustiedotTab({ item, latestYear }: Props) {
  try {
    const { yllapitoYhteensa, vuokratulot, kayttoaste } = computeFinancials(
      item,
      latestYear,
    );

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <DetailCard
          title="Kiinteistön tiedot"
          rows={[
            ["Pinta-ala", item.pinta_ala ?? "Ei tietoa"],
            ["Rakennusvuosi", item.rakennusvuosi ?? "Ei tietoa"],
            ["Käyttötarkoitus", item.kayttotarkoitus ?? "Ei tietoa"],
            ["Suojelukohde", item.suojelukohde ? "Kyllä" : "Ei"],
            ["Tasearvo", item.vuokrakulut[latestYear]?.tasearvo ?? "Ei saatavilla"],
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
              <span style={badgeStyle(item.oma_salkku)}>{item.oma_salkku}</span>,
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
    );
  }
  catch (error) {
    console.error("Error in PerustiedotTab:", error);
    return <div>Virhe tietojen lataamisessa</div>;
  }
}
