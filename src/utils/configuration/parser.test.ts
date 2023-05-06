import { resultsToConfiguration } from "./parser";
import { ConfigurationData, GRAPH_TYPES } from "./types";

// Mock
const configurationData: ConfigurationData = {
  name: "configuration",
  id: "0",
  parameters: ["p1", "p2"],
  measurements: ["m1"],
  data: "",
};
const results = {
  meta: { aborted: false, delimiter: "", cursor: 0, linebreak: "", truncated: false },
  data: [
    {
      p1: "0",
      p2: "1",
      m1: "1",
    },
  ],
  errors: [],
};
const configurationDataSplit: ConfigurationData = {
  name: "configuration",
  id: "0",
  parameters: ["p1", "p2", "p3", "p4"],
  measurements: ["m1"],
  data: "",
};
const resultsSplit = {
  meta: { aborted: false, delimiter: "", cursor: 0, linebreak: "", truncated: false },
  data: [
    {
      p1: "0",
      p2: "1",
      p3: "2",
      p4: "3",
      m1: "1",
    },
  ],
  errors: [],
};

test("resultsToConfiguration", () => {
  expect(resultsToConfiguration(configurationData, Object.assign({ ...results }, { data: [] }), {})).toMatchObject({
    experiments: [],
    id: "0",
    measurements: ["m1"],
    parameters: {},
    name: "configuration",
    split: {},
  });
});
test("resultsToConfiguration", () => {
  expect(resultsToConfiguration(configurationData, results, {})).toMatchObject({
    id: "0",
    name: "configuration",
    parameters: {
      p1: ["0"],
      p2: ["1"],
    },
    measurements: ["m1"],
    experiments: [
      {
        main_parameter: "p1",
        metadata: {
          recommended_type: GRAPH_TYPES.LINE,
          type: GRAPH_TYPES.LINE,
        },
        name: "configuration",
        runs: [
          {
            parameters: {
              p2: "1",
            },
            results: {
              m1: {
                "0": [1],
              },
            },
          },
        ],
        split_parameters: undefined,
      },
    ],
    split: {},
  });
});
test("resultsToConfiguration bar", () => {
  expect(
    resultsToConfiguration(configurationData, results, {
      "0": {
        type: GRAPH_TYPES.BAR,
        title: configurationData.name,
        error_bars: false,
        split: {
          x: { enable: false, format: "", parameter: "", placement: "before" },
          y: { enable: false, format: "", parameter: "", placement: "before" },
        },
        x: { parameter: "p1", title: "p1" },
        y: { parameter: "m1", title: "m1" },
      },
    })
  ).toMatchObject({
    id: "0",
    name: "configuration",
    parameters: {
      p1: ["0"],
      p2: ["1"],
    },
    measurements: ["m1"],
    experiments: [
      {
        main_parameter: "p1",
        metadata: {
          recommended_type: GRAPH_TYPES.LINE,
          type: GRAPH_TYPES.BAR,
        },
        name: "configuration",
        runs: [
          {
            parameters: {
              p2: "1",
            },
            results: {
              m1: {
                "0": [1],
              },
            },
          },
        ],
        split_parameters: undefined,
      },
    ],
    split: {},
  });
});
test("resultsToConfiguration pie", () => {
  expect(
    resultsToConfiguration(configurationData, results, {
      "0": {
        type: GRAPH_TYPES.PIE,
        title: configurationData.name,
        error_bars: false,
        split: {
          x: { enable: false, format: "", parameter: "", placement: "before" },
          y: { enable: false, format: "", parameter: "", placement: "before" },
        },
        x: { parameter: "p1", title: "p1" },
        y: { parameter: "m1", title: "m1" },
      },
    })
  ).toMatchObject({
    id: "0",
    name: "configuration",
    parameters: {
      p1: ["0"],
      p2: ["1"],
    },
    measurements: ["m1"],
    experiments: [
      {
        main_parameter: "p1",
        metadata: {
          recommended_type: GRAPH_TYPES.LINE,
          type: GRAPH_TYPES.PIE,
        },
        name: "configuration",
        runs: [
          {
            parameters: {
              p2: "1",
            },
            results: {
              m1: 1,
            },
          },
        ],
        split_parameters: undefined,
      },
    ],
    split: {},
  });
});
test("resultsToConfiguration boxplot", () => {
  expect(
    resultsToConfiguration(configurationData, results, {
      "0": {
        type: GRAPH_TYPES.BOXPLOT,
        title: configurationData.name,
        error_bars: false,
        split: {
          x: { enable: false, format: "", parameter: "", placement: "before" },
          y: { enable: false, format: "", parameter: "", placement: "before" },
        },
        x: { parameter: "p1", title: "p1" },
        y: { parameter: "m1", title: "m1" },
      },
    })
  ).toMatchObject({
    id: "0",
    name: "configuration",
    parameters: {
      p1: ["0"],
      p2: ["1"],
    },
    measurements: ["m1"],
    experiments: [
      {
        main_parameter: "p1",
        metadata: {
          recommended_type: GRAPH_TYPES.LINE,
          type: GRAPH_TYPES.BOXPLOT,
        },
        name: "configuration",
        runs: [
          {
            parameters: {
              p2: "1",
            },
            results: {
              m1: {
                "0": [1],
              },
            },
          },
        ],
        split_parameters: undefined,
      },
    ],
    split: {},
  });
});

test("resultsToConfiguration split", () => {
  expect(
    resultsToConfiguration(configurationDataSplit, resultsSplit, {
      "0": {
        type: GRAPH_TYPES.LINE,
        title: configurationData.name,
        error_bars: false,
        split: {
          x: { enable: true, format: "", parameter: "p3", placement: "before" },
          y: { enable: true, format: "", parameter: "p4", placement: "before" },
        },
        x: { parameter: "p1", title: "p1" },
        y: { parameter: "m1", title: "m1" },
      },
    })
  ).toMatchObject({
    id: "0",
    name: "configuration",
    parameters: {
      p1: ["0"],
      p2: ["1"],
    },
    measurements: ["m1"],
    experiments: [
      {
        main_parameter: "p1",
        metadata: {
          recommended_type: GRAPH_TYPES.LINE,
          type: GRAPH_TYPES.LINE,
        },
        name: "configuration",
        runs: [
          {
            parameters: {
              p2: "1",
            },
            results: {
              m1: {
                "0": [1],
              },
            },
          },
        ],
        split_parameters: {
          x: {
            name: "p3",
            values: ["2"],
          },
          y: {
            name: "p4",
            values: ["3"],
          },
        },
      },
    ],
    split: {},
  });
});
