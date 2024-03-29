import { ConfigurationData, GRAPH_TYPES } from "../configuration/types";

export const POS_DATA: ConfigurationData = {
  id: "31557801-d410-49d2-851a-bd3da649cad6",
  name: "POS_DATA",
  parameters: ["pkt_rate", "T"],
  measurements: ["avg_pkt_rate"],
  data: `T,pkt_rate,avg_pkt_rate
  0-tx,100000,0.1
  0-tx,200000,0.2
  0-tx,300000,0.3001
  0-tx,400000,0.4
  0-tx,500000,0.500011538461538
  0-tx,600000,0.600184615384615
  0-tx,700000,0.700476923076923
  0-tx,800000,0.800303846153846
  0-tx,900000,0.820124137931034
  0-tx,1000000,0.820121212121212
  0-tx,1100000,0.820125
  0-tx,1200000,0.82012
  0-tx,1300000,0.820120454545454
  0-tx,1400000,0.820123404255318
  0-tx,1500000,0.820121568627451
  0-tx,1600000,0.82012037037037
  0-tx,1700000,0.820115517241379
  0-tx,1800000,0.820119354838709
  0-tx,1900000,0.820116923076923
  0-tx,2000000,0.820117391304348
  1-tx,100000,0.1
  1-tx,200000,0.2
  1-tx,300000,0.3001
  1-tx,400000,0.4
  1-tx,500000,0.500011538461538
  1-tx,600000,0.600184615384615
  1-tx,700000,0.700476923076923
  1-tx,800000,0.800303846153846
  1-tx,900000,0.820124137931034
  1-tx,1000000,0.820121212121212
  1-tx,1100000,0.820125
  1-tx,1200000,0.82012
  1-tx,1300000,0.820120454545454
  1-tx,1400000,0.820123404255318
  1-tx,1500000,0.820121568627451
  1-tx,1600000,0.82012037037037
  1-tx,1700000,0.820115517241379
  1-tx,1800000,0.820119354838709
  1-tx,1900000,0.820116923076923
  1-tx,2000000,0.820117391304348`,
  settings: {
    title: " ",
    type: GRAPH_TYPES.LINE,
    error_bars: false,
    split: {
      x: { enable: false, format: "", parameter: "", placement: "before" },
      y: { enable: false, format: "", parameter: "", placement: "before" },
    },
    x: {
      title: "pkt_rate [1e6]",
      parameter: "pkt_rate",
      scale: 1000000,
    },
    y: {
      title: "Average Packet Rate [Mpps]",
      parameter: "avg_pkt_rate",
      scale: 1,
    },
  },
};
