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
import { Configuration, Experiment } from "../utils/data";
import { Events, updateConfiguration, UpdateConfigurationEvent } from "../utils/events";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  experiment: Experiment;
};

export const ChartComponent = (props: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl">
      <Line
        data={
          {
            labels: getLabel(props.experiment)[0],
            datasets: getDatasets(props.experiment),
          } as ChartData<"line", number[], string>
        }
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top" as const,
            },
            title: {
              display: true,
              text: props.experiment.name, // TODO not only the first experiment
            },
          },
        }}
      />
    </div>
  );
};
