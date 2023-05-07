import { ConfigurationData, GRAPH_TYPES } from "../types";
import { getPieChartConfiguration } from "./doughnut";

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

test("getPieChartConfiguration", () => {
  expect(getPieChartConfiguration({}, configurationDataSimple, arrayOfParsedConfigurationData)).toMatchObject({
    main_parameter: "a",
    metadata: {
      recommended_type: GRAPH_TYPES.PIE,
      type: GRAPH_TYPES.PIE,
    },
    name: "",
    runs: [
      {
        parameters: {},
        results: {
          b: 3,
        },
      },
    ],
  });
});
