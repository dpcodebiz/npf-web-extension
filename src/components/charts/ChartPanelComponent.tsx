import { Configuration } from "../../utils/configuration/types";
import { _clsx } from "../../utils/misc";
import { getSettingsGraphTitle } from "../settings/utils";
import { ChartComponent } from "./ChartComponent";
import { Settings } from "../../utils/settings/types";
import { ChartSplitterComponent } from "./ChartSplitterComponent";

type Props = {
  fullScreen: boolean;
  settings: Settings;
  configuration: Configuration;
};

export const ChartPanelComponent = (props: Props) => {
  const { fullScreen, settings, configuration } = props;

  return (
    <div
      className={fullScreen ? "absolute top-0 left-0 right-0 bottom-0 bg-white p-6 z-10" : "bg-white p-6 rounded-xl"}
    >
      <span className="text-5xl font-semibold block text-center pb-12">
        {getSettingsGraphTitle(settings, configuration)}
      </span>
      <ChartSplitterComponent configuration={configuration} settings={settings}>
        {configuration.experiments.map((experiment, index) => (
          <div key={index}>
            <div className="p-4">
              <ChartComponent settings={settings} configuration={configuration} experiment={experiment} />
            </div>
          </div>
        ))}
      </ChartSplitterComponent>
    </div>
  );
};
