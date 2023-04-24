import { ParseResult } from "papaparse";
import { ParsedConfigurationData } from "./parser";
import { ConfigurationData, GRAPH_TYPES } from "./types";

export const getRecommendedGraphType = (
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>
) => {
  return GRAPH_TYPES.LINE;
};
