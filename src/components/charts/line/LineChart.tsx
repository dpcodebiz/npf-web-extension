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
import { lineChartOptions } from "./utils";
import { Configuration, Experiment } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  settings: Settings;
  configuration: Configuration;
  experiment: Experiment;
  split?: boolean;
};

export const LineChart = (props: Props) => {
  const { settings, configuration, experiment, split = false } = props;

  return (
    <Line
      data={
        {
          labels: getLabel(experiment),
          datasets: getDatasets(experiment),
        } as ChartData<"line", number[], string>
      }
      options={lineChartOptions(settings, configuration, split)}
    />
  );
};
