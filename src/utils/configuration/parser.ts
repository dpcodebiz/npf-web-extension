import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>
): Configuration {
  // Analyzing data and getting recommended graph type for this data
  const recommended_graph_type = getRecommendedGraphType(configurationData, results);

  // Preparing configuration
  const configuration: Configuration = {
    experiments: [],
  };

  switch (recommended_graph_type) {
    case GRAPH_TYPES.LINE: {
      configuration.experiments.push(getLineChartConfiguration(configurationData, results));
      break;
    }
  }

  return configuration;
}
