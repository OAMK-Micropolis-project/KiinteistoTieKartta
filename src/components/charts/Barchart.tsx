import { Bar } from "react-chartjs-2";

export default function PointsBarChart() {
  const values = [50, 70, 40, 90];
  const data = {
    labels: ["Kiinteistö A", "B", "C", "D"],
    datasets: [
      {
        label: "Pisteet",
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#ef4444",
        ],
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
      title: {
        display: true,
        text: "Salkkujakauma",
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
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#333" },
        grid: { display: false },
      },
      y: {
        min: Math.min(...values) - 10,
        max: Math.max(...values) + 10,
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