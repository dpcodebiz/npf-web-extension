import { ChartDataset } from "chart.js";
import { Experiment, ParameterizedRun } from "./configuration/types";
import { joinParams } from "./configuration/utils";
import { first } from "radash";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  const results = experiment.runs[0].results;

  return Object.keys(results[Object.keys(results)[0]]);
};

const COLORS = {
  BARS_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
  LINE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToDataset = (run: ParameterizedRun, index: number) => {
  return {
    label: joinParams(Object.keys(run.parameters), run.parameters).replaceAll(",", "\n"),
    data: Object.values(Object.values(run.results)[0]),
    backgroundColor: COLORS.LINE_CHART[index],
    borderColor: COLORS.LINE_CHART[index],
  } as ChartDataset<"line", number[]>; // TODO
};

/**
 *
 * @param experiment
 * @returns Datasets for the chart
 */
export const getDatasets = (experiment: Experiment) => {
  if (!experiment) return [];

  // Starting to generate conditional graphs
  if (Object.keys(experiment.runs[0].results).length > 1) {
    return Object.entries(experiment.runs[0].results).map(
      ([key, values], index) =>
        ({
          label: key,
          data: Object.values(values),
          backgroundColor: COLORS.LINE_CHART[index],
          borderColor: COLORS.LINE_CHART[index],
        } as ChartDataset<"line", number[]>)
    );
  }

  return experiment.runs.map((run, index) => runToDataset(run, index));
};
