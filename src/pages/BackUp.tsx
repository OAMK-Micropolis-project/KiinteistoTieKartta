import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DeletedKiinteisto } from "../types";
import {
  cardStyle,
  tableStyle,
  tdStyle,
  backButton,
} from "../styles";
import { useKiinteistot } from "../context/useKiinteistot";

export default function PoistetutKiinteistotView() {
  const [deleted, setDeleted] = useState<DeletedKiinteisto[]>([]);
  const navigate = useNavigate();
  const { restoreKiinteisto } = useKiinteistot();

  useEffect(() => {
    const data = localStorage.getItem("kiinteistot-backup");
    if (data) {
      setDeleted(JSON.parse(data));
    }
  }, []);

  if (deleted.length === 0) {
    return (
      <div>
        <button style={backButton} onClick={() => navigate(-1)}>
          ← Takaisin
        </button>
        <p>Ei poistettuja kiinteistöjä.</p>
      </div>
    );
  }

  return (
    <div>
      <button style={backButton} onClick={() => navigate(-1)}>
        ← Takaisin
      </button>

      <h1>Poistetut kiinteistöt</h1>

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tdStyle}>Nimi</th>
              <th style={tdStyle}>Osoite</th>
              <th style={tdStyle}>Poistettu</th>
              <th style={tdStyle}>Toiminnot</th>
            </tr>
          </thead>

          <tbody>
            {deleted.map((k) => (
              <tr key={k.id}>
                <td style={tdStyle}>{k.nimi}</td>
                <td style={tdStyle}>{k.osoite}</td>
                <td style={tdStyle}>
                  {new Date(k.deletedAt).toLocaleDateString()}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => {
                      restoreKiinteisto(k.id);

                      // Päivitä lista heti
                      setDeleted((prev) =>
                        prev.filter((d) => d.id !== k.id)
                      );

                      // Siirry palautetun kiinteistön sivulle
                      navigate(`/detail/${k.id}`);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      background: "#f0f0f0",
                    }}
                  >
                    Palauta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}