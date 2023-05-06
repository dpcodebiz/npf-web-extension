import { ChartDataset } from "chart.js";
import { Experiment, GRAPH_TYPES, ParameterizedRun } from "./configuration/types";
import { getExperimentSplitParametersNames, joinParams } from "./configuration/utils";
import { iqr, maxArray, mean, median, minArray } from "@basementuniverse/stats";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  const results = experiment.runs[0].results;

  return Object.keys(results[Object.keys(results)[0]]);
};

export const getPieLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  const splitParameters = getExperimentSplitParametersNames(experiment);
  const parametersWithoutSplitParametersPerRun = experiment.runs.map((run) => {
    const parametersWithoutSplitParameters = Object.keys(run.parameters).filter(
      (parameter) => !splitParameters.includes(parameter)
    );

    return joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", "\n");
  });

  return parametersWithoutSplitParametersPerRun;
};

export const COLORS = {
  BARS_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
  LINE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
  PIE_CHART: ["#10094e", "#56005b", "#8f005c", "#bf1354", "#e34343", "#f9732c", "#ffa600"],
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToLineDataset = (run: ParameterizedRun, experiment: Experiment, index: number) => {
  const splitParameters = getExperimentSplitParametersNames(experiment);
  const parametersWithoutSplitParameters = Object.keys(run.parameters).filter(
    (parameter) => !splitParameters.includes(parameter)
  );

  return {
    label: joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", "\n"),
    data: Object.values(Object.values(run.results)[0]),
    backgroundColor: COLORS.LINE_CHART[index],
    borderColor: COLORS.LINE_CHART[index],
  } as ChartDataset<"line", number[]>;
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToPieDataset = (experiment: Experiment) => {
  const results = experiment.runs.map((run) => Object.values(run.results)[0]) as any;

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
const runToBoxPlotDataset = (run: ParameterizedRun, experiment: Experiment, index: number) => {
  const splitParameters = getExperimentSplitParametersNames(experiment);
  const parametersWithoutSplitParameters = Object.keys(run.parameters).filter(
    (parameter) => !splitParameters.includes(parameter)
  );

  const getStatsFromValues = (values: number[]) => ({
    min: minArray(values),
    max: maxArray(values),
    mean: mean(values),
    median: median(values),
    items: values,
    ...iqr(values),
  });

  return {
    label: joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", "\n"),
    data: (Object.values(Object.values(run.results)[0]) as unknown as number[][]).map((values) => {
      return getStatsFromValues(values);
    }),
    backgroundColor: COLORS.LINE_CHART[index],
    borderColor: COLORS.LINE_CHART[index],
  };
};

/**
 *
 * @param experiment
 * @returns Datasets for the chart
 */
export const getDatasets = (experiment: Experiment, type: GRAPH_TYPES = GRAPH_TYPES.LINE) => {
  if (!experiment) return [];

  switch (type) {
    case GRAPH_TYPES.BAR:
    case GRAPH_TYPES.LINE: {
      // TODO remove this because this is related to multiple results
      // (measurements and it instead show only one result and the user should actually prepare the data correctly)
      return Object.keys(experiment.runs[0].results).length > 1
        ? Object.entries(experiment.runs[0].results).map(
            ([key, values], index) =>
              ({
                label: key,
                data: Object.values(values),
                backgroundColor: COLORS.LINE_CHART[index],
                borderColor: COLORS.LINE_CHART[index],
              } as ChartDataset<"line", number[]>)
          )
        : experiment.runs.map((run, index) => runToLineDataset(run, experiment, index));
    }
    case GRAPH_TYPES.PIE: {
      return runToPieDataset(experiment);
    }
    case GRAPH_TYPES.BOXPLOT: {
      return experiment.runs.map((run, index) => runToBoxPlotDataset(run, experiment, index));
    }
  }
};
