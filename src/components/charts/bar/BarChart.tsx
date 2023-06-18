import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale, Title, ChartData, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { barChartOptions } from "./utils";
import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "../../../utils/configuration/types";
import { getDatasets, getLabel } from "../../../utils/chart";
import { Settings } from "../../../utils/settings/types";
import { getParameter, getSettingsErrorBars } from "../../settings/utils";
import { BarError } from "../../../utils/charts-wrapper/typedCharts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  configuration: Configuration;
  split: boolean;
  data: DatasetsWithResults;
  index: number;
};

export const BarChart = (props: Props) => {
  const { configuration, data, split = false, index } = props;

  return (
    <div className="bg-white p-6 rounded-xl">
      {getSettingsErrorBars(configuration) ? (
        <BarError
          data={
            {
              labels: getLabel(data, configuration),
              datasets: getDatasets(data, GRAPH_TYPES.BAR, true),
            } as ChartData<"barWithErrorBars", number[], string>
          }
          options={barChartOptions(configuration, split, index)}
        />
      ) : (
        <Bar
          data={
            {
              labels: getLabel(data, configuration),
              datasets: getDatasets(data),
            } as ChartData<"bar", number[], string>
          }
          options={barChartOptions(configuration, split, index)}
        />
      )}
    </div>
  );
};
