import { isEmpty } from "radash";
import { Configuration, Experiment, GRAPH_TYPES } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { Settings } from "../../utils/settings/types";

const MAXIMUM_AXIS_PARAMETER_VALUES = 6;
export type Axis = "x" | "y";

export type SettingsProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  configuration: Configuration;
};

export const getSettingsGraphOptions = () => {
  return [
    {
      label: "Line Chart",
      value: GRAPH_TYPES.LINE,
    },
    { value: GRAPH_TYPES.BAR, label: "Bar Chart" },
  ];
};

export const getSettingsGraphType = (settings: Settings, configuration: Configuration) => {
  return settings[configuration.id]?.type ?? configuration.experiments[0].metadata.type;
};

export const getGraphAxisTitle = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const value = settings[configuration.id]?.[axis].title;
  const default_value =
    axis == "x"
      ? configuration.experiments[0].main_parameter
      : Object.keys(configuration.experiments[0].runs[0]?.results)[0];

  return value ?? default_value;
};

//@deprecated ?
export const getSettingsSelectedGraphTypeOption = () => {};

export const getSettingsGraphTitle = (settings: Settings, configuration: Configuration) => {
  const settings_title = settings[configuration.id]?.title;

  return (settings_title && !isEmpty(settings_title) ? settings_title : undefined) ?? configuration.name ?? "";
};

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
    `${settingsFormat.replace(/{{[ ]*parameter[ ]*}}/, parameter_name).replace(/{{[ ]*value[ ]*}}/, parameter_value)}`;

  return formatted_str || `${parameter_name}=${parameter_value}`;
};

export const getSettingsSplitAxis = (axis: Axis, settings: Settings, configuration_id: string) =>
  settings[configuration_id]?.split?.[axis];

export const getSplitParameter = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const settings_value = getSettingsSplitAxis(axis, settings, configuration.id)?.parameter;
  const default_value = configuration.split[axis];
  return settings_value ?? default_value;
};

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

export const getSettingsDefaultSplitParametersOptions = (
  axis: Axis,
  settings: Settings,
  configuration: Configuration
) => {
  const parametersOptions = getSettingsSplitParametersOptions(axis, settings, configuration);
  const value = getSplitParameter(axis, settings, configuration);

  return parametersOptions.find((option) => option.value === value);
};

export const getParameter = (
  axis: Axis,
  settings: Settings,
  configuration: { id: string; parameters: string[]; measurements: string[] }
) => {
  const value = settings[configuration.id]?.[axis].parameter;
  const default_value = axis == "x" ? configuration.parameters[0] : configuration.measurements[0];

  return value ?? default_value;
};

export const getSettingsParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
  return axis == "x"
    ? Object.keys(configuration.parameters).map((parameter) => ({ label: parameter, value: parameter }))
    : configuration.measurements.map((measurement) => ({ label: measurement, value: measurement }));
};

export const getSettingsDefaultParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const parametersOptions = getSettingsParametersOptions(axis, settings, configuration);
  const value = getParameter(axis, settings, {
    id: configuration.id,
    parameters: Object.keys(configuration.parameters),
    measurements: configuration.measurements,
  });

  return parametersOptions.find((option) => option.value === value);
};
