import { _DeepPartialObject } from "chart.js/dist/types/utils";
import { Configuration, DatasetsWithResults } from "../../../utils/configuration/types";
import {
  CartesianScaleTypeRegistry,
  Chart,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LegendOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
  ScaleOptionsByType,
  TitleOptions,
} from "chart.js";
import { getGraphAxisScale, getGraphAxisTitle } from "../../settings/utils";
import { isNumber } from "radash";

export const getLineChartAxisLabels = (configuration: Configuration) => {
  return {
    x: getGraphAxisTitle("x", configuration),
    y: getGraphAxisTitle("y", configuration),
  };
};

export const lineChartAxisStyles = (configuration: Configuration, axis: "x" | "y") =>
  ({
    title: {
      text: getLineChartAxisLabels(configuration)[axis],
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
        const label = isNumber(value) ? this.getLabelForValue(value) : value;
        const scale = getGraphAxisScale(axis, configuration);
        const applyScale = !isNaN(parseFloat(label.toString().replace(",", ".")));
        const valueScaled = parseFloat(label.toString().replace(",", ".")) / scale;
        return applyScale ? `${valueScaled.toFixed(2).replace(/[.,]00$/, "")}` : label;
      },
    },
  } as ScaleOptionsByType<keyof CartesianScaleTypeRegistry>);

export const lineChartTitleStyles = () =>
  ({
    display: false,
  } as _DeepPartialObject<TitleOptions>);

export const lineChartLegendStyles = (split: boolean) =>
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
  } as _DeepPartialObject<LegendOptions<"line">>);

// const getAnnotations = (settings: Settings, configuration: Configuration, data: DatasetsWithResults, index: number) => {
//   const values = Object.keys(Object.values(configuration.experiments[index].runs[0].results)[0]);
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

export const lineChartOptions = (configuration: Configuration, split: boolean, index: number) =>
  ({
    responsive: true,
    plugins: {
      legend: lineChartLegendStyles(split),
      title: lineChartTitleStyles(),
      tooltip: {},
      // annotation: {
      //   annotations: getAnnotations(settings, configuration, index),
      // },
    },
    scales: {
      x: lineChartAxisStyles(configuration, "x"),
      y: lineChartAxisStyles(configuration, "y"),
    },
  } as _DeepPartialObject<
    CoreChartOptions<"line" | "lineWithErrorBars"> &
      ElementChartOptions<"line" | "lineWithErrorBars"> &
      PluginChartOptions<"line" | "lineWithErrorBars"> &
      DatasetChartOptions<"line" | "lineWithErrorBars"> &
      ScaleChartOptions<"line" | "lineWithErrorBars"> &
      LineControllerChartOptions
  >);
