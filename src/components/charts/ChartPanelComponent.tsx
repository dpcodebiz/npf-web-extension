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

  console.log(configuration, split_cols, split_rows);

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="grid grid-custom">
        {configuration.experiments.map((experiment, index) => (
          <>
            <div className="col-span-1">
              {split_parameters.x && Math.floor(index / split_cols) == 0 && (
                <div className="text-center pb-4 border-b-2">
                  {split_parameters.x && split_parameters.x[index % split_cols].name}=
                  {split_parameters.x && split_parameters.x[index % split_cols].value}
                </div>
              )}
              <div className="p-4">
                <ChartComponent experiment={experiment} />
              </div>
            </div>
            {split_parameters.y && index % split_cols == split_cols - 1 && (
              <div className="border-l-2 px-4 inline-grid place-content-center">
                {split_parameters.y && split_parameters.y[Math.floor(index / split_cols)].name}=
                {split_parameters.y && split_parameters.y[Math.floor(index / split_cols)].value}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
