import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useKiinteistot } from "../context/useKiinteistot";

import PointsBarChart from "../components/charts/Barchart";
import DonutChart from "../components/charts/DonutChart";
import formatNumberShort from "../utils/formatUtils";

import {
  box,
  boxesContainer,
  boxName,
  boxTitle,
  boxValue,
  chartContainer,
  estateName,
  estateNumber,
  portfolioCell,
  portfolioItemHover,
  portfolioRowStyle,
  realEstateRow,
  realEstateRowTitles,
  realEstatesContainer,
  realEstateTitle,
  realEstateTitle2,
  salkkuBadge,
  secondRowContainer,
  yearFilterButton,
  yearFilterContainer,
} from "./SummaryView.styles";

type SortKey = "nimi" | "salkku" | "pisteet" | "pinta_ala" | "tasearvo";
type SortDir = "asc" | "desc";

const salkkuOrder: Record<"A" | "B" | "C" | "D", number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

export default function HomePage() {
  const store = useKiinteistot();
  const realEstates = store.kiinteistot;

  const [sortKey, setSortKey] = useState<SortKey>("nimi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      const defaultDir: SortDir =
        nextKey === "nimi" || nextKey === "salkku" ? "asc" : "desc";
      setSortDir(defaultDir);
    }
  }

  // compute years list
  const years = useMemo(() => {
    return Array.from(
      new Set(
        realEstates.flatMap((k) => [
          ...Object.keys(k.yllapitokulut ?? {}).map(Number),
          ...Object.keys(k.vuokrakulut ?? {}).map(Number),
        ]),
      ),
    ).sort((a, b) => b - a);
  }, [realEstates]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (years.length && selectedYear === null) {
      setSelectedYear(years[0]); // newest
    }
  }, [years, selectedYear]);

  // ✅ always use a valid year number
  const effectiveYear = selectedYear ?? years[0] ?? new Date().getFullYear();

  const [hoverId, setHoverId] = useState<string | null>(null);

  const summaryBoxes = [
    { name: "KIINTEISTÖJÄ", value: formatNumberShort(realEstates.length) },
    {
      name: "KOKONAISPINTA-ALA",
      value: formatNumberShort(store.calAllPintaAla()) + " m²",
    },
    {
      name: "TASEARVO YHTEENSÄ",
      value: formatNumberShort(store.calAllTasearvo(effectiveYear)) + " €",
    },
    {
      name: "YLLÄPITÖKULUT / V",
      value: formatNumberShort(store.calAllYllapito(effectiveYear)) + " €",
    },
    {
      name: "VUOKRATULOT / V",
      value: formatNumberShort(store.calAllVuokra(effectiveYear)) + " €",
    },
  ];

  const sortedEstates = useMemo(() => {
    const list = [...realEstates];

    list.sort((a, b) => {
      let A: string | number = 0;
      let B: string | number = 0;

      switch (sortKey) {
        case "nimi":
          A = a.nimi ?? "";
          B = b.nimi ?? "";
          break;

        case "salkku":
          A = salkkuOrder[(a.oma_salkku as "A" | "B" | "C" | "D")] ?? 99;
          B = salkkuOrder[(b.oma_salkku as "A" | "B" | "C" | "D")] ?? 99;
          break;

        case "pisteet":
          A = a.painotetutPisteet ?? 0;
          B = b.painotetutPisteet ?? 0;
          break;

        case "pinta_ala":
          A = a.pinta_ala ?? 0;
          B = b.pinta_ala ?? 0;
          break;

        case "tasearvo":
          A = a.vuokrakulut?.[effectiveYear]?.tasearvo ?? 0;
          B = b.vuokrakulut?.[effectiveYear]?.tasearvo ?? 0;
          break;
      }

      if (typeof A === "string" && typeof B === "string") {
        const diff = A.localeCompare(B, "fi");
        return sortDir === "asc" ? diff : -diff;
      }

      const diff = Number(A) - Number(B);
      return sortDir === "asc" ? diff : -diff;
    });

    return list;
  }, [realEstates, effectiveYear, sortKey, sortDir]);

  return (
    <>
      <span style={boxTitle}>Kiinteistösalkku</span>

      <div style={yearFilterContainer}>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            style={yearFilterButton(effectiveYear === y)}
          >
            {y}
          </button>
        ))}
      </div>

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
            <span style={realEstateTitle2} onClick={() => handleSort("nimi")}>
              NIMI {sortKey === "nimi" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </span>

            <span style={realEstateTitle} onClick={() => handleSort("salkku")}>
              SALKKU{" "}
              {sortKey === "salkku" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </span>

            <span style={realEstateTitle} onClick={() => handleSort("pisteet")}>
              PISTEET{" "}
              {sortKey === "pisteet" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </span>

            <span
              style={realEstateTitle}
              onClick={() => handleSort("pinta_ala")}
            >
              PINTA-ALA{" "}
              {sortKey === "pinta_ala" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </span>

            <span style={realEstateTitle} onClick={() => handleSort("tasearvo")}>
              TASEARVO{" "}
              {sortKey === "tasearvo" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </span>
          </div>

          {sortedEstates.map((estate) => (
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
                {formatNumberShort(estate.vuokrakulut?.[effectiveYear]?.tasearvo ?? 0)} €
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