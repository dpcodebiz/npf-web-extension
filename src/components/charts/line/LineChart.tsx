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
  settings: Settings;
  configuration: Configuration;
  data: DatasetsWithResults;
  index: number;
  split?: boolean;
};

export const LineChart = (props: Props) => {
  const { settings, configuration, data, index, split = false } = props;

  // Do not render if configuration has not been updated yet
  // TODO store settings inside configuration instead
  if (
    configuration.x !=
      getParameter("x", settings, {
        id: configuration.id,
        parameters: Object.keys(configuration.parameters),
        measurements: configuration.measurements,
      }) ||
    configuration.y !=
      getParameter("y", settings, {
        id: configuration.id,
        parameters: Object.keys(configuration.parameters),
        measurements: configuration.measurements,
      })
  )
    return <></>;

  return (
    <>
      {getSettingsErrorBars(settings, configuration) ? (
        <LineError
          data={
            {
              labels: getLabel(data, settings, configuration),
              datasets: getDatasets(data, settings, configuration, GRAPH_TYPES.LINE, true),
            } as ChartData<"lineWithErrorBars", number[], string>
          }
          options={lineChartOptions(settings, configuration, split, index)}
        />
      ) : (
        <Line
          data={
            {
              labels: getLabel(data, settings, configuration),
              datasets: getDatasets(data, settings, configuration),
            } as ChartData<"line", number[], string>
          }
          options={lineChartOptions(settings, configuration, split, index)}
        />
      )}
    </>
  );
};
