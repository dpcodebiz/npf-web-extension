import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  ChartData,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getDatasets, getLabel } from "../utils/chart";
import { Configuration } from "../utils/data";
import { Events, updateConfiguration, UpdateConfigurationEvent } from "../utils/events";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const ChartComponent = () => {
  // States
  const [configuration, setConfiguration] = useState<Configuration>();
  const [data, setData] = useState<ChartData<"line", number[], string>>();
  const [loading, setLoading] = useState<boolean>(true);

  // Mounting
  useEffect(() => {
    // Exporting the update method
    //@ts-expect-error because we are setting the window variable
    window.updateConfiguration = updateConfiguration;

    const onUpdateConfiguration = (e: Event) => {
      // Cast
      const ev = e as UpdateConfigurationEvent;

      setLoading(true);
      setConfiguration(ev.detail.configuration);
    };

    // Listening to
    window.addEventListener(Events.UPDATE_CONFIGURATION, onUpdateConfiguration);

    // TODO fix this breaking the app when it shouldn't
    //return window.removeEventListener(Events.UPDATE_CONFIGURATION, onUpdateChartData);
  }, []);

  // Handling configuration update
  useEffect(() => {
    // Skip if no configuration
    if (!configuration) return;

    const label = getLabel(configuration);
    const datasets = getDatasets(configuration);

    // Typeguard -> this should never be triggered
    if (!label || !datasets) return;

    setData({
      labels: label[0],
      datasets: datasets,
    });
  }, [configuration]);

  // This avoids rendering issues when data is still being updated but chartjs
  // tries accessing it
  useEffect(() => {
    if (!data) return;

    setLoading(false);
  }, [data]);

  // const raw_data = {
  //   experiments: [
  //     {
  //       name: "01-iperf.npf",
  //       runs: [
  //         {
  //           name: "('', 'without')",
  //           results: {
  //             "1": 60501974220.8,
  //             "2": 51092413440.0,
  //             "3": 76334086963.2,
  //             "4": 64968509849.6,
  //             "5": 57515010252.8,
  //             "6": 58613023744.0,
  //             "7": 67958106112.0,
  //             "8": 50650913177.6,
  //           },
  //         },
  //         {
  //           name: "('-Z', 'with')",
  //           results: {
  //             "1": 92964336640.0,
  //             "2": 93229826867.2,
  //             "3": 100535490355.2,
  //             "4": 98984001331.2,
  //             "5": 98882097561.6,
  //             "6": 98175769190.4,
  //             "7": 99427311411.2,
  //             "8": 94954852966.4,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // };

  return loading ? (
    <>loading</>
  ) : (
    <Line
      data={data as ChartData<"line", number[], string>}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: configuration?.experiments[0].name, // TODO not only the first experiment
          },
        },
      }}
    />
  );
};
