<template>
  <div class="pages">
     <header class="title-2">
        <div class="quick-report-con">
          <span class="bitems bstate">
            <select v-model="stateBox" class="selectbox box-bet" @change="getHistoryBet()">
              <option value="Durum" selected>Durum</option>
              <option value="Hepsi">Hepsi</option>
              <option value="Kazandi">Kazananlar</option>
              <option value="Kaybetti">Kaybedenler</option>
            </select>
          </span>
          <div class="input-con">
          <input v-model="dateStart" type="date" class="input-date">
            <input v-model="dateFinish" type="date" class="input-date">
            <input type="button" value="ARA" class="btn btn-date bg-f" @click="filterAsDate()">
          </div>
          <div class="quick-report cl-g">
            <div>
              <span class="mr10">Adet:</span>
              <span class="cl-y">{{totalCount}}</span>
            </div>
            <div>
              <span class="mr10">Girdi:</span>
              <span class="cl-y">{{totalAmount | currency('', 2)}}</span>
            </div>
            <div>
              <span class="mr10">Kazanç:</span>
              <span class="cl-y">{{totalEarn | currency('', 2)}}</span>
            </div>
          </div>
        </div>
        <span class="badge bg-g">{{betSummary.length}}</span>
      </header>
    <div class="bet-con">
      <ul>
        <li class="title-ligth">
          <div class="blinks">
            <span class="bitems bno">NO</span>
            <span class="bitems">
              <div>
                <input v-model="searchBox" type="text" @keyup="resetFilter()" @keyup.enter="getBetsummaryCode()" class="bet-inp" placeholder="Ara...">
                <span class="searchbox-border"/>
              </div>
            </span>
            <span class="bitems cp">
              <span>
                <span v-if="checkRole === 'C1' || checkRole === 'U1'">SAHİP</span>
                <span v-else>
                   <select v-if="checkRole !== 'U1'" v-model="userBox" class="selectbox box-bet select-owner" @change="getHistoryBet()">
                    <option value="Üyeler" selected>Üyeler</option>
                    <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
                  </select>
                </span>
              </span>
            </span>
            <span class="bitems bdate cp" @click="sortList('date')">TARİH</span>
            <span class="bitems btime cp" @click="sortList('time')">SAAT</span>
            <span class="bitems bcount cp" @click="sortList('betscount')">MBS</span>
            <span class="bitems bamo cp" @click="sortList('amount')">MİKTAR</span>
            <span class="bitems brate cp" @click="sortList('rate')">ORAN</span>
            <span class="bitems bearn cp" @click="sortList('earn')">KAZANÇ</span>
          </div>
          <span class="bitems bstate" v-if="checkRole === 'S1' || checkRole === 'B1'">AKTİFLER</span>
          <span class="bitems bstate" v-else>
            <select v-model="stateBox" class="selectbox box-bet" @change="getHistoryBet()">
              <option value="Durum" selected disabled>Durum</option>
              <option value="Hepsi">Hepsi</option>
              <option value="Kazandi">Kazananlar</option>
              <option value="Kaybetti">Kaybedenler</option>
              <option value="iptal">İptaller</option>
              <option value="iade">İadeler</option>
            </select>
          </span>
        </li>
      </ul>
      <ul class="bet-summary-con po-r">
        <div class="list-bet" v-for="(list,index) in betSummary" :key="index" :class="list.state">
          <li class="blinks" @click="getBets($event, index, list)">
            <span class="bitems-list bno">
              <span class="bno-inside bg-b">{{ index }}</span>
            </span>
            <span class="bitems-list" :class="{betIdClass: betid === list.betid}">{{ list.betid }}</span>
            <span v-if="checkRole === 'C1' || checkRole === 'U1'" class="bitems-list bowner" :class="{filterBetClass: sortName === 'owner'}">{{ list.owner }}</span>
            <span v-if="checkRole === 'A1' || checkRole === 'G1'" class="bitems-list bowner">{{ list.user | capitalize}}</span>
            <span v-if="checkRole === 'S1' || checkRole === 'B1'" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
            <span class="bitems-list bdate" :class="{filterBetClass: sortName === 'date'}">{{list.date | dateFormat }}</span>
            <span class="bitems-list btime" :class="{filterBetClass: sortName === 'time'}">{{list.date | timeFormat}}</span>
            <span class="bitems-list bcount" :class="{filterBetClass: sortName === 'betscount'}">{{ list.betscountremain}} / {{list.betscount}}</span>
            <span class="bitems-list bamo" :class="{filterBetClass: sortName === 'amount'}">{{ list.amount | currency('₺', 0)}}</span>
            <span class="bitems-list brate" :class="{filterBetClass: sortName === 'rate'}">{{ list.rate }}</span>
            <span class="bitems-list bearn" :class="{filterBetClass: sortName === 'earn'}">{{ list.earn  | currency('₺', 2)}}</span>
          </li>
          <span class="bitems-list bstate">
            <i class="fas fa-thumbs-up cl-bl" v-if="list.state ==='Kazandi'"/>
            <i class="fas fa-thumbs-down cl-bl" v-if="list.state ==='Kaybetti'" />
            <i class="fas fa-ban cl-bl" v-if="list.state ==='iptal'" />
            <i class="fas fa-retweet cl-bl" v-if="list.state ==='iade'" />
          </span>
        </div>
        <div v-if="isDetailsHandel" class="bet-details-model">
          <div class="bet-details-con">
            <div class="bet-details-inside">
              <header class="title-3">
                <span >Kupon Detay</span>
                <i class="fas fa-window-close dialog-close fa-lg" @click="closeDetails()"/>
              </header>
             <div class="bet-con">
                  <ul>
                    <li class="title-ligth">
                      <span class="bitems bcupon">KUPON</span>
                      <span class="bitems bcode">KOD</span>
                      <span class="bitems btime">SAAT</span>
                      <span class="bitems bmatch">MAÇ</span>
                      <span class="bitems bgame">OYUN</span>
                      <span class="bitems boption">SEÇİM</span>
                      <span class="bitems brate">ORAN</span>
                      <span class="bitems bstream">TÜRÜ</span>
                      <span class="bitems bscore">SKOR</span>
                      <span v-if="checkA1 || checkB1" class="bitems bstate">DURUM</span>
                    </li>
                  </ul>
                  <ul class="bet-details po-r">
                    <li class="list-bet details-list"  v-for="(list,index) in bets" :key="index" :class="{innerAktif:list.state === 'Aktif',Kazandi:list.state === 'Kazandi', Kaybetti:list.state === 'Kaybetti', iade:list.state === 'iade',iptalrepeat:list.betid === cancelInner, iptal:list.state === 'iptal'}">
                      <span class="bitems-list">
                        <span class="betid-inside">{{ list.betid }}</span>
                      </span>
                      <span class="bitems-list bcode">{{ list.code }}</span>
                      <span class="bitems-list btime btimebet">{{ list.eventtime }}</span>
                      <span class="bitems-list bmatch bmachbet">{{ String(list.matches).slice(0,30) }}</span>
                      <span class="bitems-list bgame">{{ list.games}}</span>
                      <span class="bitems-list boption">{{ list.options}}</span>
                      <span class="bitems-list brate">{{ list.rate }}</span>
                      <span class="bitems-list bstream">{{ list.stream }}</span>
                      <div class="bitems-list bscore po-r" @click="getScoreDetails(list.scoreid)">
                        <span class="bscore-text" :class="{red:list.ts === '3'}">{{list.score}}</span>
                      </div>
                      <!--print sub-->
                      <div id="printMe">
                        <ul class="slip-item-con only-print">
                          <div class="print-title">
                            <h3 class="slip-title">Bahislerim</h3>
                            <li class="slip-date">
                              <span class="slip-items">No: {{ list.id }}</span>
                              <span class="slip-items">Tarih: {{ $moment(new Date(),'YYYY-MM-DD H:mm').format('YYYY-MM-DD H:mm') }}</span>
                            </li>
                          </div>
                          <li class="slip print-list" v-for="(printlist,index) in bets" :key="index">
                            <div class="slip-order">
                              <span class="badge slip-code cl-b">{{printlist.code}}</span>
                              <span class="slip-match">{{ printlist.matches }}</span>
                            </div>
                            <div class="slip-order">
                              <span class="slip-items slip-items-text">Bahis:</span>
                              <span class="slip-items slip-items-break">{{ printlist.games }}</span>
                            </div>
                            <div class="slip-order jcsb">
                              <div>
                                <span class="slip-items slip-items-text">Seçim:</span>
                                <span class="slip-items slip-items-break">{{ printlist.options }}</span>
                              </div>
                              <b class="slip-items slip-rate">{{ printlist.rate }}</b>
                            </div>
                          </li>
                        </ul> 
                        <ul class="print-result only-print"> 
                          <li class="info-con">
                            <span>Toplam Bahis: </span>
                            <span> {{ betSum.betscount }}</span>
                          </li>
                          <li class="info-con info-con-rate">
                            <span>Toplam Oran:</span>
                            <span> {{ betSum.rate }}</span>
                          </li>
                          <li class="info-con info-con-rate">
                            <span>Miktar:</span>
                            <span> {{ betSum.amount  | currency('₺', 2) }}</span>
                          </li>
                          <li class="info-con">
                            <span>Toplam Kazanç:</span>
                            <span>{{ betSum.earn | currency('₺', 0) }}</span>
                          </li>
                        </ul>
                      </div>
                      <!--print sub-->
                    </li>
                    <li>
                      <div class="user-comission mt20">
                        <!-- <div>
                          <span class="mr10">Brüt Kazanç:</span>
                          <span class="mr20">{{cuponbaseearn  | currency('', 2)}}</span>
                        </div> -->
                        <div>
                          <span class="mr10">Kesinti:</span>
                          <span class="mr20">{{$store.state.auth.personcomission}} %</span>
                        </div>
                        <div>
                          <span class="mr10">Net Kazanç:</span>
                          <span>{{getComission | currency('', 2)}}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
            </div>
          </div>
        </div>
      </ul>
      <error v-if="error" :message="error" class="flex-error"/>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <span class="page-end">Başka veri yoktur</span>
    </div>
    <preloader v-if="isLoader" class="loader-con loader-flex"/>
  </div>
