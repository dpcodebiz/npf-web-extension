import { Configuration } from "./data";

// Main event used to trigger a rerendering of the whole app with fresh data from npf
// This is used mainly to allow the app to be fed data easily
export type UpdateConfigurationEvent = CustomEvent<{
  configuration: Configuration;
}>;
