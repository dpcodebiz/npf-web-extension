import { ConfigurationData } from "../configuration/types";

export const CPU_ALGORITHM_DATA: ConfigurationData = {
  id: "36292876-f3fc-4c6f-93d9-ae0a53d9d9da",
  name: "CPU performance",
  parameters: ["N", "algorithm", "num_cpus", "cpu_brand"],
  measurements: ["efficiency"],
  data: `algorithm,N,num_cpus,efficiency,cpu_brand
Algorithm 1,10,1,0.75,Ryzen
Algorithm 1,10,4,0.85,Ryzen
Algorithm 1,10,8,0.90,Ryzen
Algorithm 2,10,1,0.65,Ryzen
Algorithm 2,10,4,0.80,Ryzen
Algorithm 2,10,8,0.87,Ryzen
Algorithm 1,20,1,0.72,Intel
Algorithm 1,20,4,0.84,Intel
Algorithm 1,20,8,0.89,Intel
Algorithm 2,20,1,0.68,Intel
Algorithm 2,20,4,0.78,Intel
Algorithm 2,20,8,0.85,Intel
Algorithm 1,30,1,0.73,Ryzen
Algorithm 1,30,4,0.83,Ryzen
Algorithm 1,30,8,0.88,Ryzen
Algorithm 2,30,1,0.67,Ryzen
Algorithm 2,30,4,0.77,Ryzen
Algorithm 2,30,8,0.84,Ryzen
Algorithm 1,40,1,0.74,Intel
Algorithm 1,40,4,0.82,Intel
Algorithm 1,40,8,0.87,Intel
Algorithm 2,40,1,0.66,Intel
Algorithm 2,40,4,0.76,Intel
Algorithm 2,40,8,0.83,Intel
Algorithm 1,50,1,0.71,Ryzen
Algorithm 1,50,4,0.81,Ryzen
Algorithm 1,50,8,0.86,Ryzen
Algorithm 2,50,1,0.69,Ryzen
Algorithm 2,50,4,0.79,Ryzen
Algorithm 2,50,8,0.86,Ryzen
Algorithm 1,60,1,0.70,Intel
Algorithm 1,60,4,0.80,Intel
Algorithm 1,60,8,0.85,Intel
Algorithm 2,60,1,0.64,Intel
Algorithm 2,60,4,0.75,Intel
Algorithm 2,60,8,0.82,Intel
`,
};
