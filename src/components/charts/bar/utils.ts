import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Configuration } from "../../../utils/configuration/types";
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
import { getGraphAxisScale, getGraphAxisTitle } from "../../settings/utils";

export const getBarChartAxisLabels = (configuration: Configuration) => {
  return {
    x: getGraphAxisTitle("x", configuration),
    y: getGraphAxisTitle("y", configuration),
  };
};

export const barChartAxisStyles = (configuration: Configuration, axis: "x" | "y") =>
  ({
    title: {
      text: getBarChartAxisLabels(configuration)[axis],
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
        const scale = getGraphAxisScale(axis, configuration);
        const applyScale = !isNaN(parseFloat(label.toString().replace(",", ".")));
        const valueScaled = parseFloat(label.toString().replace(",", ".")) / scale;
        return applyScale ? `${valueScaled.toFixed(2).replace(/[.,]000$/, "")}` : label;
      },
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

// const getAnnotations = (settings: Settings, configuration: Configuration, index: number) => {
//   const values = Object.keys(Object.values(configuration.data.runs[0].results)[0]);
//   const pairs: string[][] = [];

//   for (const i of range(values.length - 2)) {
//     pairs.push([values[i], values[i + 1]]);
//   }

//   return pairs
//     .map((interval, index) =>
//       index % 2 == 1
//         ? {
//             type: "box",
//             backgroundColor: "rgba(0,0,0, 0.1)",
//             borderWidth: 0,
//             drawTime: "beforeDatasetsDraw",
//             xMax: interval[0],
//             xMin: interval[1],
//             xScaleID: "x",
//             yScaleID: "y",
//           }
//         : undefined
//     )
//     .filter((e) => e);
// };

export const barChartOptions = (configuration: Configuration, split: boolean, index: number) =>
  ({
    responsive: true,
    plugins: {
      legend: barChartLegendStyles(split),
      title: barChartTitleStyles(),
      tooltip: {},
      // annotation: {
      //   annotations: getAnnotations(settings, configuration, index),
      // },
    },
    scales: {
      x: barChartAxisStyles(configuration, "x"),
      y: barChartAxisStyles(configuration, "y"),
    },
  } as _DeepPartialObject<
    CoreChartOptions<"bar" | "barWithErrorBars"> &
      ElementChartOptions<"bar" | "barWithErrorBars"> &
      PluginChartOptions<"bar" | "barWithErrorBars"> &
      DatasetChartOptions<"bar" | "barWithErrorBars"> &
      ScaleChartOptions<"bar" | "barWithErrorBars"> &
      BarControllerChartOptions
  >);
