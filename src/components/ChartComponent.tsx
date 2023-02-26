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
import React from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const raw_data = {
  "01-iperf.npf": {
    "('', 'without')": {
      "1": 60501974220.8,
      "2": 51092413440.0,
      "3": 76334086963.2,
      "4": 64968509849.6,
      "5": 57515010252.8,
      "6": 58613023744.0,
      "7": 67958106112.0,
      "8": 50650913177.6,
    },
    "('-Z', 'with')": {
      "1": 92964336640.0,
      "2": 93229826867.2,
      "3": 100535490355.2,
      "4": 98984001331.2,
      "5": 98882097561.6,
      "6": 98175769190.4,
      "7": 99427311411.2,
      "8": 94954852966.4,
    },
  },
};

const getLabel = () => {
  return Object.entries(raw_data["01-iperf.npf"]).map(([k, pairs]) => Object.keys(pairs));
};

const getData = () => {
  return Object.entries(raw_data["01-iperf.npf"]).map(([k, v]) => ({
    label: k,
    data: Object.values(v),
    backgroundColor: "blue",
    borderColor: "blue",
  }));
};

const data: ChartData<"line", number[], string> = {
  labels: getLabel()[0],
  datasets: getData(),
};

export const ChartComponent = () => {
  console.log(getLabel(), getData());

  return (
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
            text: Object.keys(raw_data)[0],
          },
        },
      }}
    />
  );
};
