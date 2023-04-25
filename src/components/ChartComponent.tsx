import { Experiment, GRAPH_TYPES } from "../utils/configuration/types";
import { BarChart } from "./charts/bar/BarChart";
import { LineChart } from "./charts/line/LineChart";
type Props = {
  experiment: Experiment;
};

export const ChartComponent = ({ experiment }: Props) => {
  const renderGraph = (experiment: Experiment) => {
    switch (experiment.metadata.type) {
      case GRAPH_TYPES.LINE: {
        return <LineChart experiment={experiment}></LineChart>;
      }
      case GRAPH_TYPES.BAR: {
        return <BarChart experiment={experiment}></BarChart>;
      }
    }
  };

  return <div className="bg-white p-6 rounded-xl">{renderGraph(experiment)}</div>;
};
