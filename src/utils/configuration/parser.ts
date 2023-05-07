import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";
import { getConfigurationDataByParameters, getParametersWithValues } from "./utils";
import { Settings } from "../settings/types";
import { getPieChartConfiguration } from "./parser/doughnut";
import { getBoxPlotChartConfiguration } from "./parser/boxplot";
import { isEmpty } from "radash";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

/**
 * Returns a Configuration based on a specified configuration data,
 * parsed results and settings. This is the most important method of the app
 * as it returns the data structure used by the rendering component.
 * @param configurationData
 * @param results
 * @param settings
 * @returns
 */
export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>,
  settings: Settings
): Configuration {
  if (isEmpty(results.data))
    return {
      id: configurationData.id,
      parameters: {},
      name: configurationData.name,
      split: {},
      experiments: [],
      measurements: configurationData.measurements,
    };

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
    const { recommended_type, recommended_error_bars } = getRecommendedGraphType(
      configurationData,
      resultsByChangingParameter,
      settings
    );
    const selected_graph_type = settings[configurationData.id]?.type ?? recommended_type;

    switch (selected_graph_type) {
      case GRAPH_TYPES.LINE: {
        configuration.experiments.push({
          ...getLineChartConfiguration(settings, configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: {
            type: GRAPH_TYPES.LINE,
            recommended_type: recommended_type,
            recommended_error_bars: recommended_error_bars,
          },
        });
        break;
      }
      case GRAPH_TYPES.BAR: {
        configuration.experiments.push({
          ...getLineChartConfiguration(settings, configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: {
            type: GRAPH_TYPES.BAR,
            recommended_type: recommended_type,
            recommended_error_bars: recommended_error_bars,
          },
        });
        break;
      }
      case GRAPH_TYPES.PIE: {
        configuration.experiments.push({
          ...getPieChartConfiguration(settings, configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: {
            type: GRAPH_TYPES.PIE,
            recommended_type: recommended_type,
            recommended_error_bars: recommended_error_bars,
          },
        });
        break;
      }
      case GRAPH_TYPES.BOXPLOT: {
        configuration.experiments.push({
          ...getBoxPlotChartConfiguration(settings, configurationData, resultsByChangingParameter),
          split_parameters,
          metadata: {
            type: GRAPH_TYPES.BOXPLOT,
            recommended_type: recommended_type,
            recommended_error_bars: recommended_error_bars,
          },
        });
        break;
      }
    }
  });

  return configuration;
}
