// src/charts/chartKriteerit.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";

let kriteeritChart: Chart | null = null;

export function renderKriteeritChart(canvasId: string, properties: Kiinteisto[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (kriteeritChart) kriteeritChart.destroy();

    const KRITEERIT = ["ika", "vesikatto", "sadevesi", "julkisivu", "ikkunat", "ovet"];

    kriteeritChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: KRITEERIT,
            datasets: properties.map((p, i) => ({
                label: p.nimi,
                data: KRITEERIT.map(k => p.pisteet[k] ?? 0),
                backgroundColor: `rgba(${80 + i * 30}, ${120 - i * 20}, ${160 + i * 15}, 0.7)`
            })),
        },
        options: {
            responsive: true
        }
    });
}