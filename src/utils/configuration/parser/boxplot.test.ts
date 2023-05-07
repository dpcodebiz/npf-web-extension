import { ConfigurationData, GRAPH_TYPES } from "../types";
import { getBoxPlotChartConfiguration } from "./boxplot";

// Mock
const configurationDataSimple: ConfigurationData = {
  id: "02",
  parameters: ["a"],
  measurements: ["b"],
  name: "",
  data: ``,
};
const arrayOfParsedConfigurationData = [
  {
    a: "1",
    b: "3",
  },
  {
    a: "2",
    b: "3",
  },
  {
    a: "3",
    b: "3",
  },
];

test("getBoxPlotChartConfiguration", () => {
  expect(getBoxPlotChartConfiguration({}, configurationDataSimple, arrayOfParsedConfigurationData)).toMatchObject({
    main_parameter: "a",
    metadata: {
      recommended_type: GRAPH_TYPES.BOXPLOT,
      type: GRAPH_TYPES.BOXPLOT,
    },
    name: "",
    runs: [
      {
        parameters: {},
        results: {
          b: {
            "1": [3],
            "2": [3],
            "3": [3],
          },
        },
      },
    ],
  });
});
