// src/charts/chartYllapito.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { laskeYllapito } from "../utils/analyticsUtils";

let yllapitoChart: Chart | null = null;

export function renderYllapitoChart(canvasId: string, properties: Kiinteisto[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (yllapitoChart) yllapitoChart.destroy();

    yllapitoChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: properties.map(p => p.nimi),
            datasets: [
                {
                    label: "Ylläpitokulut (€)",
                    data: properties.map(laskeYllapito),
                    backgroundColor: "rgba(46, 104, 166, 0.7)",
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}