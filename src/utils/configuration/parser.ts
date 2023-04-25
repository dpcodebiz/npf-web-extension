import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES, Settings } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>,
  settings: Settings
): Configuration {
  // Analyzing data and getting recommended graph type for this data
  const recommended_graph_type = getRecommendedGraphType(configurationData, results);
  const selected_graph_type = settings[configurationData.id]?.type ?? recommended_graph_type;

  // Preparing configuration
  const configuration: Configuration = {
    experiments: [],
  };

  switch (selected_graph_type) {
    case GRAPH_TYPES.LINE: {
      configuration.experiments.push({
        ...getLineChartConfiguration(configurationData, results),
        metadata: {
          type: GRAPH_TYPES.LINE,
          recommended_type: recommended_graph_type,
        },
      });
      break;
    }
    case GRAPH_TYPES.BAR: {
      configuration.experiments.push({
        ...getLineChartConfiguration(configurationData, results),
        metadata: { type: GRAPH_TYPES.BAR, recommended_type: recommended_graph_type },
      });
      break;
    }
  }

  return configuration;
}
