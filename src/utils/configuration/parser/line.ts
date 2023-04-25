import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, Experiment, GRAPH_TYPES, ParameterizedRun } from "../types";
import { group, mapValues, objectify } from "radash";
import { ExperimentData, ParsedConfigurationData } from "../parser";
import { joinParams, splitParams } from "../utils";

export const groupDataByParameters = (
  parameters: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configurationData: any[]
) => {
  return group(configurationData, (data) => joinParams(parameters, data));
};

/**
 * Groups all data by all common parameters and then aggregates all the results (computes average value)
 * @param parameters Parameters of the configuration
 * @param measurements Measurements of the configuration
 * @param results Raw pandas dataframe parsed from csv
 * @returns
 */
function aggregateAllResults(
  parameters: string[],
  measurements: string[],
  results: ParseResult<ParsedConfigurationData>
) {
  // Grouping all data by all params
  const grouped_data_by_all_params = groupDataByParameters(parameters, results.data);

  // Computing average of all results
  const aggregated_data = mapValues(grouped_data_by_all_params, (data) => {
    // Aggregating for each measurement
    const measurements_aggregated = objectify(
      measurements,
      (measurement) => measurement,
      (measurement) => {
        if (!data) return 0;

        const sum = data.reduce((acc, currentValue) => acc + parseFloat(currentValue[measurement]), 0) ?? 0;
        return sum / data.length;
      }
    );

    return measurements_aggregated;
  });

  return aggregated_data;
}

function getRunsFromGroupedData(
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
      [measurement]: Object.assign({}, ...(experiment_data_by_measurement(measurement) ?? [])),
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

export const unfoldAggregatedData = (aggregated_data: ReturnType<typeof aggregateAllResults>) => {
  return Object.entries(aggregated_data).map(([joined_params, v]) => {
    return {
      experiment_data: v,
      ...splitParams(joined_params),
    } as { [index: string]: string | typeof v };
  });
};

export const getLineChartConfiguration = (
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>
) => {
  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = configurationData.parameters[0];

  // Aggregating all results
  const aggregated_data = aggregateAllResults(parameters, measurements, results);

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

  // Debug
  // console.log(grouped_data_by_other_params, experiment);

  return experiment;
};
