import { Chart as ChartJS, Tooltip, Legend, Title, ChartData, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { pieChartOptions } from "./utils";
import { Configuration, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getPieLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";

ChartJS.register(Tooltip, Legend, ArcElement);

type Props = {
  settings: Settings;
  configuration: Configuration;
  experiment: Experiment;
  split?: boolean;
};

export const PieChart = (props: Props) => {
  const { settings, configuration, experiment, split = false } = props;

  return (
    <Pie
      data={
        {
          labels: getPieLabel(experiment),
          datasets: getDatasets(experiment, settings, configuration, GRAPH_TYPES.PIE),
        } as ChartData<"pie", number[], string>
      }
      options={pieChartOptions(settings, configuration, split)}
    />
  );
};
