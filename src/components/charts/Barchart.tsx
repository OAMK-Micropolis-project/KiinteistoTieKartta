import { Bar } from "react-chartjs-2";

export default function PointsBarChart() {
  const data = {
    labels: ["Kiinteistö A", "B", "C", "D"],
    datasets: [
      {
        label: "Pisteet",
        data: [50, 70, 40, 90],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return <Bar data={data} />;
}