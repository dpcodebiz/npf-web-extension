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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getLabel = (rawData: any) => {
  console.log(rawData);
  return rawData ? Object.entries(rawData["01-iperf.npf"]).map(([k, pairs]) => Object.keys(pairs as any)) : null;
};

const getData = (rawData: any) => {
  console.log(rawData);
  return rawData
    ? Object.entries(rawData["01-iperf.npf"]).map(([k, v]) => ({
        label: k,
        data: Object.values(v as any),
        backgroundColor: "blue",
        borderColor: "blue",
      }))
    : null;
};

export const ChartComponent = () => {
  const [rawData, setRawData] = useState<any>();
  const [data, setData] = useState<ChartData<"line", number[], string>>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const onUpdateChartData = (e: any) => {
      setLoading(true);
      setRawData(e.detail.rawData);
      console.log("yes", e.detail.rawData);
    };

    window.addEventListener("updateChartData", onUpdateChartData);
    console.log("test");

    //return window.removeEventListener("updateChartData", onUpdateChartData);
  }, []);

  useEffect(() => {
    const label = getLabel(rawData);

    setData({
      labels: label ? label[0] : undefined,
      datasets: getData(rawData) as any,
    });
  }, [rawData]);

  useEffect(() => {
    setLoading(false);
  }, [data]);

  // const raw_data = {
  //   "01-iperf.npf": {
  //     "('', 'without')": {
  //       "1": 60501974220.8,
  //       "2": 51092413440.0,
  //       "3": 76334086963.2,
  //       "4": 64968509849.6,
  //       "5": 57515010252.8,
  //       "6": 58613023744.0,
  //       "7": 67958106112.0,
  //       "8": 50650913177.6,
  //     },
  //     "('-Z', 'with')": {
  //       "1": 92964336640.0,
  //       "2": 93229826867.2,
  //       "3": 100535490355.2,
  //       "4": 98984001331.2,
  //       "5": 98882097561.6,
  //       "6": 98175769190.4,
  //       "7": 99427311411.2,
  //       "8": 94954852966.4,
  //     },
  //   },
  // };

  return rawData == undefined || data == undefined || loading ? (
    <>loading</>
  ) : (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: Object.keys(rawData)[0],
          },
        },
      }}
    />
  );
};
