import { getRecommendedGraphType } from "./data_analyzer";
import { ConfigurationData, GRAPH_TYPES } from "./types";

const configurationData: ConfigurationData = {
  data: "",
  id: "",
  parameters: ["p1", "p2"],
  measurements: ["y1", "y2"],
  name: "",
};

test("getRecommendedGraphType line", () => {
  expect(getRecommendedGraphType(configurationData, [], {})).toMatchObject({
    recommended_type: GRAPH_TYPES.LINE,
    recommended_error_bars: false,
  });
  expect(
    getRecommendedGraphType(
      configurationData,
      [
        { p1: "1", p2: "0", y1: "1" },
        { p1: "1", p2: "0", y1: "2" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "4" },
      ],
      {}
    )
  ).toMatchObject({ recommended_type: GRAPH_TYPES.LINE, recommended_error_bars: true });
});

test("getRecommendedGraphType boxplot", () => {
  expect(
    getRecommendedGraphType(
      configurationData,
      [
        { p1: "1", p2: "0", y1: "1" },
        { p1: "1", p2: "0", y1: "1" },
        { p1: "1", p2: "0", y1: "2" },
        { p1: "1", p2: "0", y1: "2" },
        { p1: "1", p2: "0", y1: "2" },
        { p1: "1", p2: "0", y1: "2" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "3" },
        { p1: "2", p2: "1", y1: "4" },
        { p1: "2", p2: "1", y1: "4" },
      ],
      {}
    )
  ).toMatchObject({ recommended_type: GRAPH_TYPES.BOXPLOT, recommended_error_bars: false });
});
