import { Experiment } from "./types";

export const joinParams = (params_to_join: string[], params: { [index: string]: string }) => {
  return params_to_join.reduce((acc, param) => `${acc}${param}=${params[param]},`, "");
};

export const splitParams = (joined_params: string) => {
  const separated: { [index: string]: string } = {};
  joined_params.split(",").map((paramWithValue) => {
    const [param, value] = paramWithValue.split("=");
    if (param == "") return; // Skip if no param name
    separated[param] = value;
  });
  return separated;
};

export const getExperimentSplitParametersNames = (experiment: Experiment) =>
  Object.values(experiment.split_parameters ?? {}).map((split_parameter) => split_parameter.name);

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
