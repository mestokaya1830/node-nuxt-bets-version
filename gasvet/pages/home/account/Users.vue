<template>
  <div v-if="checkRole" class="pages">
    <header class="title-2">
      <span class="account-title-text">ÜYELER</span>
        <span class="badge bg-g mr10">{{ users.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="uitems uowner-title bitems-title">ÜYE ADI</span>
        <span class="uitems bitems-title">ADMİN</span>
        <span v-if="checkA1" class="uitems bitems-title">LİMİT</span>
        <span v-if="checkA1 || checkG1" class="uitems bitems-title">BAKİYE</span>
        <span v-if="checkB1 || checkS1" class="uitems bitems-title">ÜYE SAYISI</span>
        <span class="uitems bitems-title">DURUM</span>
        <span v-if="checkB1 || checkS1" class="uitems bitems-title">ÖDEME</span>
      </li>
    </ul>
    <ul class="bet-summary-con-admin">
      <li v-for="list in users" :key="list._user">
        <nuxt-link class="list" :to="'/home/account/users/' + list.user">
          <span class="uitems-list uowner"><i class="fa fa-user fa-lg ml10 mr10 cl-g"/>{{ list.user | capitalize}}</span>
          <span class="uitems-list">{{ list.admin | capitalize}}</span>
          <span v-if="checkA1" class="uitems-list">{{ list.credit | currency('', 0) }}</span>
          <span v-if="checkA1 || checkG1" class="uitems-list">
            {{ list.creditremain | currency('', 0) }}
            <div v-if="list.role === 'G1'">
              (<span class="cl-r subcredit">{{list.subcredit | currency('', 0)}}</span>)
            </div>
          </span>
          <span v-if="checkB1 || checkS1" class="uitems-list">{{ list.userlimit }} / {{ list.userlimit - list.usedlimit }}</span>
          <span class="uitems-list">{{ list.state | capitalize}}</span>
          <span v-if="checkB1 || checkS1" class="uitems-list">
            <span class="payment-list cl-w" :class="{paymentTimeClass: cancelTime(list.payment) > 30}">{{ $moment(list.payment, 'YYYY-MM-DD').format('MM-DD') }}</span>
          </span>
        </nuxt-link>
      </li>
      <li class="page-end upe"><i class="fas fa-anchor fa-lg"></i></li>
    </ul>
    <preloader v-if="isLoader" class="loader-con loader-flex"/>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "users",
  data() {
    return {
      users: {},
      adminSelect: null,
      isLoader: false
    };
  },
  
  mounted() {
    this.getUsers();
     window.scroll({top: 0, left: 0, behavior: 'smooth'})
  },
  computed: {
    checkG1() {
      if (
        this.$store.state.auth.role === "G1"
      ) {
        return true;
      }
    },
    checkU1() {
      if (
        this.$store.state.auth.role === "U1"
      ) {
        return true;
      }
    },
    checkA1() {
      if (this.$store.state.auth.role === "A1") {
        return true;
      }
    },
    checkS1() {
      if (this.$store.state.auth.role === "S1") {
        return true;
      }
    },
    checkB1() {
      if (this.$store.state.auth.role === "B1") {
        return true;
      }
    },
    checkRole(){
      if (this.$store.state.auth.role !== 'U1' && this.$store.state.auth.role !== 'C1') {
        return true
      }
    }
  },
  methods: {
    async getUsers() {
      this.isLoader = true
      await axios.get("/api/home/account/users").then(result1 => {
        this.isLoader = false
        let users = result1.data.data.map(item => {if (item.role === 'G1') {return item.user}}).filter(item => item !== undefined)
        axios.post("/api/home/account/subusers",{users:users}).then(result2 => {
          this.users = result1.data.data.map(item => {
            return {
              user:item.user,
              admin:item.admin,
              role:item.role,
              credit:item.credit,
              creditremain:item.creditremain,
              subcredit:result2.data.subuser
              .filter(item2 => {if(item.user === item2.admin) return item2.creditremain})
              .reduce((acc, item3)=>{return acc + item3.creditremain},0),
              state:item.state,
              userlimit:item.userlimit,
              usedlimit:item.usedlimit,
              payment:item.payment,
              autopay:item.autopay
            }
          })
        })
      }).catch(err => {console.log(err)})
    },
    cancelTime (value) {
      let diff = Date.now() - new Date(value).getTime()
      return Math.floor((diff) / (1000 * 60 * 60 * 24))
    },
    scrollVisible () {
      if (this.$refs.scroll.scrollTop > 20) {
        this.isLcrollState = true
      } else {
        this.isLcrollState = false
      }
    }
  }
}
</script>
