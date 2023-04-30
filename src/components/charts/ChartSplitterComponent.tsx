import { _clsx } from "../../utils/misc";
import styles from "../../styles/grid.module.scss";
import { Settings } from "../../utils/settings/types";
import { Configuration } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { getSettingsSplitAxisFormat } from "../settings/utils";
import React, { PropsWithChildren } from "react";

type Props = {
  settings: Settings;
  configuration: Configuration;
};

export const ChartSplitterComponent = (props: PropsWithChildren<Props>) => {
  const { settings, configuration } = props;

  const split_parameters = getSplitParameters(configuration.experiments);
  const split_cols = split_parameters.x?.length ?? 1;

  return (
    <div className={_clsx("grid", styles["grid-" + split_cols])}>
      {split_parameters.x ? (
        <>
          {configuration.experiments.map((_, index) => (
            <>
              {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                <div className="text-center px-4 pb-4 border-b-2">
                  {getSettingsSplitAxisFormat("x", index, settings, configuration)}
                </div>
              )}
            </>
          ))}
          <span></span>
        </>
      ) : split_parameters.y ? (
        <>
          <span></span>
          <span></span>
        </>
      ) : (
        <></>
      )}
      {props.children &&
        React.Children.map(props.children, (child, index) => (
          <>
            {child}
            {split_parameters.y && index % split_cols == split_cols - 1 && (
              <div className="border-l-2 px-4 inline-grid place-content-center">
                {getSettingsSplitAxisFormat("y", index, settings, configuration)}
              </div>
            )}
          </>
        ))}
    </div>
  );
};
