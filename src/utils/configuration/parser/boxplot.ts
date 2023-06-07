import { getParameter } from "../../../components/settings/utils";
import { Settings } from "../../settings/types";
import { getRecommendedGroupByOtherParams } from "../data_analyzer";
import { ParsedConfigurationData } from "../parser-backup";
import { ConfigurationData, Experiment, GRAPH_TYPES } from "../types";
import {
  aggregateAllResults,
  getRunsFromGroupedData,
  groupDataByParameters,
  mergeValuesAggregation,
  unfoldAggregatedData,
} from "./line";

export const getBoxPlotChartConfiguration = (
  settings: Settings,
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[]
) => {
  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = getParameter("x", settings, configurationData);
  const second_param = parameters.filter((param) => param != main_param)[0];
  const group_by_other_params = getRecommendedGroupByOtherParams(configurationData, results, settings);

  // Aggregating all results
  const aggregated_data = aggregateAllResults(parameters, measurements, results, mergeValuesAggregation);

  // Now, we unfold all the data
  const unfolded_data = unfoldAggregatedData(aggregated_data);

  // Grouping again but only by main parameter now
  const grouped_data_by_other_params = groupDataByParameters(
    group_by_other_params && second_param ? [second_param] : [],
    unfolded_data
  );

  // Creating experiment
  const experiment: Experiment = {
    metadata: {
      type: GRAPH_TYPES.BOXPLOT,
      recommended_type: GRAPH_TYPES.BOXPLOT,
      recommended_error_bars: false,
    },
    name: configurationData.name,
    main_parameter: main_param,
    runs: getRunsFromGroupedData(
      main_param,
      measurements,
      group_by_other_params
        ? grouped_data_by_other_params
        : { ["parameter=" + main_param]: grouped_data_by_other_params[""] }
    ),
  };

  return experiment;
};
