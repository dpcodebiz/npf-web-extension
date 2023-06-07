import { Configuration, DatasetsWithResults, Experiment, GRAPH_TYPES } from "../../utils/configuration/types";
import { Settings } from "../../utils/settings/types";
import { getSettingsGraphType } from "../settings/utils";
import { BarChart } from "./bar/BarChart";
import { BoxPlotChart } from "./boxplot/BoxPlotChart";
import { LineChart } from "./line/LineChart";
import { PieChart } from "./pie/PieChart";
type Props = {
  settings: Settings;
  configuration: Configuration;
  data: DatasetsWithResults;
  index: number;
};

export const ChartComponent = (props: Props) => {
  const { settings, configuration, data, index } = props;

  const graph_type = getSettingsGraphType(settings, configuration);

  const split = configuration.split != undefined;

  switch (graph_type) {
    case GRAPH_TYPES.LINE: {
      return (
        <LineChart
          index={index}
          settings={settings}
          configuration={configuration}
          split={split}
          data={data}
        ></LineChart>
      );
    }
    case GRAPH_TYPES.BAR: {
      return (
        <BarChart settings={settings} configuration={configuration} split={split} data={data} index={index}></BarChart>
      );
    }
    case GRAPH_TYPES.PIE: {
      return <PieChart settings={settings} configuration={configuration} split={split} data={data}></PieChart>;
    }
    case GRAPH_TYPES.BOXPLOT: {
      return <BoxPlotChart settings={settings} configuration={configuration} data={data} index={index}></BoxPlotChart>;
    }
  }
  return <></>;
};
