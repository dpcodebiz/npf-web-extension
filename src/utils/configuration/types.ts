export type Settings = {
  [index: string]: ConfigurationSettings;
};

export type ConfigurationSettings = {
  type: GRAPH_TYPES;
};

/**
 * Configuration data that will be injected into the app
 */
export type ConfigurationData = {
  id: string; // Must be unique
  name: string;
  parameters: string[];
  measurements: string[];
  data: string;
};

/**
 * Main configuration input that is used to hydrate the app
 */
export type Configuration = {
  experiments: Experiment[]; // TODO in the future each experiment will be tied to only one configuration
};

export type Experiment = {
  metadata: Metadata;
  name: string;
  main_parameter: string;
  runs: ParameterizedRun[];
};

export enum GRAPH_TYPES {
  LINE,
  BAR,
}

export type Metadata = {
  type: GRAPH_TYPES;
  recommended_type: GRAPH_TYPES;
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
