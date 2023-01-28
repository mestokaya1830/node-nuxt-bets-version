<template>
  <div class="pages">
    <header class="title-2">
      <div class="quick-report-con">
        <span class="set-title mr20">Oyun Raporu</span>
        <div class="input-con">
         <input v-model="dateStart" type="date" class="input-date">
          <input v-model="dateFinish" type="date" class="input-date">
          <input type="button" value="ARA" class="btn btn-date" @click="filterAsDate()">
        </div>
          <input type="button" value="HEPSİ" class="btn btn-date" @click="resetFilter()">
      </div>
      <span class ="badge bg-g mr10">{{ gamelog.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkMember || checkSubmember">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="getGameLog()">
            <option disabled>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
        <span class="citems bitems-title cadmin">ADMİN</span>
        <span class="citems bitems-title">KOD</span>
        <span class="citems bitems-title">TARİH</span>
        <span class="citems bitems-title">SAAT</span>
        <span class="citems bitems-title list-des">NEDEN</span>
        <span class="citems bitems-title">MİKTAR</span>
        <span class="citems bitems-title">İŞLEM</span>
        <span class="citems bitems-title">BAKİYE</span>
      </li>
    </ul>
    <ul class="gamelog-con">
      <li v-for="(list, index) in gamelog" :key="index" class="list">
        <span class="citems-list no">{{ index }}</span>
        <span class="citems-list cowner"><i class="fa fa-user fa-lg cl-g ml5 mr5"/>{{ list.user | capitalize}}</span>
        <span class="citems-list cadmin">{{ list.admin }}</span>
        <span class="citems-list">{{ list.betsumid }}</span>
        <span class="citems-list">{{ list.date | dateFormat }}</span>
        <span class="citems-list">{{ list.date | timeFormat }}</span>
        <span class="citems-list list-des">{{ list.des }}</span>
        <span class="citems-list">{{ list.amount | currency('', 2)}}</span>
        <span class="citems-list" :class="{green: list.ope === 'Eklendi', red: list.ope === 'Eksildi'}">{{ list.ope }}</span>
        <span class="citems-list">{{ list.creditremain | currency('', 0)}}</span>
      </li>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <li class="page-end cp" @click="getGamelog()">
        <i class="fas fa-anchor fa-lg" v-if="gamelog.length > 0"></i>
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
  name: 'Gamelog',
  data () {
    return {
      gamelog: {},
      userList: {},
      userBox: 'Üyeler',
      dateStart: moment().subtract(4,'days').format('YYYY-MM-DD'),
      dateFinish: moment().add(1,'days').format('YYYY-MM-DD'),
      notfound: null,
      lastId: [],
      isLoader: false
    }
  },
  computed: {
    checkSubadmin () {
      if (this.$store.state.auth.role === 'Subadmin') {
        return true
      }
    },
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
    checkAdmin () {
      if (this.$store.state.auth.role === 'Admin') {
        return false
      }
    },
    getLastId() {
      return Math.min.apply(Math, this.lastId)
    }
  },
  filters: {
    dateFormat: (value) => {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('YYYY-MM-DD')
    },
    timeFormat: (value) => {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('H:mm:ss')
    }
  },
  mounted () {
    this.getUserList()
    this.getGameLog()
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlistgamelogs').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getGameLog () {
      this.isLoader = true
      this.notfound = null
      await axios.post('/api/home/account/gamelogs/', {userbox: this.userBox}).then((result) => {
        if (result.data.gamelog) {
          this.gamelog = result.data.gamelog
        }
        this.isLoader = false
      })
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/gamelog/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.gamelog = result.data.datefilter
          this.notfound = null
        } else {
          this.gamelog = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    resetFilter () {
      this.gamelogAll = {}
      this.notfound = ''
      this.getGameLog()
    }
  }
}
</script>
