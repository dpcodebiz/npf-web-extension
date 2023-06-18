import { Settings } from "../settings/types";
import { ParsedConfigurationData } from "./parser";
import { ConfigurationData, Experiment, GRAPH_TYPES } from "./types";
import { getParametersWithValues, joinParams, splitParams } from "./utils";

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

test("joinParams", () => {
  expect(joinParams(["a", "b"], parsedConfigurationData)).toMatch("a=1,b=2");
});

test("splitParams", () => {
  expect(splitParams("a=1,b=2")).toMatchObject({ a: "1", b: "2" });
});

// test("getSplitParameters", () => {
//   expect(getSplitParameters([])).toMatchObject({
//     x: [
//       {
//         name: "b",
//         value: "0",
//       },
//       {
//         name: "b",
//         value: "1",
//       },
//       {
//         name: "b",
//         value: "2",
//       },
//     ],
//     y: [
//       {
//         name: "c",
//         value: "3",
//       },
//       {
//         name: "c",
//         value: "4",
//       },
//       {
//         name: "c",
//         value: "5",
//       },
//     ],
//   });
// });

test("getParametersWithValues", () => {
  expect(getParametersWithValues(["a", "b"], arrayOfParsedConfigurationData)).toMatchObject({
    a: ["1", "2", "3"],
    b: ["3"],
  });
});
