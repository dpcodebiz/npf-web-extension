import { useEffect, useState } from "react";
import "./App.css";
import { ChartComponent } from "./components/ChartComponent";
import { Events } from "./utils/events";
import { WebsiteLoader } from "./components/WebsiteLoader";
import { useConfiguration } from "./utils/configuration";
import { IPERF_DATA } from "./utils/examples/iperf";
import { MATH_DATA } from "./utils/examples/math";
import { WORLD_POPULATION_DATA } from "./utils/examples/world_population";
import { ConfigurationData, GRAPH_TYPES } from "./utils/configuration/types";

function App() {
  // States
  const { loading, load, configuration, settings, setSettings } = useConfiguration();
  const [experiments, setExperiments] = useState<{ [index: string]: ConfigurationData }>();

  const [selectedExperiment, setSelectedExperiment] = useState("");

  const demo = () => {
    setExperiments({
      [IPERF_DATA.id]: IPERF_DATA,
      [MATH_DATA.id]: MATH_DATA,
      [WORLD_POPULATION_DATA.id]: WORLD_POPULATION_DATA,
    });
  };

  // Mounting
  useEffect(() => {
    const updateConfiguration = (configurationData: ConfigurationData) => {
      load(configurationData);
      setExperiments({ [configurationData.id]: configurationData });
    };

    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;
    //@ts-expect-error because we are setting the window variable
    window.demo = demo;

    // Dispatching event
    window.dispatchEvent(new Event(Events.APP_READY));
  }, [load]);

  // Reset selected experiment and configuration loaded when experiments available change
  useEffect(() => {
    if (!experiments || Object.keys(experiments).length == 0) return;
    if (Object.keys(experiments).includes(selectedExperiment)) return;

    setSelectedExperiment(Object.keys(experiments)[0]);
    load(experiments[Object.keys(experiments)[0]]);
  }, [experiments, load, selectedExperiment]);

  const onExperimentClick = (id: string) => {
    if (!experiments) return;

    setSelectedExperiment(id);
    load(experiments[id]);
  };

  const getCurrentRenderedBarType = () => {
    if (!experiments || selectedExperiment == "") return;

    return settings[experiments[selectedExperiment].id]?.type ?? configuration?.experiments[0].metadata.type;
  };

  return (
    <>
      <WebsiteLoader loading={loading || !configuration} />
      <div className="bg-gray-100 w-screen h-screen flex flex-row">
        <div className="bg-white w-[400px] p-6 space-y-6">
          <div className="font-bold text-xl">Network Performance Framework</div>
          <div className="space-y-2 flex flex-col">
            {!loading &&
              experiments &&
              Object.entries(experiments).map(([id, configurationData]) => (
                <button
                  className={`p-4 text-lg text-left rounded transition-all duration-200 ${
                    selectedExperiment == id ? "bg-uclouvain-1 text-white" : "hover:bg-gray-200"
                  }`}
                  key={id}
                  onClick={() => {
                    selectedExperiment != id && onExperimentClick(id);
                  }}
                >
                  {configurationData.name}
                </button>
              ))}
          </div>
        </div>
        <div className="p-6 w-full space-y-6">
          <div className="grid grid-cols-2 bg-white rounded-xl">
            {experiments && (
              <div className="flex flex-col gap-4 col-span-1 p-4">
                <span className="text-2xl">Settings</span>
                <span>
                  The recommended graph type for this data is:{" "}
                  {configuration?.experiments[0].metadata.recommended_type ? "Bar Chart" : "Line Chart"}
                </span>
                <button
                  onClick={() => {
                    setSettings({
                      [experiments[selectedExperiment].id]: {
                        type: getCurrentRenderedBarType() == GRAPH_TYPES.BAR ? GRAPH_TYPES.LINE : GRAPH_TYPES.BAR,
                      },
                    });
                  }}
                  className="bg-green-400 hover:bg-green-500 transition-all duration-100 px-4 py-2 w-max"
                >
                  Change to {getCurrentRenderedBarType() == GRAPH_TYPES.BAR ? "Line Chart" : "Bar Chart"}
                </button>
              </div>
            )}
          </div>
          <div>{!loading && configuration && <ChartComponent experiment={configuration.experiments[0]} />}</div>
        </div>
      </div>
    </>
  );
}

export default App;
