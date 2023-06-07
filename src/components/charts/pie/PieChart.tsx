import { Chart as ChartJS, Tooltip, Legend, Title, ChartData, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { pieChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getPieLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";

ChartJS.register(Tooltip, Legend, ArcElement);

type Props = {
  settings: Settings;
  configuration: Configuration;
  data: DatasetsWithResults;
  split?: boolean;
};

export const PieChart = (props: Props) => {
  const { settings, configuration, data, split = false } = props;

  return (
    <Pie
      data={
        {
          labels: getPieLabel(data),
          datasets: getDatasets(data, settings, configuration, GRAPH_TYPES.PIE),
        } as ChartData<"pie", number[], string>
      }
      options={pieChartOptions(settings, configuration, data, split)}
    />
  );
};
