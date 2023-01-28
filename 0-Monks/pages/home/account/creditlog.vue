<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>KREDİ GEÇMİŞİ</span>
      <span class ="badge bg-g mr10">{{ creditLogAll.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkU1">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="changeCreditlog()">
            <option disabled>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
        <span class="citems bitems-title">
          <i class="far fa-calendar-alt fa-lg citems-calendar mr20" @click="datePanel" />
          <i class="far fa-calendar-times fa-lg cp" @click="resetFilter()" />
        </span>
        <div v-if="dateOpen" v-draggable class="dialog date-dialog">
          <header class="title-1">
            <h3>Tarih</h3>
            <i class ="fas fa-times-circle fa-lg dialog-close" @click="dateOpen = false"/>
          </header>
          <div class="dialog-content">
            <div>
              <div class="date-text">Başlangıç</div>
              <input v-model="dateStart" type="date" class="input-date">
            </div>
            <div>
              <div class="date-text">Bitiş</div>
              <input v-model="dateFinish" type="date" class="input-date">
            </div>
            <input type="button" value="Ara" class="btn btn-date " @click="filterAsDate()">
          </div>
        </div> 
        <span class="citems bitems-title">SAAT</span>
        <span class="citems bitems-title">MİKTAR</span>
        <span class="citems bitems-title list-des">NEDEN</span>
        <span class="citems bitems-title">İŞLEM</span>
        <span class="citems bitems-title">KALAN</span>
      </li>
    </ul>
    <ul class="creditlog-con">
      <li v-for="(list, index) in creditLogAll" :key="index" class="list">
        <span class="citems-list no">{{ index }}</span>
        <span class="citems-list cowner cowner-title"><i class="fa fa-user fa-lg cl-g ml5 mr5"/>{{ list.user | capitalize}}</span>
        <span class="citems-list">{{ list.date | dateFormat }}</span>
        <span class="citems-list">{{ list.date | timeFormat }}</span>
        <span class="citems-list">{{ list.amount | currency('₺', 0)}}</span>
        <span class="citems-list list-des">{{ list.des }}</span>
        <span class="citems-list" :class="{loginProccess: list.ope === 'Eklendi'}">{{ list.ope }}</span>
        <span class="citems-list">{{ list.creditremain | currency('₺', 0)}}</span>
      </li>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <li class="page-end cp" @click="getCreditlogAll()">
        <i class="fas fa-anchor fa-lg" v-if="creditLog.length > 0"></i>
        <span v-else class="page-end">Başka veri yoktur</span>
      </li>
    </ul>
     <preloader v-if="loader" class="loader-con loader-flex"/>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import notfound from '@/components/notfound'
import preloader from '@/components/preloader'
export default {
  name: 'Creditlog',
  components: {
   notfound,
   preloader
  },
  data () {
    return {
      creditLog: {},
      creditLogAll: [],
      userList: {},
      userBox: 'Üyeler',
      dateOpen: false,
      dateStart: '',
      dateFinish: '',
      notfound: '',
      lastId: [],
      loader: false
    }
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
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
  mounted () {
    this.getUserList()
    if (this.checkU1) {
      this.getCreditLog()
    }
    this.goTop()
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getCreditLog () {
      this.loader = true
      this.notfound = ''
      await axios.post('/api/home/account/creditlog/', {userbox: this.userBox}).then((result) => {
        this.creditLog = result.data.creditlog
        this.loader = false
        this.lastId = result.data.creditlog.map(item => item.id)
        if (this.creditLog !== []) {
          this.creditLogAll = this.creditLog
        }
      })
    },
    async getCreditlogAll () {
      this.loader = true
      await axios.post('/api/home/account/creditlogall/', {lastid: this.getLastId, userbox: this.userBox}).then((result) => {
        this.creditLog = result.data.creditlog
        this.loader = false
        this.lastId = result.data.creditlog.map(item => item.id)
        this.creditLog.forEach(element => {
          this.creditLogAll.push(element)
        })
      })
    },
    async filterAsDate () {
      await axios.post('/api/home/account/creditlog/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.creditLogAll = result.data.datefilter
          this.dateOpen = false
          this.notfound = ''
        } else {
          this.dateOpen = false
          this.creditLogAll = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    changeCreditlog () {
      this.creditLogAll = []
      this.lastId = []
      this.getCreditLog ()
    },
    datePanel () {
      this.dateOpen =! this.dateOpen
      this.dateStart = ''
      this.dateFinish = ''
    },
    resetFilter () {
      this.creditLogAll = []
      this.getCreditLog()
    }
  }
}
</script>
