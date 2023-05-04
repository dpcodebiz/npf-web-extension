import { _clsx } from "../../utils/misc";
import styles from "../../styles/grid.module.scss";
import { Settings } from "../../utils/settings/types";
import { Configuration } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { getSettingsPlacement, getSettingsSplitAxisFormat } from "../settings/utils";
import React, { Fragment, PropsWithChildren } from "react";

type Props = {
  settings: Settings;
  configuration: Configuration;
};

export const ChartSplitterComponent = (props: PropsWithChildren<Props>) => {
  const { settings, configuration } = props;

  const split_parameters = getSplitParameters(configuration.experiments);
  const split_cols = split_parameters.x?.length ?? 1;
  const split_rows = split_parameters.y?.length ?? 0;
  const split_x_placement = getSettingsPlacement("x", settings, configuration);
  const split_y_placement = getSettingsPlacement("y", settings, configuration);

  return (
    <div
      className={_clsx(
        "grid gap-2 xl:gap-4",
        styles["grid-" + split_cols + (split_rows > 0 ? (split_y_placement == "after" ? "-r" : "-l") : "")]
      )}
    >
      {split_parameters.x && split_x_placement == "before" && (
        <>
          {split_rows > 0 && split_y_placement == "before" && <span></span>}
          {configuration.experiments.map((_, index) => (
            <Fragment key={index}>
              {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                <div className="text-center px-4 pb-4 border-b-2">
                  {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                </div>
              )}
            </Fragment>
          ))}
          {split_rows > 0 && split_y_placement == "after" && <span></span>}
        </>
      )}
      {props.children &&
        React.Children.map(props.children, (child, index) => (
          <>
            {split_parameters.y && split_y_placement == "before" && index % split_cols == 0 && (
              <div className="border-r-2 px-4 inline-grid place-content-center">
                {getSettingsSplitAxisFormat("y", index, settings, configuration)}
              </div>
            )}
            {child}
            {split_parameters.y && split_y_placement == "after" && index % split_cols == split_cols - 1 && (
              <div className="border-l-2 w-max px-4 inline-grid place-content-center">
                {getSettingsSplitAxisFormat("y", index, settings, configuration)}
              </div>
            )}
          </>
        ))}
      {split_parameters.x && split_x_placement == "after" && (
        <>
          {split_rows > 0 && split_y_placement == "before" && <span></span>}
          {configuration.experiments.map((_, index) => (
            <Fragment key={index}>
              {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                <div className="text-center px-4 pt-4 mt-4 border-t-2">
                  {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                </div>
              )}
            </Fragment>
          ))}
          <span></span>
        </>
      )}
    </div>
  );
};
