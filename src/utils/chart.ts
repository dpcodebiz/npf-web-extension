import { ChartDataset } from "chart.js";
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "./configuration/types";
import { splitParams } from "./configuration/utils";
import { iqr, maxArray, mean, median, minArray } from "@basementuniverse/stats";
import { getParameter, getSettingsGraphTitle, getSettingsSplitAxisFormat } from "../components/settings/utils";
import { flat } from "radash";
import jsPDF from "jspdf";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (datasets: DatasetsWithResults, configuration: Configuration) => {
  if (!datasets) return [];

  const mainParameter = getParameter("x", {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
    settings: configuration.settings,
  });

  const uniqueLabels = new Set();
  [...datasets.values()].forEach((results) => {
    [...results.keys()].forEach((key) => uniqueLabels.add(splitParams(key)[mainParameter]));
  });
  const uniqueLabelsValuesRaw = [...uniqueLabels.values()] as string[];
  const hasNumberLabels = !isNaN(parseInt(uniqueLabelsValuesRaw[0] as string));

  const uniqueLabelsSorted = hasNumberLabels
    ? uniqueLabelsValuesRaw.sort((a, b) => parseFloat(a) - parseFloat(b))
    : uniqueLabelsValuesRaw.sort();

  return uniqueLabelsSorted;
};

export const getPieLabel = (data: DatasetsWithResults) => {
  if (!data) return [];

  return [...data.keys()];
};

export const COLORS = {
  BARS_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
  LINE_CHART: [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#393b79",
    "#637939",
    "#8c6d31",
    "#843c39",
    "#7b4173",
    "#5254a3",
    "#bd9e39",
    "#ad494a",
    "#ad494a",
    "#637939",
    "#6b6ecf",
    "#b5cf6b",
    "#cfa6ce",
    "#ce6bcb",
  ],
  PIE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
};

export const backgroundPlugin = {
  id: "custom_canvas_background_color",
  beforeDraw: (chart: any) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @param experiment
 * @param index
 * @param error_bars
 * @returns
 */
const getLineDatasets = (datasets: DatasetsWithResults, error_bars: boolean) => {
  return [...datasets.entries()].map(([dataset, results], index) => {
    console.log(index);

    return {
      label: dataset.replaceAll(",", " "),
      data: [...results.values()].map((values) =>
        error_bars
          ? {
              y: mean(values),
              yMin: [minArray(values)],
              yMax: [maxArray(values)],
            }
          : mean(values)
      ),
      backgroundColor: COLORS.LINE_CHART[index],
      borderColor: COLORS.LINE_CHART[index],
    } as ChartDataset<"line", number[]>;
  });
};

// Todo refactor this properly
export const exportChartPdf = (canvas: any, index: number, configuration: Configuration) => {
  const split_x = getSettingsSplitAxisFormat("x", index, configuration);
  const split_y = getSettingsSplitAxisFormat("y", index, configuration);
  const title = `${getSettingsGraphTitle(configuration)}${split_x != "undefined" ? "_" + split_x : ""}${
    split_y != "undefined" ? "_" + split_y : ""
  }`;
  const canvasImage = canvas.toDataURL("image/jpeg", 1.0);
  const pdf = new jsPDF({
    orientation: "landscape",
  });
  pdf.setFontSize(10);
  pdf.setFillColor(204, 204, 204, 0);
  pdf.rect(10, 10, 150, 160, "F");
  pdf.addImage(canvasImage, "jpeg", 15, 15, 280, 150);
  pdf.save(title);
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const getPieDatasets = (data: DatasetsWithResults) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = [...data.values()].map((run) => mean(flat([...run.values()])));

  return [
    {
      data: results,
      backgroundColor: COLORS.LINE_CHART,
      borderColor: COLORS.LINE_CHART,
    },
  ] as ChartDataset<"pie", number[]>[];
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const getBoxPlotDatasets = (datasets: DatasetsWithResults) => {
  const getStatsFromValues = (values: number[]) => {
    return {
      min: minArray(values),
      max: maxArray(values),
      mean: mean(values),
      median: median(values),
      items: values,
      ...iqr(values),
    };
  };

  return [...datasets.entries()].map(([dataset, results], index) => ({
    label: dataset,
    data: [...results.values()].map((values) => {
      return getStatsFromValues(values);
    }),
    backgroundColor: COLORS.LINE_CHART[index],
    borderColor: COLORS.LINE_CHART[index],
  }));
};

/**
 *
 * @param experiment
 * @returns Datasets for the chart
 */
export const getDatasets = (data: DatasetsWithResults, type: GRAPH_TYPES = GRAPH_TYPES.LINE, error_bars = false) => {
  if (!data) return [];

  switch (type) {
    case GRAPH_TYPES.BAR:
    case GRAPH_TYPES.LINE: {
      return getLineDatasets(data, error_bars);
    }
    case GRAPH_TYPES.PIE: {
      return getPieDatasets(data);
    }
    case GRAPH_TYPES.BOXPLOT: {
      return getBoxPlotDatasets(data);
    }
  }
};
