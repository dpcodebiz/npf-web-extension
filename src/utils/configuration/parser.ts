import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES, Settings, SplitParametersData } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";
import { getConfigurationDataByParameters } from "./utils";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>,
  settings: Settings
): Configuration {
  // TODO remove main param?
  const configurationDataByParameters = getConfigurationDataByParameters(configurationData.parameters, results.data);

  // Preparing configuration
  const configuration: Configuration = {
    experiments: [],
  };

  configurationDataByParameters.forEach((data) => {
    const { split_parameters, data: resultsByChangingParameter } = data;

    // Analyzing data and getting recommended graph type for this data
    const recommended_graph_type = getRecommendedGraphType(configurationData, resultsByChangingParameter);
    const selected_graph_type = settings[configurationData.id]?.type ?? recommended_graph_type;

    switch (selected_graph_type) {
      case GRAPH_TYPES.LINE: {
        configuration.experiments.push({
          ...getLineChartConfiguration(configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: {
            type: GRAPH_TYPES.LINE,
            recommended_type: recommended_graph_type,
          },
        });
        break;
      }
      case GRAPH_TYPES.BAR: {
        configuration.experiments.push({
          ...getLineChartConfiguration(configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: { type: GRAPH_TYPES.BAR, recommended_type: recommended_graph_type },
        });
        break;
      }
    }
  });

  return configuration;
}
