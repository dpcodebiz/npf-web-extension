import React, { useRef } from "react";
import { ChartData } from "chart.js";
import { BoxPlot } from "../../../utils/charts-wrapper/typedCharts";
import { boxplotChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "../../../utils/configuration/types";
import { backgroundPlugin, exportChartPdf, getDatasets, getLabel } from "../../../utils/chart";

type Props = {
  configuration: Configuration;
  index: number;
  data: DatasetsWithResults;
};

export const BoxPlotChart: React.FC<Props> = (props: Props) => {
  const { configuration, index, data } = props;

  const split = configuration.split != undefined;
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
        <BoxPlot
          ref={chartRef}
          data={
            {
              labels: getLabel(data, configuration),
              datasets: getDatasets(data, GRAPH_TYPES.BOXPLOT),
            } as ChartData<"boxplot", number[], string>
          }
          options={boxplotChartOptions(configuration, split, index)}
          plugins={[backgroundPlugin]}
        />
      </div>
    </>
  );
};
