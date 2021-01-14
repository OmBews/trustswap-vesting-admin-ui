<template>
  <div class="navbar">
    <div class="nav-brand">
      <img src="@/static/images/logo.png" width="80px" />
      <div class="nav-brand-name">TrustSwap Token Vesting Admin</div>
    </div>
    <div class="connect-container">
      <button class="round" v-if="address" @click="disconnect">
        {{ compressAddress(address, 10, 5) }}
      </button>
      <button class="round" v-else @click="connectWallet">
        Connect Wallet
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Web3Wrapper from "../../utils/Web3Wrapper";
export default {
  computed: {
    ...mapState({
      address: (state) => state.account.address,
      provider: (state) => state.metamask.provider,
    }),
  },
  async created() {
    await this.connectWallet();
  },
  methods: {
    async connectWallet() {
      await Web3Wrapper.connect();
    },
    disconnect() {
      Web3Wrapper.disconnect();
    },
    compressAddress(address, leftOffset, rightOffset) {
      return (
        address.substr(0, leftOffset) +
        "..." +
        address.substr(address.length - rightOffset, address.length)
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nav-brand {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .nav-brand-name {
      margin-left: 20px;
      color: white;
      font-size: 2rem;
    }
  }
}
</style>
