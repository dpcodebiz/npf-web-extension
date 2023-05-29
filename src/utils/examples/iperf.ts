import { ConfigurationData } from "../configuration/types";

export const IPERF_DATA: ConfigurationData = {
  id: "823dfb17-6b46-4c97-b081-bf4f76c0236b",
  name: "IPerf",
  parameters: ["PARALLEL", "ZEROCOPY"],
  measurements: ["THROUGHPUT"],
  data: `index,build,test_index,PARALLEL,ZEROCOPY,THROUGHPUT,run_index
0,local,0,1,without,19135978496.0,0
1,local,0,1,without,22817648640.0,1
2,local,0,1,without,28520083456.0,2
3,local,1,2,without,31340425216.0,0
4,local,1,2,without,41161121792.0,1
5,local,1,2,without,31650170880.0,2
6,local,2,3,without,33332489216.0,0
7,local,2,3,without,34288356352.0,1
8,local,2,3,without,34779042816.0,2
9,local,3,4,without,31832727552.0,0
10,local,3,4,without,36118060032.0,1
11,local,3,4,without,42437566464.0,2
12,local,4,5,without,40501676032.0,0
13,local,4,5,without,38903192576.0,1
14,local,4,5,without,31619256320.0,2
15,local,5,6,without,30298829824.0,0
16,local,5,6,without,33407863808.0,1
17,local,5,6,without,34874952704.0,2
18,local,6,7,without,36362635264.0,0
19,local,6,7,without,35777731584.0,1
20,local,6,7,without,32053485568.0,2
21,local,7,8,without,31608955904.0,0
22,local,7,8,without,39330247680.0,1
23,local,7,8,without,24769043456.0,2
24,local,8,1,with,30265147392.0,0
25,local,8,1,with,31512469504.0,1
26,local,8,1,with,30546978816.0,2
27,local,9,2,with,32128543744.0,0
28,local,9,2,with,31828677632.0,1
29,local,9,2,with,47904337920.0,2
30,local,10,3,with,48655931392.0,0
31,local,10,3,with,39123430400.0,1
32,local,10,3,with,51369563136.0,2
33,local,11,4,with,44973415424.0,0
34,local,11,4,with,29169464320.0,1
35,local,11,4,with,32533061632.0,2
36,local,12,5,with,35865209856.0,0
37,local,12,5,with,32147295232.0,1
38,local,12,5,with,36256634880.0,2
39,local,13,6,with,27406221312.0,0
40,local,13,6,with,24098322432.0,1
41,local,13,6,with,39835249664.0,2
42,local,14,7,with,31190895616.0,0
43,local,14,7,with,23495259136.0,1
44,local,14,7,with,32507271168.0,2
45,local,15,8,with,34367432704.0,0
46,local,15,8,with,36991376384.0,1
47,local,15,8,with,36155990016.0,2`,
};
