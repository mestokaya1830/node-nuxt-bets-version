<template>
  <div>
    <div class="navbar-logo">
      <img src="~/static/img/logo.png" alt="" />
    </div>
    <Navbar id="navbar" />
    <div class="top-items top-last-item">
      <div @click="openChatHandel()" title="Chat">
        <span v-if="lastMsg" class="msg-info">{{ lastMsg }}</span>
        <span v-else class="msg-info"><i class="fas fa-comments"></i></span>
        <div v-if="lastMsg" class="msg-info-slide" :class="{ newMsgClass: isNewMsg }">
          <i class="fa fa-comments fa-2x"></i>
        </div>
      </div>
      <div class="po-r" @click="setMultiLogin" title="Çoklu Oturum İzni">
        <i v-if="multiLogin" class="fas fa-users fa-2x cp cl-g" />
        <i v-else class="fas fa-users fa-2x cp cl-r" />
        <span v-if="$store.state.auth" class="sessioncount">
          {{ $store.state.auth.sessioncount }}
        </span>
      </div>
      <nuxt-link to="" class="navbar-logout cl-r" @click.native="logout" title="Çıkış">
        <i v-if="!isLoader" class="fas fa-sign-out-alt fa-2x" />
        <img v-if="isLoader" src="~/static/img/loader.gif" class="mt10" alt="" />
        <span v-if="errorMsg">{{ errorMsg }}</span>
      </nuxt-link>
      <nuxt-link to="/welcome" class="navbar-links mobile" exact-active-class="navbar-active">
        <i class="fas fa-list navbar-icons cl-w" />
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import socket from "~/plugins/socket.io.js";
import Navbar from "./navbar.vue";
export default {
  middleware: "clientauth",
  name: "Top",
  data() {
    return {
      isLoader: false,
      errorMsg: null,
      multiLogin: this.$store.state.auth.multilogin,
      lastMsgCount: 0,
      isNewMsg: false,
    };
  },
  mounted() {
    socket.on("msgcount", () => {
      const oldcount = this.$store.state.msgcount;
      this.lastMsgCount = oldcount + 1;
      this.$store.commit("setMsgCount", this.lastMsgCount);
    });
    this.getMsgCount();
  },
  computed: {
    lastMsg() {
      return this.$store.state.msgcount;
    },
  },
  methods: {
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
            this.$router.push("/");
            setTimeout(() => {
              this.$store.commit("setAuth", null);
            }, 1000);
          }
        });
      } else {
        this.isLoader = false;
        this.errorMsg = "Baglanti Yok!";
      }
    },
    async getMsgCount() {
      if (navigator.onLine === true) {
        await axios.get("/api/home/msgcount").then((result) => {
          if (result.data.message !== "null") {
            if (this.$store.state.msgcount !== result.data.message) {
              this.$store.commit("setMsgCount", result.data.message);
            } else {
              this.$store.commit("setMsgCount", "");
            }
          }
        });
      }
    },
    async setMultiLogin() {
      this.multiLogin = !this.multiLogin;
      await axios.post("/api/multilogin", { multilogin: this.multiLogin });
    },
    checkRole() {
      if (this.$store.state.auth) {
        if (
          this.$store.state.auth.role !== "Boss" &&
          this.$store.state.auth.role !== "Superadmin"
        ) {
          return true;
        }
      }
    },
    openChatHandel() {
      this.$store.commit("setOpenChat", true);
      this.isNewMsg = false;
    },
  },
  components: { Navbar },
};
</script>
