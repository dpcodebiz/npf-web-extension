import { ParseResult } from "papaparse";
import { readString } from "react-papaparse";
import { useCallback, useEffect, useState } from "react";
import { Configuration, ConfigurationData } from "./types";
import { ParsedConfigurationData, resultsToConfiguration } from "./parser";
import { Settings } from "../settings/types";
import { debounce } from "radash";
import { loadSettings, saveSettings } from "../../components/settings/utils";

/**
 * Hook handling the app configuration
 */
export const useConfiguration = () => {
  // States
  const [settings, setSettings] = useState<Settings>(loadSettings());
  const [loading, setLoading] = useState(true);
  const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);
  const [configurationData, setConfigurationData] = useState<ConfigurationData>();

  const load = useCallback(
    (configurationData: ConfigurationData) => {
      setLoading(true);
      setConfigurationData(configurationData);

      readString(configurationData.data, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        complete: function (results: ParseResult<ParsedConfigurationData>): void {
          setConfiguration(resultsToConfiguration(configurationData, results, settings));
        },
      });
    },
    [settings]
  );

  // Set loading false when configuration is loaded
  useEffect(() => {
    if (configuration == undefined) return;

    debounce({ delay: 100 }, () => setLoading(false))();
  }, [configuration]);

  useEffect(() => {
    if (!configurationData) return;

    load(configurationData);
  }, [settings, configurationData, load]);

  useEffect(() => {
    if (!settings) return;

    saveSettings(settings);
  }, [settings]);

  return { loading, load, configuration, settings, setSettings };
};
