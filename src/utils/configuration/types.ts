/**
 * Configuration data that will be injected into the app
 */
export type ConfigurationData = {
  parameters: string[];
  measurements: string[];
  data: string;
};

/**
 * Main configuration input that is used to hydrate the app
 */
export type Configuration = {
  experiments: Experiment[];
};

export type Experiment = {
  name: string;
  runs: ParameterizedRun[];
};

export type ParameterizedRun = {
  parameters: RunParameters;
  results: ParameterizedResults;
};

export type RunParameters = {
  [index: string]: string;
};

export type ParameterizedResults = {
  [index: string]: Results;
};

export type Results = {
  [index: string]: number;
};
