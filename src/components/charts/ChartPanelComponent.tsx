import { Configuration } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { _clsx } from "../../utils/misc";
import { getSettingsGraphTitle, getSettingsSplitAxisFormat } from "../settings/utils";
import { ChartComponent } from "./ChartComponent";
import styles from "../../styles/grid.module.scss";
import { Settings } from "../../utils/settings/types";
import { ChartSplitterComponent } from "./ChartSplitterComponent";

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

  // console.log(configuration, split_cols, split_rows);

  return (
    <div className="bg-white p-6 rounded-xl">
      <span className="text-2xl block text-center pb-6">{getSettingsGraphTitle(settings, configuration)}</span>
      <ChartSplitterComponent configuration={configuration} settings={settings}>
        {configuration.experiments.map((experiment, index) => (
          <>
            <div>
              <div className="p-4">
                <ChartComponent experiment={experiment} />
              </div>
            </div>
          </>
        ))}
      </ChartSplitterComponent>
    </div>
  );
};
