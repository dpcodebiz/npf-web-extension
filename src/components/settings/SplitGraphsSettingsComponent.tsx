import { getSplitParameters } from "../../utils/configuration/utils";
import { _clsx } from "../../utils/misc";
import { SettingsProps, getSettingsSplitAxisFormat } from "./utils";

import styles from "../../styles/grid.module.scss";

export const SplitGraphsSettingsComponent = (props: SettingsProps) => {
  const { setSettings, configuration, settings } = props;

  const split_parameters = getSplitParameters(configuration.experiments);
  const split_cols = split_parameters.x?.length ?? 0;

  return (
    <div>
      <div className="p-4 gap-4 flex flex-col place-content-center justify-center w-full flex-grow">
        <span className="text-2xl">Per graph settings</span>
        <span></span>
        <div className={_clsx("grid", styles["grid-" + split_cols])}>
          {configuration.experiments.map((experiment, index) => (
            <>
              <div>
                {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                  <div className="text-center pl-20 pr-5 pb-4 border-b-2">
                    {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                  </div>
                )}
                <div className="p-4">Options here</div>
              </div>
              {split_parameters.y && index % split_cols == split_cols - 1 && (
                <div className="border-l-2 px-4 inline-grid place-content-center">
                  {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
