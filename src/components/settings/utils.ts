import { isEmpty } from "radash";
import { Configuration, GRAPH_TYPES, ParametersWithValues, SplitParametersData } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { ConfigurationSettings, Settings } from "../../utils/settings/types";

const MAXIMUM_AXIS_PARAMETER_VALUES = 6;
export type Axis = "x" | "y";

export type SettingsProps = {
  setSettings: (settings: Settings) => void;
  configuration: Configuration;
};

/**
 * Returns graph options for the settings select input
 * @returns
 */
export const getSettingsGraphOptions = () => {
  return [
    {
      label: "Line Chart",
      value: GRAPH_TYPES.LINE,
    },
    { value: GRAPH_TYPES.BAR, label: "Bar Chart" },
    { value: GRAPH_TYPES.PIE, label: "Pie Chart" },
    { value: GRAPH_TYPES.BOXPLOT, label: "Boxplot Chart" },
  ];
};

/**
 * Returns the rendered graph type from the current settings.
 * @default configuration.[...].metadata.type
 * @param settings
 * @param configuration
 * @returns GRAPH_TYPES
 */
export const getSettingsGraphType = (configuration: Configuration) => {
  return configuration.settings?.type ?? configuration.type;
};

/**
 * Returns the parameter selected for a given axis
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getParameter = (
  axis: Axis,
  configuration: { id: string; parameters: string[]; measurements: string[]; settings?: ConfigurationSettings }
) => {
  const value = configuration.settings?.[axis].parameter;
  const default_value = axis == "x" ? configuration.parameters[0] : configuration.measurements[0];

  return value ?? default_value;
};

/**
 * Returns the title of a given axis
 * @default parameter.name
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getGraphAxisTitle = (axis: Axis, configuration: Configuration) => {
  const value = configuration.settings?.[axis]?.title;
  const measurement = getParameter("y", {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
    settings: configuration.settings,
  });
  const default_value = axis == "x" ? Object.keys(configuration.parameters)[0] : measurement;

  return value ?? default_value;
};

/**
 * Returns the scale of a given axis
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getGraphAxisScale = (axis: Axis, configuration: Configuration) => {
  const value = configuration.settings?.[axis]?.scale;
  const default_value = 1;

  return value ?? default_value;
};

/**
 * Returns the title of the graph from the settings
 * @default configuration.name
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsGraphTitle = (configuration: Configuration) => {
  const settings_title = configuration.settings?.title;

  return (settings_title && !isEmpty(settings_title) ? settings_title : undefined) ?? configuration.name ?? "";
};

/**
 * Returns a formatted string for the split axis feature.
 * It takes into account the format specified in the settings and an iteration.
 * @param axis
 * @param index
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsSplitAxisFormat = (axis: Axis, index: number, configuration: Configuration) => {
  const split_parameters = getSplitParameters(configuration);

  let split_nb = 0;
  let parameter_name: string;
  let parameter_value: string;

  switch (axis) {
    case "x": {
      if (!split_parameters.x) return "undefined";
      split_nb = split_parameters.x?.length;
      parameter_name = split_parameters.x[0].name as string;
      parameter_value = split_parameters.x[index % split_nb].value;
      break;
    }
    case "y": {
      if (!split_parameters.y) return "undefined";
      split_nb = configuration.data.length / split_parameters.y?.length;
      parameter_name = split_parameters.y[0].name as string;
      parameter_value = split_parameters.y[Math.floor(index / split_nb)].value;
      break;
    }
  }

  const settingsFormat = configuration.settings?.split?.[axis]?.format;
  const formatted_str =
    settingsFormat &&
    `${settingsFormat
      .replaceAll(/{{[ ]*parameter[ ]*}}/g, parameter_name)
      .replaceAll(/{{[ ]*p[ ]*}}/g, parameter_name)
      .replaceAll(/{{[ ]*0[ ]*}}/g, parameter_name)
      .replaceAll(/{{[ ]*value[ ]*}}/g, parameter_value)
      .replaceAll(/{{[ ]*v[ ]*}}/g, parameter_value)
      .replaceAll(/{{[ ]*1[ ]*}}/g, parameter_value)}`;

  return formatted_str || `${parameter_name}=${parameter_value}`;
};

/**
 * Returns the split settings for a given axis
 * @param axis
 * @param settings
 * @param configuration_id
 * @returns
 */
