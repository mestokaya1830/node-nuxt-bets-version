<template>
  <div class="pages">
    <header class="title-2">
      <div class="quick-report-con">
        <span class="set-title">Giriş/Çıkış Raporu</span>
        <div class="input-con">
         <input v-model="dateStart" type="date" class="input-date">
          <input v-model="dateFinish" type="date" class="input-date">
          <input type="button" value="ARA" class="btn btn-date" @click="filterAsDate()">
        </div>
          <input type="button" value="HEPSİ" class="btn btn-date" @click="resetFilter()">
      </div>
      <span class ="badge bg-g mr10">{{ loginLog.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkMember || checkSubmember">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="getloginLog()">
            <option disabled selected>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
        <span class="citems bitems-title">TARİH</span>
        <span class="citems bitems-title">SAAT</span>
        <span class="citems bitems-title">İŞLEM</span>
        <span class="citems bitems-title">IP</span>
      </li>
    </ul>
    <ul class="loginlog-con">
      <li v-for="(list, index) in loginLog" :key="list.id" class="list">
        <span class="citems-list no">{{ index }}</span>
        <span class="citems-list cowner cowner-title"><i class="fa fa-user fa-lg cl-g ml5 mr5"/>{{ list.user | capitalize}}</span>
        <span class="citems-list">{{ list.date | dateFormat }}</span>
        <span class="citems-list">{{ list.date | timeFormat }}</span>
        <span class="citems-list">
          <span :class="{green:list.proccess === 'Online'}">{{ list.proccess }}</span>
        </span>
        <span class="citems-list">{{ list.ip }}</span>
      </li>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <li class="page-end cp">
        <i class="fas fa-anchor fa-lg" v-if="loginLog.length > 0"></i>
        <span v-else class="page-end">Başka veri yoktur</span>
      </li>
    </ul>
     <preloader v-if="isLoader" class="loader-con loader-flex"/>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Loginlog',
  data () {
    return {
      loginLog: {},
      userList: {},
      userBox: 'Üyeler',
      dateStart: moment().subtract(4,'days').format('YYYY-MM-DD'),
      dateFinish: moment().add(1,'days').format('YYYY-MM-DD'),
      notfound: null,
      lastId:[],
      isLoader: false
    }
  },
  mounted () {
    this.getUserList()
    this.getloginLog()
  },
  computed: {
    checkMember () {
      if (this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    checkSubmember () {
      if (this.$store.state.auth.role === 'Submember') {
        return true
      }
    },
    getLastId() {
      return Math.min.apply(Math, this.lastId)
    }
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('YYYY-MM-DD')
    },
    timeFormat: function (value) {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('H:mm:ss')
    }
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getloginLog () {
      this.isLoader = true
      await axios.post('/api/home/account/loginlogs/', {userbox: this.userBox}).then((result) => {
        if (result.data.loginlog) {
          this.loginLog = result.data.loginlog
        }
        this.isLoader = false
      })
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/loginlogs/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.loginLog = result.data.datefilter
          this.notfound = null
        } else {
          this.loginLog = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    resetFilter () {
      this.loginLog = {}
      this.notfound = ''
      this.getloginLog()
    }
  }
}
</script>
