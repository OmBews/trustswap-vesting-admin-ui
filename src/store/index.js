import Vue from "vue";
import Vuex from "vuex";

import account from "./modules/account";
import contract from "./modules/contract";
import metamask from "./modules/metamask";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    metamask,
    contract,
  },

  state: {
    loading: false,
  },

  mutations: {
    loading(state, loading) {
      state.loading = loading;
    },
  },
});
