import { ChartDataset } from "chart.js";
import { Configuration, Experiment, GRAPH_TYPES, ParameterizedRun } from "./configuration/types";
import { getExperimentSplitParametersNames, joinParams } from "./configuration/utils";
import { iqr, maxArray, mean, median, minArray } from "@basementuniverse/stats";
import { getParameter } from "../components/settings/utils";
import { Settings } from "./settings/types";

/**
 * @param experiment
 * @returns Labels for the chart
 */
export const getLabel = (experiment: Experiment, settings: Settings, configuration: Configuration) => {
  if (!experiment) return [];

  const results = experiment.runs[0].results;
  const param = getParameter("y", settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
  });

  return Object.keys(results[param]);
};

export const getPieLabel = (experiment: Experiment) => {
  if (!experiment) return [];

  const splitParameters = getExperimentSplitParametersNames(experiment);
  const parametersWithoutSplitParametersPerRun = experiment.runs.map((run) => {
    const parametersWithoutSplitParameters = Object.keys(run.parameters).filter(
      (parameter) => !splitParameters.includes(parameter)
    );

    return joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", " ");
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
 * @param experiment
 * @param index
 * @param error_bars
 * @returns
 */
const runToLineDataset = (
  run: ParameterizedRun,
  experiment: Experiment,
  index: number,
  error_bars: boolean,
  settings: Settings,
  configuration: Configuration
) => {
  const splitParameters = getExperimentSplitParametersNames(experiment);
  const parametersWithoutSplitParameters = Object.keys(run.parameters).filter(
    (parameter) => !splitParameters.includes(parameter)
  );
  const param = getParameter("y", settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
  });

  return {
    label: joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", " "),
    data: Object.values(run.results[param]).map((values) =>
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
};

/**
 * Returns a chart dataset for a given run
 * @param run
 * @returns
 */
const runToPieDataset = (experiment: Experiment) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    label: joinParams(parametersWithoutSplitParameters, run.parameters).replaceAll(",", " "),
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
export const getDatasets = (
  experiment: Experiment,
  settings: Settings,
  configuration: Configuration,
  type: GRAPH_TYPES = GRAPH_TYPES.LINE,
  error_bars = false
) => {
  if (!experiment) return [];

  switch (type) {
    case GRAPH_TYPES.BAR:
    case GRAPH_TYPES.LINE: {
      return experiment.runs.map((run, index) =>
        runToLineDataset(run, experiment, index, error_bars, settings, configuration)
      );
    }
    case GRAPH_TYPES.PIE: {
      return runToPieDataset(experiment);
    }
    case GRAPH_TYPES.BOXPLOT: {
      return experiment.runs.map((run, index) => runToBoxPlotDataset(run, experiment, index));
    }
  }
};
