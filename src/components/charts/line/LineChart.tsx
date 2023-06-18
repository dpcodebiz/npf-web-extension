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
import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";
import { LineError } from "../../../utils/charts-wrapper/typedCharts";
import { getParameter, getSettingsErrorBars } from "../../settings/utils";
import { PointWithErrorBar } from "chartjs-chart-error-bars";
import Annotation from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointWithErrorBar,
  Annotation
);

type Props = {
  configuration: Configuration;
  data: DatasetsWithResults;
  index: number;
  split?: boolean;
};

export const LineChart = (props: Props) => {
  const { configuration, data, index, split = false } = props;

  return (
    <>
      {getSettingsErrorBars(configuration) ? (
        <LineError
          data={
            {
              labels: getLabel(data, configuration),
              datasets: getDatasets(data, GRAPH_TYPES.LINE, true),
            } as ChartData<"lineWithErrorBars", number[], string>
          }
          options={lineChartOptions(configuration, split, index)}
        />
      ) : (
        <Line
          data={
            {
              labels: getLabel(data, configuration),
              datasets: getDatasets(data),
            } as ChartData<"line", number[], string>
          }
          options={lineChartOptions(configuration, split, index)}
        />
      )}
    </>
  );
};
