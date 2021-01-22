require("dotenv").config();
const config = {
  mainnet: {},
  rinkeby: {
    tokenLocker: "0x0a6A4F5Ad1498Bd018687910C9729b6DFA36abe4",
  },
};

export const Artifact =
  process.env.NODE_ENV === "development" ? config.rinkeby : config.mainnet;

export const NETWORKID = process.env.NODE_ENV === "development" ? 4 : 1;
