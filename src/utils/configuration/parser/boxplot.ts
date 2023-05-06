import { mapValues, objectify } from "radash";
import { getParameter } from "../../../components/settings/utils";
import { Settings } from "../../settings/types";
import { ParsedConfigurationData } from "../parser";
import { ConfigurationData, Experiment, GRAPH_TYPES } from "../types";
import { getRunsFromGroupedData, groupDataByParameters, unfoldAggregatedData } from "./line";

/**
 * Groups all data by all common parameters and then aggregates all the results (concatenates all results into a single array)
 * @param parameters Parameters of the configuration
 * @param measurements Measurements of the configuration
 * @param results Raw pandas dataframe parsed from csv
 * @returns
 */
function aggregateAllResults(parameters: string[], measurements: string[], results: ParsedConfigurationData[]) {
  // Grouping all data by all params
  const grouped_data_by_all_params = groupDataByParameters(parameters, results);

  // Retrieving all values
  const aggregated_data = mapValues(grouped_data_by_all_params, (data) => {
    // Aggregating for each measurement
    const measurements_aggregated = objectify(
      measurements,
      (measurement) => measurement,
      (measurement) => {
        if (!data) return 0;
        return data.reduce((acc, currentValue) => acc.concat([parseFloat(currentValue[measurement])]), []);
      }
    );

    return measurements_aggregated;
  });

  return aggregated_data;
}

export const getBoxPlotChartConfiguration = (
  settings: Settings,
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[]
) => {
  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = getParameter("x", settings, configurationData);

  // Aggregating all results
  const aggregated_data = aggregateAllResults(parameters, measurements, results);

  console.log(aggregated_data);

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
      type: GRAPH_TYPES.BOXPLOT,
      recommended_type: GRAPH_TYPES.BOXPLOT,
    },
    name: configurationData.name,
    main_parameter: main_param,
    runs: getRunsFromGroupedData(main_param, measurements, grouped_data_by_other_params),
  };

  // Debug
  // console.log(grouped_data_by_other_params);

  return experiment;
};
