import { isEmpty } from "radash";
import { Configuration, GRAPH_TYPES } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { Settings } from "../../utils/settings/types";

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

export const getSettingsSplitParameter = (axis: Axis, settings: Settings, configuration_id: string) =>
  settings[configuration_id]?.split?.[axis].parameter;

export const getSplitParameter = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const settings_value = getSettingsSplitParameter(axis, settings, configuration.id);
  const default_value = configuration.split[axis];
  return settings_value ?? default_value;
};

export const getSettingsSplitParametersOptions = (axis: Axis, settings: Settings, configuration: Configuration) => {
  const other_axis_value = getSplitParameter(axis == "x" ? "y" : "x", settings, configuration);

  return configuration.parameters
    .filter((parameter) => parameter != other_axis_value)
    .map((parameter) => ({
      label: parameter,
      value: parameter,
    }));
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
