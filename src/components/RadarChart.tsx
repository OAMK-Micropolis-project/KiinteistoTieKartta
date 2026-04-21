import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
import { chartCanvas } from "../styles";

interface RadarChartProps {
  labels: string[];
  data: number[];
}

/**
 * Declarative wrapper around Chart.js radar chart.
 * Handles create/destroy lifecycle internally so callers never
 * need to manage a Chart ref or touch the DOM directly.
 */
export default function RadarChart({ labels, data }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "radar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: "rgba(46,104,166,0.25)",
            borderColor: "rgba(46,104,166,0.9)",
            borderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1 },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    return () => chart.destroy();
  }, [labels, data]);

  return <canvas ref={canvasRef} style={chartCanvas} />;
}
