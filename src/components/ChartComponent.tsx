import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getDatasets, getLabel } from "../utils/chart";
import { Experiment } from "../utils/configuration/types";

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
            labels: getLabel(props.experiment),
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
