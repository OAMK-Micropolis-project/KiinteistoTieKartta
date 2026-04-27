// src/charts/maintenanceChart.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { theme } from "../theme";

let maintenanceChart: Chart | null = null;

function calcYllapito(k: Kiinteisto, year: number): number {
    return Object.values(k.yllapitokulut[year] || {}).reduce(
        (sum, val) => sum + (val ?? 0),
        0
    );
}

export function renderMaintenanceChart(canvasId: string, properties: Kiinteisto[]) {
    try {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;

        if (maintenanceChart) maintenanceChart.destroy();

        const labels = properties.map(k => k.nimi);
        const values = properties.map(k => {
            const year = Math.max(...Object.keys(k.yllapitokulut).map(Number));
            return calcYllapito(k, year);
        });
        const colors = properties.map(
            k => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
        );

        maintenanceChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Ylläpitokulut (€ / v)",
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.parsed.y} €`
                        }
                    },
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: theme.colors.text } }
                }
            }
        });
        return maintenanceChart;

    } catch (error) {
        console.error("Error rendering Maintenance chart:", error);
    }
}