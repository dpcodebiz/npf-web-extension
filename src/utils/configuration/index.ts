import { ParseResult } from "papaparse";
import { readString } from "react-papaparse";
import { useEffect, useState } from "react";
import { Configuration, ConfigurationData, Experiment, ParameterizedRun, Run } from "./types";
import { group, mapValues, objectify } from "radash";

export const joinParams = (params_to_join: string[], params: { [index: string]: string }) => {
  return params_to_join.reduce((acc, param) => `${acc}${param}=${params[param]},`, "");
};

export const splitParams = (joined_params: string) => {
  const separated: any = {};
  joined_params.split(",").map((paramWithValue) => {
    const [param, value] = paramWithValue.split("=");
    if (param == "") return; // Skip if no param name
    separated[param] = value;
  });
  return separated;
};

const resultsToConfiguration = (configurationData: ConfigurationData, results: ParseResult<any>) => {
  // Preparing configuration
  const config: Configuration = {
    experiments: [],
  };

  // Grouping all the data by parameter value
  const parameters = configurationData.parameters;
  const measurements = configurationData.measurements;
  const main_param = configurationData.parameters[0];

  // Grouping all data by all params
  const grouped_data_by_all_params = group(results.data, (e) => joinParams(parameters, e));

  // Computing average of all results
  const aggregated_data = mapValues(grouped_data_by_all_params, (e) => {
    // Aggregating for each measurement
    const measurements_aggregated = objectify(
      measurements,
      (measurement) => measurement,
      (measurement) => {
        const sum = e?.reduce((acc, currentValue) => acc + parseFloat(currentValue[measurement]), 0);
        return sum / (e as any[]).length;
      }
    );

    return measurements_aggregated;
  });

  // Now, we unfold all the data
  const unfolded_data = Object.entries(aggregated_data).map(([k, v], index) => {
    return {
      experiment_data: v,
      ...splitParams(k),
    };
  });

  // Grouping again but only by main parameter now
  const grouped_data_by_other_params = group(unfolded_data, (e) =>
    joinParams(
      parameters.filter((param) => param != main_param),
      e
    )
  );

  // Creating experiment
  const runs: ParameterizedRun[] = [];
  Object.entries(grouped_data_by_other_params).forEach(([joined_params, results_data]) => {
    // Remaps { [measurement]: value }[] into { [main_param]: value }[]
    const experiment_data_by_measurement = (measurement: string) =>
      results_data?.map((result_data) => ({
        [result_data[main_param]]: result_data.experiment_data[measurement],
      }));

    // Merges all { [main_param]: value }[] into ({ [measurement]: { [main_param]: value } })
    const results_by_measurement = measurements.map((measurement) => ({
      [measurement]: Object.assign({}, ...(experiment_data_by_measurement(measurement) ?? [])),
    }));

    // Creating run
    const run: ParameterizedRun = {
      parameters: { ...splitParams(joined_params) },
      results: Object.assign({}, ...results_by_measurement),
    };

    // Storing run
    runs.push(run);
  });
  const experiment: Experiment = {
    name: "",
    runs,
  };

  console.log(
    // results,
    // grouped_data_by_all_params,
    // aggregated_data,
    // unfolded_data,
    grouped_data_by_other_params,
    experiment
  );

  return { experiments: [experiment] } as Configuration;

  // Getting parameters
  // const fields = results.meta.fields;
  // const fields_without_npf_meta = fields?.filter((e) => !["build", "index", "test_index", "run_index"].includes(e)); // Removing npf_meta

  // TODO check here if fields match the configuration data meta provided (mechanism to prevent data mismatch)

  // console.log(fields_without_npf_meta, results);
};

export const useConfiguration = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);

  // Set loading false when configuration is loaded
  useEffect(() => {
    if (configuration == undefined) return;

    setLoading(false);
  }, [configuration]);

  const load = (configurationData: ConfigurationData) => {
    setLoading(true);

    readString(configurationData.data, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: function (results: ParseResult<unknown>): void {
        setConfiguration(resultsToConfiguration(configurationData, results));
      },
    });
  };

  return { loading, load, configuration };
};
