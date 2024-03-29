import { ConfigurationSettings } from "../settings/types";

/**
 * Configuration data that will be injected into the app
 */
export type ConfigurationData = {
  id: string; // Must be unique
  name: string;
  parameters: string[];
  measurements: string[];
  data: string;
  settings?: ConfigurationSettings;
};

/**
 * Main configuration input that is used to hydrate the app
 */
export type Configuration = {
  id: string;
  name: string;
  parameters: ParametersWithValues;
  measurements: string[];
  split: SplitParametersData;
  data: DatasetsWithResults[];
  type: GRAPH_TYPES;
  recommended_type: GRAPH_TYPES;
  recommended_error_bars?: boolean;
  x: string;
  y: string;
  settings: ConfigurationSettings;
};

export type DatasetsWithResults = Map<string, Results>;
export type Results = Map<string, number[]>;

export type ParametersWithValues = {
  [index: string]: string[];
};

export type Experiment = {
  metadata: Metadata;
  name: string;
  main_parameter: string;
  split_parameters?: SplitParametersData;
  runs: ParameterizedRun[];
};

export type SplitParametersData = { x?: SplitParameter; y?: SplitParameter };
export type SplitParameter = {
  name: string;
  values: string[];
};

export enum GRAPH_TYPES {
  LINE,
  BAR,
  PIE,
  BOXPLOT,
}

export type Metadata = {
  type: GRAPH_TYPES;
  recommended_type: GRAPH_TYPES;
  recommended_error_bars?: boolean;
  group_by_other_params?: boolean;
};

export type ParameterizedRun = {
  parameters: RunParameters;
  results: ParameterizedResults;
};

export type RunParameters = {
  [index: string]: string;
};

export type ParameterizedResults = {
  [index: string]: { [index: string]: number[] };
};
