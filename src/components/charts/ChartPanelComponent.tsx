import { Configuration } from "../../utils/configuration/types";
import { _clsx } from "../../utils/misc";
import { getSettingsGraphTitle } from "../settings/utils";
import { ChartComponent } from "./ChartComponent";
import { ChartSplitterComponent } from "./ChartSplitterComponent";

type Props = {
  loading?: boolean;
  fullScreen: boolean;
  configuration: Configuration;
};

export const ChartPanelComponent = (props: Props) => {
  const { fullScreen, configuration, loading = false } = props;

  return (
    <div
      className={fullScreen ? "absolute top-0 left-0 right-0 bottom-0 bg-white p-6 z-10" : "bg-white p-6 rounded-xl"}
    >
      {loading ? (
        <div className="w-full bg-gray-200 rounded-xl animate-pulse"></div>
      ) : (
        <>
          <span className="text-3xl xl:text-5xl font-semibold block text-center pb-12">
            {getSettingsGraphTitle(configuration)}
          </span>
          <ChartSplitterComponent configuration={configuration}>
            {configuration.data.map((datasetsWithResults, index) => (
              <div key={index}>
                <div className="p-2 xl:p-4">
                  <ChartComponent configuration={configuration} data={datasetsWithResults} index={index} />
                </div>
              </div>
            ))}
          </ChartSplitterComponent>
          {fullScreen && (
            <div className="fixed bottom-0 right-0 px-4 py-2 bg-slate-100 rounded-full m-6">
              Press escape to exit fullscreen
            </div>
          )}
        </>
      )}
    </div>
  );
};
