import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Experiment } from "../../../utils/configuration/types";
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

export const getBarChartAxisLabels = (experiment: Experiment) => {
  return {
    x: experiment.main_parameter,
    y: Object.keys(experiment.runs[0]?.results)[0] ?? "undefined",
  };
};

export const barChartAxisStyles = (experiment: Experiment, axis: "x" | "y") =>
  ({
    title: {
      text: getBarChartAxisLabels(experiment)[axis],
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

export const barChartTitleStyles = (experiment: Experiment) =>
  ({
    display: true,
    text: experiment.name,
    font: {
      size: 40,
    },
    color: "#000",
  } as _DeepPartialObject<TitleOptions>);

export const barChartLegendStyles = () =>
  ({
    position: "right" as const,
    title: {
      display: true,
      text: "Datasets",
      font: {
        size: 20,
      },
      color: "#000",
    },
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

export const barChartOptions = (experiment: Experiment) =>
  ({
    responsive: true,
    plugins: {
      legend: barChartLegendStyles(),
      title: barChartTitleStyles(experiment),
      tooltip: {},
    },
    scales: {
      x: barChartAxisStyles(experiment, "x"),
      y: barChartAxisStyles(experiment, "y"),
    },
  } as _DeepPartialObject<
    CoreChartOptions<"bar"> &
      ElementChartOptions<"bar"> &
      PluginChartOptions<"bar"> &
      DatasetChartOptions<"bar"> &
      ScaleChartOptions<"bar"> &
      BarControllerChartOptions
  >);
