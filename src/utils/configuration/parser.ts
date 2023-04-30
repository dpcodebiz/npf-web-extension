import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";
import { getConfigurationDataByParameters, getParametersWithValues } from "./utils";
import { Settings } from "../settings/types";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>,
  settings: Settings
): Configuration {
  // TODO remove main param?
  const parametersWithValues = getParametersWithValues(configurationData.parameters, results.data);
  const configurationDataByParameters = getConfigurationDataByParameters(configurationData, results.data, settings);
  const split_parameters = {
    x: configurationDataByParameters[0].split_parameters?.x?.name,
    y: configurationDataByParameters[0].split_parameters?.y?.name,
  };

  // Preparing configuration
  const configuration: Configuration = {
    name: configurationData.name,
    parameters: parametersWithValues,
    measurements: configurationData.measurements,
    split: {
      ...(split_parameters.x ? { x: split_parameters.x } : {}),
      ...(split_parameters.y ? { y: split_parameters.y } : {}),
    },
    id: configurationData.id,
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
