import { ChartDataset } from "chart.js";
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "./configuration/types";
import { splitParams } from "./configuration/utils";
import { iqr, maxArray, mean, median, minArray } from "@basementuniverse/stats";
import { getParameter } from "../components/settings/utils";
import { Settings } from "./settings/types";
import { flat } from "radash";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (datasets: DatasetsWithResults, settings: Settings, configuration: Configuration) => {
  if (!datasets) return [];

  const mainParameter = getParameter("x", settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
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
  LINE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
  PIE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
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
  return [...datasets.entries()].map(
    ([dataset, results], index) =>
      ({
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
      } as ChartDataset<"line", number[]>)
  );
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
