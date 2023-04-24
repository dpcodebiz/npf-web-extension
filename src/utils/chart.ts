import { ChartDataset } from "chart.js";
import { Configuration, Experiment, ParameterizedRun, Run } from "./configuration/types";
import { joinParams } from "./configuration";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  const results = experiment.runs[0].results;

  return Object.keys(results[Object.keys(results)[0]]);
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToDataset = (run: ParameterizedRun) => {
  return {
    label: joinParams(Object.keys(run.parameters), run.parameters),
    data: Object.values(Object.values(run.results)[0]),
    backgroundColor: "blue", // TODO
    borderColor: "blue", // TODO
  } as ChartDataset<"line", number[]>; // TODO
};

/**
 *
 * @param experiment
 * @returns Datasets for the chart
 */
export const getDatasets = (experiment: Experiment) => {
  if (!experiment) return [];

  return experiment.runs.map((run) => runToDataset(run));
};
