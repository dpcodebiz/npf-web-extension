import { ParseResult } from "papaparse";
import { readString } from "react-papaparse";
import { useCallback, useEffect, useState } from "react";
import { Configuration, ConfigurationData, Settings } from "./types";
import { ParsedConfigurationData, resultsToConfiguration } from "./parser";

/**
 * Hook handling the app configuration
 */
export const useConfiguration = () => {
  // States
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);
  const [configurationData, setConfigurationData] = useState<ConfigurationData | undefined>(undefined);

  const load = useCallback(
    (configurationData: ConfigurationData) => {
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

    setLoading(false);
  }, [configuration]);

  // Update configuration on settings changed
  useEffect(() => {
    if (!configurationData) return;

    load(configurationData);
  }, [configurationData, settings, load]);

  return { loading, load, configuration, settings, setSettings };
};
