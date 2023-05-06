import { Settings } from "../settings/types";
import { ParsedConfigurationData } from "./parser";
import { ConfigurationData, Experiment, GRAPH_TYPES } from "./types";
import {
  getConfigurationDataByParameters,
  getExperimentSplitParametersNames,
  getParametersWithValues,
  getSplitParameters,
  joinParams,
  splitParams,
} from "./utils";

// Mock data
const configurationDataSimple: ConfigurationData = {
  id: "02",
  parameters: ["a"],
  measurements: ["b"],
  name: "",
  data: ``,
};
const configurationData: ConfigurationData = {
  id: "01",
  parameters: ["a", "b", "d", "e"],
  measurements: ["c"],
  name: "",
  data: ``,
};
const arrayOfParsedConfigurationDataSplit = [
  {
    a: "1",
    b: "3",
    c: "1",
    d: "2",
    e: "5",
  },
  {
    a: "2",
    b: "3",
    c: "2",
    d: "2",
    e: "5",
  },
  {
    a: "3",
    b: "3",
    c: "3",
    d: "4",
    e: "5",
  },
];
const settings: Settings = {};
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
const parsedConfigurationData: ParsedConfigurationData = {
  a: "1",
  b: "2",
};
const experiment: Experiment = {
  metadata: {
    recommended_type: GRAPH_TYPES.LINE,
    type: GRAPH_TYPES.LINE,
  },
  main_parameter: "a",
  name: "experiment",
  runs: [],
  split_parameters: {
    x: {
      name: "b",
      values: ["0", "1", "2"],
    },
    y: {
      name: "c",
      values: ["3", "4", "5"],
    },
  },
};

test("joinParams", () => {
  expect(joinParams(["a", "b"], parsedConfigurationData)).toMatch("a=1,b=2");
});

test("splitParams", () => {
  expect(splitParams("a=1,b=2")).toMatchObject({ a: "1", b: "2" });
});

test("getExperimentSplitParametersNames", () => {
  expect(getExperimentSplitParametersNames(experiment)).toMatchObject(["b", "c"]);
});

test("getExperimentSplitParametersNames empty", () => {
  expect(
    getExperimentSplitParametersNames(Object.assign({ ...experiment }, { split_parameters: undefined }))
  ).toMatchObject([]);
});

test("getSplitParameters", () => {
  expect(getSplitParameters([experiment])).toMatchObject({
    x: [
      {
        name: "b",
        value: "0",
      },
      {
        name: "b",
        value: "1",
      },
      {
        name: "b",
        value: "2",
      },
    ],
    y: [
      {
        name: "c",
        value: "3",
      },
      {
        name: "c",
        value: "4",
      },
      {
        name: "c",
        value: "5",
      },
    ],
  });
});

test("getParametersWithValues", () => {
  expect(getParametersWithValues(["a", "b"], arrayOfParsedConfigurationData)).toMatchObject({
    a: ["1", "2", "3"],
    b: ["3"],
  });
});

test("getConfigurationDataByParameters split", () => {
  expect(
    getConfigurationDataByParameters(configurationData, arrayOfParsedConfigurationDataSplit, settings)
  ).toMatchObject([
    {
      data: [
        {
          a: "1",
          b: "3",
          c: "1",
          d: "2",
          e: "5",
        },
        {
          a: "2",
          b: "3",
          c: "2",
          d: "2",
          e: "5",
        },
      ],
      split_parameters: {
        x: {
          name: "d",
          values: ["2", "4"],
        },
        y: {
          name: "e",
          values: ["5"],
        },
      },
    },
    {
      data: [
        {
          a: "3",
          b: "3",
          c: "3",
          d: "4",
          e: "5",
        },
      ],
      split_parameters: {
        x: {
          name: "d",
          values: ["2", "4"],
        },
        y: {
          name: "e",
          values: ["5"],
        },
      },
    },
  ]);
});

test("getConfigurationDataByParameters simple", () => {
  expect(
    getConfigurationDataByParameters(configurationDataSimple, arrayOfParsedConfigurationData, settings)
  ).toMatchObject([
    {
      data: [
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
      ],
    },
  ]);
});

test("getConfigurationDataByParameters only x", () => {
  expect(
    getConfigurationDataByParameters(configurationData, arrayOfParsedConfigurationDataSplit, {
      "01": {
        title: "",
        type: GRAPH_TYPES.LINE,
        error_bars: false,
        x: { title: "", parameter: "" },
        y: { title: "", parameter: "" },
        split: {
          x: {
            enable: true,
            parameter: "d",
            format: "",
            placement: "after",
          },
          y: {
            enable: false,
            parameter: "d",
            format: "",
            placement: "after",
          },
        },
      },
    } as Settings)
  ).toMatchObject([
    {
      split_parameters: {
        x: {
          name: "d",
          values: ["2", "4"],
        },
      },
      data: [
        {
          a: "1",
          b: "3",
          c: "1",
          d: "2",
          e: "5",
        },
        {
          a: "2",
          b: "3",
          c: "2",
          d: "2",
          e: "5",
        },
      ],
    },
    {
      split_parameters: {
        x: {
          name: "d",
          values: ["2", "4"],
        },
      },
      data: [
        {
          a: "3",
          b: "3",
          c: "3",
          d: "4",
          e: "5",
        },
      ],
    },
  ]);
});

test("getConfigurationDataByParameters only y", () => {
  expect(
    getConfigurationDataByParameters(configurationData, arrayOfParsedConfigurationDataSplit, {
      "01": {
        title: "",
        type: GRAPH_TYPES.LINE,
        error_bars: false,
        x: { title: "", parameter: "" },
        y: { title: "", parameter: "" },
        split: {
          x: {
            enable: false,
            parameter: "d",
            format: "",
            placement: "after",
          },
          y: {
            enable: true,
            parameter: "d",
            format: "",
            placement: "after",
          },
        },
      },
    } as Settings)
  ).toMatchObject([
    {
      split_parameters: {
        y: {
          name: "d",
          values: ["2", "4"],
        },
      },
      data: [
        {
          a: "1",
          b: "3",
          c: "1",
          d: "2",
          e: "5",
        },
        {
          a: "2",
          b: "3",
          c: "2",
          d: "2",
          e: "5",
        },
      ],
    },
    {
      split_parameters: {
        y: {
          name: "d",
          values: ["2", "4"],
        },
      },
      data: [
        {
          a: "3",
          b: "3",
          c: "3",
          d: "4",
          e: "5",
        },
      ],
    },
  ]);
});
