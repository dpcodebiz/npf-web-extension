import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, Title, ChartData, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { barChartOptions } from "./utils";
import { Configuration, Experiment } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  settings: Settings;
  configuration: Configuration;
  split: boolean;
  experiment: Experiment;
};

export const BarChart = (props: Props) => {
  const { settings, configuration, experiment, split = false } = props;
  return (
    <div className="bg-white p-6 rounded-xl">
      <Bar
        data={
          {
            labels: getLabel(experiment),
            datasets: getDatasets(experiment),
          } as ChartData<"bar", number[], string>
        }
        options={barChartOptions(settings, configuration, split)}
      />
    </div>
  );
};
