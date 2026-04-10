// src/charts/chartYllapito.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { laskeYllapito } from "../utils/analyticsUtils";
import { theme } from "../theme";

let yllapitoChart: Chart | null = null;

export function renderYllapitoChart(canvasId: string, properties: Kiinteisto[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (yllapitoChart) yllapitoChart.destroy();

    const colors = properties.map(
            k => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
        );

    yllapitoChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: properties.map(p => p.nimi),
            datasets: [
                {
                    label: "Ylläpitokulut (€)",
                    data: properties.map(laskeYllapito),
                    backgroundColor: colors,
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}