import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Configuration, Experiment } from "../../../utils/configuration/types";
import {
  CartesianScaleTypeRegistry,
  Chart,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LegendOptions,
  BarControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
  ScaleOptionsByType,
  TitleOptions,
} from "chart.js";
import { Settings } from "../../../utils/settings/types";
import { getGraphAxisTitle } from "../../settings/utils";

export const getBarChartAxisLabels = (settings: Settings, configuration: Configuration) => {
  return {
    x: getGraphAxisTitle("x", settings, configuration),
    y: getGraphAxisTitle("y", settings, configuration),
  };
};

export const barChartAxisStyles = (settings: Settings, configuration: Configuration, axis: "x" | "y") =>
  ({
    title: {
      text: getBarChartAxisLabels(settings, configuration)[axis],
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

export const barChartTitleStyles = () =>
  ({
    display: false,
  } as _DeepPartialObject<TitleOptions>);

export const barChartLegendStyles = (split: boolean) =>
  ({
    position: split ? "top" : ("right" as const),
    align: split ? "end" : "center",
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
  } as _DeepPartialObject<LegendOptions<"bar">>);

export const barChartOptions = (settings: Settings, configuration: Configuration, split: boolean) =>
  ({
    responsive: true,
    plugins: {
      legend: barChartLegendStyles(split),
      title: barChartTitleStyles(),
      tooltip: {},
    },
    scales: {
      x: barChartAxisStyles(settings, configuration, "x"),
      y: barChartAxisStyles(settings, configuration, "y"),
    },
  } as _DeepPartialObject<
    CoreChartOptions<"bar" | "barWithErrorBars"> &
      ElementChartOptions<"bar" | "barWithErrorBars"> &
      PluginChartOptions<"bar" | "barWithErrorBars"> &
      DatasetChartOptions<"bar" | "barWithErrorBars"> &
      ScaleChartOptions<"bar" | "barWithErrorBars"> &
      BarControllerChartOptions
  >);
