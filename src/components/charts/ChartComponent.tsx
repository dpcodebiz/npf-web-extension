import { Experiment, GRAPH_TYPES } from "../../utils/configuration/types";
import { BarChart } from "./bar/BarChart";
import { LineChart } from "./line/LineChart";
type Props = {
  experiment: Experiment;
};

export const ChartComponent = (props: Props) => {
  const { experiment } = props;
  const split = experiment.split_parameters != undefined;

  const renderGraph = (experiment: Experiment) => {
    switch (experiment.metadata.type) {
      case GRAPH_TYPES.LINE: {
        return <LineChart split={split} experiment={experiment}></LineChart>;
      }
      case GRAPH_TYPES.BAR: {
        return <BarChart experiment={experiment}></BarChart>;
      }
    }
  };

  return <>{renderGraph(experiment)}</>;
};
