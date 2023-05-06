import { Configuration, GRAPH_TYPES } from "../../utils/configuration/types";
import { Settings } from "../../utils/settings/types";
import {
  getGraphAxisTitle,
  getParameter,
  getSettingsDefaultParametersOptions,
  getSettingsDefaultSplitParametersOptions,
  getSettingsErrorBars,
  getSettingsGraphOptions,
  getSettingsGraphTitle,
  getSettingsGraphType,
  getSettingsParametersOptions,
  getSettingsPlacement,
  getSettingsPlacementOptions,
  getSettingsSplitAxis,
  getSettingsSplitAxisFormat,
  getSettingsSplitParametersOptions,
  getSplitParameter,
  loadSettings,
  saveSettings,
} from "./utils";

// Mock data
const settings: Settings = {
  "0": {
    title: "test",
    error_bars: true,
    type: GRAPH_TYPES.BOXPLOT,
    x: {
      parameter: "param1",
      title: "x axis",
    },
    y: {
      parameter: "param2",
      title: "y axis",
    },
    split: {
      x: {
        enable: true,
        format: "{{parameter}}={{value}}",
        parameter: "split_x",
        placement: "after",
      },
      y: {
        enable: true,
        format: "{{parameter}}={{value}}",
        parameter: "split_y",
        placement: "before",
      },
    },
  },
};
const configuration: Configuration = {
  id: "0",
  split: {
    x: "split_x",
    y: "split_y",
  },
  experiments: [
    {
      split_parameters: {
        x: {
          name: "split_x",
          values: ["x1", "x2", "x3"],
        },
        y: {
          name: "split_y",
          values: ["y1", "y2", "y3"],
        },
      },
      main_parameter: "param1",
      metadata: {
        recommended_type: GRAPH_TYPES.LINE,
        type: GRAPH_TYPES.LINE,
      },
      name: "experiment",
      runs: [
        {
          parameters: {
            split_x: "c",
            split_y: "d",
          },
          results: {
            param2: {
              "0": [0, 1],
              "1": [2, 3],
              "2": [4],
            },
          },
        },
      ],
    },
  ],
  name: "configuration",
  parameters: {
    param1: ["0", "1"],
    split_x: ["x1", "x2"],
    split_y: ["y1", "y2"],
  },
  measurements: ["param2"],
};