export const getSettingsSplitAxis = (axis: Axis, settings: ConfigurationSettings) => settings?.split?.[axis];

export const getSplitParameter = (
  axis: Axis,
  configuration: { id: string; split: SplitParametersData; settings?: ConfigurationSettings }
) => {
  const settings_value = configuration.settings ? getSettingsSplitAxis(axis, configuration.settings)?.parameter : null;
  const default_value = configuration.split[axis]?.name;
  return settings_value ?? default_value;
};

/**
 * Returns all parameters available for the split graphs feature as options for the
 * select input
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsSplitParametersOptions = (
  axis: Axis,
  configuration: {
    id: string;
    split: SplitParametersData;
    parameters: ParametersWithValues;
    settings: ConfigurationSettings;
  }
) => {
  const other_axis_value = getSplitParameter(axis == "x" ? "y" : "x", configuration);

  return [{ label: "None", value: "undefined" }].concat(
    Object.entries(configuration.parameters)
      .filter(([parameter, values]) => parameter != other_axis_value && values.length < MAXIMUM_AXIS_PARAMETER_VALUES)
      .map(([parameter]) => ({
        label: parameter,
        value: parameter,
      }))
  );
};

/**
 * Returns the option associated to the parameter chosen to split the graphs
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsDefaultSplitParametersOptions = (axis: Axis, configuration: Configuration) => {
  const parametersOptions = getSettingsSplitParametersOptions(axis, configuration);
  const value = getSplitParameter(axis, configuration);

  return parametersOptions.find((option) => option.value === value);
};

/**
 * Returns parameters available for a given axis
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsParametersOptions = (axis: Axis, configuration: Configuration) => {
  return axis == "x"
    ? Object.keys(configuration.parameters).map((parameter) => ({ label: parameter, value: parameter }))
    : configuration.measurements.map((measurement) => ({ label: measurement, value: measurement }));
};

/**
 * Returns the default settings placement select option
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsDefaultParametersOptions = (axis: Axis, configuration: Configuration) => {
  const parametersOptions = getSettingsParametersOptions(axis, configuration);
  const value = getParameter(axis, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
    settings: configuration.settings,
  });

  return parametersOptions.find((option) => option.value === value);
};

/**
 * Returns the settings placement select options
 * @param axis
 * @returns
 */
export const getSettingsPlacementOptions = (axis: Axis) => {
  return [
    {
      label: axis == "x" ? "Top" : "Left",
      value: "before",
    },
    {
      label: axis == "x" ? "Bottom" : "Right",
      value: "after",
    },
  ];
};

/**
 * Returns the placement of the headings of the split feature
 * @default x: "before", y: "after"
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsPlacement = (axis: Axis, configuration: Configuration) => {
  const value = configuration.settings?.split?.[axis].placement;
  const default_value = axis == "x" ? "before" : "after";

  return value ?? default_value;
};

/**
 * Returns whether error bars are enabled
 * @default false
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsErrorBars = (configuration: Configuration) => {
  return configuration.settings?.error_bars ?? configuration.recommended_error_bars;
};

/**
 * Saves the settings to the local storage
 * @param settings
 */
export const saveSettings = (settings: Settings) => {
  localStorage.setItem("settings", JSON.stringify(settings));
};

/**
 * Loads the settings from the local storage
 * @returns
 */
export const loadSettings = () => {
  return JSON.parse(localStorage.getItem("settings") ?? "{}") as Settings;
};
