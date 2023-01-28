<template>
  <div class="pages" v-if="checkU1 || checkA2">
    <header class="title-2">
      <span>GEÇMİŞ KUPONLAR</span>
      <div class="date-con">
        <span class="bitems-calendar">
          <i class="far fa-calendar-alt fa-lg cp mr20" @click="datePanel" />
          <i class="far fa-calendar-times fa-lg cp" @click="getBetSummary()" />
        </span>
      </div>
      <div class="quick-report cl-g">
        <div>
          <span class="mr10">Toplam Adet:</span>
          <span class="cl-y">{{totalCount}}</span>
        </div>
        <div>
          <span class="mr10">Toplam Girdi:</span>
          <span class="cl-y">{{totalAmount | currency('₺', 2)}}</span>
        </div>
        <div>
          <span class="mr10">Toplam Gelir:</span>
          <span class="cl-y">{{totalEarn | currency('₺', 2)}}</span>
        </div>
      </div>
       <span class="badge bg-g">{{betSummary.length}}</span>
    </header>
    <div class="bet-con">
      <ul>
        <li class="title-ligth bg-d">
          <div class="blinks">
            <span class="bitems bno">NO</span>
            <span class="bitems">
              <div>
                <input v-model="searchBox" type="text" class="bet-inp" placeholder="Ara...">
                <span class="searchbox-border"/>
              </div>
            </span>
            <span class="bitems cp" @click="sortOwner('owner')">
              <span>
                <span v-if="checkU1">SAHİP</span>
                <span v-else>
                   <select v-if="!checkU1" v-model="userBox" class="selectbox box-bet select-owner" @change="getHistoryBet()">
                    <option value="Üyeler" selected>Üyeler</option>
                    <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
                  </select>
                </span>
              </span>
            </span>
            <span class="bitems bdate cp" @click="sortDate('date')">Tarih</span>
            <span class="bitems btime cp" @click="sortTime('time')">SAAT</span>
            <span class="bitems bcount cp" @click="sortBetscount('betscount')">MBS</span>
            <span class="bitems bamo cp" @click="sortAmount('amount')">MİKTAR</span>
            <span class="bitems brate cp" @click="sortRate('rate')">ORAN</span>
            <span class="bitems bearn cp" @click="sortEarn('earn')">KAZANÇ</span>
          </div>
          <span class="bitems bstate" v-if="checkS3 || checkB4">AKTİFLER</span>
          <span class="bitems bstate" v-else>
            <select v-model="stateBox" class="selectbox box-bet" @change="getHistoryBet()">
              <option value="Hepsi">Hepsi</option>
              <option value="Kazandi">Kazananlar</option>
              <option value="Kaybetti">Kaybedenler</option>
              <option value="iptal">İptaller</option>
              <option value="iade">İadeler</option>
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
            <span class="bitems-list" :class="{betIdClass: betid === list.id}">{{ list.id }}</span>
            <span v-if="checkU1" class="bitems-list bowner" :class="{filterBetClass: sortName === 'owner'}">{{ list.owner }}</span>
            <span v-if="checkA2" class="bitems-list bowner">{{ list.user | capitalize}}</span>
            <span v-if="checkB4 || checkS3" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
            <span class="bitems-list bdate" :class="{filterBetClass: sortName === 'date'}">{{list.date | dateFormat }}</span>
            <span class="bitems-list btime" :class="{filterBetClass: sortName === 'time'}">{{list.date | timeFormat}}</span>
            <span class="bitems-list bcount" :class="{filterBetClass: sortName === 'betscount'}">{{ list.betscountremain}} / {{list.betscount}}</span>
            <span class="bitems-list bamo" :class="{filterBetClass: sortName === 'amount'}">{{ list.amount | currency('₺', 0)}}</span>
            <span class="bitems-list brate" :class="{filterBetClass: sortName === 'rate'}">{{ list.rate }}</span>
            <span class="bitems-list bearn" :class="{filterBetClass: sortName === 'earn'}">{{ list.earn  | currency('₺', 2)}}</span>
          </li>
          <span class="bitems-list bstate">
            <i class="fas fa-thumbs-up cl-g" v-if="list.state ==='Kazandi'  && !checkU1"/>
            <i class="fas fa-thumbs-down cl-r" v-if="list.state ==='Kaybetti'" />
            <i class="fas fa-ban cl-d" v-if="list.state ==='iptal'" />
            <i class="fas fa-retweet cl-o" v-if="list.state ==='iade'" />
          </span>
        </div>
        <div v-if="detailsHandel" class="bet-details-con" :style="{top:top}">
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
                <span class="bitems bstream">TÜRÜ</span>
                <span class="bitems bskor">SKOR</span>
                <span v-if="$store.state.auth.role !== 'U1'" class="bitems bstate">DURUM</span>
                <span class="bitems">SONUÇ</span>
              </li>
            </ul>
            <ul class="bet-details">
              <li class="list list-bet details-list" v-for="(list,index) in bets" :key="index">
                <span class="bitems-list betDetailsClass">{{ list.betid }}</span>
                <span class="bitems-list bcode">{{ list.code }}</span>
                <span class="bitems-list bmatch">{{ list.matches }}</span>
                <span class="bitems-list bgame">{{ list.games }}</span>
                <span class="bitems-list boption">{{ list.options }}</span>
                <span class="bitems-list brate">{{ list.rate }}</span>
                <span class="bitems-list bstream">{{ list.stream }}</span>
                <span class="bitems-list bskorlist">{{list.score}}</span>
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
        <input type="button" value="ARA" class="btn btn-date" @click="getHistoryBet()">
      </div>
    </div>
    <preloader v-if="loader" class="loader-con loader-flex"/>
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
  name: 'Historybet',
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
      stateBox: '',
      dateOpen: false,
      dateStart: '',
      dateFinish: '',
      notfound: '',
      loader: false,
      bets: {},
      betSum: {},
      betid: '',
      detailsHandel: false,
      removeIndex: '',
      sort: false,
      sortName: '',
      list:'',
      error: '',
      betstate: '',
      getDetails:[],
      betloader:false,
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalEarn:0
    }
  },
  mounted () {
    this.getUserlist()
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
    async getHistoryBet () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/historybet', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish:this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.dateOpen = false
          this.notfound = ''
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
        } else {
          this.dateOpen = false
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    async getBets (event, index, list) {
      this.loader = true
      await axios.get('/api/home/historybet/' + list.id).then((result) => {
        this.bets = result.data.bets
        this.detailsHandel = true
        this.betSum = list
        this.betid = list.id
        this.removeIndex = index
        this.loader = false
        this.top = (event.pageY - 166)+ 'px'
      })
    },
    async closeDetails () {
      this.detailsHandel = false
    },
    getTotal(value){
      let won = value.filter(item => item.state === 'Kazandi')
      let amount = value.filter(item => item.state !== 'iade' && item.state !== 'iptal')
      this.totalCount = value.length
      this.totalAmount = amount.reduce((acc, item)=>{
        return acc + item.amount
      },0)
      let calcearn = won.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      this.totalEarn = calcearn - this.totalAmount
    },
    datePanel () {
      this.dateOpen =! this.dateOpen
      this.dateStart = ''
      this.dateFinish = ''
    },
    sortOwner (name) {
      if (this.sort) {
        this.sort =! this.sort
        this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.owner > b.owner ? 1:-1               
           }else{
            return a.owner > b.owner ? -1:1   
          }
        })
      }
    },
    sortAmount (name) {
      if (this.sort) {
        this.sort =! this.sort
        this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.amount > b.amount ? 1:-1               
           }else{
            return a.amount > b.amount ? -1:1   
          }
        })
      }
    },
    sortRate (name) {
      if (this.sort) {
        this.sort =! this.sort
         this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.rate > b.rate ? 1:-1                  
           }else{
            return a.rate > b.rate ? -1:1        
          }
        })
      }
    },
    sortEarn (name) {
      if (this.sort) {
        this.sort =! this.sort
         this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.earn > b.earn ? 1:-1                  
           }else{
            return a.earn > b.earn ? -1:1        
          }
        })
      }
    },
    sortDate (name) {
      if (this.sort) {
        this.sort =! this.sort
        this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.date > b.date ? 1:-1                  
           }else{
            return a.date > b.date ? -1:1        
          }
        })
      }
    },
    sortTime (name) {
      if (this.sort) {
        this.sort =! this.sort
        this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.date > b.date ? 1:-1                  
           }else{
            return a.date > b.date ? -1:1        
          }
        })
      }
    },
    sortBetscount (name) {
      if (this.sort) {
        this.sort =! this.sort
         this.sortName = name
        this.betSummary.sort((a, b) => {
         if(this.sort){
            return a.betscountremain > b.betscountremain ? 1:-1                  
           }else{
            return a.betscountremain > b.betscountremain ? -1:1        
          }
        })
      }
    }
  }
}
</script>
