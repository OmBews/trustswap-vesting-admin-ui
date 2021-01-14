export default {
  namespaced: true,

  state: {
    tokenLocker: null,
  },

  mutations: {
    setContracts(state, payload) {
      const { tokenLocker } = payload;
      state.tokenLocker = tokenLocker;
    },
    clearContracts(state) {
      state.tokenLocker = null;
    },
  },
};
