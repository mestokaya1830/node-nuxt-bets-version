<template>
  <div class="pages">
    <header class="title-2">
      <span>İşlem Geçmişi</span>
      <span class ="badge bg-g mr10">{{ loginLogAll.length }}</span>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title no">NO</span>
        <span class="citems bitems-title cowner-title">
          <span v-if="checkU1">ÜYE ADI</span>
          <select v-else v-model="userBox" class="selectbox box-credit" @change="changeLoginLog()">
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
          <b :class="{loginProccess:list.proccess === 'Online'}">{{ list.proccess }}</b>
        </span>
        <span class="citems-list">{{ list.ip }}</span>
      </li>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <li class="page-end cp" @click="getLoginLogAll()">
        <i class="fas fa-anchor fa-lg" v-if="loginLog.length > 0"></i>
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
  name: 'Loginlog',
  components: {
   notfound,
   preloader
  },
  data () {
    return {
      loginLog: {},
      loginLogAll: [],
      userList: {},
      userBox: 'Üyeler',
      dateOpen: false,
      dateStart: '',
      dateFinish: '',
      notfound: '',
      lastId:[],
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
      this.getloginLog()
    }
    window.scrollTo(500, 0)
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getloginLog () {
      this.loader = true
      await axios.post('/api/home/account/loginlog/', {userbox: this.userBox}).then((result) => {
        this.loginLog = result.data.loginlog
        this.loader = false
        for (const item in result.data.loginlog) {
          this.lastId.push(result.data.loginlog[item].id)
        }
        if (this.loginLog !== []) {
          this.loginLog.forEach(element => {
            this.loginLogAll.push(element)
          })
        }
      })
    },
    async getLoginLogAll () {
      this.loader = true
      await axios.post('/api/home/account/loginlogall/', {lastid: this.getLastId, userbox: this.userBox}).then((result) => {
        this.loginLog = result.data.loginlog
        this.loader = false
        for (const item in result.data.loginlog) {
          this.lastId.push(result.data.loginlog[item].id)
        }
        this.loginLog.forEach(element => {
          this.loginLogAll.push(element)
        })
      })
    },
    changeLoginLog () {
      this.loginLogAll = []
      this.lastId = []
      this.getloginLog ()
    },
    async filterAsDate () {
      await axios.post('/api/home/account/loginlog/datefilter', {userbox: this.userBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.loginLogAll = result.data.datefilter
          this.dateOpen = false
          this.notfound = ''
        } else {
          this.dateOpen = false
          this.loginLogAll = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    datePanel () {
      this.dateOpen =! this.dateOpen
      this.dateStart = ''
      this.dateFinish = ''
    },
    resetFilter () {
      this.loginLogAll = []
      this.getloginLog()
    }
  }
}
</script>