</template>

<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import moment from 'moment'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'historybet',
  data () {
    return {
      betSummary: {},
      userList: {},
      userBox: 'Üyeler',
      searchBox: null,
      stateBox: 'Durum',
      dateStart: moment().subtract(4,'days').format('YYYY-MM-DD'),
      dateFinish: moment().add(1,'days').format('YYYY-MM-DD'),
      notfound: null,
      bets: {},
      betSum: {},
      betid: null,
      removeIndex: null,
      sortName: null,
      list:null,
      error: null,
      betstate: null,
      getDetails:[],
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalEarn:0,
      isDetailsHandel: false,
      isLoader: false,
      isSort: false,
      isBetLoader:false
    }
  },
  mounted () {
    this.getUserlist()
  },
  computed: {
    checkRole () {
      return this.$store.state.auth.role
    }
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").format("MM-DD")
    },
    timeFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").format("H:mm:ss")
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getHistoryBet () {
      await axios.post('/api/home/account/historybet', {userbox: this.userBox, statebox: this.stateBox}).then((result) => {
        if (result.data.historybet.length > 0) {
          this.betSummary = result.data.historybet
          this.notfound = null
          this.totalCount = result.data.historybet.length
          this.getTotal(result.data.historybet)
        } else {
          this.betSummary = result.data.historybet
          this.totalCount = result.data.historybet.length
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      }).catch(err => {console.log(err)})
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/historybetdatefilter', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish:this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.notfound = null
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
        } else {
          this.betSummary = result.data.datefilter
          this.totalCount = result.data.historybet.length
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      }).catch(err => {console.log(err)})
    },
    async getBets (event, index, list) {
      this.isLoader = true
      await axios.get('/api/home/account/historybet/' + list.betid).then((result) => {
        this.bets = result.data.bets
        this.isDetailsHandel = true
        this.betSum = list
        this.betid = list.id
        this.removeIndex = index
        this.isLoader = false
        this.top = event.pageY - 250 +'px'
      }).catch(err => {console.log(err)})
    },
    closeDetails () {
      this.isDetailsHandel = false
    },
    getTotal(value){
      let won = value.filter(item => item.state === 'Kazandi')
      let amount = value.filter(item => item.state !== 'iade' && item.state !== 'iptal')
      this.totalAmount = amount.reduce((acc, item)=>{
        return acc + item.amount
      },0)
      let calcearn = won.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      if (this.stateBox === 'Hepsi') {
        this.totalEarn = this.totalAmount - calcearn
      }else if(this.stateBox === 'Kazandi'){
        this.totalEarn = calcearn
      }else{
        this.totalEarn = 0
      }
    },
    async getBetsummaryCode(){
      this.stateBox = 'Hepsi'
      await axios.post('/api/home/account/betsummaryhistorycode', {id: this.searchBox}).then((result) => {
        if (result.data.betsummarycode.length > 0) {
          this.betSummary = result.data.betsummarycode
          this.searchBox = ''
        } else {
          this.betSummary = {}
          this.notfound = 'Kupon Yok!'
          this.searchBox = ''
        }
      }).catch(err => {console.log(err)})
    },
    resetFilter(){
      if (this.searchBox.length === 0) {
        this.getHistoryBet()
      }
    },
    sortList (name) {
      this.isSort = ! this.isSort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.isSort){
          return a[name] > b[name] ? 1:-1               
         }else{
          return a[name] > b[name] ? -1:1   
        }
      })
      this.sortClass()
    },
    sortClass(){
      document.querySelectorAll('.bitems').forEach(item => {
        item.classList.remove('sortClass')
      })
      event.target.classList.add('sortClass')
    }
  }
}
</script>
