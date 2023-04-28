import { Configuration } from "../../utils/configuration/types";
import { getSplitParameters } from "../../utils/configuration/utils";
import { ChartComponent } from "./ChartComponent";

type Props = {
  configuration: Configuration;
};

export const ChartPanelComponent = (props: Props) => {
  const { configuration } = props;

  // TODO add a multivariate metadata to configuration so no checking needed
  const nExperiments = configuration.experiments.length;
  const split = configuration.experiments[0].split_parameters != undefined;
  const split_parameters = getSplitParameters(configuration.experiments);
  const split_cols = split_parameters.x?.length ?? 0;
  const split_rows = split_parameters.y?.length ?? 0;

  const getCols = () => {
    const splitCols = configuration.experiments[0].split_parameters?.x?.values.length;

    switch (splitCols) {
      case 1:
        return `grid grid-cols-1`;
      case 2:
        return `grid grid-cols-2`;
      case 3:
        return `grid grid-cols-3`;
      case 4:
        return `grid grid-cols-4`;
    }

    return `grid grid-cols-1`;
  };

  console.log(configuration);

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className={getCols()}>
        {configuration.experiments.map((experiment, index) => (
          <div className="col-span-1">
            {split && split_parameters?.x && (
              <div>
                <div className="text-center pb-4">
                  {split_parameters.x[index % split_cols].name}={split_parameters.x[index % split_cols].value}
                </div>
                <hr />
              </div>
            )}
            <ChartComponent experiment={experiment} />
          </div>
        ))}
      </div>
    </div>
  );
};
