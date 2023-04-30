import { Configuration } from "../../utils/configuration/types";
import { _clsx } from "../../utils/misc";
import { getSettingsGraphTitle } from "../settings/utils";
import { ChartComponent } from "./ChartComponent";
import { Settings } from "../../utils/settings/types";
import { ChartSplitterComponent } from "./ChartSplitterComponent";

type Props = {
  settings: Settings;
  configuration: Configuration;
};

export const ChartPanelComponent = (props: Props) => {
  const { settings, configuration } = props;

  return (
    <div className="bg-white p-6 rounded-xl">
      <span className="text-5xl font-semibold block text-center pb-12">
        {getSettingsGraphTitle(settings, configuration)}
      </span>
      <ChartSplitterComponent configuration={configuration} settings={settings}>
        {configuration.experiments.map((experiment) => (
          <>
            <div>
              <div className="p-4">
                <ChartComponent settings={settings} configuration={configuration} experiment={experiment} />
              </div>
            </div>
          </>
        ))}
      </ChartSplitterComponent>
    </div>
  );
};
