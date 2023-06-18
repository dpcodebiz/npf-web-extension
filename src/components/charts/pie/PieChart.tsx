import { Chart as ChartJS, Tooltip, Legend, Title, ChartData, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import { pieChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { backgroundPlugin, exportChartPdf, getDatasets, getPieLabel } from "../../../utils/chart";
import { useRef } from "react";

ChartJS.register(Tooltip, Legend, ArcElement);

type Props = {
  configuration: Configuration;
  data: DatasetsWithResults;
  split?: boolean;
  index: number;
};

export const PieChart = (props: Props) => {
  const { data, split = false, index, configuration } = props;
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
      <div>
        <Pie
          ref={chartRef}
          data={
            {
              labels: getPieLabel(data),
              datasets: getDatasets(data, GRAPH_TYPES.PIE),
            } as ChartData<"pie", number[], string>
          }
          options={pieChartOptions(data, split)}
          plugins={[backgroundPlugin]}
        />
      </div>
    </>
  );
};
