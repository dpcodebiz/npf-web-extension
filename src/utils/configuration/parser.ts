import { ParseResult } from "papaparse";
import { Configuration, ConfigurationData, GRAPH_TYPES, Settings, SplitParameter, SplitParametersData } from "./types";
import { getRecommendedGraphType } from "./data_analyzer";
import { getLineChartConfiguration, groupDataByParameters } from "./parser/line";
import { splitParams } from "./utils";
import { mapValues, shake, unique } from "radash";

export type ParsedConfigurationData = { [index: string]: string };
export type ExperimentData = { [index: string]: number };

export function resultsToConfiguration(
  configurationData: ConfigurationData,
  results: ParseResult<ParsedConfigurationData>,
  settings: Settings
): Configuration {
  // Checking how many parameters vary
  const getParametersValues = (dataGroupedByParameters: any) => {
    const keysParametersJoined = Object.keys(dataGroupedByParameters);
    const arrayOfParametersSplit = keysParametersJoined.map((joinedParams) => splitParams(joinedParams));
    const parameters = Object.keys(arrayOfParametersSplit[0]);

    // Getting values for each parameter
    const valuesForEachParameter = Object.assign(
      {},
      ...parameters.map((parameter) => ({
        [parameter]: arrayOfParametersSplit.reduce<any>((acc, val) => acc.concat([val[parameter]]), []),
      }))
    );
    const uniqueValuesForEachParameter = mapValues(valuesForEachParameter, (values: any) => unique(values));

    return uniqueValuesForEachParameter;
  };

  const getChangingParameters = (unique = true) => {
    const dataGrouped = groupDataByParameters(configurationData.parameters, results.data);
    const valuesForEachParameter = getParametersValues(dataGrouped);
    const changingParameters = shake(valuesForEachParameter, (values) => values.length < 2);

    console.log(getParametersValues(dataGrouped), valuesForEachParameter, changingParameters);

    return unique ? changingParameters : valuesForEachParameter;
  };

  const changingParameters = getChangingParameters(false);
  const nChangingParameters = Object.keys(changingParameters).length;

  const splitParsedConfigurationData: {
    split_parameters?: SplitParametersData;
    data: ParsedConfigurationData[];
  }[] = [];

  // Split along X axis
  if (nChangingParameters > 2) {
    const [changingParameterX, valuesX] = Object.entries(changingParameters)[2];

    // Split along Y axis
    if (nChangingParameters > 3) {
      const [changingParameterY, valuesY] = Object.entries(changingParameters)[3];

      for (const valueX of valuesX) {
        for (const valueY of valuesY) {
          const resultsByChangingParameter = results.data.filter(
            (data) => data[changingParameterX] == valueX && data[changingParameterY] == valueY
          );

          splitParsedConfigurationData.push({
            split_parameters: {
              x: {
                name: changingParameterX,
                values: valuesX as any,
              },
              y: {
                name: changingParameterY,
                values: valuesY as any,
              },
            },
            data: resultsByChangingParameter,
          });
        }
      }
    } else {
      for (const valueX of valuesX) {
        const resultsByChangingParameter = results.data.filter((data) => data[changingParameterX] == valueX);

        splitParsedConfigurationData.push({
          split_parameters: {
            x: {
              name: changingParameterX,
              values: valuesX as any,
            },
          },
          data: resultsByChangingParameter,
        });
      }
    }

    console.log("multivariate!", splitParsedConfigurationData);
  } else {
    splitParsedConfigurationData.push({
      data: results.data,
    });
  }

  // Preparing configuration
  const configuration: Configuration = {
    experiments: [],
  };

  splitParsedConfigurationData.forEach((data) => {
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
