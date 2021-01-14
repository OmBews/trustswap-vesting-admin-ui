// Import Vue
import Vue from "vue";
import VueRouter from "vue-router";
import { sync } from "vuex-router-sync";

import App from "./App";
import routes from "./routes";
import "vue-snotify/styles/material.css";
import store from "./store";
import Snotify, { SnotifyPosition } from "vue-snotify";

Vue.use(Snotify, {
  toast: {
    timeout: 5000,
    bodyMaxLength: 5000,
    pauseOnHover: false,
    position: SnotifyPosition.rightTop,
  },
});

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkActiveClass: "active",
  mode: "history",
});

sync(store, router);

export default new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
  router,
});
