import { useEffect, useState } from "react";
import "./App.scss";
import { Events } from "./utils/events";
import { WebsiteLoader } from "./components/WebsiteLoader";
import { useConfiguration } from "./utils/configuration";
import { IPERF_DATA } from "./utils/examples/iperf";
import { MATH_DATA } from "./utils/examples/math";
import { WORLD_POPULATION_DATA } from "./utils/examples/world_population";
import { ConfigurationData } from "./utils/configuration/types";
import { CPU_ALGORITHM_DATA } from "./utils/examples/cpu_algorithm";
import { ChartPanelComponent } from "./components/charts/ChartPanelComponent";
import { SettingsModal } from "./components/settings/SettingsModal";

function App() {
  // States
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const { loading, load, configuration, settings, setSettings } = useConfiguration();
  const [experiments, setExperiments] = useState<{ [index: string]: ConfigurationData }>();

  const [selectedExperiment, setSelectedExperiment] = useState("");

  const demo = () => {
    setExperiments({
      [CPU_ALGORITHM_DATA.id]: CPU_ALGORITHM_DATA,
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

    if (!configuration) {
      demo();
    }

    // Dispatching event
    window.dispatchEvent(new Event(Events.APP_READY));
  }, [configuration, load]);

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

  return (
    <>
      {configuration && (
        <SettingsModal
          open={settingsModalOpen}
          setOpen={(open: boolean) => setSettingsModalOpen(open)}
          settings={settings}
          configuration={configuration}
          setSettings={setSettings}
        />
      )}
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
          <div className="ml-auto w-max px-4">
            <button
              onClick={() => setSettingsModalOpen(!settingsModalOpen)}
              className="bg-uclouvain-1 text-white px-4 py-2 rounded"
            >
              <i className="las la-cogs"></i>Settings
            </button>
          </div>
          {!loading && configuration && <ChartPanelComponent settings={settings} configuration={configuration} />}
        </div>
      </div>
    </>
  );
}

export default App;
