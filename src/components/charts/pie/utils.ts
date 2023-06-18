import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { DatasetsWithResults } from "../../../utils/configuration/types";
import {
  CoreChartOptions,
  DatasetChartOptions,
  LegendOptions,
  PieControllerChartOptions,
  PluginChartOptions,
  TitleOptions,
} from "chart.js";
import { COLORS, getPieLabel } from "../../../utils/chart";

export const PieChartTitleStyles = () =>
  ({
    display: false,
  } as _DeepPartialObject<TitleOptions>);

export const PieChartLegendStyles = (split: boolean, data: DatasetsWithResults) =>
  ({
    position: split ? "top" : ("right" as const),
    align: split ? "end" : "center",
    display: true,
    labels: {
      generateLabels: function () {
        return getPieLabel(data).map((label, index) => ({
          text: label,
          strokeStyle: COLORS.PIE_CHART[index],
          fillStyle: COLORS.PIE_CHART[index],
        }));
      },
      color: "#000",
    },
  } as _DeepPartialObject<LegendOptions<"pie">>);

export const pieChartOptions = (data: DatasetsWithResults, split: boolean) =>
  ({
    responsive: true,
    plugins: {
      legend: PieChartLegendStyles(split, data),
      title: PieChartTitleStyles(),
      tooltip: {},
    },
  } as _DeepPartialObject<
    CoreChartOptions<"pie"> & PluginChartOptions<"pie"> & DatasetChartOptions<"pie"> & PieControllerChartOptions
  >);
