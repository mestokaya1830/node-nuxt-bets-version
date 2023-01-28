<template>
  <div class="pages">
    <header class="title-2" id="content">
      <div class="quick-report-con">
        <span class="set-title mr20">GİRİŞ/ÇIKIŞ RAPORU</span>
        <div class="input-con">
         <input v-model="dateStart" type="date" class="input-date">
          <input v-model="dateFinish" type="date" class="input-date">
          <input type="button" value="ARA" class="btn btn-date bg-f" @click="filterAsDate()">
        </div>
      </div>
      <span class ="badge bg-g mr10">{{ loginLogAll.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkU1 || checkC1">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="changeLoginLog()">
            <option disabled>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
        <span class="citems bitems-title">
          <i class="far fa-calendar-times fa-lg cp" @click="resetFilter()" />
        </span>
        <span class="citems bitems-title">SAAT</span>
        <span class="citems bitems-title">İŞLEM</span>
        <span class="citems bitems-title">IP</span>
      </li>
    </ul>
    <ul class="loginlog-con">
      <li v-for="(list, index) in loginLogAll" :key="list.id" class="list">
        <span class="citems-list no">{{ index }}</span>
        <span class="citems-list cowner cowner-title"><i class="fa fa-user fa-lg cl-g ml5 mr5"/>{{ list.user | capitalize}}</span>
        <span class="citems-list">{{ list.date | dateFormat }}</span>
        <span class="citems-list">{{ list.date | timeFormat }}</span>
        <span class="citems-list">
          <b :class="{green:list.proccess === 'Online'}">{{ list.proccess }}</b>
        </span>
        <span class="citems-list">{{ list.ip }}</span>
      </li>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <li class="page-end cp" @click="getLoginLogAll()">
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
  name: 'loginlog',
  data () {
    return {
      loginLog: {},
      loginLogAll: [],
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
    this.goTop()
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkC1 () {
      if (this.$store.state.auth.role === 'C1') {
        return true
      }
    },
    getLastId() {
      return Math.min.apply(Math, this.lastId)
    }
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("YYYY-MM-DD")
    },
    timeFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("H:mm:ss")
    }
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getloginLog () {
      this.isLoader = true
      await axios.post('/api/home/account/loginlog/', {userbox: this.userBox}).then((result) => {
        if (result.data.loginlog.length > 0) {
          this.loginLog = result.data.loginlog
          this.lastId = result.data.loginlog.map(item => item.id)
          if (this.loginLog !== []) {
            this.loginLogAll = this.loginLog
          }
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async getLoginLogAll () {
      this.isLoader = true
      await axios.post('/api/home/account/loginlogall/', {lastid: this.getLastId, userbox: this.userBox}).then((result) => {
        if (result.data.loginlog) {
          this.loginLog = result.data.loginlog
          this.lastId = result.data.loginlog.map(item => item.id)
          this.loginLog.forEach(element => {
            this.loginLogAll.push(element)
          })
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    changeLoginLog () {
      this.loginLogAll = []
      this.lastId = []
      this.getloginLog ()
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/loginlog/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.loginLogAll = result.data.datefilter
          this.notfound = null
        } else {
          this.loginLogAll = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      }).catch(err => {console.log(err)})
    },
    resetFilter () {
      this.loginLogAll = []
      this.getloginLog()
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
