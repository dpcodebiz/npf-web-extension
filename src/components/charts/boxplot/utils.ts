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
import { getGraphAxisScale, getGraphAxisTitle } from "../../settings/utils";
import { range } from "radash";

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
      callback: function (value, index, ticks) {
        const label = this.getLabelForValue(value as number);
        const scale = getGraphAxisScale(axis, settings, configuration);
        const valueScaled = parseFloat(label.toString().replace(",", ".")) / scale;
        return `${valueScaled.toFixed(2).replace(/[.,]000$/, "")}`;
      },
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

const getAnnotations = (settings: Settings, configuration: Configuration, index: number) => {
  const values = Object.keys(Object.values(configuration.experiments[index].runs[0].results)[0]);
  const pairs: string[][] = [];

  for (const i of range(values.length - 2)) {
    pairs.push([values[i], values[i + 1]]);
  }

  return pairs
    .map((interval, index) =>
      index % 2 == 1
        ? {
            type: "box",
            backgroundColor: "rgba(0,0,0, 0.1)",
            borderWidth: 0,
            drawTime: "beforeDatasetsDraw",
            xMax: interval[0],
            xMin: interval[1],
            xScaleID: "x",
            yScaleID: "y",
          }
        : undefined
    )
    .filter((e) => e);
};

export const boxplotChartOptions = (settings: Settings, configuration: Configuration, split: boolean, index: number) =>
  ({
    responsive: true,
    plugins: {
      legend: boxplotChartLegendStyles(split),
      title: boxplotChartTitleStyles(),
      tooltip: {},
      // annotation: {
      //   annotations: getAnnotations(settings, configuration, index),
      // },
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
