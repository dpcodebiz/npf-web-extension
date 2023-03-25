import { Configuration } from "./data";

export enum Events {
  UPDATE_CONFIGURATION = "updateConfiguration",
}

export type UpdateConfigurationEvent = CustomEvent<{
  configuration: Configuration;
}>;

// This function allows to interact with the react app by providing the
// app configuration
export const updateConfiguration = (configuration: Configuration) => {
  window.dispatchEvent(
    new CustomEvent("updateConfiguration", {
      detail: {
        configuration,
      },
    })
  );
};
