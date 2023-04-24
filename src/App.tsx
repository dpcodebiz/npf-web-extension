import { useEffect, useState } from "react";
import "./App.css";
import { ChartComponent } from "./components/ChartComponent";
import { Events, UpdateConfigurationEvent, updateConfiguration } from "./utils/events";
import { WebsiteLoader } from "./components/WebsiteLoader";
import { useConfiguration } from "./utils/configuration";
import { IPERF_DATA } from "./utils/examples/iperf";
import { MATH_DATA } from "./utils/examples/math";

function App() {
  // States
  const { loading, load, configuration } = useConfiguration();

  const tabs = [IPERF_DATA, MATH_DATA];

  const [selectedTab, setSelectedTab] = useState(0);

  // Mounting
  useEffect(() => {
    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;

    const onUpdateConfiguration = (e: Event) => {
      // Cast
      const ev = e as UpdateConfigurationEvent;

      // load(ev.detail.configuration);
    };

    // Listening to
    window.addEventListener(Events.UPDATE_CONFIGURATION, onUpdateConfiguration);

    if (!configuration) {
      // DEBUG
      load(IPERF_DATA);
    }

    // TODO fix this breaking the app when it shouldn't
    //return window.removeEventListener(Events.UPDATE_CONFIGURATION, onUpdateChartData);
  }, [load, configuration]);

  // Set default tab on configuration update

  const onTabClick = (index: number) => {
    setSelectedTab(index);
    load(tabs[index]);
  };

  return (
    <>
      <WebsiteLoader loading={loading || !configuration} />
      <div className="bg-gray-100 w-screen h-screen flex flex-row">
        <div className="bg-white w-[300px] p-6 space-y-6">
          <div className="font-bold text-xl">Network Performance Framework</div>
          <div className="text-lg">Results available</div>
          <div className="space-y-2 flex flex-col">
            {!loading &&
              tabs.map((configurationData, index) => (
                <button
                  className={`p-4 text-lg text-left rounded transition-all duration-200 ${
                    selectedTab == index ? "bg-uclouvain-1 text-white" : "hover:bg-gray-200"
                  }`}
                  key={index}
                  onClick={() => {
                    selectedTab != index && onTabClick(index);
                  }}
                >
                  {configurationData.name}
                </button>
              ))}
          </div>
        </div>
        <div className="p-6 w-full">
          {/* <div className="flex flex-row gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div className="bg-white rounded-xl p-6 space-y-2" key={index}>
                <div>Experiments count</div>
                <div className="mx-auto w-max text-blue-500">17</div>
              </div>
            ))}
          </div> */}
          <div>{!loading && configuration && <ChartComponent experiment={configuration.experiments[0]} />}</div>
        </div>
      </div>
    </>
  );
}

export default App;
