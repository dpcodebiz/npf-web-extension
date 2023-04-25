import { ParseResult } from "papaparse";
import { ParsedConfigurationData } from "./parser";
import { ConfigurationData, GRAPH_TYPES } from "./types";

export const getRecommendedGraphType = (
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>
) => {
  // Getting number of parameters
  const paramsCount = configurationData.parameters.length;
  const measurementsCount = configurationData.measurements.length;

  // Only one param
  if (paramsCount == 1) {
    switch (measurementsCount) {
      case 1: {
        return GRAPH_TYPES.LINE;
      }
      case 2: {
        return GRAPH_TYPES.BAR;
      }
    }
  }

  // Default to LINE
  return GRAPH_TYPES.LINE;
};
