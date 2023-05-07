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
import { Configuration, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";
import { LineError } from "../../../utils/charts-wrapper/typedCharts";
import { getSettingsErrorBars } from "../../settings/utils";
import { PointWithErrorBar } from "chartjs-chart-error-bars";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, PointWithErrorBar);

type Props = {
  settings: Settings;
  configuration: Configuration;
  experiment: Experiment;
  split?: boolean;
};

export const LineChart = (props: Props) => {
  const { settings, configuration, experiment, split = false } = props;

  return (
    <>
      {getSettingsErrorBars(settings, configuration) ? (
        <LineError
          data={
            {
              labels: getLabel(experiment, settings, configuration),
              datasets: getDatasets(experiment, settings, configuration, GRAPH_TYPES.LINE, true),
            } as ChartData<"lineWithErrorBars", number[], string>
          }
          options={lineChartOptions(settings, configuration, split)}
        />
      ) : (
        <Line
          data={
            {
              labels: getLabel(experiment, settings, configuration),
              datasets: getDatasets(experiment, settings, configuration),
            } as ChartData<"line", number[], string>
          }
          options={lineChartOptions(settings, configuration, split)}
        />
      )}
    </>
  );
};
