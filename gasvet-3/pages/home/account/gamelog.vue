<template>
  <div class="pages">
    <header class="title-2" id="content">
      <div class="quick-report-con">
        <span class="set-title mr20">OYUN RAPORU</span>
        <div class="input-con">
         <input v-model="dateStart" type="date" class="input-date">
          <input v-model="dateFinish" type="date" class="input-date">
          <input type="button" value="ARA" class="btn btn-date bg-f" @click="filterAsDate()">
        </div>
      </div>
      <span class ="badge bg-g mr10">{{ gamelogAll.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkU1 || checkC1">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="changegamelog()">
            <option disabled>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
        <span class="citems bitems-title cadmin">ADMİN</span>
        <span class="citems bitems-title">KOD</span>
        <span class="citems bitems-title">
          <i class="far fa-calendar-times fa-lg cp" @click="resetFilter()" />
        </span>
        <span class="citems bitems-title">SAAT</span>
        <span class="citems bitems-title list-des">NEDEN</span>
        <span class="citems bitems-title">MİKTAR</span>
        <span class="citems bitems-title">İŞLEM</span>
        <span class="citems bitems-title">BAKİYE</span>
      </li>
    </ul>
    <ul class="gamelog-con">
      <li v-for="(list, index) in gamelogAll" :key="index" class="list">
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
      <li class="page-end cp" @click="getGamelogAll()">
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
  name: 'gamelog',
  data () {
    return {
      gamelog: {},
      gamelogAll: [],
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
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
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
    checkA2 () {
      if (this.$store.state.auth.role === 'A2') {
        return false
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
  mounted () {
    this.getUserList()
    this.getGameLog()
    this.goTop()
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlistgamelog').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getGameLog () {
      this.isLoader = true
      this.notfound = null
      await axios.post('/api/home/account/gamelog/', {userbox: this.userBox}).then((result) => {
        if (result.data.gamelog) {
          this.gamelog = result.data.gamelog
          this.lastId = result.data.gamelog.map(item => item.id)
          if (this.gamelog !== []) {
            this.gamelogAll = this.gamelog
          }
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async getGamelogAll () {
      this.isLoader = true
      await axios.post('/api/home/account/gamelogall/', {lastid: this.getLastId, userbox: this.userBox}).then((result) => {
        if (result.data.gamelog) {
          this.gamelog = result.data.gamelog
          this.lastId = result.data.gamelog.map(item => item.id)
          this.gamelog.forEach(element => {
            this.gamelogAll.push(element)
          })
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/gamelog/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.gamelogAll = result.data.datefilter
          this.notfound = null
        } else {
          this.gamelogAll = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      }).catch(err => {console.log(err)})
    },
    changegamelog () {
      this.gamelogAll = []
      this.lastId = []
      this.getGameLog ()
    },
    resetFilter () {
      this.gamelogAll = []
      this.getGameLog()
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
