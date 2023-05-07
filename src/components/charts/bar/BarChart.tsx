import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, Title, ChartData, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { barChartOptions } from "./utils";
import { Configuration, Experiment, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";
import { getSettingsErrorBars } from "../../settings/utils";
import { BarError } from "../../../utils/charts-wrapper/typedCharts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  settings: Settings;
  configuration: Configuration;
  split: boolean;
  experiment: Experiment;
};

export const BarChart = (props: Props) => {
  const { settings, configuration, experiment, split = false } = props;
  return (
    <div className="bg-white p-6 rounded-xl">
      {getSettingsErrorBars(settings, configuration) ? (
        <BarError
          data={
            {
              labels: getLabel(experiment, settings, configuration),
              datasets: getDatasets(experiment, settings, configuration, GRAPH_TYPES.BAR, true),
            } as ChartData<"barWithErrorBars", number[], string>
          }
          options={barChartOptions(settings, configuration, split)}
        />
      ) : (
        <Bar
          data={
            {
              labels: getLabel(experiment, settings, configuration),
              datasets: getDatasets(experiment, settings, configuration),
            } as ChartData<"bar", number[], string>
          }
          options={barChartOptions(settings, configuration, split)}
        />
      )}
    </div>
  );
};
