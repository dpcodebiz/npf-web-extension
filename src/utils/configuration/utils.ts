import { isArray, mapValues, shake, unique } from "radash";
import { ParsedConfigurationData } from "./parser";
import { groupDataByParameters } from "./parser/line";
import { ConfigurationData, Experiment, SplitParametersData } from "./types";
import { Settings } from "../settings/types";
import { getSettingsSplitAxis } from "../../components/settings/utils";

/**
 * Joins all parameters
 * @param params_to_join List of parameters to join together
 * @param params
 * @returns
 */
export const joinParams = (params_to_join: string[], params: ParsedConfigurationData) => {
  return params_to_join.reduce((acc, param) => `${acc}${param}=${params[param]},`, "");
};

/**
 * Splits all parameters into a new Object.
 *
 * "var1=a,var2=b" => { "var1": "a", "var2": "b" }
 * @param joined_params
 * @returns
 */
export const splitParams = (joined_params: string) => {
  const separated: { [index: string]: string } = {};
  joined_params.split(",").map((paramWithValue) => {
    const [param, value] = paramWithValue.split("=");
    if (param == "") return; // Skip if no param name
    separated[param] = value;
  });
  return separated;
};

/**
 * Returns the name of each split parameter
 * @param experiment
 * @returns
 */
export const getExperimentSplitParametersNames = (experiment: Experiment) =>
  Object.values(experiment.split_parameters ?? {}).map((split_parameter) => split_parameter.name);

/**
 * Returns the split parameters for each axis (columns/rows)
 * along with their values
 * @param experiments
 * @returns
 */
export const getSplitParameters = (experiments: Experiment[]) => ({
  x: experiments[0].split_parameters?.x?.values.map((value) => ({
    name: experiments[0].split_parameters?.x?.name,
    value,
  })),
  y: experiments[0].split_parameters?.y?.values.map((value) => ({
    name: experiments[0].split_parameters?.y?.name,
    value,
  })),
});

/**
 * Groups all data by parameters then iterates over all sets and returns all values found for each parameter
 * @param dataGroupedByParameters
 * @returns
 */
const getParametersValues = (dataGroupedByParameters: ReturnType<typeof groupDataByParameters>) => {
  const keysParametersJoined = Object.keys(dataGroupedByParameters);
  const arrayOfParametersSplit = keysParametersJoined.map((joinedParams) => splitParams(joinedParams));
  const parameters = Object.keys(arrayOfParametersSplit[0]);

  // Getting values for each parameter
  const valuesForEachParameter = Object.assign(
    {},
    ...parameters.map((parameter) => ({
      [parameter]: arrayOfParametersSplit.reduce<string[]>((acc, val) => acc.concat([val[parameter]]), []),
    }))
  );

  // Remove duplicate values
  const uniqueValuesForEachParameter = mapValues(valuesForEachParameter, (values: string[]) => unique(values));

  return uniqueValuesForEachParameter;
};

/**
 * Returns all parameters along with their possible values found inside the data
 * @param parameters Acts as a filter for the parameters returned
 * @param parsedConfigurationData
 * @returns
 */
export const getParametersWithValues = (parameters: string[], parsedConfigurationData: ParsedConfigurationData[]) => {
  const dataGrouped = groupDataByParameters(parameters, parsedConfigurationData);
  const valuesForEachParameter = getParametersValues(dataGrouped);

  return valuesForEachParameter;
};

/**
 * Returns subsets of ParsedConfigurationData[] where each subset has a specific combination of parameters values.
 * @param parameters
 * @param parsedConfigurationData
 * @returns
 */
export const getConfigurationDataByParameters = (
  configurationData: ConfigurationData,
  parsedConfigurationData: ParsedConfigurationData[],
  settings: Settings
) => {
  // Getting all parameters with their values
  const parameters = configurationData.parameters;
  const parametersWithValues = getParametersWithValues(parameters, parsedConfigurationData);
  const nParameters = Object.keys(parametersWithValues).length;

  const splitParsedConfigurationData: {
    split_parameters?: SplitParametersData;
    data: ParsedConfigurationData[];
  }[] = [];

  // Split along X axis
  const parameterXEntry =
    nParameters > 2 && (getSettingsSplitAxis("x", settings, configurationData.id)?.enable ?? true)
      ? Object.entries(parametersWithValues).find(
          (entry) => entry[0] === getSettingsSplitAxis("x", settings, configurationData.id)?.parameter
        ) ?? Object.entries(parametersWithValues)[2]
      : undefined;
  const parameterYEntry =
    nParameters > 3 && (getSettingsSplitAxis("y", settings, configurationData.id)?.enable ?? true)
      ? Object.entries(parametersWithValues).find(
          (entry) => entry[0] === getSettingsSplitAxis("y", settings, configurationData.id)?.parameter
        ) ?? Object.entries(parametersWithValues)[3]
      : undefined;

  if (parameterXEntry || parameterYEntry) {
    const [parameterX, valuesX] = parameterXEntry ?? [];
    const [parameterY, valuesY] = parameterYEntry ?? [];

    // Filtering data by parameters
    const configurationDataByParameters = parameterXEntry
      ? (valuesX as string[]).map((valueX) =>
          parameterYEntry
            ? (valuesY as string[]).map((valueY) =>
                parsedConfigurationData.filter(
                  (data) => data[parameterX as string] == valueX && data[parameterY as string] == valueY
                )
              )
            : parsedConfigurationData.filter((data) => data[parameterX as string] == valueX)
        )
      : (valuesY as string[]).map((valueY) =>
          parsedConfigurationData.filter((data) => data[parameterY as string] == valueY)
        );

    // Iterating through all possible combinations
    configurationDataByParameters.forEach((subResultsXorY) => {
      // We have both x and y
      if (parameterXEntry && parameterYEntry) {
        (subResultsXorY as ParsedConfigurationData[][]).forEach((subResultsXY) => {
          splitParsedConfigurationData.push({
            split_parameters: {
              x: {
                name: parameterX as string,
                values: valuesX as string[],
              },
              y: {
                name: parameterY as string,
                values: valuesY as string[],
              },
            },
            data: subResultsXY,
          });
        });
        return;
      }

      splitParsedConfigurationData.push({
        split_parameters: {
          ...(parameterXEntry
            ? {
                x: {
                  name: parameterX as string,
                  values: valuesX as string[],
                },
              }
            : {}),
          ...(parameterYEntry
            ? {
                y: {
                  name: parameterY as string,
                  values: valuesY as string[],
                },
              }
            : {}),
        },
        data: subResultsXorY as ParsedConfigurationData[],
      });
    });
  } else {
    // No need to split the data so just pushing the data
    splitParsedConfigurationData.push({
      data: parsedConfigurationData,
    });
  }

  return splitParsedConfigurationData;
};
