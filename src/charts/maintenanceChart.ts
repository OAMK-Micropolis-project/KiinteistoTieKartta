import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { laskeYllapito } from "../utils/analyticsUtils";
import { theme } from "../theme";

const maintenanceChart: Chart | null = null;

export function renderMaintenanceChart(
    canvasId: string,
    properties: Kiinteisto[]
) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (maintenanceChart) maintenanceChart.destroy();

    const label = properties.map(k => k.nimi);
    const values = properties.map(k => laskeYllapito(k));
    const colors = properties.map(
        k => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
    );

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: label,
            datasets: [
                {
                    label: "Ylläpitokulut (€ / v)",
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (ctx) => 
                            `${ctx.label}: ${ctx.parsed.y} €`
                    }
                },
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: { color: theme.colors.text }
                }
            }
        }
    });
}
