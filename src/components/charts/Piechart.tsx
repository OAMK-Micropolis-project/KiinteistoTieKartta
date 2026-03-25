import { Pie } from "react-chartjs-2";

export default function AreaPieChart() {
  const data = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [300, 500, 200],
        backgroundColor: ["#3b82f6", "#22c55e", "#ef4444"],
      },
    ],
  };

  return <Pie data={data} />;
}