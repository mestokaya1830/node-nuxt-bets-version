<template>
  <div class="wel-page">
    <header class="wel-header">
      <h2 class="wel-title">Gasvete Hoş Geldiniz</h2>
      <nuxt-link
        to=""
        class="wel-logout cl-r"
        @click.native="logout"
        title="Çıkış"
      >
        <i v-if="!isLoader" class="fas fa-sign-out-alt fa-2x" />
        <img
          v-if="isLoader"
          src="~/static/img/loader.gif"
          class="welcome-loader mt10"
          alt=""
        />
        <span v-if="errorMsg">{{ errorMsg }}</span>
      </nuxt-link>
    </header>
    <div class="wel-con">
      <a
        href="/home/soccerfixture#soccer"
        class="wel-links wls"
        exact-active-class="navbar-active"
      >
        <i class="fas fa-futbol wel-icons cl-g" />
        <span class="wel-text">FUTBOL</span>
      </a>
      <a
        href="/home/soccerinplay#soccerlive"
        class="wel-links wlsi"
        exact-active-class="navbar-active"
      >
        <i class="fas fa-bolt wel-icons cl-y" />
        <span class="wel-text">FUTBOL CANLI</span>
      </a>
      <a
        href="/home/basketfixture#basket"
        class="wel-links wlb"
        exact-active-class="navbar-active"
      >
        <i class="fas fa-basketball-ball wel-icons cl-o" />
        <span class="wel-text">BASKET</span>
      </a>
      <a
        href="/home/basketinplay#basketlive"
        class="wel-links wlbi"
        exact-active-class="navbar-active"
      >
        <i class="fas fa-bolt wel-icons cl-y" />
        <span class="wel-text">BASKET CANLI</span>
      </a>
      <a
        href="/home/account#index"
        class="wel-links wla"
        exact-active-class="navbar-active"
      >
        <i class="fas fa-user-secret wel-icons cl-f" />
        <span class="wel-text">HESABIM</span>
      </a>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import socket from "~/plugins/socket.io.js";
export default {
  middleware: "clientauth",
  name: "Welcome",
  data() {
    return {
      isLoader: false,
      errorMsg: null,
    };
  },
  mounted() {
    if (!this.$store.state.auth) {
      this.$router.push("/");
    }
    this.getMsgCount();
    this.getSettings();
  },
  methods: {
    async getSettings() {
      await axios.get("/api/home/account/settings").then((result) => {
        if (result.data.result.length > 0) {
          localStorage.setItem("set", JSON.stringify(result.data.result));
        }
      });
    },
    async getMsgCount() {
      if (navigator.onLine === true) {
        await axios.get("/api/home/msgcount").then((result) => {
          if (this.$store.state.msgcount !== result.data.message) {
            this.$store.commit("setMsgCount", result.data.message);
          } else {
            this.$store.commit("setMsgCount", "");
          }
        });
      }
    },
    async logout() {
      if (navigator.onLine === true) {
        this.errorMsg = null;
        this.isLoader = true;
        await axios.get("/api/logout").then((result) => {
          if (result.data.ok) {
            this.$store.commit("setBetSlip", false);
            this.$store.commit("removeSlips", "");
            this.isLoader = false;
            socket.disconnect();
            localStorage.clear();
            this.$store.commit("setAuth", null);
            this.$router.push("/");
          }
        });
      } else {
        this.isLoader = false;
        this.errorMsg = "Baglanti Yok!";
      }
    },
  },
};
</script>