import { useEffect, useState } from "react";
import "./App.css";
import { ChartComponent } from "./components/ChartComponent";
import { Configuration } from "./utils/data";
import { Events, UpdateConfigurationEvent, updateConfiguration } from "./utils/events";
import { WebsiteLoader } from "./components/WebsiteLoader";

function App() {
  // States
  const [configuration, setConfiguration] = useState<Configuration>();
  const [loading, setLoading] = useState<boolean>(true);

  // Mounting
  useEffect(() => {
    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;

    const onUpdateConfiguration = (e: Event) => {
      // Cast
      const ev = e as UpdateConfigurationEvent;

      setLoading(false);
      setConfiguration(ev.detail.configuration);
    };

    // Listening to
    window.addEventListener(Events.UPDATE_CONFIGURATION, onUpdateConfiguration);

    // TODO fix this breaking the app when it shouldn't
    //return window.removeEventListener(Events.UPDATE_CONFIGURATION, onUpdateChartData);
  }, []);

  return (
    <>
      <WebsiteLoader loading={loading || !configuration} />
      <div className="bg-gray-100 w-screen h-screen flex flex-row">
        <div className="bg-white w-[300px] p-6 space-y-6">
          {/* sidebar */}
          <div className="font-bold text-xl">Network Performance Framework</div>
          <ul className="space-y-2">
            <li className="font-bold">Home</li>
            <li>Device 1</li>
            <li>Device 2</li>
            <li>Device 3</li>
            <li>Device 4</li>
          </ul>
        </div>
        <div className="p-6">
          <div className="flex flex-row gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div className="bg-white rounded-xl p-6 space-y-2" key={index}>
                <div>Experiments count</div>
                <div className="mx-auto w-max text-blue-500">17</div>
              </div>
            ))}
          </div>
          <div>
            {!loading &&
              configuration &&
              configuration.experiments.map((experiment) => <ChartComponent experiment={experiment} />)}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
