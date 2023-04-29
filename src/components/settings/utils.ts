import { isEmpty } from "radash";
import { Configuration, Experiment, GRAPH_TYPES, Settings } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";

export type SettingsProps = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  configuration: Configuration;
};

export const getSettingsGraphSelectOptions = () => {
  return [
    {
      label: "Line Chart",
      value: GRAPH_TYPES.LINE,
    },
    { value: GRAPH_TYPES.BAR, label: "Bar Chart" },
  ];
};

export const getSettingsSelectedGraphType = (settings: Settings, configuration: Configuration) => {
  return settings[configuration.id]?.type ?? configuration.experiments[0].metadata.type;
};

export const getSettingsSelectedGraphTypeOption = () => {};

export const getSettingsGraphTitle = (settings: Settings, configuration: Configuration) => {
  const settings_title = settings[configuration.id]?.title;

  return (settings_title && !isEmpty(settings_title) ? settings_title : undefined) ?? configuration.name ?? "";
};

export const getSettingsSplitAxisFormat = (
  axis: "x" | "y",
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

  const settingsFormat = axis == "x" ? settings[configuration.id]?.x_format : settings[configuration.id]?.y_format;
  const formatted_str =
    settingsFormat &&
    `${settingsFormat.replace(/{{[ ]*parameter[ ]*}}/, parameter_name).replace(/{{[ ]*value[ ]*}}/, parameter_value)}`;

  return formatted_str || `${parameter_name}=${parameter_value}`;
};
