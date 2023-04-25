import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, Title, ChartData, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { barChartOptions } from "./utils";
import { Experiment } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  experiment: Experiment;
};

export const BarChart = ({ experiment }: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl">
      <Bar
        data={
          {
            labels: getLabel(experiment),
            datasets: getDatasets(experiment),
          } as ChartData<"bar", number[], string>
        }
        options={barChartOptions(experiment)}
      />
    </div>
  );
};
