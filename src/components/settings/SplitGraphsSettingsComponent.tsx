import { getSplitParameters } from "../../utils/configuration/utils";
import { _clsx } from "../../utils/misc";
import { SettingsProps, getSettingsSplitAxisFormat } from "./utils";

import styles from "../../styles/grid.module.scss";
import { ChartSplitterComponent } from "../charts/ChartSplitterComponent";

export const SplitGraphsSettingsComponent = (props: SettingsProps) => {
  const { setSettings, configuration, settings } = props;

  const split_parameters = getSplitParameters(configuration.experiments);

  return (
    <div>
      <div className="p-4 gap-4 flex flex-col place-content-center justify-center w-full flex-grow">
        <span className="text-2xl">Preview</span>
        <span></span>
        <div className="p-10">
          <ChartSplitterComponent configuration={configuration} settings={settings}>
            {configuration.experiments.map((_, index) => (
              <>
                <div>
                  <div className="p-4 m-2 bg-gray-100">
                    <div className="py-2 w-full h-full"></div>
                  </div>
                </div>
              </>
            ))}
          </ChartSplitterComponent>
        </div>
      </div>
    </div>
  );
};
