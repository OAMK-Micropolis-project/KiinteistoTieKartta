// src/charts/chartKriteerit.ts
import Chart from "chart.js/auto";
import type { Kiinteisto } from "../types";
import { theme } from "../theme";

let kriteeritChart: Chart | null = null;

export function renderKriteeritChart(canvasId: string, properties: Kiinteisto[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) return;

    if (kriteeritChart) kriteeritChart.destroy();

    const KRITEERIT = ["ika", "vesikatto", "sadevesi", "julkisivu", "ikkunat", "ovet"];

    const colors = properties.map(
            k => theme.colors.salkku[k.oma_salkku as "A" | "B" | "C" | "D"].color
        );

    kriteeritChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: KRITEERIT,
            datasets: properties.map((p, i) => ({
                label: p.nimi,
                data: KRITEERIT.map(k => p.pisteet[k] ?? 0),
                backgroundColor: colors[i]
            })),
        },
        options: {
            responsive: true
        }
    });
}