test("getSettingsGraphOptions", () => {
  expect(getSettingsGraphOptions()).toMatchObject([
    {
      label: "Line Chart",
      value: GRAPH_TYPES.LINE,
    },
    { value: GRAPH_TYPES.BAR, label: "Bar Chart" },
    { value: GRAPH_TYPES.PIE, label: "Pie Chart" },
    { value: GRAPH_TYPES.BOXPLOT, label: "Boxplot Chart" },
  ]);
});
test("getSettingsGraphType", () => {
  expect(getSettingsGraphType(settings, configuration)).toBe(GRAPH_TYPES.BOXPLOT);
});
test("getSettingsGraphType no settings", () => {
  expect(getSettingsGraphType({}, configuration)).toBe(GRAPH_TYPES.LINE);
});
test("getGraphAxisTitle", () => {
  expect(getGraphAxisTitle("x", settings, configuration)).toMatch("x axis");
  expect(getGraphAxisTitle("y", settings, configuration)).toMatch("y axis");
});
test("getGraphAxisTitle no settings", () => {
  expect(getGraphAxisTitle("x", {}, configuration)).toMatch("param1");
  expect(getGraphAxisTitle("y", {}, configuration)).toMatch("param2");
});
test("getSettingsGraphTitle", () => {
  expect(getSettingsGraphTitle(settings, configuration)).toMatch("test");
  expect(getSettingsGraphTitle(Object.assign({ ...settings }, { title: " " }), configuration)).toMatch("test");
});
test("getSettingsGraphTitle no settings", () => {
  expect(getSettingsGraphTitle({}, configuration)).toMatch("configuration");
  expect(getSettingsGraphTitle({}, Object.assign({ ...configuration }, { name: undefined }))).toMatch("");
});
test("getSettingsSplitAxisFormat", () => {
  expect(getSettingsSplitAxisFormat("x", 0, settings, configuration)).toBe("split_x=x1");
  expect(getSettingsSplitAxisFormat("y", 0, settings, configuration)).toBe("split_y=y1");
  expect(
    getSettingsSplitAxisFormat("x", 0, { "0": Object.assign({ ...settings["0"] }, { split: {} }) }, configuration)
  ).toBe("split_x=x1");
  expect(
    getSettingsSplitAxisFormat(
      "x",
      0,
      { "0": Object.assign({ ...settings["0"] }, { split: { x: { enabled: true, format: "{{p}}={{v}}" } } }) },
      configuration
    )
  ).toBe("split_x=x1");
  expect(
    getSettingsSplitAxisFormat(
      "x",
      0,
      { "0": Object.assign({ ...settings["0"] }, { split: { x: { enabled: true, format: "{{0}}={{1}}" } } }) },
      configuration
    )
  ).toBe("split_x=x1");
});
test("getSettingsSplitAxisFormat no settings", () => {
  expect(
    getSettingsSplitAxisFormat(
      "x",
      0,
      {},
      Object.assign({ ...configuration }, { experiments: [{ split_parameters: undefined }] })
    )
  ).toBe("undefined");
  expect(
    getSettingsSplitAxisFormat(
      "y",
      0,
      {},
      Object.assign({ ...configuration }, { experiments: [{ split_parameters: undefined }] })
    )
  ).toBe("undefined");
});
test("getSettingsSplitAxis", () => {
  expect(getSettingsSplitAxis("x", settings, configuration.id)).toMatchObject({
    enable: true,
    format: "{{parameter}}={{value}}",
    parameter: "split_x",
    placement: "after",
  });
  expect(getSettingsSplitAxis("y", settings, configuration.id)).toMatchObject({
    enable: true,
    format: "{{parameter}}={{value}}",
    parameter: "split_y",
    placement: "before",
  });
});
test("getSplitParameter", () => {
  expect(getSplitParameter("x", settings, configuration)).toBe("split_x");
  expect(getSplitParameter("y", settings, configuration)).toBe("split_y");
});
test("getSplitParameter no settings", () => {
  expect(getSplitParameter("x", {}, configuration)).toBe("split_x");
  expect(getSplitParameter("y", {}, configuration)).toBe("split_y");
});
test("getSettingsSplitParametersOptions", () => {
  expect(getSettingsSplitParametersOptions("x", settings, configuration)).toMatchObject([
    { label: "None", value: "undefined" },
    { label: "param1", value: "param1" },
    { label: "split_x", value: "split_x" },
  ]);
  expect(getSettingsSplitParametersOptions("y", settings, configuration)).toMatchObject([
    { label: "None", value: "undefined" },
    { label: "param1", value: "param1" },
    { label: "split_y", value: "split_y" },
  ]);
});
test("getSettingsDefaultSplitParametersOptions", () => {
  expect(getSettingsDefaultSplitParametersOptions("x", settings, configuration)).toMatchObject({
    label: "split_x",
    value: "split_x",
  });
  expect(getSettingsDefaultSplitParametersOptions("y", settings, configuration)).toMatchObject({
    label: "split_y",
    value: "split_y",
  });
});
test("getParameter", () => {
  expect(
    getParameter("x", settings, {
      id: configuration.id,
      measurements: configuration.measurements,
      parameters: Object.keys(configuration.parameters),
    })
  ).toMatch("param1");
  expect(
    getParameter("y", settings, {
      id: configuration.id,
      measurements: configuration.measurements,
      parameters: Object.keys(configuration.parameters),
    })
  ).toMatch("param2");
});
test("getParameter no settings", () => {
  expect(
    getParameter(
      "x",
      {},
      {
        id: configuration.id,
        measurements: configuration.measurements,
        parameters: Object.keys(configuration.parameters),
      }
    )
  ).toMatch("param1");
  expect(
    getParameter(
      "y",
      {},
      {
        id: configuration.id,
        measurements: configuration.measurements,
        parameters: Object.keys(configuration.parameters),
      }
    )
  ).toMatch("param2");
});
test("getSettingsParametersOptions", () => {
  expect(getSettingsParametersOptions("x", settings, configuration)).toMatchObject([
    { label: "param1", value: "param1" },
    { label: "split_x", value: "split_x" },
    { label: "split_y", value: "split_y" },
  ]);
  expect(getSettingsParametersOptions("y", settings, configuration)).toMatchObject([
    { label: "param2", value: "param2" },
  ]);
});
test("getSettingsDefaultParametersOptions", () => {
  expect(getSettingsDefaultParametersOptions("x", settings, configuration)).toMatchObject({
    label: "param1",
    value: "param1",
  });
  expect(getSettingsDefaultParametersOptions("y", settings, configuration)).toMatchObject({
    label: "param2",
    value: "param2",
  });
});
test("getSettingsPlacementOptions", () => {
  expect(getSettingsPlacementOptions("x")).toMatchObject([
    { label: "Top", value: "before" },
    { label: "Bottom", value: "after" },
  ]);
  expect(getSettingsPlacementOptions("y")).toMatchObject([
    { label: "Left", value: "before" },
    { label: "Right", value: "after" },
  ]);
});
test("getSettingsPlacement", () => {
  expect(getSettingsPlacement("x", settings, configuration)).toMatch("after");
  expect(getSettingsPlacement("y", settings, configuration)).toMatch("before");
});
test("getSettingsPlacement no settings", () => {
  expect(getSettingsPlacement("x", {}, configuration)).toMatch("before");
  expect(getSettingsPlacement("y", {}, configuration)).toMatch("after");
});
test("getSettingsErrorBars", () => {
  expect(getSettingsErrorBars(settings, configuration)).toBe(true);
});
test("getSettingsErrorBars no settings", () => {
  expect(getSettingsErrorBars({}, configuration)).toBe(false);
});
test("saveSettings", () => {
  saveSettings(settings);
  expect(localStorage.getItem("settings")).toMatch(JSON.stringify(settings));
});
test("loadSettings", () => {
  localStorage.setItem("settings", JSON.stringify(settings));
  expect(loadSettings()).toMatchObject(settings);
});
test("loadSettings no settings", () => {
  expect(loadSettings()).toMatchObject({});
});
