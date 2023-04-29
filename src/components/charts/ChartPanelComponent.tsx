import { Configuration, Settings } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { getSettingsGraphTitle, getSettingsSplitAxisFormat } from "../settings/utils";
import { ChartComponent } from "./ChartComponent";

type Props = {
  settings: Settings;
  configuration: Configuration;
};

export const ChartPanelComponent = (props: Props) => {
  const { settings, configuration } = props;

  // TODO add a multivariate metadata to configuration so no checking needed
  const split_parameters = getSplitParameters(configuration.experiments);
  const split_cols = split_parameters.x?.length ?? 0;
  const split_rows = split_parameters.y?.length ?? 0;

  console.log(configuration, split_cols, split_rows);

  return (
    <div className="bg-white p-6 rounded-xl">
      <span className="text-2xl block text-center pb-6">{getSettingsGraphTitle(settings, configuration)}</span>
      <div className="grid grid-custom">
        {configuration.experiments.map((experiment, index) => (
          <>
            <div>
              {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                <div className="text-center pl-20 pr-5 pb-4 border-b-2">
                  {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                </div>
              )}
              <div className="p-4">
                <ChartComponent experiment={experiment} />
              </div>
            </div>
            {split_parameters.y && index % split_cols == split_cols - 1 && (
              <div className="border-l-2 px-4 inline-grid place-content-center">
                {getSettingsSplitAxisFormat("y", index, settings, configuration)}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
