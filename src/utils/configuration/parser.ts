import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, DatasetsWithResults, GRAPH_TYPES, Results } from "./types";
import { getRecommendedGraphSettings, getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration } from "./parser/line";
import {
  getConfigurationDataByParameters,
  getParametersWithValues,
  getSplitParameters,
  joinParams,
  splitParams,
} from "./utils";
import { Settings } from "../settings/types";
import { getPieChartConfiguration } from "./parser/doughnut";
import { getBoxPlotChartConfiguration } from "./parser/boxplot";
import { flat, group, isEmpty, mapEntries, mapValues, omit } from "radash";
import { getSettingsParametersOptions, getSplitParameter } from "../../components/settings/utils";
import { getParameter } from "../../components/settings/utils";

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
  // Parsing results
  const dataParsed = results.data;

  // Recommendations
  const recommendedGraphSettings = getRecommendedGraphSettings(configurationData, dataParsed, settings);

  // Data
  const parameters = configurationData.parameters;
  const parametersWithValues = getParametersWithValues(parameters, dataParsed);
  const measurements = configurationData.measurements;
  const configurationId = configurationData.id;

  // Main parameters
  const mainParameter = getParameter("x", settings, configurationData);
  const mainMeasurement = getParameter("y", settings, configurationData);

  // Retrieving split
  const splitParameters = [
    getSplitParameter("x", settings, { id: configurationId, split: {} }),
    getSplitParameter("y", settings, { id: configurationId, split: {} }),
  ];
  const splitX = splitParameters[0] != "undefined" && splitParameters[0] != undefined;
  const [primarySplitParameter, secondarySplitParameter] = [
    splitParameters.filter((param) => param != "undefined" && param != undefined)[0],
    splitParameters.filter((param) => param != "undefined" && param != undefined)[1],
  ];
  const primarySplitValues: Set<string> = new Set();
  const secondarySplitValues: Set<string> = new Set();

  // Handling split
  const groupByParameter = (dataParsed: ParsedConfigurationData[], parameter: string) => {
    let dataByParameter = group(dataParsed, (result) => joinParams([parameter], result));
    dataByParameter = mapValues(dataByParameter, (results) => results?.map((result) => omit(result, [parameter])));

    return dataByParameter;
  };
  const groupByMainParameter = (dataParsed: ParsedConfigurationData[]) => {
    // Dataset for current split
    const datasetsWithResults: DatasetsWithResults = new Map<string, Results>();

    const otherParameters = parameters.filter(
      (parameter) => ![mainParameter, primarySplitParameter, secondarySplitParameter].includes(parameter)
    );
    const dataByOtherParameters = group(dataParsed, (result) => joinParams(otherParameters, result)) as {
      [index: string]: ParsedConfigurationData[];
    };
    const dataByMainParameter = mapValues(dataByOtherParameters, (dataGrouped) =>
      group(dataGrouped, (dataGroupedEntry) => joinParams([mainParameter], dataGroupedEntry))
    );
    const measurementByMainParameter = mapValues(dataByMainParameter, (dataGroupedByOtherParam) =>
      mapValues(dataGroupedByOtherParam, (dataGroupedByMainParameter) =>
        dataGroupedByMainParameter?.map((entry) => entry[mainMeasurement])
      )
    );

    // Getting uniformized keys
    const uniqueKeys = new Set();
    Object.values(measurementByMainParameter).forEach((results) => {
      Object.keys(results).forEach((key) => uniqueKeys.add(key));
    });
    const uniqueKeysRaw = [...uniqueKeys.values()] as string[];
    const uniqueKeysValuesRaw = uniqueKeysRaw.map((v) => {
      const splitted = splitParams(v as string);
      return Object.values(splitted)[0];
    });
    const hasNumberLabels = !isNaN(parseInt(uniqueKeysValuesRaw[0]));
    const uniqueKeysSorted = hasNumberLabels
      ? [...uniqueKeysRaw].sort(
          (a, b) => parseFloat(splitParams(a)[mainParameter]) - parseFloat(splitParams(b)[mainParameter])
        )
      : ([...uniqueKeysRaw].sort() as string[]);

    // Storing datasets
    for (const datasetEntry of Object.entries(measurementByMainParameter)) {
      const [key, dataset] = datasetEntry;

      // Results map
      const results: Results = new Map<string, number[]>();

      // Filling in missing values with empty results
      for (const key of uniqueKeysSorted) {
        results.set(key, dataset[key]?.map((v) => parseFloat(v)) ?? []);
      }

      datasetsWithResults.set(key, results);
    }

    return datasetsWithResults;
  };

  const dataByPrimaryOrSecondary = secondarySplitParameter
    ? groupByParameter(dataParsed, secondarySplitParameter)
    : primarySplitParameter
    ? groupByParameter(dataParsed, primarySplitParameter)
    : {};
  const dataNested = secondarySplitParameter
    ? mapValues(dataByPrimaryOrSecondary, (dataParsed) =>
        groupByParameter(dataParsed as ParsedConfigurationData[], primarySplitParameter)
      )
    : dataByPrimaryOrSecondary;
  const datasetsBySplitParameter = mapValues(dataNested as any, (dataParsedOrObject) =>
    secondarySplitParameter
      ? mapEntries(dataParsedOrObject as any, (key, dataParsed) => [
          key,
          groupByMainParameter(dataParsed as unknown as ParsedConfigurationData[]),
        ])
      : groupByMainParameter(dataParsedOrObject as ParsedConfigurationData[])
  );
  const splitDatasetsReduced = secondarySplitParameter
    ? flat(Object.values(datasetsBySplitParameter).map((v) => Object.values(v)))
    : Object.values(datasetsBySplitParameter);

  // Adding split values
  Object.entries(secondarySplitParameter ? dataNested : dataByPrimaryOrSecondary).forEach(
    ([primaryOrSecondaryKey, primaryOrSecondaryValues]) => {
      if (secondarySplitParameter) {
        const secondarySplitValue = splitParams(primaryOrSecondaryKey)[secondarySplitParameter];
        secondarySplitValues.add(secondarySplitValue);

        Object.keys(primaryOrSecondaryValues)
          .map((key) => splitParams(key)[primarySplitParameter])
          .forEach((primarySplitValue) => primarySplitValues.add(primarySplitValue));

        return;
      }

      const primarySplitValue = splitParams(primaryOrSecondaryKey)[primarySplitParameter];
      primarySplitValues.add(primarySplitValue);
    }
  );

  // Final datasets
  const finalDatasets = splitDatasetsReduced.length > 0 ? splitDatasetsReduced : [groupByMainParameter(dataParsed)];

  console.log(
    "data",
    dataByPrimaryOrSecondary,
    splitDatasetsReduced,
    finalDatasets,
    // mainParameter,
    secondarySplitValues
  );

  return {
    id: configurationId,
    data: finalDatasets,
    type: GRAPH_TYPES.LINE,
    parameters: parametersWithValues,
    measurements: measurements,
    x: mainParameter,
    y: mainMeasurement,
    split: {
      ...(primarySplitParameter
        ? { [splitX ? "x" : "y"]: { name: primarySplitParameter, values: [...primarySplitValues.values()] } }
        : {}),
      ...(secondarySplitParameter
        ? { y: { name: secondarySplitParameter, values: [...secondarySplitValues.values()] } }
        : {}),
    },
    ...recommendedGraphSettings,
  } as Configuration;
}
