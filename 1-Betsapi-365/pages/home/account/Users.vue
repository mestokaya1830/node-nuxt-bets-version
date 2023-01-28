<template>
  <div class="pages">
    <header class="title-2">
      <span class="account-title-text">Üyeler</span>
        <span class="badge bg-g mr10">{{ users.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="uitems bitems-title no">NO</span>
        <span class="uitems uowner-title bitems-title">ÜYE ADI</span>
        <span class="uitems bitems-title">YETKİ</span>
        <span class="uitems bitems-title">ADMİN</span>
        <span v-if="checkU1 || checkA2" class="uitems bitems-title">KREDİ</span>
        <span v-if="checkU1 || checkA2" class="uitems bitems-title">KALAN</span>
        <span v-if="checkB4 || checkS3" class="uitems bitems-title">LİMİT</span>
        <span class="uitems bitems-title">DURUM</span>
        <span v-if="checkB4 || checkS3" class="uitems bitems-title">ÖDEME</span>
      </li>
    </ul>
    <ul class="bet-summary-con-admin">
      <li v-for="(list, index) in users" :key="list._user">
        <nuxt-link class="list" :to="'/home/account/users/' + list.user">
          <span class="uitems-list no">{{ index }}</span>
          <span class="uitems-list uowner"><i class="fa fa-user fa-lg mr5 ml5 cl-g"/>{{ list.user | capitalize}}</span>
          <span class="uitems-list">{{ list.role }}</span>
          <span class="uitems-list">{{ list.admin | capitalize}}</span>
          <span v-if="checkU1 || checkA2" class="uitems-list">{{ list.credit | currency('₺', 0, { thousandsSeparator: '.' }) }}</span>
          <span v-if="checkU1 || checkA2" class="uitems-list">{{ list.creditremain | currency('₺', 0, { thousandsSeparator: '.' }) }}</span>
          <span v-if="checkB4 || checkS3" class="uitems-list">{{ list.userlimit }} / {{ list.remain }}</span>
          <span class="uitems-list">{{ list.state | capitalize}}</span>
          <span v-if="checkB4 || checkS3" class="uitems-list">
            <span class="payment-list cl-w" :class="{paymentTimeClass: cancelTime(list.payment) > 30}">{{ $moment(list.payment, 'YYYY-MM-DD').format('MM-DD') }}</span>
          </span>
        </nuxt-link>
      </li>
      <li class="page-end upe"><i class="fas fa-anchor fa-lg"></i></li>
    </ul>
    <preloader v-if="loader" class="loader-con loader-flex"/>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import preloader from '@/components/preloader'
export default {
  name: "Users",
  components: {
   preloader
  },
  data() {
    return {
      users: {},
      adminSelect: "",
      loader: false
    };
  },
  computed: {
    checkU1() {
      if (
        this.$store.state.auth.role === "U1"
      ) {
        return true;
      }
    },
    checkA2() {
      if (this.$store.state.auth.role === "A2") {
        return true;
      }
    },
    checkS3() {
      if (this.$store.state.auth.role === "S3") {
        return true;
      }
    },
    checkB4() {
      if (this.$store.state.auth.role === "B4") {
        return true;
      }
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.loader = true
      await axios.get("/api/home/account/users").then(result => {
        this.users = result.data.users
        this.loader = false
      })
    },
    cancelTime (value) {
      let diff = Date.now() - new Date(value).getTime()
      return Math.floor((diff) / (1000 * 60 * 60 * 24))
    }
  }
}
</script>
