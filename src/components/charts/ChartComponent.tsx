import { Configuration, DatasetsWithResults, GRAPH_TYPES } from "../../utils/configuration/types";
import { getSettingsGraphType } from "../settings/utils";
import { BarChart } from "./bar/BarChart";
import { BoxPlotChart } from "./boxplot/BoxPlotChart";
import { LineChart } from "./line/LineChart";
import { PieChart } from "./pie/PieChart";
type Props = {
  configuration: Configuration;
  data: DatasetsWithResults;
  index: number;
};

export const ChartComponent = (props: Props) => {
  const { configuration, data, index } = props;

  const graph_type = getSettingsGraphType(configuration);

  const split = configuration.split != undefined;

  switch (graph_type) {
    case GRAPH_TYPES.LINE: {
      return <LineChart index={index} configuration={configuration} split={split} data={data}></LineChart>;
    }
    case GRAPH_TYPES.BAR: {
      return <BarChart configuration={configuration} split={split} data={data} index={index}></BarChart>;
    }
    case GRAPH_TYPES.PIE: {
      return <PieChart configuration={configuration} split={split} data={data}></PieChart>;
    }
    case GRAPH_TYPES.BOXPLOT: {
      return <BoxPlotChart configuration={configuration} data={data} index={index}></BoxPlotChart>;
    }
  }
  return <></>;
};
