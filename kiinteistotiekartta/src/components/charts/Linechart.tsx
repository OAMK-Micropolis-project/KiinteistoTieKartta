import { Line } from "react-chartjs-2";

export default function PortfolioLineChart() {
  const data = {
    labels: ["Tammi", "Helmi", "Maalis", "Huhti"],
    datasets: [
      {
        label: "Arvo (€)",
        data: [120000, 135000, 128000, 155000],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}