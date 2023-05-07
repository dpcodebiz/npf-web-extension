import { ConfigurationData } from "../configuration/types";

export const WORLD_POPULATION_DATA: ConfigurationData = {
  id: "735ccdf3-c77c-4558-baa3-99495082b77e",
  name: "World population",
  parameters: ["Age", "Gender"],
  measurements: ["Population"],
  data: `Age,Gender,Population
0-4,Female,327.601
0-4,Male,350.321
5-9,Female,316.714
5-9,Male,338.892
10-14,Female,301.011
10-14,Male,322.363
15-19,Female,288.482
15-19,Male,308.333
20-24,Female,287.820
20-24,Male,306.100
25-29,Female,298.802
25-29,Male,313.635
30-34,Female,284.628
30-34,Male,294.299
35-39,Female,254.272
35-39,Male,260.623
40-44,Female,241.212
40-44,Male,246.733
45-49,Female,232.150
45-49,Male,235.016
50-54,Female,210.913
50-54,Male,210.672
55-59,Female,180.543
55-59,Male,176.861
60-64,Female,156.485
60-64,Male,149.018
65-69,Female,124.190
65-69,Male,113.766
70-74,Female,87.781
70-74,Male,76.413
75-79,Female,65.132
75-79,Male,52.196
80-84,Female,44.715
80-84,Male,31.985
85-89,Female,24.933
85-89,Male,15.256
90-94,Female,10.710
90-94,Male,5.262
95-99,Female,2.851
95-99,Male,1.087
100+,Female,0.384
100+,Male,0.102
`,
};
