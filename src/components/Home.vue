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
      <div v-if="parsed" class="send-container">
        <div :style="{ color: '#070846' }">
          Before send to the contract, please double check if the csv is
          correct.
        </div>
        <button class="round send-but" @click="uploadCsv">
          Send to the Contract
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BigNumber from "bignumber.js";
import readXlsxFile from "read-excel-file";
import moment from "moment";
export default {
  data: () => ({
    file: null,
    parsed: false,
    data: {
      users: [],
      amounts: [],
      periods: [],
      startTimes: [],
    },
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
    convertPeriod(data) {
      const lastChar = data.substr(data.length - 1);
      const num = parseInt(data.substr(0, data.length - 1));
      if (lastChar === "M") return num * 24 * 31;
      else if (lastChar === "W") return num * 24 * 7;
      else if (lastChar === "D") return num * 24;
      else if (lastChar === "H") return num;
      return num;
    },
    isValidPeriod(data) {
      const lastChar = data.substr(data.length - 1);
      if (
        lastChar !== "M" &&
        lastChar !== "D" &&
        lastChar !== "H" &&
        lastChar !== "W"
      ) {
        return false;
      } else if (!parseInt(data.substr(0, data.length - 1))) return false;
      return true;
    },
    isValidDate(date) {
      return (
        moment(date)
          .toDate()
          .toString() !== "Invalid Date" || date === "Immediately"
      );
    },
    async onSelectFile(e) {
      this.file = event.target.files ? event.target.files[0] : null;
      if (!this.file) return;
      const data = await readXlsxFile(this.file);
      if (!data) {
        this.$snotify.error("CSV Loading failed");
        return;
      }
      if (
        data[0][0] !== "Address" ||
        data[0][1] !== "StartTime" ||
        data[0][2] !== "Period" ||
        data[0][3] !== "Amount"
      ) {
        this.$snotify.error(
          "CSV data is invalid. The first row should be Address, Period and Amount"
        );
        return;
      }
      const rows = data.slice(1);
      this.data = { users: [], amounts: [], periods: [], startTimes: [] };
      rows.forEach((row, index) => {
        try {
          if (!this.web3.utils.isAddress(row[0])) {
            throw new Error(`${row[0]} is not valid address`);
          } else if (!this.isValidDate(row[1])) {
            throw new Error(`StartTime format is invalid on ${index + 2} line`);
          } else if (!this.isValidPeriod(row[2])) {
            throw new Error(`Period format is invalid on ${index + 2} line`);
          } else if (!parseInt(row[3])) {
            throw new Error(`Amount is invalid on ${index + 2} line`);
          }
          const startTimestamp =
            row[1] === "Immediately"
              ? Math.round(new Date().getTime() / 1000)
              : Math.round(
                  new Date(row[1]).getTime() / 1000 - 43200 //sub 43200 for 12 hours timestamp different from excel and javascript
                );
          this.data.users.push(row[0]);
          this.data.amounts.push(
            this.web3.utils.toWei(Number(row[3]).toString())
          );
          this.data.periods.push(this.convertPeriod(row[2]));
          this.data.startTimes.push(startTimestamp);
        } catch (err) {
          this.$snotify.error(err.message);
        }
      });
      this.parsed = true;
    },
    async loadContract() {
      if (!this.tokenLocker) return;
    },
    async uploadCsv() {
      try {
        const {
          transactionHash,
        } = await this.tokenLocker.methods
          .sendLockTokenMany(
            this.data.users,
            this.data.amounts,
            this.data.startTimes,
            this.data.periods
          )
          .send({
            from: this.address,
          });
        const tx = await this.web3.eth.getTransactionReceipt(transactionHash);
        if (tx) this.$snotify.success(`Successfully locked the tokens`);
      } catch (error) {
        console.error(error);
        this.$snotify.error(error.message);
      }
    },
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
  .send-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
