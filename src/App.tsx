import { useCallback, useEffect, useMemo, useState } from "react";
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
import { isArray, isEqual } from "radash";

function App() {
  // States
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const { loading, load, configuration, settings, setSettings } = useConfiguration();
  const [keysHistory, setKeysHistory] = useState<string[]>([]);

  // Configurations available
  const [configurations, setConfigurations] = useState<{ [index: string]: ConfigurationData }>();
  const [selectedConfiguration, setSelectedConfiguration] = useState("");

  // Callbacks
  const updateConfiguration = useCallback(
    (configurationData: ConfigurationData | ConfigurationData[]) => {
      if (isArray(configurationData)) {
        load(configurationData[0]);
        const newConfigurations: { [index: string]: ConfigurationData } = {};
        configurationData.forEach((config) => {
          newConfigurations[config.id] = config;
        });
        setConfigurations(Object.assign({ ...configurations }, newConfigurations));
        return;
      }

      load(configurationData);
      setConfigurations({ ...configurations, ...{ [configurationData.id]: configurationData } });
    },
    [configurations, load]
  );
  const demo = useCallback(() => {
    setConfigurations({
      ...{
        [CPU_ALGORITHM_DATA.id]: CPU_ALGORITHM_DATA,
        [IPERF_DATA.id]: IPERF_DATA,
        [MATH_DATA.id]: MATH_DATA,
        [WORLD_POPULATION_DATA.id]: WORLD_POPULATION_DATA,
      },
    });
  }, [setConfigurations]);
  const onConfigurationClick = useCallback(
    (id: string) => {
      if (!configurations) return;

      setSelectedConfiguration(id);
      load(configurations[id]);
    },
    [configurations, setSelectedConfiguration, load]
  );

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      const newHistory = [ev.key, ...keysHistory].slice(0, 4);
      if (isEqual(newHistory, ["o", "m", "e", "d"])) {
        setKeysHistory([]);
        demo();
      } else setKeysHistory([ev.key, ...keysHistory].slice(0, 4));
      ev.key == "Escape" && setFullScreen(false);
    },
    [setKeysHistory, demo, keysHistory]
  );

  // Mounting
  useEffect(() => {
    // Listening for escape key
    !settingsModalOpen && document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown, settingsModalOpen]);

  // Mounting
  useEffect(() => {
    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;
    //@ts-expect-error because we are setting the window variable
    window.demo = demo;

    // Dispatching event
    if (!configurations) {
      window.dispatchEvent(new Event(Events.APP_READY));
    }
  }, [updateConfiguration, demo, configurations]);

  // Reset selected configuration and configuration loaded when configurations available change
  useEffect(() => {
    if (!configurations || Object.keys(configurations).length == 0) return;
    if (Object.keys(configurations).includes(selectedConfiguration)) return;

    setSelectedConfiguration(Object.keys(configurations)[0]);
    load(configurations[Object.keys(configurations)[0]]);
  }, [configurations, load, selectedConfiguration]);

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
      <WebsiteLoader loading={loading && !configuration} />
      <div className="bg-gray-100 min-w-[100vw] w-max h-screen flex flex-row">
        <div className="bg-white w-[300px] xlw-[400px] p-6 space-y-6">
          <div className="font-bold text-lg xl:text-xl">Network Performance Framework</div>
          <div className="space-y-2 flex flex-col">
            {configurations &&
              Object.entries(configurations).map(([id, configurationData]) => (
                <button
                  className={`p-4 xl:text-lg text-left rounded transition-all duration-200 ${
                    selectedConfiguration == id ? "bg-uclouvain-1 text-white" : "hover:bg-gray-200"
                  }`}
                  key={id}
                  onClick={() => {
                    selectedConfiguration != id && onConfigurationClick(id);
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
        <div className="p-6 w-full space-y-6 grid pt-12" style={{ gridTemplateRows: "min-content repeat(1, 1fr)" }}>
          <div className="w-max px-4 space-x-4 fixed top-4 right-4">
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
          {configuration && !fullScreen && (
            <ChartPanelComponent
              loading={loading}
              fullScreen={false}
              settings={settings}
              configuration={configuration}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
