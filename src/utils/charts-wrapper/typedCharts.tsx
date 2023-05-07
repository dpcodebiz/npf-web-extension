import React, { forwardRef } from "react";
import { Chart as ChartJS } from "chart.js";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";
import { BarWithErrorBarsController, BarWithErrorBar, LineWithErrorBarsController } from "chartjs-chart-error-bars";
import type { ChartType, ChartComponentLike } from "chart.js";

import type { ChartProps, ChartJSOrUndefined, TypedChartComponent } from "./types";
import { Chart } from "./chart";

function createTypedChart<T extends ChartType>(type: T, registerables: ChartComponentLike) {
  ChartJS.register(registerables);

  return forwardRef<ChartJSOrUndefined<T>, Omit<ChartProps<T>, "type">>((props, ref) => (
    <Chart {...props} ref={ref} type={type} />
  )) as TypedChartComponent<T>;
}

export const BoxPlot = /* #__PURE__ */ createTypedChart("boxplot", [BoxPlotController, BoxAndWiskers]);
export const LineError = /* #__PURE__ */ createTypedChart("lineWithErrorBars", [LineWithErrorBarsController]);
export const BarError = /* #__PURE__ */ createTypedChart("barWithErrorBars", [
  BarWithErrorBarsController,
  BarWithErrorBar,
]);
