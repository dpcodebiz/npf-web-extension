import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, Title, ChartData, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { barChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "../../../utils/configuration/types";
import { backgroundPlugin, exportChartPdf, getDatasets, getLabel } from "../../../utils/chart";
import { getSettingsErrorBars } from "../../settings/utils";
import { BarError } from "../../../utils/charts-wrapper/typedCharts";
import { useRef } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  configuration: Configuration;
  split: boolean;
  data: DatasetsWithResults;
  index: number;
};

export const BarChart = (props: Props) => {
  const { configuration, data, split = false, index } = props;
  const chartRef = useRef(null);

  return (
    <div className="bg-white p-6 rounded-xl">
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
          <BarError
            ref={chartRef}
            data={
              {
                labels: getLabel(data, configuration),
                datasets: getDatasets(data, GRAPH_TYPES.BAR, true),
              } as ChartData<"barWithErrorBars", number[], string>
            }
            options={barChartOptions(configuration, split, index)}
            plugins={[backgroundPlugin]}
          />
        </div>
      ) : (
        <div>
          <Bar
            ref={chartRef}
            data={
              {
                labels: getLabel(data, configuration),
                datasets: getDatasets(data),
              } as ChartData<"bar", number[], string>
            }
            options={barChartOptions(configuration, split, index)}
            plugins={[backgroundPlugin]}
          />
        </div>
      )}
    </div>
  );
};
