import { getParameter } from "../../../components/settings/utils";
import { Settings } from "../../settings/types";
import { ParsedConfigurationData } from "../parser";
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
      type: GRAPH_TYPES.BOXPLOT,
      recommended_type: GRAPH_TYPES.BOXPLOT,
      recommended_error_bars: false,
    },
    name: configurationData.name,
    main_parameter: main_param,
    runs: getRunsFromGroupedData(main_param, measurements, grouped_data_by_other_params),
  };

  return experiment;
};
