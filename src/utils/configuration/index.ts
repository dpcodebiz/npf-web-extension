import { ParseResult } from "papaparse";
import { readString } from "react-papaparse";
import { useEffect, useState } from "react";
import { Configuration, ConfigurationData } from "./types";
import { ParsedConfigurationData, resultsToConfiguration } from "./parser";

/**
 * Hook handling the app configuration
 */
export const useConfiguration = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [configuration, setConfiguration] = useState<Configuration | undefined>(undefined);

  // Set loading false when configuration is loaded
  useEffect(() => {
    if (configuration == undefined) return;

    setLoading(false);
  }, [configuration]);

  const load = (configurationData: ConfigurationData) => {
    setLoading(true);

    readString(configurationData.data, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: function (results: ParseResult<ParsedConfigurationData>): void {
        setConfiguration(resultsToConfiguration(configurationData, results));
      },
    });
  };

  return { loading, load, configuration };
};
