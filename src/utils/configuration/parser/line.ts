/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigurationData, Experiment, GRAPH_TYPES, ParameterizedRun } from "../types";
import { group, mapValues, objectify } from "radash";
import { ExperimentData, ParsedConfigurationData } from "../parser";
import { joinParams, splitParams } from "../utils";
import { getParameter } from "../../../components/settings/utils";
import { Settings } from "../../settings/types";

/**
 * Groups a set of configurationData by parameters
 * @param parameters
 * @param configurationData
 * @returns
 */
export const groupDataByParameters = (
  parameters: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configurationData: any[]
) => {
  return group(configurationData, (data) => joinParams(parameters, data));
};

export const mergeValuesAggregation = (data: { [index: string]: string }[], measurement: string) =>
  data.reduce((acc, currentValue) => acc.concat([parseFloat(currentValue[measurement])]), [] as number[]);

export const sumDataAggregation = (data: { [index: string]: string }[], measurement: string) => {
  const sum = data.reduce((acc, currentValue) => acc + parseFloat(currentValue[measurement]), 0);
  return sum / data.length;
};

/**
 * Groups all data by all common parameters and then aggregates all the results (computes average value)
 * @param parameters Parameters of the configuration
 * @param measurements Measurements of the configuration
 * @param results Raw pandas dataframe parsed from csv
 * @returns
 */
export function aggregateAllResults(
  parameters: string[],
  measurements: string[],
  results: ParsedConfigurationData[],
  aggregation: (data: any, measurement: string) => any
) {
  // Grouping all data by all params
  const grouped_data_by_all_params = groupDataByParameters(parameters, results);

  // Computing average of all results
  const aggregated_data = mapValues(grouped_data_by_all_params, (data) => {
    // Aggregating for each measurement
    const measurements_aggregated = objectify(
      measurements,
      (measurement) => measurement,
      (measurement) => {
        return aggregation(data, measurement);
      }
    );

    return measurements_aggregated;
  });

  return aggregated_data;
}

/**
 * Returns an array of parameterized runs
 * @param main_param
 * @param measurements
 * @param grouped_data_by_params
 * @returns
 */
export function getRunsFromGroupedData(
  main_param: string,
  measurements: string[],
  grouped_data_by_params: ReturnType<typeof groupDataByParameters>
) {
  const runs: ParameterizedRun[] = [];
  Object.entries(grouped_data_by_params).forEach(([joined_params, results_data]) => {
    // Remaps { [measurement]: value }[] into { [main_param]: value }[]
    const experiment_data_by_measurement = (measurement: string) =>
      results_data?.map((result_data) => ({
        [result_data[main_param]]: (result_data.experiment_data as unknown as ExperimentData)[measurement],
      }));

    // Merges all { [main_param]: value }[] into ({ [measurement]: { [main_param]: value } })
    const results_by_measurement = measurements.map((measurement) => ({
      [measurement]: Object.assign({}, ...(experiment_data_by_measurement(measurement) as any)),
    }));

    // Creating run
    const run: ParameterizedRun = {
      parameters: { ...splitParams(joined_params) },
      results: Object.assign({}, ...results_by_measurement),
    };

    // Storing run
    runs.push(run);
  });

  return runs;
}

/**
 * Unfolds a set of aggregated data and stores all the parameters with their values inside
 * the experiment_data key
 * @param aggregated_data
 * @returns
 */
export const unfoldAggregatedData = (aggregated_data: ReturnType<typeof aggregateAllResults>) => {
  return Object.entries(aggregated_data).map(([joined_params, v]) => {
    return {
      experiment_data: v,
      ...splitParams(joined_params),
    } as { [index: string]: string | typeof v };
  });
};

export const getLineChartConfiguration = (
  settings: Settings,
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[]
) => {
  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = getParameter("x", settings, configurationData);

  // Aggregating all results
  const aggregated_data = aggregateAllResults(parameters, measurements, results, mergeValuesAggregation);

  // Now, we unfold all the data
  const unfolded_data = unfoldAggregatedData(aggregated_data);

  // Grouping again but only by main parameter now
  const grouped_data_by_other_params = groupDataByParameters(
    parameters.filter((param) => param != main_param),
    unfolded_data
  );

  // Creating experiment
  const experiment: Experiment = {
    metadata: {
      type: GRAPH_TYPES.LINE,
      recommended_type: GRAPH_TYPES.LINE,
    },
    name: configurationData.name,
    main_parameter: main_param,
    runs: getRunsFromGroupedData(main_param, measurements, grouped_data_by_other_params),
  };

  return experiment;
};
