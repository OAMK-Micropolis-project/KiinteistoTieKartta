import { useState } from "react";
import { cardStyle, sectionTitle } from "../../styles";
import type { Kiinteisto } from "../../types";
import { computeFinancials } from "../../utils/kiinteistoUtils";
import InfoRow from "../InfoRow";
import VuokrakulutModal from "../VuokrakulutModal";
import Yllapitokulut from "../Yllapitokulut";

interface Props {
  item: Kiinteisto;
  latestYear: number;
  onUpdate: (item: Kiinteisto) => void;
}

export default function TalousTab({ item, latestYear, onUpdate }: Props) {
  const { vuokratulot, kayttoaste } =
    computeFinancials(item, latestYear);

  const vuokra = item.vuokrakulut[latestYear];

  const [showVuokraModal, setShowVuokraModal] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      <Yllapitokulut title="Ylläpitokulut (€/v)" item={item} />

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Vuokraustiedot</h3>

        <button onClick={() => setShowVuokraModal(true)}>
          Lisää / muokkaa vuokratietoja
        </button>


        {showVuokraModal && (
          <VuokrakulutModal
            year={latestYear}
            initial={vuokra}
            onSave={(y, data) => {
              onUpdate({
                ...item,
                vuokrakulut: {
                  ...item.vuokrakulut,
                  [y]: data,
                },
              });
            }}
            onClose={() => setShowVuokraModal(false)}
          />
        )}


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
            <InfoRow
              label="Käyttöaste"
              value={`${kayttoaste} %`}
            />
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
  );
}