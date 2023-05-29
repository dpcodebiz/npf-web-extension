# Python Package

This page describes the methods inside the python package. These methods act as an interface with the web app.

## cli

- `-v, --version` returns the version of the package

## export (configurationData, outdir)

This exports a specific set of configurations to the web interface.

- `configurationData` **ConfigurationData** or **ConfigurationData[]** - configuration(s) with the dataset
- `outdir` **string** - outdir of the exported app

Each **ConfigurationData** follows the same structure as provided inside */src/configuration/types.ts*.

```ts
interface ConfigurationData {
  id: string; // Must be unique
  name: string;
  parameters: string[];
  measurements: string[];
  data: string; // CSV data with newlines and comma separator
  settings?: ConfigurationSettings; // Override the default settings of the graph inside the app
}

export enum GRAPH_TYPES {
  LINE,
  BAR,
  PIE,
  BOXPLOT,
}

interface ConfigurationSettings = {
  title: string; // Graph title
  x: AxisSettings;
  y: AxisSettings;
  split: { // Settings related to the split graph feature
    x: AxisSplitSettings;
    y: AxisSplitSettings;
  };
  type: GRAPH_TYPES; // Graph type
  error_bars: boolean; // Whether to display error bars or not, effective only for line and bar charts
};

interface AxisSplitSettings = {
  enable: boolean; // If set to false, the feature is disabled
  parameter: string; // Graphs will be splitted to rows or columns using this parameter
  format: string; // If set to " ", it will split the graphs without a heading for each row/column
  placement: "before" | "after"; // Placement of the heading for each row/column
};

interface AxisSettings = {
  title: string; // Axis title
  parameter: string; // Axis parameter
  scale: number; // Values for the given axis will be divided by this number. Useful when graphs have a
};
```

## demo (outdir)

This provides a running app only for demonstration purposes.

- `outdir` **string** - outdir of the exported app

The demonstration datasets are available inside */src/utils/examples/*.
