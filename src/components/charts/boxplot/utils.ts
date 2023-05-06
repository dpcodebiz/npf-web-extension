import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Configuration } from "../../../utils/configuration/types";
import {
  CartesianScaleTypeRegistry,
  Chart,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LegendOptions,
  PluginChartOptions,
  ScaleChartOptions,
  ScaleOptionsByType,
  TitleOptions,
} from "chart.js";
import { Settings } from "../../../utils/settings/types";
import { getGraphAxisTitle } from "../../settings/utils";

export const getBoxplotChartAxisLabels = (settings: Settings, configuration: Configuration) => {
  return {
    x: getGraphAxisTitle("x", settings, configuration),
    y: getGraphAxisTitle("y", settings, configuration),
  };
};

export const boxplotChartAxisStyles = (settings: Settings, configuration: Configuration, axis: "x" | "y") =>
  ({
    title: {
      text: getBoxplotChartAxisLabels(settings, configuration)[axis],
      color: "#000",
      font: {
        size: 16,
      },
      padding: {
        top: 20,
        bottom: 20,
      },
      display: true,
    },
    ticks: {
      color: "#000",
      font: {
        size: 16,
      },
      padding: 10,
    },
  } as ScaleOptionsByType<keyof CartesianScaleTypeRegistry>);

export const boxplotChartTitleStyles = () =>
  ({
    display: false,
  } as _DeepPartialObject<TitleOptions>);

export const boxplotChartLegendStyles = (split: boolean) =>
  ({
    position: split ? "top" : ("right" as const),
    align: split ? "end" : "center",
    display: true,
    labels: {
      generateLabels: function (chart) {
        const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);

        // customize the style of the labels when they're not selected
        labels.forEach(function (label) {
          label.fontColor = !label.hidden ? "#000" : "#666"; // set the font color to gray
          label.fillStyle = !label.hidden ? label.fillStyle : "transparent";
          label.strokeStyle = !label.hidden ? label.strokeStyle : "transparent";
          label.borderRadius = 2;
        });

        return labels;
      },
      color: "#000",
    },
  } as _DeepPartialObject<LegendOptions<"boxplot">>);

export const boxplotChartOptions = (settings: Settings, configuration: Configuration, split: boolean) =>
  ({
    responsive: true,
    plugins: {
      legend: boxplotChartLegendStyles(split),
      title: boxplotChartTitleStyles(),
      tooltip: {},
    },
    scales: {
      x: boxplotChartAxisStyles(settings, configuration, "x"),
      y: boxplotChartAxisStyles(settings, configuration, "y"),
    },
  } as _DeepPartialObject<
    CoreChartOptions<"boxplot"> &
      ElementChartOptions<"boxplot"> &
      PluginChartOptions<"boxplot"> &
      DatasetChartOptions<"boxplot"> &
      ScaleChartOptions<"boxplot">
  >);
