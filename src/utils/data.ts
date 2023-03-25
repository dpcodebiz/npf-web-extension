/**
 * Main configuration input that is used to hydrate the app
 *
 * This should be set by npf
 */
export type Configuration = {
  experiments: Experiment[];
};

export type Experiment = {
  name: string;
  runs: Run[];
};

export type Run = {
  parameters: string;
  results: Results;
};

export type Results = {
  [index: string]: number;
};
