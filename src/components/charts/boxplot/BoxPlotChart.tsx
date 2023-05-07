import React from "react";
import { ChartData, ChartOptions } from "chart.js";
import { BoxPlot } from "../../../utils/charts-wrapper/typedCharts";
import { boxplotChartOptions } from "./utils";
import { Configuration, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { Settings } from "../../../utils/settings/types";
import { getDatasets, getLabel } from "../../../utils/chart";

type Props = {
  settings: Settings;
  configuration: Configuration;
  experiment: Experiment;
};

export const BoxPlotChart: React.FC<Props> = (props: Props) => {
  const { settings, configuration, experiment } = props;

  const split = experiment.split_parameters != undefined;

  return (
    <BoxPlot
      data={
        {
          labels: getLabel(experiment, settings, configuration),
          datasets: getDatasets(experiment, settings, configuration, GRAPH_TYPES.BOXPLOT),
        } as ChartData<"boxplot", number[], string>
      }
      options={boxplotChartOptions(settings, configuration, split)}
    />
  );
};
