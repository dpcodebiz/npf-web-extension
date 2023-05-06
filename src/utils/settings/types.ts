import { GRAPH_TYPES } from "../configuration/types";

export type Settings = {
  [index: string]: ConfigurationSettings;
};

export type ConfigurationSettings = {
  title: string;
  x: AxisSettings;
  y: AxisSettings;
  split: {
    x: AxisSplitSettings;
    y: AxisSplitSettings;
  };
  type: GRAPH_TYPES;
  error_bars: boolean;
};

export type AxisSplitSettings = {
  enable: boolean;
  parameter: string;
  format: string;
  placement: "before" | "after";
};

export type AxisSettings = {
  title: string;
  parameter: string;
};
