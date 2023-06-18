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
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "../../../utils/configuration/types";
import { backgroundPlugin, exportChartPdf, getDatasets, getLabel } from "../../../utils/chart";
import { LineError } from "../../../utils/charts-wrapper/typedCharts";
import { getSettingsErrorBars } from "../../settings/utils";
import { PointWithErrorBar } from "chartjs-chart-error-bars";
import Annotation from "chartjs-plugin-annotation";
import { useRef } from "react";

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

  const chartRef = useRef(null);

  return (
    <>
      <button
        className="w-max ml-auto block mb-2 bg-uclouvain-1 text-white py-1 px-2 rounded"
        onClick={() => {
          exportChartPdf(
            //@ts-expect-error type
            chartRef.current.canvas,
            index,
            configuration
          );
        }}
      >
        Download
      </button>
      {getSettingsErrorBars(configuration) ? (
        <div>
          <LineError
            ref={chartRef}
            data={
              {
                labels: getLabel(data, configuration),
                datasets: getDatasets(data, GRAPH_TYPES.LINE, true),
              } as ChartData<"lineWithErrorBars", number[], string>
            }
            options={lineChartOptions(configuration, split, index)}
            plugins={[backgroundPlugin]}
          />
        </div>
      ) : (
        <div>
          <Line
            ref={chartRef}
            data={
              {
                labels: getLabel(data, configuration),
                datasets: getDatasets(data),
              } as ChartData<"line", number[], string>
            }
            options={lineChartOptions(configuration, split, index)}
          />
        </div>
      )}
    </>
  );
};
