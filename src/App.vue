<template>
  <div id="app">
    <Navbar />
    <router-view />
    <vue-snotify />
  </div>
</template>
<script>
import Navbar from "@/components/Navbar";
export default {
  components: {
    Navbar,
  },
};
</script>
<style lang="scss">
@import "./css/style.scss";
</style>
