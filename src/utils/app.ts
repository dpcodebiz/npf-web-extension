import { isArray } from "radash";
import { ConfigurationData } from "./configuration/types";
import { Settings } from "./settings/types";

type Params = {
  load: (_: ConfigurationData) => void;
  configurations: { [index: string]: ConfigurationData } | undefined;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setConfigurations: (
    value: React.SetStateAction<
      | {
          [index: string]: ConfigurationData;
        }
      | undefined
    >
  ) => void;
};

type CallbackParams = { configurationData: ConfigurationData | ConfigurationData[] };

export const updateConfigurationCallback =
  ({ load, setConfigurations, configurations, setSettings, settings }: Params) =>
  ({ configurationData }: CallbackParams) => {
    if (isArray(configurationData)) {
      load(configurationData[0]);
      const newConfigurations: { [index: string]: ConfigurationData } = {};
      configurationData.forEach((config) => {
        newConfigurations[config.id] = config;
      });
      const configurationSettings: Settings = Object.assign(
        {},
        ...configurationData.map((config) => ({ [config.id]: config.settings }))
      );

      setConfigurations(Object.assign({ ...configurations }, newConfigurations));
      setSettings({ ...settings, ...configurationSettings });
      return;
    }

    const configurationSettings: Settings = configurationData.settings
      ? Object.assign({}, { [configurationData.id]: configurationData.settings })
      : {};

    load(configurationData);
    setConfigurations({ ...configurations, ...{ [configurationData.id]: configurationData } });
    setSettings({ ...settings, ...configurationSettings });
  };
