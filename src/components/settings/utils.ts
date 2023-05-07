import { isEmpty } from "radash";
import { Configuration, GRAPH_TYPES } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { Settings } from "../../utils/settings/types";

const MAXIMUM_AXIS_PARAMETER_VALUES = 6;
export type Axis = "x" | "y";

export type SettingsProps = {
  settings: Settings;
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
export const getSettingsGraphType = (settings: Settings, configuration: Configuration) => {
  return settings[configuration.id]?.type ?? configuration.experiments[0].metadata.type;
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
  settings: Settings,
  configuration: { id: string; parameters: string[]; measurements: string[] }
) => {
  const value = settings[configuration.id]?.[axis].parameter;
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
export const getGraphAxisTitle = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const value = settings[configuration.id]?.[axis].title;
  const measurement = getParameter("y", settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
  });
  const default_value = axis == "x" ? configuration.experiments[0].main_parameter : measurement;

  return value ?? default_value;
};

/**
 * Returns the title of the graph from the settings
 * @default configuration.name
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsGraphTitle = (settings: Settings, configuration: Configuration) => {
  const settings_title = settings[configuration.id]?.title;

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
export const getSettingsSplitAxisFormat = (
  axis: Axis,
  index: number,
  settings: Settings,
  configuration: Configuration
) => {
  const split_parameters = getSplitParameters(configuration.experiments);

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
      split_nb = split_parameters.y?.length;
      parameter_name = split_parameters.y[0].name as string;
      parameter_value = split_parameters.y[index % split_nb].value;
      break;
    }
  }

  const settingsFormat = settings[configuration.id]?.split?.[axis]?.format;
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
export const getSettingsSplitAxis = (axis: Axis, settings: Settings, configuration_id: string) =>
  settings[configuration_id]?.split?.[axis];

export const getSplitParameter = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const settings_value = getSettingsSplitAxis(axis, settings, configuration.id)?.parameter;
  const default_value = configuration.split[axis];
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
export const getSettingsSplitParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const other_axis_value = getSplitParameter(axis == "x" ? "y" : "x", settings, configuration);

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
export const getSettingsDefaultSplitParametersOptions = (
  axis: Axis,
  settings: Settings,
  configuration: Configuration
) => {
  const parametersOptions = getSettingsSplitParametersOptions(axis, settings, configuration);
  const value = getSplitParameter(axis, settings, configuration);

  return parametersOptions.find((option) => option.value === value);
};

/**
 * Returns parameters available for a given axis
 * @param axis
 * @param settings
 * @param configuration
 * @returns
 */
export const getSettingsParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
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
export const getSettingsDefaultParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const parametersOptions = getSettingsParametersOptions(axis, settings, configuration);
  const value = getParameter(axis, settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
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
export const getSettingsPlacement = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const value = settings[configuration.id]?.split?.[axis].placement;
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
export const getSettingsErrorBars = (settings: Settings, configuration: Configuration) => {
  return settings[configuration.id]?.error_bars ?? false;
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
