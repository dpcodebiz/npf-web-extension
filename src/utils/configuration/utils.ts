export const joinParams = (params_to_join: string[], params: { [index: string]: string }) => {
  return params_to_join.reduce((acc, param) => `${acc}${param}=${params[param]},`, "");
};

export const splitParams = (joined_params: string) => {
  const separated: { [index: string]: string } = {};
  joined_params.split(",").map((paramWithValue) => {
    const [param, value] = paramWithValue.split("=");
    if (param == "") return; // Skip if no param name
    separated[param] = value;
  });
  return separated;
};
