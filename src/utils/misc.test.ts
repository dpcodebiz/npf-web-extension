import { _clsx } from "./misc";

test("Misc methods", () => {
  expect(_clsx("a", "b")).toMatch("a b");
});
