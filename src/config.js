require("dotenv").config();
const config = {
  mainnet: {},
  rinkeby: {
    tokenLocker: "0x2CEfcB282E037245E1BBF9210252c308ffC12fEd",
    token: "0x22b29196c49aA443d3E65297Eb5faE21D9CF1fe7",
    deployer: "0x5518876726C060b2D3fCda75c0B9f31F13b78D07",
  },
};

export const Artifact =
  process.env.NODE_ENV === "development" ? config.rinkeby : config.mainnet;

export const NETWORKID = process.env.NODE_ENV === "development" ? 4 : 1;
