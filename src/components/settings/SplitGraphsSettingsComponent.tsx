import { _clsx } from "../../utils/misc";
import { SettingsProps, getSettingsGraphTitle } from "./utils";

import { ChartSplitterComponent } from "../charts/ChartSplitterComponent";
import { Fragment } from "react";

export const SplitGraphsSettingsComponent = (props: SettingsProps) => {
  const { configuration, settings } = props;

  return (
    <div className="w-full h-full">
      <div className="p-4 flex flex-col h-full">
        <span className="text-center block pb-4 text-lg xl:text-xl font-semibold">
          {getSettingsGraphTitle(settings, configuration)}
        </span>
        <ChartSplitterComponent configuration={configuration} settings={settings}>
          {configuration.experiments.map((_, index) => (
            <Fragment key={index}>
              <div>
                <div className="xl:p-4 m-2 bg-gray-100 h-full">
                  <div className="py-2 w-full h-full"></div>
                </div>
              </div>
            </Fragment>
          ))}
        </ChartSplitterComponent>
      </div>
    </div>
  );
};
