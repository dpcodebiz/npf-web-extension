import { Configuration, ConfigurationData, GRAPH_TYPES } from "../types";
import {
  aggregateAllResults,
  getLineChartConfiguration,
  getRunsFromGroupedData,
  groupDataByParameters,
  mergeValuesAggregation,
  sumDataAggregation,
  unfoldAggregatedData,
} from "./line";

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

test("groupDataByParameters", () => {
  expect(
    groupDataByParameters(
      ["p1", "p2"],
      [
        { p1: "0", p2: "0", p3: "1" },
        { p1: "1", p2: "1", p3: "2" },
      ]
    )
  ).toMatchObject({ "p1=0,p2=0,": [{ p1: "0", p2: "0", p3: "1" }], "p1=1,p2=1,": [{ p1: "1", p2: "1", p3: "2" }] });
});
test("mergeValuesAggregation", () => {
  expect(
    mergeValuesAggregation(
      [
        { p1: "0", p2: "0", p3: "1" },
        { p1: "1", p2: "1", p3: "2" },
      ],
      "p1"
    )
  ).toMatchObject([0, 1]);
});
test("sumDataAggregation", () => {
  expect(
    sumDataAggregation(
      [
        { p1: "1", p2: "0", p3: "1" },
        { p1: "3", p2: "1", p3: "2" },
      ],
      "p1"
    )
  ).toBe(2);
});

test("aggregateAllResults", () => {
  expect(
    aggregateAllResults(
      ["p1"],
      ["p3"],
      [
        { p1: "1", p2: "0", p3: "1" },
        { p1: "3", p2: "1", p3: "2" },
      ],
      sumDataAggregation
    )
  ).toMatchObject({ "p1=1,": { p3: 1 }, "p1=3,": { p3: 2 } });
});
test("getRunsFromGroupedData", () => {
  const aggregated_data = aggregateAllResults(
    ["p1", "p2"],
    ["p3"],
    [
      { p1: "1", p2: "0", p3: "1" },
      { p1: "3", p2: "1", p3: "2" },
    ],
    mergeValuesAggregation
  );
  const unfolded_data = unfoldAggregatedData(aggregated_data);

  expect(getRunsFromGroupedData("p1", ["p3"], groupDataByParameters(["p2"], unfolded_data))).toMatchObject([
    { parameters: { p2: "0" }, results: { p3: { "1": [1] } } },
    { parameters: { p2: "1" }, results: { p3: { "3": [2] } } },
  ]);
});
test("unfoldAggregatedData", () => {
  const aggregated_data = aggregateAllResults(
    ["p1", "p2"],
    ["p3"],
    [
      { p1: "1", p2: "0", p3: "1" },
      { p1: "3", p2: "1", p3: "2" },
    ],
    mergeValuesAggregation
  );

  expect(unfoldAggregatedData(aggregated_data)).toMatchObject([
    {
      experiment_data: {
        p3: [1],
      },
      p1: "1",
      p2: "0",
    },
    {
      experiment_data: {
        p3: [2],
      },
      p1: "3",
      p2: "1",
    },
  ]);
});
test("getLineChartConfiguration", () => {
  expect(getLineChartConfiguration({}, configurationDataSimple, arrayOfParsedConfigurationData)).toMatchObject({
    main_parameter: "a",
    metadata: {
      recommended_type: 0,
      type: 0,
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
