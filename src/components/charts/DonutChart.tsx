import { Doughnut } from "react-chartjs-2";
import { useKiinteistot } from "../../context/useKiinteistot";
import { useMemo } from "react";

export default function DonutChart() {
  const { kiinteistot } = useKiinteistot();

  const counts = useMemo(() => {
    return kiinteistot.reduce(
      (acc, k) => {
        acc[k.oma_salkku]++;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0 }
    );
  }, [kiinteistot]);

  const data = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "Portfoliot",
        data: [counts.A, counts.B, counts.C, counts.D],
        backgroundColor: [
          "#22c55e",
          "#eab308",
          "#f97316",
          "#ef4444",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    cutout: "60%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: "Salkkujakauma",
            font: {
                size: 20,
                weight: "600",
            },
            color: "2c2c2c",
            padding: {
                top: 10,
                bottom: 10,
            },
        },
        legend: {
        position: "bottom" as const,
        labels: {
          color: "#333",
        }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}