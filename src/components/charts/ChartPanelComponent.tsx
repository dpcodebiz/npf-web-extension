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
      <span className="text-2xl block text-center pb-6">{getSettingsGraphTitle(settings, configuration)}</span>
      <ChartSplitterComponent configuration={configuration} settings={settings}>
        {configuration.experiments.map((experiment) => (
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
