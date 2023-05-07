import { getRecommendedGraphType } from "./data_analyzer";
import { ConfigurationData, GRAPH_TYPES } from "./types";

const configurationDataLine: ConfigurationData = {
  data: "",
  id: "",
  parameters: ["p1", "p2"],
  measurements: ["y1", "y2"],
  name: "",
};
const configurationDataLine2: ConfigurationData = {
  data: "",
  id: "",
  parameters: ["p1"],
  measurements: ["y1"],
  name: "",
};
const configurationDataBar: ConfigurationData = {
  data: "",
  id: "",
  parameters: ["p1"],
  measurements: ["y1", "y2"],
  name: "",
};

test("getRecommendedGraphType line", () => {
  expect(getRecommendedGraphType(configurationDataLine, [])).toBe(GRAPH_TYPES.LINE);
  expect(getRecommendedGraphType(configurationDataLine2, [])).toBe(GRAPH_TYPES.LINE);
});

test("getRecommendedGraphType bar", () => {
  expect(getRecommendedGraphType(configurationDataBar, [])).toBe(GRAPH_TYPES.BAR);
});
