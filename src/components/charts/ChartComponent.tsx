import { Configuration, Experiment, GRAPH_TYPES } from "../../utils/configuration/types";
import { Settings } from "../../utils/settings/types";
import { BarChart } from "./bar/BarChart";
import { BoxPlotChart } from "./boxplot/BoxPlotChart";
import { LineChart } from "./line/LineChart";
import { PieChart } from "./pie/PieChart";
type Props = {
  settings: Settings;
  configuration: Configuration;
  experiment: Experiment;
};

export const ChartComponent = (props: Props) => {
  const { settings, configuration, experiment } = props;
  const split = experiment.split_parameters != undefined;

  const renderGraph = (experiment: Experiment) => {
    switch (experiment.metadata.type) {
      case GRAPH_TYPES.LINE: {
        return (
          <LineChart
            settings={settings}
            configuration={configuration}
            split={split}
            experiment={experiment}
          ></LineChart>
        );
      }
      case GRAPH_TYPES.BAR: {
        return (
          <BarChart settings={settings} configuration={configuration} split={split} experiment={experiment}></BarChart>
        );
      }
      case GRAPH_TYPES.PIE: {
        return (
          <PieChart settings={settings} configuration={configuration} split={split} experiment={experiment}></PieChart>
        );
      }
      case GRAPH_TYPES.BOXPLOT: {
        return <BoxPlotChart settings={settings} configuration={configuration} experiment={experiment}></BoxPlotChart>;
      }
    }
  };

  return <>{renderGraph(experiment)}</>;
};
