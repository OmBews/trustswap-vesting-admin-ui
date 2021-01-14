import detectEthereumProvider from "@metamask/detect-provider";
import { Artifact, NETWORKID } from "../config";
import TokenLockerABI from "./abi/SwapTokenLocker.json";
import store from "../store";
import Web3 from "web3";
import vue from "../main";
class Web3Wrapper {
  handleChainChanged = (_chainId) => {
    if (!_chainId) return;
    store.commit("account/setChainId", _chainId);
    if (parseInt(_chainId) !== NETWORKID) {
      this.disconnect();
      vue.$snotify.error("Please change the network");
    }
  };

  handleAccountsChanged = (accounts) => {
    const { address } = store.state.account;
    if (accounts.length === 0) {
      this.disconnect();
    } else if (accounts[0] !== address) {
      store.commit("account/setAddress", accounts[0]);
    }
  };

  disconnect = () => {
    store.dispatch("account/disconnect");
    store.commit("metamask/clearProvider");
    store.commit("contract/clearContracts");
  };

  connect = async () => {
    try {
      this.disconnect();
      const provider = await detectEthereumProvider();
      if (provider) {
        if (provider !== window.ethereum)
          throw new Error("Do you have multiple wallets installed?");
      } else {
        throw new Error("Please install MetaMask!");
      }
      const chainId =
        provider.chainId || (await provider.request({ method: "eth_chainId" }));
      if (parseInt(chainId) !== NETWORKID) {
        this.disconnect();
        vue.$snotify.error("Please change the network");
        return;
      }
      provider.on("accountsChanged", this.handleAccountsChanged);
      provider.on("chainChanged", this.handleChainChanged);
      provider.on("disconnect", (res) => {
        store.dispatch("account/disconnect");
      });

      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          this.handleAccountsChanged(accounts);
          const web3 = new Web3(provider);
          const tokenLocker = new web3.eth.Contract(
            TokenLockerABI,
            Artifact.tokenLocker
          );
          tokenLocker.setProvider(provider);
          store.commit("metamask/setProvider", provider);
          store.commit("metamask/setWeb3", web3);
          store.commit("contract/setContracts", {
            tokenLocker,
          });
        })
        .catch((err) => {
          console.error(err);
          store.dispatch("account/disconnect");
        });
    } catch (err) {
      console.error(err);
      this.disconnect();
    }
  };
}

const web3Wrapper = new Web3Wrapper();
export default web3Wrapper;
