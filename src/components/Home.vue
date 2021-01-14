<template>
  <div class="home-page">
    <div class="container">
      <a class="download" href="/assets/Sample.xls">Download Sample CSV</a>
      <div class="footer">
        <label for="uploadfile" class="button round upload-but"
          >Upload CSV</label
        >
        <input
          type="file"
          id="uploadfile"
          name="uploadfile"
          class="file-input"
          @click="(e) => (e.target.value = null)"
          @change="onSelectFile"
        />
      </div>
      <div v-if="parsed">
        <button class="round send-but">Send to the Contract</button>
        <div :style="{ color: '#070846' }">
          Before send to the contract, please double check if the csv is
          correct.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BigNumber from "bignumber.js";
import readXlsxFile from "read-excel-file";
export default {
  data: () => ({
    file: null,
    parsed: false,
    data: null,
  }),
  computed: {
    ...mapState({
      address: (state) => state.account.address,
      tokenLocker: (state) => state.contract.tokenLocker,
      web3: (state) => state.metamask.web3,
      provider: (state) => state.metamask.provider,
    }),
  },
  watch: {
    async address(value) {
      if (value) await this.loadContract();
    },
  },
  methods: {
    uploadCsv() {},
    async onSelectFile(e) {
      this.file = event.target.files ? event.target.files[0] : null;
      if (!this.file) return;
      this.data = await readXlsxFile(this.file);
      if (!this.data) {
        this.$snotify.error("CSV Loading failed");
        return;
      }
      if (
        this.data[0][0] !== "Address" ||
        this.data[0][1] !== "Period" ||
        this.data[0][2] !== "Amount"
      ) {
        this.$snotify.error(
          "CSV data is invalid. The first row should be Address, Period and Amount"
        );
        return;
      }
      const rows = this.data.slice(1);
      rows.forEach((row) => {
        try {
          if (!this.web3.utils.isAddress(row[0])) {
            throw new Error(`${row[0]} is not valid address`);
          }
        } catch (err) {
          this.$snotify.error(err.message);
        }
      });
    },
    async loadContract() {
      if (!this.tokenLocker) return;
    },
    uploadCsv() {},
  },
  async mounted() {
    await this.loadContract();
  },
};
</script>
<style lang="scss" scoped>
.home-page {
  padding: 2rem;
  .container {
    box-shadow: 0 5px 10px rgb(58 149 214 / 90%),
      0 15px 40px rgb(51 75 169 / 50%);
    padding: 40px;
    border-radius: 40px;
    width: 80%;
    flex-direction: column;
    gap: 2rem;
    height: 400px;
    margin: auto;
    justify-content: center;
    display: flex;
    align-items: center;
    .download {
      text-decoration: none;
      color: #111e63;
    }
  }
  .claim-caption {
    text-align: center;
    font-size: 1.3rem;
  }
  .send-but {
    font-size: 2rem;
  }
  .footer {
    justify-content: center;
    display: flex;
    .upload-but {
      font-size: 1.5rem;
    }
    .file-input {
      opacity: 0;
      position: absolute;
      z-index: -1;
    }
  }
}
</style>
