import { ChartDataset } from "chart.js";
import { Configuration, Run } from "./data";

/**
 * @param configuration
 * @returns Labels for the chart
 */
export const getLabel = (configuration: Configuration) => {
  if (!configuration) return;

  // TODO iterate through each experiment
  const experiment = configuration.experiments[0];

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
 * @param configuration
 * @returns Datasets for the chart
 */
export const getDatasets = (configuration: Configuration) => {
  if (!configuration) return;

  // TODO iterate through each experiment
  const experiment = configuration.experiments[0];

  return experiment.runs.map((run) => runToDataset(run));
};
