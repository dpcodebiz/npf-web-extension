import { Chart as ChartJS, Tooltip, Legend, Title, ChartData, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { pieChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getPieLabel } from "../../../utils/chart";

ChartJS.register(Tooltip, Legend, ArcElement);

type Props = {
  configuration: Configuration;
  data: DatasetsWithResults;
  split?: boolean;
};

export const PieChart = (props: Props) => {
  const { data, split = false } = props;

  return (
    <Pie
      data={
        {
          labels: getPieLabel(data),
          datasets: getDatasets(data, GRAPH_TYPES.PIE),
        } as ChartData<"pie", number[], string>
      }
      options={pieChartOptions(data, split)}
    />
  );
};
