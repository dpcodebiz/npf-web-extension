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
  settings: Settings;
  configuration: Configuration;
  split: boolean;
  data: DatasetsWithResults;
  index: number;
};

export const BarChart = (props: Props) => {
  const { settings, configuration, data, split = false, index } = props;

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
    <div className="bg-white p-6 rounded-xl">
      {getSettingsErrorBars(settings, configuration) ? (
        <BarError
          data={
            {
              labels: getLabel(data, settings, configuration),
              datasets: getDatasets(data, settings, configuration, GRAPH_TYPES.BAR, true),
            } as ChartData<"barWithErrorBars", number[], string>
          }
          options={barChartOptions(settings, configuration, split, index)}
        />
      ) : (
        <Bar
          data={
            {
              labels: getLabel(data, settings, configuration),
              datasets: getDatasets(data, settings, configuration),
            } as ChartData<"bar", number[], string>
          }
          options={barChartOptions(settings, configuration, split, index)}
        />
      )}
    </div>
  );
};
