import { getParameter } from "../../components/settings/utils";
import { Settings } from "../settings/types";
import { ParsedConfigurationData } from "./parser-backup";
import { groupDataByParameters } from "./parser/line";
import { ConfigurationData, GRAPH_TYPES } from "./types";

/**
 * Analyzes the configuration data and results before returning a
 * graph type. It currently only recommends between boxplot, line bar with errors and line bar.
 * @param configurationData
 * @param results
 * @param settings
 * @returns
 */
export const getRecommendedGraphType = (
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[],
  settings: Settings
) => {
  // Grouping by main parameter and other parameters
  const main_parameter = getParameter("x", settings, {
    id: configurationData.id,
    parameters: configurationData.parameters,
    measurements: configurationData.measurements,
  });
  const second_parameter = configurationData.parameters.filter((param) => param != main_parameter)[0];
  const relevantParameters = [main_parameter, second_parameter];
  const groupedData = groupDataByParameters(
    configurationData.parameters.filter((param) => relevantParameters.includes(param)),
    results
  );
  const averageResultsPerParameter =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(groupedData).reduce((acc, data) => acc + (data as any[]).length, 0) /
    Object.values(groupedData).length;

  if (averageResultsPerParameter >= 5) {
    return { recommended_type: GRAPH_TYPES.BOXPLOT, recommended_error_bars: false };
  } else if (averageResultsPerParameter > 1) {
    return { recommended_type: GRAPH_TYPES.LINE, recommended_error_bars: true };
  }

  // Default to LINE
  return { recommended_type: GRAPH_TYPES.LINE, recommended_error_bars: false };
};

/**
 * Analyzes the configuration data and results and returns whether to split the data into
 * multiple labels for the graph or group everything under the same label.
 * @param configurationData
 * @param results
 * @param settings
 * @returns
 */
export const getRecommendedGroupByOtherParams = (
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[],
  settings: Settings
) => {
  // Grouping by main parameter and other parameters
  const main_parameter = getParameter("x", settings, {
    id: configurationData.id,
    parameters: configurationData.parameters,
    measurements: configurationData.measurements,
  });
  const second_parameter = configurationData.parameters.filter((param) => param != main_parameter)[0];
  const groupedData = groupDataByParameters(second_parameter ? [second_parameter] : [], results);

  return Object.keys(groupedData).length < 6;
};

/**
 * Analyzes the configuration data and results before returning a recommended settings structure.
 * @param configurationData
 * @param results
 * @param settings
 * @returns
 */
export const getRecommendedGraphSettings = (
  configurationData: ConfigurationData,
  results: ParsedConfigurationData[],
  settings: Settings
) => {
  const { recommended_type, recommended_error_bars } = getRecommendedGraphType(configurationData, results, settings);

  return { recommended_type, recommended_error_bars };
};
