import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useKiinteistot } from "../context/useKiinteistot";

import DonutChart from "../components/charts/DonutChart";
import PointsBarChart from "../components/charts/Barchart";
import formatNumberShort from "../utils/formatUtils";

import {
  boxesContainer,
  box,
  boxName,
  boxValue,
  boxTitle,
  secondRowContainer,
  realEstatesContainer,
  realEstateRow,
  realEstateRowTitles,
  realEstateTitle,
  realEstateTitle2,
  estateName,
  estateNumber,
  portfolioCell,
  chartContainer,
  portfolioRowStyle,
  portfolioItemHover,
  salkkuBadge,
} from "./SummaryView.styles";

export default function HomePage() {
  const store = useKiinteistot();
  const realEstates = store.kiinteistot;
  const year = store.getLatestYear();

  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const settings = await window.settings.load();
      console.log("Last opened file:", settings.lastFilePath);
    }
    load();
  }, []);

  const summaryBoxes = [
    { name: "KIINTEISTÖJÄ", value: formatNumberShort(realEstates.length) },
    {
      name: "KOKONAISPINTA-ALA",
      value: formatNumberShort(store.calAllPintaAla()) + " m²",
    },
    {
      name: "TASEARVO YHTEENSÄ",
      value: formatNumberShort(store.calAllTasearvo(year)) + " €",
    },
    {
      name: "YLLÄPITÖKULUT / V",
      value: formatNumberShort(store.calAllYllapito(year)) + " €",
    },
    {
      name: "VUOKRATULOT / V",
      value: formatNumberShort(store.calAllVuokra(year)) + " €",
    },
  ];

  return (
    <>
      <span style={boxTitle}>Kiinteistösalkku</span>

      <div style={boxesContainer}>
        {summaryBoxes.map((boxItem, i) => (
          <div key={i} style={box}>
            <span style={boxName}>{boxItem.name}</span>
            <span style={boxValue}>{boxItem.value}</span>
          </div>
        ))}
      </div>

      <div style={secondRowContainer}>
        <div style={realEstatesContainer}>
          <span style={realEstateTitle2}>KAIKKI KIINTEISTÖT</span>

          <div style={realEstateRowTitles}>
            <span style={realEstateTitle2}>NIMI</span>
            <span style={realEstateTitle}>SALKKU</span>
            <span style={realEstateTitle}>PISTEET</span>
            <span style={realEstateTitle}>PINTA-ALA</span>
            <span style={realEstateTitle}>TASEARVO</span>
          </div>

          {realEstates.map((estate) => (
            <NavLink
              key={estate.id}
              to={`/detail/${estate.id}`}
              style={{
                ...realEstateRow,
                ...portfolioRowStyle(estate.oma_salkku),
                ...(hoverId === String(estate.id) ? portfolioItemHover() : {}),
              }}
              onMouseEnter={() => setHoverId(String(estate.id))}
              onMouseLeave={() => setHoverId(null)}
            >
              <span style={estateName}>{estate.nimi}</span>
              <span style={portfolioCell}>
                <span style={salkkuBadge(estate.oma_salkku)}>
                  {estate.oma_salkku}
                </span>
              </span>
              <span style={estateNumber}>
                {(estate.painotetutPisteet ?? 0).toLocaleString("fi-FI")}
              </span>
              <span style={estateNumber}>
                {estate.pinta_ala.toLocaleString("fi-FI")} m²
              </span>
              <span style={estateNumber}>
                {formatNumberShort(
                  estate.vuokrakulut[year]?.tasearvo ?? 0,
                )}{" "}
                €
              </span>
            </NavLink>
          ))}
        </div>

        <div>
          <div style={chartContainer}>
            <DonutChart />
          </div>
          <div style={chartContainer}>
            <PointsBarChart />
          </div>
        </div>
      </div>
    </>
  );
}