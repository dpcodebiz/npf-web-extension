import React from "react";
import { ChartData, ChartOptions } from "chart.js";
import { BoxPlot } from "../../../utils/charts-wrapper/typedCharts";
import { boxplotChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { Settings } from "../../../utils/settings/types";
import { getDatasets, getLabel } from "../../../utils/chart";

type Props = {
  configuration: Configuration;
  index: number;
  data: DatasetsWithResults;
};

export const BoxPlotChart: React.FC<Props> = (props: Props) => {
  const { configuration, index, data } = props;

  const split = configuration.split != undefined;

  return (
    <BoxPlot
      data={
        {
          labels: getLabel(data, configuration),
          datasets: getDatasets(data, GRAPH_TYPES.BOXPLOT),
        } as ChartData<"boxplot", number[], string>
      }
      options={boxplotChartOptions(configuration, split, index)}
    />
  );
};
