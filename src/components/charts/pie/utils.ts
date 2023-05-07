import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Configuration, Experiment } from "../../../utils/configuration/types";
import {
  CoreChartOptions,
  DatasetChartOptions,
  LegendOptions,
  PieControllerChartOptions,
  PluginChartOptions,
  TitleOptions,
} from "chart.js";
import { Settings } from "../../../utils/settings/types";
import { COLORS, getPieLabel } from "../../../utils/chart";

export const PieChartTitleStyles = () =>
  ({
    display: false,
  } as _DeepPartialObject<TitleOptions>);

export const PieChartLegendStyles = (split: boolean, experiment: Experiment) =>
  ({
    position: split ? "top" : ("right" as const),
    align: split ? "end" : "center",
    display: true,
    labels: {
      generateLabels: function () {
        return getPieLabel(experiment).map((label, index) => ({
          text: label,
          strokeStyle: COLORS.PIE_CHART[index],
          fillStyle: COLORS.PIE_CHART[index],
        }));
      },
      color: "#000",
    },
  } as _DeepPartialObject<LegendOptions<"pie">>);

export const pieChartOptions = (_: Settings, configuration: Configuration, split: boolean) =>
  ({
    responsive: true,
    plugins: {
      legend: PieChartLegendStyles(split, configuration.experiments[0]),
      title: PieChartTitleStyles(),
      tooltip: {},
    },
  } as _DeepPartialObject<
    CoreChartOptions<"pie"> & PluginChartOptions<"pie"> & DatasetChartOptions<"pie"> & PieControllerChartOptions
  >);
