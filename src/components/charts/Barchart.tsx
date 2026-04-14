import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import { useKiinteistot } from "../../context/useKiinteistot";
import { plugins } from "chart.js";
import { theme } from "../../theme";

function sumPisteet(pisteet: Record<string, number>): number {
  return Object.values(pisteet).reduce((sum, v) => sum + v, 0);
}

export default function PointsBarChart() {
  const { kiinteistot } = useKiinteistot();

  const sums = useMemo(() => {
    return kiinteistot.reduce(
      (acc, estate) => {
        acc[estate.oma_salkku] += sumPisteet(estate.pisteet);
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0 }
    );
  }, [kiinteistot]);

  const values = [sums.A, sums.B, sums.C, sums.D];

  const colors = kiinteistot.map(
    k => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
  );

  const data = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "Pisteet",
        data: values,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Pistejakauma",
        font: {
          size: 20,
          weight: "600",
        },
        color: "#2c2c2c",
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#333" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#333" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}