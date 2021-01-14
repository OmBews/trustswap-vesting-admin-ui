require("dotenv").config();
const config = {
  mainnet: {},
  rinkeby: {
    locker: "0x29492ea7857D62fE7704d1efe16CBC6EAF895191",
    token: "0x22b29196c49aA443d3E65297Eb5faE21D9CF1fe7",
    admin: "0x5518876726C060b2D3fCda75c0B9f31F13b78D07",
  },
};

export const Artifact =
  process.env.NODE_ENV === "development" ? config.rinkeby : config.mainnet;

export const NETWORKID = process.env.NODE_ENV === "development" ? 4 : 1;
