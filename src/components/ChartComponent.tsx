import { Experiment } from "../utils/configuration/types";
import { LineChart } from "./charts/line/LineChart";
type Props = {
  experiment: Experiment;
};

export const ChartComponent = (props: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl">
      <LineChart experiment={props.experiment}></LineChart>
    </div>
  );
};
