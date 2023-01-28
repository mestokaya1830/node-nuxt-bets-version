<template>
  <div class="pages" v-if="checkU1 || checkA2">
     <header class="title-2">
       <span>Kuponlar</span>
       <span class="badge bg-g">{{betSummary.length}}</span>
    </header>
    <div class="bet-con">
      <ul>
        <li class="title-ligth" :class="stateBox">
          <div class="blinks">
            <span class="bitems bno">NO</span>
            <span class="bitems">
              <div class="bet-searchbox-con">
                <input v-model="searchBox" type="text" class="bet-inp" placeholder="Ara...">
                <span class="searchbox-border"/>
              </div>
            </span>
            <span class="bitems bowner">
              <span>
                <span v-if="checkU1">SAHİP</span>
                <span v-else>
                   <select v-if="!checkU1" v-model="userBox" class="selectbox box-bet select-owner" @change="getBetSummary()">
                    <option value="Üyeler" selected>Üyeler</option>
                    <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
                  </select>
                </span>
              </span>
            </span>
            <span class="bitems bdate">
              <span class="bitems-calendar">
                <i class="far fa-calendar-alt fa-lg cp" @click="datePanel" />
                <i class="fas fa-arrows-alt-v fa-lg mr10 ml10 mt5 cp" @click="sortDate('date')" />
                <i class="far fa-calendar-times fa-lg cp" @click="getBetSummary()" />
              </span>
            </span>
            <span class="bitems btime cp" @click="sortTime('time')">SAAT</span>
            <span class="bitems bcount cp" @click="sortBetscount('betscount')">MBS</span>
            <span class="bitems bamo cp" @click="sortAmount('amount')">MİKTAR</span>
            <span class="bitems brate cp" @click="sortRate('rate')">ORAN</span>
            <span class="bitems bearn cp" @click="sortEarn('earn')">KAZANÇ</span>
          </div>
          <span class="bitems bstate" v-if="checkS3 || checkB4">AKTİFLER</span>
          <span class="bitems bstate" v-else>
            <select v-model="stateBox" class="selectbox box-bet" @change="getBetSummary()">
              <option value="Aktif" selected>Aktifler</option>
              <option value="Hepsi">Hepsi</option>
              <option value="Kazandi">Kazananlar</option>
              <option value="Kaybetti">Kaybedenler</option>
              <option value="iptal">İptaller</option>
            </select>
          </span>
        </li>
      </ul>
      <ul class="bet-summary-con">
        <div class="list list-bet" v-for="(list,index) in filterBy(betSummary, searchBox)" :key="index">
          <li class="blinks" @click="getBets($event, index, list)">
            <span class="bitems-list bno">
              <span class="bno-inside" :class="list.state">{{ index }}</span>
            </span>
            <span class="bitems-list" :class="{betRefClass: betref === list.betref}">{{ list.betref }}</span>
            <span v-if="checkU1" class="bitems-list bowner">{{ list.owner }}</span>
            <span v-if="checkA2" class="bitems-list bowner">{{ list.user | capitalize}}</span>
            <span v-if="checkB4 || checkS3" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
            <span class="bitems-list bdate" :class="{filterBetClass: sortName === 'date'}">{{list.date | dateFormat }}</span>
            <span class="bitems-list btime" :class="{filterBetClass: sortName === 'time'}">{{list.date | timeFormat}}</span>
            <span class="bitems-list bcount" :class="{filterBetClass: sortName === 'betscount'}">{{ list.betscount }} / {{list.betscountremain}}</span>
            <span class="bitems-list bamo" :class="{filterBetClass: sortName === 'amount'}">{{ list.amount | currency('₺', 0)}}</span>
            <span class="bitems-list brate" :class="{filterBetClass: sortName === 'rate'}">{{ list.rate }}</span>
            <span class="bitems-list bearn" :class="{filterBetClass: sortName === 'earn'}">{{ list.earn  | currency('₺', 2)}}</span>
          </li>
          <span class="bitems-list bstate">
            <div class="payment-con" v-if="list.state === 'Kazandi' && checkU1">
              <input type="button" class="bitems-button bg-f" v-if="list.payment === 'no'" value="ÖDE" @click="paymentBet(list.betref)"/>
              <input type="button" class="bitems-button bitemsButtonClass bg-g" v-if="list.payment === 'yes'" value="ÖDENDİ"/>
            </div>
            <i class="fas fa-thumbs-up cl-g" v-if="list.state ==='Kazandi'  && !checkU1"/>
            <i class="fas fa-thumbs-down cl-r" v-if="list.state ==='Kaybetti'" />
            <i class="fas fa-ban cl-d" v-if="list.state ==='iptal'" />
            <i class="fas fa-balance-scale cl-o" v-if="list.state ==='Aktif'" />
            <i class="fas fa-trash-alt bet-cancel" v-if="(cancelTime(list.date) < 15 && checkU1) || list.state === 'Aktif' && checkA2"  @click="cancelBet(list.betref, list.amount, list.user)" />
          </span>
        </div>
        <div v-if="detailsHandel" class="bet-details" :style="{top:top}">
          <header class="title-3">
            <span >Kupon Detay</span>
            <i class="fas fa-window-close dialog-close fa-lg" @click="closeDetails()"/>
          </header>
          <div class="bet-con">
            <ul>
              <li class="title-ligth" :class="stateBox">
                <span class="bitems bcupon">KUPON</span>
                <span class="bitems bcode">KOD</span>
                <span class="bitems bmatch">MAÇ</span>
                <span class="bitems bgame">OYUN</span>
                <span class="bitems boption">SEÇİM</span>
                <span class="bitems brate">ORAN</span>
                <span class="bitems bstream">TARZ</span>
                <span class="bitems bbranch">BRANŞ</span>
                <span class="bitems bskor">SKOR</span>
                <span v-if="$store.state.auth.role !== 'U1'" class="bitems bstate">DURUM</span>
                <span class="bitems">SONUÇ</span>
              </li>
            </ul>
            <ul class="bet-summary-con">
              <li class="list list-bet" v-for="list in bets" :key="list.id">
                <span class="bitems-list betDetailsClass">{{ list.betref }}</span>
                <span class="bitems-list bcode">{{ list.code }}</span>
                <span class="bitems-list bmatch">{{ list.matches }}</span>
                <span class="bitems-list bgame">{{ list.games }}</span>
                <span class="bitems-list boption">{{ list.options }}</span>
                <span class="bitems-list brate">{{ list.rate }}</span>
                <span class="bitems-list bstream">{{ list.stream }}</span>
                <span class="bitems-list bbranch">{{ list.branch }}</span>
                <span class="bitems-list bskorlist">{{list.score}}</span>
                <span v-if="$store.state.auth.role !== 'U1' && !betloader" class="bitems-list bstate">
                  <select v-model="list.state" class="selectbox box-bet" @change="getBetState(list)" v-if="list.state !== 'iptal'">
                    <option value="Aktif" :class="{activeClass: list.state ==='Aktif'}">Aktif</option>
                    <option value="Kazandi" :class="{wonClass: list.state ==='Kazandi'}">Kazandi</option>
                    <option value="Kaybetti" :class="{lostClass: list.state ==='Kaybetti'}">Kaybetti</option>
                  </select>
                </span>
                <span v-if="betloader" class="bitems-list bstate"><img src="~/assets/img/loader.gif" alt="" ></span>
                <span class="bitems-list">
                  <span class="bno-inside" :class="list.state">{{ list.state }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </ul>
      <error v-if="error" :message="error" class="flex-error"/>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <span class="page-end">Başka veri yoktur</span>
    </div>
    <div v-if="dateOpen" v-draggable class="dialog date-dialog">
      <header class="title-1">
        <span>Tarih</span>
        <i class ="fas fa-window-close fa-lg dialog-close" @click="dateOpen = false"/>
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
        <input type="button" value="ARA" class="btn btn-date" @click="filterAsDate()">
      </div>
    </div>
    <preloader v-if="loader" class="loader-con loader-flex"/>
  </div>
  <div v-else class="pages">
    <div class="center-no-bet"></div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import moment from 'moment'
import notfound from '@/components/notfound.vue'
import preloader from '@/components/preloader.vue'
import error from '@/components/error.vue'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Betsummary',
  components: {
   notfound,
   preloader,
   error
  },
  data () {
    return {
      betSummary: {},
      userList: {},
      userBox: 'Üyeler',
      searchBox: null,
      stateBox: 'Aktif',
      dateOpen: false,
      dateStart: '',
      dateFinish: '',
      notfound: '',
      loader: false,
      bets: {},
      betSum: {},
      betref: '',
      betId: 0,
      detailsHandel: false,
      removeIndex: '',
      sort: false,
      sortName: '',
      list:'',
      error: '',
      betstate: '',
      getDetails:[],
      betloader:false,
      scoreId: '',
      top: 0
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetSummary()
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkA2 () {
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    checkS3 () {
      if (this.$store.state.auth.role === 'S3') {
        return true
      }
    },
    checkB4 () {
      if (this.$store.state.auth.role === 'B4') {
        return true
      }
    }
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("MM-DD")
    },
    timeFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("H:mm:ss")
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getBetSummary () {
      this.loader = true
      await axios.post('/api/home/account/betsummary', {userbox: this.userBox, statebox: this.stateBox}).then((result) => {
        this.loader = false
        this.notfound = false
        this.betSummary = result.data.betsummary
      })
    },
    getScore(){

    },
    async cancelBet (betref, amount, user) {
      if (this.$store.state.auth.role === 'U1') {
        if (this.$store.state.limitsettings.maxkis !== 0 && this.$store.state.limitsettings.maxkisremain === this.$store.state.limitsettings.maxkis) {
          this.error = 'İptal sınırınız dolmuştur!'
          setTimeout(() => {
            this.error = ''
          }, 1000)
        }else{
          await axios.post('/api/home/account/cancelbet', {betref: betref, amount: amount, user: user}).then((result) => {
            if (result.data.code === 200) {
              setTimeout(() => {
                location.reload()
              }, 100)
            }
          })
        }
      } else {
        await axios.post('/api/home/account/cancelbet', {betref: betref, amount: amount, user: user}).then((result) => {
          if (result.data.code === 200) {
            setTimeout(() => {
              location.reload()
            }, 100)
          }
        })
      }
    },
    async filterAsDate () {
      await axios.post('/api/home/account/betsummary/datefilter', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish: this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.dateOpen = false
          this.notfound = ''
          this.betSummary = result.data.datefilter
        } else {
          this.dateOpen = false
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    async getBets (event, index, list) {
      this.loader = true
      await axios.get('/api/home/account/betsummary/' + list.betref).then((result) => {
        this.bets = result.data.bets
        this.detailsHandel = true
        this.betSum = list
        this.betref = list.betref
        this.removeIndex = index
        this.loader = false
        this.top = (event.pageY - 166)+ 'px'
      })
    },
    async getBetState (betdetail) {
      this.betloader = true
      this.getDetails = []
      this.bets.forEach(item => {
        this.getDetails.push(item.state)
      })
      await axios.post('/api/home/account/setbetstate', {betsum:this.betSum,betdetail: betdetail}).then((result) => {
        if(result.data.code === 200){
          setTimeout(() => {
            this.betloader = false
          }, 1000)
        }
      })
    },
    async closeDetails () {
      this.detailsHandel = false
      let betstate = ""
      if (this.getDetails.length > 0) {
        let l = this.getDetails.includes('Kaybetti')
        let a = this.getDetails.includes('Aktif')
        let w = this.getDetails.includes('Kazandi')
        if (l) {
          betstate = 'Kaybetti'
        }else if(w && !a){
          betstate = "Kazandi"
        }else{
          betstate = "Aktif"
        }
        if (betstate !== '') {
          await axios.post('/api/home/account/setbetsummarystate', {betsum:this.betSum, betstate: betstate}).then((result) => {
            if(result.data.code === 200){
              if (result.data.message !== 'active') {
                setTimeout(() => {
                  this.betSummary.splice(this.removeIndex,1)
                  this.getCreditInfo()
                  this.getActiveInfo()
                  this.removeIndex = ''
                  this.getDetails = ''
                  this.bets = {}
                  this.betref = ''
                }, 500)
              }
            }
          })
        }
      }
    },
    async getCreditInfo() {
      await axios.post('/api/home/account/creditinfo', { userbox: 'Üyeler' }).then((result) => {
        this.$store.commit('setCreditInfo', result.data.creditinfo)
      })
    },
    async getActiveInfo() {
      await axios.post('/api/home/account/activeinfo', { userbox: 'Üyeler' }).then((result) => {
        this.$store.commit('setActiveInfo', result.data.activeinfo)
      })
    },
    async paymentBet(betref){
      await axios.post('/api/home/account/paymentbet', {betref: betref, value: 'yes' }).then((result) => {
        if (result.data.code === 200) {
          this.getBetSummary()
        }
      })
    },
    datePanel () {
      this.dateOpen =! this.dateOpen
      this.dateStart = ''
      this.dateFinish = ''
    },
    cancelTime (value) {
      let diff = Date.now() - new Date(value).getTime()
      return Math.floor((diff / 1000) / 60)
    },
    sortAmount (name) {
      this.sort =! this.sort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.amount > b.amount ? 1:-1               
         }else{
          return a.amount > b.amount ? -1:1   
        }
      })
    },
    sortRate (name) {
      this.sort =! this.sort
       this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.rate > b.rate ? 1:-1                  
         }else{
          return a.rate > b.rate ? -1:1        
        }
      })
    },
    sortEarn (name) {
      this.sort =! this.sort
       this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.earn > b.earn ? 1:-1                  
         }else{
          return a.earn > b.earn ? -1:1        
        }
      })
    },
    sortDate (name) {
      this.sort =! this.sort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.date > b.date ? 1:-1                  
         }else{
          return a.date > b.date ? -1:1        
        }
      })
    },
    sortTime (name) {
      this.sort =! this.sort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.date > b.date ? 1:-1                  
         }else{
          return a.date > b.date ? -1:1        
        }
      })
    },
    sortBetscount (name) {
      this.sort =! this.sort
       this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.betscount > b.betscount ? 1:-1                  
         }else{
          return a.betscount > b.betscount ? -1:1        
        }
      })
    }
  }
}
</script>
