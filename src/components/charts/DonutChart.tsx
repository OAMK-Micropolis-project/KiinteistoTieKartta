import { Doughnut } from "react-chartjs-2";

export default function DonutChart() {
  const data = {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        label: "Portfoliot",
        data: [10, 20, 30, 40],
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#ef4444"
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