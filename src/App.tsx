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
  const [fullScreen, setFullScreen] = useState(false);
  const { loading, load, configuration, settings, setSettings } = useConfiguration();

  // Configurations available
  const [configurations, setConfigurations] = useState<{ [index: string]: ConfigurationData }>();
  const [selectedConfiguration, setSelectedConfiguration] = useState("");

  const onKeyDown = (ev: KeyboardEvent) => {
    ev.key == "Escape" && setFullScreen(false);
  };

  // Mounting
  useEffect(() => {
    // TODO extract this
    const demo = () => {
      setConfigurations({
        ...configurations,
        ...{
          [CPU_ALGORITHM_DATA.id]: CPU_ALGORITHM_DATA,
          [IPERF_DATA.id]: IPERF_DATA,
          [MATH_DATA.id]: MATH_DATA,
          [WORLD_POPULATION_DATA.id]: WORLD_POPULATION_DATA,
        },
      });
    };

    const updateConfiguration = (configurationData: ConfigurationData) => {
      load(configurationData);
      setConfigurations({ [configurationData.id]: configurationData });
    };

    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;
    //@ts-expect-error because we are setting the window variable
    window.demo = demo;

    // Set up demo if no configuration provided
    if (!configuration) {
      demo();
    }

    // Dispatching event
    window.dispatchEvent(new Event(Events.APP_READY));

    // Listening for escape key
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [configuration, load, setConfigurations, configurations]);

  // Reset selected experiment and configuration loaded when experiments available change
  useEffect(() => {
    if (!configurations || Object.keys(configurations).length == 0) return;
    if (Object.keys(configurations).includes(selectedConfiguration)) return;

    setSelectedConfiguration(Object.keys(configurations)[0]);
    load(configurations[Object.keys(configurations)[0]]);
  }, [configurations, load, selectedConfiguration]);

  const onExperimentClick = (id: string) => {
    if (!configurations) return;

    setSelectedConfiguration(id);
    load(configurations[id]);
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
              configurations &&
              Object.entries(configurations).map(([id, configurationData]) => (
                <button
                  className={`p-4 text-lg text-left rounded transition-all duration-200 ${
                    selectedConfiguration == id ? "bg-uclouvain-1 text-white" : "hover:bg-gray-200"
                  }`}
                  key={id}
                  onClick={() => {
                    selectedConfiguration != id && onExperimentClick(id);
                  }}
                >
                  {configurationData.name}
                </button>
              ))}
          </div>
        </div>
        {!loading && configuration && fullScreen && (
          <ChartPanelComponent fullScreen={true} settings={settings} configuration={configuration} />
        )}
        <div className="p-6 w-full space-y-6">
          <div className="ml-auto w-max px-4 space-x-4">
            <button
              onClick={() => setSettingsModalOpen(!settingsModalOpen)}
              className="bg-uclouvain-1 text-white px-4 py-2 rounded"
            >
              Settings
            </button>
            <button onClick={() => setFullScreen(true)} className="bg-uclouvain-1 text-white px-4 py-2 rounded">
              Full Screen
            </button>
          </div>
          {!loading && configuration && !fullScreen && (
            <ChartPanelComponent fullScreen={false} settings={settings} configuration={configuration} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
