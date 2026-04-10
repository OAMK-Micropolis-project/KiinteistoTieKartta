// src/charts/chartYllapito.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { laskeYllapito } from "../utils/analyticsUtils";
import { theme } from "../theme";

let yllapitoChart: Chart | null = null;

export function renderYllapitoChart(canvasId: string, properties: Kiinteisto[]) {
    try {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;

        if (yllapitoChart) yllapitoChart.destroy();

        // Calculate the most recent year from all properties
        const year = Math.max(
            ...properties.flatMap(k => Object.keys(k.yllapitokulut).map(Number))
        );

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
                        data: properties.map(p => laskeYllapito(p, year)),
                        backgroundColor: colors,
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                responsive: true
            }
        });
    } catch (error) {
        console.error("Error rendering Yllapito chart:", error);
    }
}