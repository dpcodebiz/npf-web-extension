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
import { Experiment } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = {
  experiment: Experiment;
  split?: boolean;
};

export const LineChart = (props: Props) => {
  const { experiment, split = false } = props;

  return (
    <Line
      data={
        {
          labels: getLabel(experiment),
          datasets: getDatasets(experiment),
        } as ChartData<"line", number[], string>
      }
      options={lineChartOptions(experiment, split)}
    />
  );
};
