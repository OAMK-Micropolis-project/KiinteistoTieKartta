
import React from "react";
import { useParams } from "react-router-dom";

export default function PropertyView() {
  const { id } = useParams();
  const list = JSON.parse(localStorage.getItem("kiinteistot") || "[]");
  const item = list[Number(id)];

  if (!item) return <div style={{ padding: 20 }}>Ei kiinteistöä löytynyt.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{item.nimi}</h2>
      <p><strong>Osoite:</strong> {item.osoite}</p>
      <p><strong>Käyttötarkoitus:</strong> {item.kayttotarkoitus}</p>
    </div>
  );
}
