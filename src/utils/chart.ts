import { ChartDataset } from "chart.js";
import { Configuration, Experiment, Run } from "./data";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  // TODO iterate through each experiment
  return experiment.runs.map(({ results }) => Object.keys(results));
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToDataset = (run: Run) =>
  ({
    label: run.parameters,
    data: Object.values(run.results),
    backgroundColor: "blue",
    borderColor: "blue",
  } as ChartDataset<"line", number[]>);

/**
 *
 * @param experiment
 * @returns Datasets for the chart
 */
export const getDatasets = (experiment: Experiment) => {
  if (!experiment) return [];

  return experiment.runs.map((run) => runToDataset(run));
};
