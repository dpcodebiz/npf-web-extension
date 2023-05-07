import { mapValues } from "radash";
import { getParameter } from "../../../components/settings/utils";
import { Settings } from "../../settings/types";
import { ParsedConfigurationData } from "../parser";
import { ConfigurationData, Experiment, GRAPH_TYPES, ParameterizedRun } from "../types";
import { splitParams } from "../utils";
import { aggregateAllResults, groupDataByParameters, sumDataAggregation, unfoldAggregatedData } from "./line";

/**
 * Returns an array of ParameterizedRun for a pie chart
 * @param summed_results
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRunsFromGroupedDataPie(summed_results: Partial<Record<string, any>>) {
  const runs: ParameterizedRun[] = [];
  Object.entries(summed_results).forEach(([joined_params, results_data]) => {
    // Creating run
    const run: ParameterizedRun = {
      parameters: { ...splitParams(joined_params) },
      results: Object.assign({}, results_data?.experiment_data),
    };

    // Storing run
    runs.push(run);
  });

  return runs;
}

/**
 * Returns a configuration for a pie chart
 * @param settings
 * @param configurationData
 * @param results
 * @returns
 */
export const getPieChartConfiguration = (
  settings: Settings,
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[]
) => {
  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = getParameter("x", settings, configurationData);

  // Aggregating all results
  const aggregated_data = aggregateAllResults(parameters, measurements, results, sumDataAggregation);

  // Now, we unfold all the data
  const unfolded_data = unfoldAggregatedData(aggregated_data);

  // Grouping again but only by main parameter now
  const grouped_data_by_other_params = groupDataByParameters(
    parameters.filter((param) => param != main_param),
    unfolded_data
  );

  // Summing all results again
  const summed_results = mapValues(grouped_data_by_other_params, (entries) => {
    // Reducing each array of entries to one object
    const reduced_value = entries?.reduce((acc, current) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sum: any = { experiment_data: {} };

      // Summing each measurement
      measurements.forEach((measurement) => {
        sum.experiment_data[measurement] =
          current.experiment_data[measurement] + (acc?.experiment_data?.efficiency ?? 0);
      });

      return sum;
    }, {});

    // Setting each parameter value
    parameters
      .filter((parameter) => parameter != main_param)
      .forEach((parameter) => {
        reduced_value[parameter] = entries?.[0]?.[parameter];
      });

    return reduced_value;
  });

  // Creating experiment
  const experiment: Experiment = {
    metadata: {
      type: GRAPH_TYPES.PIE,
      recommended_type: GRAPH_TYPES.PIE,
      recommended_error_bars: false,
    },
    name: configurationData.name,
    main_parameter: main_param,
    runs: getRunsFromGroupedDataPie(summed_results),
  };

  return experiment;
};
