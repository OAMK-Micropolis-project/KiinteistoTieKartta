// src/charts/criteriaComparisonChart.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { theme } from "../theme";

let criteriaChart: Chart | null = null;

export function renderCriteriaComparisonChart(
    canvasId: string,
    properties: Kiinteisto[],
    criteria: string
) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (criteriaChart) criteriaChart.destroy();

    const labels = properties.map((k) => k.nimi);
    const values = properties.map((k) => k.pisteet[criteria] ?? 0);

    const colors = properties.map(
        (k) => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
    );

    criteriaChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: `Pisteet (${criteria})`,
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) =>
                            `${ctx.label}: ${ctx.parsed.y} pistettä`
                    }
                },
                legend: { display: false }
            }
        }
    });
}