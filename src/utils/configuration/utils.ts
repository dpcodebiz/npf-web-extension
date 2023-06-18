import { mapValues, unique } from "radash";
import { ParsedConfigurationData } from "./parser";
import { groupDataByParameters } from "./parser/line";
import { Configuration } from "./types";

/**
 * Joins all parameters
 * @param params_to_join List of parameters to join together
 * @param params
 * @returns
 */
export const joinParams = (params_to_join: string[], params: ParsedConfigurationData) => {
  return params_to_join.reduce((acc, param) => `${acc}${param}=${params[param]},`, "").slice(0, -1);
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
 * Returns the split parameters for each axis (columns/rows)
 * along with their values
 * @param experiments
 * @returns
 */
export const getSplitParameters = (configuration: Configuration) => ({
  x: configuration.split?.x?.values.map((value) => ({
    name: configuration.split?.x?.name,
    value,
  })),
  y: configuration.split?.y?.values.map((value) => ({
    name: configuration.split?.y?.name,
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
