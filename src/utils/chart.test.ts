import { COLORS, getDatasets, getLabel, getPieLabel } from "./chart";
import { Experiment, GRAPH_TYPES } from "./configuration/types";

// Mock data
const experiment: Experiment = {
  main_parameter: "p1",
  name: "experiment",
  metadata: {
    recommended_type: GRAPH_TYPES.LINE,
    type: GRAPH_TYPES.LINE,
  },
  runs: [
    {
      parameters: {
        p1: "test",
      },
      results: {
        p2: {
          "0": [1, 2],
          "1": [2, 3],
        },
      },
    },
  ],
};
const pie_experiment: Experiment = {
  main_parameter: "p1",
  name: "experiment",
  metadata: {
    recommended_type: GRAPH_TYPES.PIE,
    type: GRAPH_TYPES.PIE,
  },
  runs: [
    {
      parameters: {
        p1: "test",
      },
      results: {
        p2: {
          "0": [1, 2],
          "1": [2, 3],
        },
      },
    },
  ],
};

test("getLabel", () => {
  expect(
    getLabel(
      experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} }
    )
  ).toMatchObject(["0", "1"]);
});
test("getLabel error", () => {
  // @ts-expect-error(undefined experiment)
  expect(getLabel(undefined)).toMatchObject([]);
});
test("getPieLabel", () => {
  expect(getPieLabel(experiment)).toMatchObject(["p1=test "]);
});
test("getPieLabel error", () => {
  // @ts-expect-error(undefined experiment)
  expect(getPieLabel(undefined)).toMatchObject([]);
});
test("getDatasets line", () => {
  expect(
    getDatasets(
      experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} }
    )
  ).toMatchObject([
    {
      backgroundColor: COLORS.LINE_CHART[0],
      borderColor: COLORS.LINE_CHART[0],
      data: [1.5, 2.5],
      label: "p1=test ",
    },
  ]);
});

test("getDatasets bar", () => {
  expect(
    getDatasets(
      experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} },
      GRAPH_TYPES.BAR
    )
  ).toMatchObject([
    {
      backgroundColor: COLORS.BARS_CHART[0],
      borderColor: COLORS.BARS_CHART[0],
      data: [1.5, 2.5],
      label: "p1=test ",
    },
  ]);
});

test("getDatasets line error bars", () => {
  expect(
    getDatasets(
      experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} },
      GRAPH_TYPES.LINE,
      true
    )
  ).toMatchObject([
    {
      backgroundColor: COLORS.LINE_CHART[0],
      borderColor: COLORS.LINE_CHART[0],
      data: [
        {
          y: 1.5,
          yMax: [2],
          yMin: [1],
        },
        {
          y: 2.5,
          yMax: [3],
          yMin: [2],
        },
      ],
      label: "p1=test ",
    },
  ]);
});
test("getDatasets pie", () => {
  expect(
    getDatasets(
      pie_experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} },
      GRAPH_TYPES.PIE
    )
  ).toMatchObject([
    {
      backgroundColor: COLORS.BARS_CHART,
      borderColor: COLORS.BARS_CHART,
      data: [
        {
          "0": [1, 2],
          "1": [2, 3],
        },
      ],
    },
  ]);
});

test("getDatasets boxplot", () => {
  expect(
    getDatasets(
      experiment,
      {},
      { id: "0", parameters: { p1: ["test"] }, measurements: ["p2"], experiments: [experiment], name: "", split: {} },
      GRAPH_TYPES.BOXPLOT
    )
  ).toMatchObject([
    {
      backgroundColor: COLORS.LINE_CHART[0],
      borderColor: COLORS.LINE_CHART[0],
      data: [
        {
          items: [1, 2],
          max: 2,
          mean: 1.5,
          median: 1.5,
          min: 1,
          range: 0,
        },
        {
          items: [2, 3],
          max: 3,
          mean: 2.5,
          median: 2.5,
          min: 2,
          range: 0,
        },
      ],
      label: "p1=test ",
    },
  ]);
});
test("getDatasets error", () => {
  // @ts-expect-error(undefined experiment)
  expect(getDatasets(undefined)).toMatchObject([]);
});
