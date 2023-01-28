<template>
  <div>
    <top id="top" />
    <div id="main-wrapper">
      <div id="banner">
        <div :class="{ topMenuSticky: stickyState }">
          <div id="top-menu-mini">
            <div class="anons" v-if="anons">
              <p class="anons-item">
                <span>{{ anons }}</span>
              </p>
            </div>
          </div>
          <div id="top-menu">
            <ul id="home-summary">
              <li v-if="$store.state.auth">
                {{ $store.state.auth.user | capitalize }}
              </li>
              <li
                v-if="
                  $store.state.auth &&
                  $store.state.auth.role !== 'Member' &&
                  $store.state.auth.role !== 'Submember'
                "
              >
                Aktif Bayi Sayısı:
                <span class="ml10">{{ activeUsers }}</span>
              </li>
              <li>
                Bakiye :
                <span>
                  {{ $store.state.betinfo.creditremain | currency("", 0) }}
                  {{ $store.state.betinfo.creditremainsum | currency("", 2) }}
                </span>
                <span
                  v-if="
                    $store.state.auth.role !== 'Submember' &&
                    $store.state.betinfo.subcredit > 0
                  "
                  class="subcredit ml5"
                >
                  ({{ $store.state.betinfo.subcredit | currency("", 0) }})
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="home-wrapper">
        <div class="match-list-title">
          <img src="~/static/img/logo.png" alt="" width="65">
        </div>
        <div id="home-router-con">
          <nuxt class="home-router" />
        </div>
        
      </div>
      <chat class="chat-router" v-if="$store.state.openchat" />
      <footer class="home-footer">
      <h3>
        <img src="~/static/img/18.png" />
        Sistemimizi 18 yaşından büyükler ve yurtdışında ikamet edenler kullanabilirler...!
      </h3>
    </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import socket from "~/plugins/socket.io.js";
import Vue2Filters from "vue2-filters";
export default {
  middleware: "clientauth",
  mixins: [Vue2Filters.mixin],
  name: "Home",
  data() {
    return {
      oddsAll: {},
      anons: "",
      subcredit: 0,
      activeUsers: 0,
      stickyState: false,
      scrollPosition: 450,
    };
  },
  mounted() {
    socket.emit("activeusers", this.$store.state.auth.user);
    if (this.checkRole()) {
      this.getSetTime();
      this.getSetLimit();
      this.getSettings();
      this.betInfo();
      this.getActiveUsers();
    }
    this.getAnons();
    window.addEventListener("scroll", this.stickyMenu);
  },
  computed: {
    lastMsg() {
      return this.$store.state.msgcount;
    },
    getEarnAdmin() {
      if (this.$store.state.betinfo.subcredit) {
        return (
          this.$store.state.betinfo.credit -
          this.$store.state.betinfo.creditremain -
          this.$store.state.betinfo.subcredit
        );
      } else {
        return this.$store.state.betinfo.credit - this.$store.state.betinfo.creditremain;
      }
    },
    getEarnSubuser() {
      if (this.$store.state.betinfo.wonearn) {
        return this.$store.state.betinfo.wonearn - this.$store.state.betinfo.totalamount;
      } else {
        return 0 - this.$store.state.betinfo.totalamount;
      }
    },
    checkSubmember() {
      if (this.$store.state.auth.role === "Submember") {
        return true;
      }
    },
  },
  methods: {
    async betInfo() {
      const credit = await axios.post("/api/home/account/creditinfo", {
        userbox: "Üyeler",
      });
      const subcredit = await axios.post("/api/home/account/subcredit", {
        userbox: "Üyeler",
      });
      const active = await axios.post("/api/home/account/activeinfo", {
        userbox: "Üyeler",
      });
      const won = await axios.post("/api/home/account/woninfo", { userbox: "Üyeler" });
      const total = await axios.post("/api/home/account/totalinfo", {
        userbox: "Üyeler",
      });
      const lostinfo = await axios.post("/api/home/account/lostinfo", {
        userbox: "Üyeler",
      });
      Promise.all([credit, subcredit, active, total, won, lostinfo]).then((result) => {
        const final = {
          ...result[0].data.creditinfo,
          ...result[1].data.subcredit,
          ...result[2].data.activeinfo,
          ...result[3].data.totalinfo,
          ...result[4].data.woninfo,
          ...result[5].data.lostinfo,
        };
        this.$store.commit("setBetInfo", final);
      });
    },
    async getSetTime() {
      await axios.get("/api/home/account/settime").then((result) => {
        this.$store.commit("setTime", result.data.data);
      });
    },
    async getSetLimit() {
      await axios.get("/api/home/account/setlimit").then((result) => {
        this.$store.commit("setLimit", result.data.data);
      });
    },
    async getActiveUsers() {
      await axios.get("/api/home/account/activeusers").then((result) => {
        if (result.data.activeusers[0]) {
          this.activeUsers = result.data.activeusers[0].count;
        }
      });
    },
    async getSettings() {
      await axios.get("/api/home/account/settings").then((result) => {
        if (result.data) {
          const rate = result.data.result.filter((item) => {
            if (
              item.type === "sor" ||
              item.type === "bar" ||
              item.type === "solr" ||
              item.type === "balr"
            ) {
              return {
                item,
              };
            }
          });
          this.$store.commit("setRate", rate);
        }
      });
    },
    async getAnons() {
      await axios.get("/api/home/account/getanons").then((result) => {
        if (result.data.anons) {
          this.anons = result.data.anons.anons;
        }
      });
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
    stickyMenu() {
      if (window.scrollY > this.scrollPosition) {
        this.stickyState = false;
      } else {
        this.stickyState = true;
      }
    },
  },
};
</script>
