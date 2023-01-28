<template>
  <div class="pages" v-if="checkRole">
    <div>
      <header class="title-2" id="content">
        <div class="quick-report-con">
          <div class="date-con">
            <select v-model="quickDate" class="selectbox boxbet" @change="quickDatefilter()">
              <option value="Tarih" disabled>Tarih</option>
              <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
              <option :value="$moment().subtract(1,'days').format('YYYY-MM-DD')">Dün</option>
            </select>
          </div>
          <div class="input-con">
          <input v-model="dateStart" type="date" class="input-date">
            <input v-model="dateFinish" type="date" class="input-date">
            <input type="button" value="ARA" class="btn btn-date bg-f mr10" @click="filterAsDate()">
          </div>
          <div class="quick-report qrcom cl-g">
            <div>
              <span>Adet:</span>
              <span class="cl-y">{{totalCount}}</span>
            </div>
            <div>
              <span>Girdi:</span>
              <span class="cl-y">{{totalAmount | currency('', 2)}}</span>
            </div>
            <div>
              <span>Brüt:</span>
              <span class="cl-y">{{totalBaseEarn | currency('', 2)}}</span>
            </div>
            <div>
              <span>Net:</span>
              <span class="cl-y">{{totalEarn | currency('', 2)}}</span>
            </div>
            <div>
              <span>Kom:</span>
              <span class="cl-y">{{calcComission | currency('', 2)}}</span>
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
              <span class="bitems bid">
                <div>
                  <input v-model="searchBox" type="number" @keyup="resetFilter()" @keyup.enter="getBetsummaryCode()" class="bet-inp" placeholder="Ara...">
                  <span class="searchbox-border"/>
                </div>
              </span>
              <span class="bitems cp">
                <span>
                  <select v-model="userBox" class="selectbox box-bet select-owner" @change="getBetSummary()">
                    <option value="Üyeler" selected>Üyeler</option>
                    <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
                  </select>
                </span>
              </span>
              <span class="bitems bdate cp" @click="sortList('date')">TARİH</span>
              <span class="bitems btime cp" @click="sortList('time')">SAAT</span>
              <span class="bitems bcount cp" @click="sortList('betscount')">MBS</span>
              <span class="bitems bamo cp" @click="sortList('amount')">MİKTAR</span>
              <span class="bitems brate cp" @click="sortList('rate')">ORAN</span>
              <span class="bitems bearn cp" @click="sortList('baseearn')">BRÜT</span>
              <span class="bitems bearn cp" @click="sortList('earn')">NET</span>
              <span class="bitems brate cp" @click="sortList('stream')">TÜR</span>
            </div>
            <span class="bitems bstate">KOMİSYON</span>
          </li>
        </ul>
        <ul class="bet-summary-con po-r">
          <div class="list-bet"  v-for="(list,index) in betSummary" :key="index" :class="list.state">
            <li class="blinks"  @click="getBets($event, index, list)">
              <span class="bitems-list bno">
                <span class="bno-inside bg-b">{{ index }}</span>
              </span>
              <span class="bitems-list bid" :class="{betIdClass: betid === list.id}">{{ list.id }}</span>
              <span class="bitems-list bowner">{{ list.user | capitalize}}</span>
              <span class="bitems-list bdate">{{list.date | dateFormat }}</span>
              <span class="bitems-list btime">{{list.date | timeFormat}}</span>
              <span class="bitems-list bcount">{{ list.betscountremain}} / {{list.betscount}}</span>
              <span class="bitems-list bamo">{{ list.amount | currency('', 0)}}</span>
              <span class="bitems-list brate">{{ list.rate  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ list.baseearn  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ (list.baseearn - (list.earn * comission) / 100)  | currency('', 2)}}</span>
              <span class="bitems-list brate">{{ list.stream }}</span>
            </li>
            <span class="bitems-list bstate">{{((list.baseearn * comission) / 100) | currency('', 2)}}</span>
          </div>
          <div v-if="isDetailsHandel" class="bet-details-model">
            <div  class="bet-details-con">
              <div class="bet-details-inside">
                <header class="title-3">
                  <div>
                  <span>Kupon Detay</span>
                    <i class="fas fa-print cp fa-lg ml20 cl-y" v-print="'#printMe'"/>
                  </div>
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
                      <span class="bitems bstate">DURUM</span>
                    </li>
                  </ul>
                  <ul class="bet-details po-r">
                    <li class="list-bet details-list Kazandi"  v-for="(list,index) in bets" :key="index">
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
                        <span class="bscore-text">{{list.score}}</span>
                      </div>
                      <span class="bitems-list bstate">
                        <i class="fas fa-thumbs-up cl-bl"/>
                      </span>
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
        <notfound v-if="notfound" :message="notfound" class="not-found"/>
        <span class="page-end">Başka veri yoktur</span>
      </div>
      <div v-if="isScore" class="dialog-score" :style="{top:top}">
        <header class="title-3">
          <h3>Detaylar</h3>
          <i class ="fas fa-window-close fa-lg dialog-close" @click="isScore = false"/>
        </header>
        <div class="dialog-score-con" v-if="scoreParts[0] && scoreParts[0].sport_id === '1'">
          <div class="score-top" v-if="scoreParts.length > 0 && scoreParts[0].ss !== null">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span class="bsh" v-if="scoreParts[0].extra">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div v-if="!scoreParts[0].scores[1] && scoreParts[0].scores[2]">
              <span class="bsh">İlk Yarı : {{scoreParts[0].scores[2].home}} - {{scoreParts[0].scores[2].away}}</span>
            </div>
            <div class="bscore-half" v-if="scoreParts[0].scores[1] && scoreParts[0].scores[2]">
              <span class="bsh">İlk Yarı : {{scoreParts[0].scores[1].home}} - {{scoreParts[0].scores[1].away}}</span>
              <span class="bsh">İkinci Yarı : {{scoreParts[0].scores[2].home}} - {{scoreParts[0].scores[2].away}}</span>
            </div>
            <span class="score-line mt10">OLAYLAR</span>
            <span class="bsh" v-for="(eventlist,index) in scoreParts[0].events" :key="index">
              <span>{{eventlist.text}}</span>
            </span>
          </div>
          <span class="cl-w" v-else>Veri Yok!</span>
        </div>
        <div class="dialog-score-con" v-if="scoreParts[0] && scoreParts[0].sport_id === '18'">
          <div class="score-top" v-if="scoreParts.length > 0 && scoreParts[0].ss !== null">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span class="bsh" v-if="scoreParts[0].extra">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div class="bscore-half" v-if="scoreParts[0].scores[3] && scoreParts[0].scores[5]">
              <span class="bsh">İlk Yarı : {{scoreParts[0].scores[3].home}} - {{scoreParts[0].scores[3].away}} <label class="cl-g">Toplam: {{Number(scoreParts[0].scores[3].home) + Number(scoreParts[0].scores[3].away)}}</label></span>
              <span class="bsh">İkinci Yarı : {{Number(scoreParts[0].scores[4].home) + Number(scoreParts[0].scores[5].home)}} - {{Number(scoreParts[0].scores[4].away) + Number(scoreParts[0].scores[5].away)}}<label class="cl-g">Toplam: {{(Number(scoreParts[0].scores[7].home) + Number(scoreParts[0].scores[7].away)) - (Number(scoreParts[0].scores[3].home) + Number(scoreParts[0].scores[3].away))}}</label></span>
              <span class="bsh">Maç Sonu : {{scoreParts[0].scores[7].home}} - {{scoreParts[0].scores[7].away}} <label class="cl-g">Toplam: {{Number(scoreParts[0].scores[7].home) + Number(scoreParts[0].scores[7].away)}}</label></span>
            </div>
            <div class="basket-scores">
              <div class="bstt">
                <span class="bsti">1.Çey</span>
                <span class="bsti">2.Çey</span>
                <span class="bsti">3.Çey</span>
                <span class="bsti">4.Çey</span>
              </div>
              <div class="bst">
                <span class="bsti">{{scoreParts[0].scores[1].home}}</span>
                <span class="bsti">{{scoreParts[0].scores[2].home}}</span>
                <span class="bsti">{{scoreParts[0].scores[4].home}}</span>
                <span class="bsti">{{scoreParts[0].scores[5].home}}</span>
              </div>
              <div class="bst">
                <span class="bsti">{{scoreParts[0].scores[1].away}}</span>
                <span class="bsti">{{scoreParts[0].scores[2].away}}</span>
                <span class="bsti">{{scoreParts[0].scores[4].away}}</span>
                <span class="bsti">{{scoreParts[0].scores[5].away}}</span>
              </div>
              <div class="bstr">
                <span class="bsti">{{Number(scoreParts[0].scores[1].home) + Number(scoreParts[0].scores[1].away)}}</span>
                <span class="bsti">{{Number(scoreParts[0].scores[2].home) + Number(scoreParts[0].scores[2].away)}}</span>
                <span class="bsti">{{Number(scoreParts[0].scores[4].home) + Number(scoreParts[0].scores[4].away)}}</span>
                <span class="bsti">{{Number(scoreParts[0].scores[5].home) + Number(scoreParts[0].scores[5].away)}}</span>
              </div>
            </div>
          </div>
          <span class="cl-w" v-else>Veri Yok!</span>
        </div>
      </div>
      <preloader v-if="isLoader" class="loader-con loader-flex"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import moment from 'moment'
import socket from '~/plugins/socket.io.js'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Detailscomission',
  data () {
    return {
      betSummary: {},
      userList: {},
      userBox: 'Üyeler',
      searchBox: null,
      stateBox: 'Aktif',
      dateStart: moment().subtract(4,'days').format('YYYY-MM-DD'),
      dateFinish: moment().add(1,'days').format('YYYY-MM-DD'),
      notfound: null,
      bets: {},
      betSum: {},
      betPrint: {},
      betid: null,
      removeIndex: null,
      sortName: null,
      error: false,
      betstate: null,
      getDetails:[],
      scores:{},
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalBaseEarn:0,
      totalEarn:0,
      quickDate:'Tarih',
      bId: null,
      bAmount: null,
      bUser: null,
      bIndex: null,
      cuponbaseearn:0,
      betScore:null,
      scoreId:0,
      isLoader: false,
      isSubloader: false,
      isDetailsHandel: false,
      isSort: false,
      isBetLoader:false,
      isWarningOpen: false,
      betState:null,
      isScore:false,
      scoreParts:0,
      matchStatus:null,
      calcComission:0,
      comission:0
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetSummary()
    this.goTop()
  },
  computed: {
    checkRole () {
      if (this.$store.state.auth.role === 'Subadmin' || this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    getComission(){
      let newEarn = (this.cuponbaseearn * this.$store.state.auth.personcomission) / 100
      return this.cuponbaseearn - newEarn
    }
  },
  filters: {
    dateFormat: (value) => {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('MM-DD')
    },
    timeFormat: (value) => {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('H:mm:ss')
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlistcomission').then((result) => {
        this.userList = result.data.userlist
        this.comission = this.userList[0].personcomission
      })
    },
    async getBetSummary () {
      this.isLoader = true
      let today = moment().format('YYYY-MM-DD')
      await axios.post('/api/home/account/detailscomission', {userbox: this.userBox, statebox: this.stateBox,date:today}).then((result) => {
        if (result.data.betsummary) {
          this.betSummary = result.data.betsummary
          this.getTotal(result.data.betsummary)
        }
        this.isLoader = false
        this.notfound = false
      })
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/detailscomissiondatefilter', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish:this.dateFinish}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.notfound = null
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
        } else {
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      })
    },
    async quickDatefilter () {
      await axios.post('/api/home/account/detailscomissionquickdatefilter', {userbox: this.userBox, statebox:this.stateBox, quickdate:this.quickDate}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.isDateOpen = false
          this.notfound = null
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
          this.quickDate = 'Tarih'
        } else {
          this.isDateOpen = false
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
          this.quickDate = 'Tarih'
        }
      })
    },
    async getBets (event, index, list) {
      this.isLoader = true
      this.betsum = {}
      await axios.get('/api/home/account/betsummary/' + list.id).then((result) => {
        if (result.data.bets) {
          this.bets = result.data.bets
          this.isDetailsHandel = true
          this.betSum = list
          this.betid = list.id
          this.removeIndex = index
          this.isLoader = false
          this.top = event.pageY - 250 +'px'
          this.cuponbaseearn = list.baseearn
          let scoreid = result.data.bets.map(item => item.scoreid)
          if (list.state === 'Aktif') {
            event.target.parentElement.parentElement.classList.add('innerAktif')
          } else {
            event.target.parentElement.parentElement.classList.add('betActive')
          }
          axios.get(`/api/home/scores/${scoreid}`).then((scores) => {
            this.isSubloader = false
            this.scores = scores.data
            this.repeatTime = scores.data.every(item => item.time_status === '0')
            result.data.bets.forEach(item => {
              scores.data.forEach(item2 => {
                if (item.scoreid == item2.bwin_id) {
                  if (item2.scores[1]) {
                    {item.score = item2.scores[1].home +'-'+ item2.scores[1].away +' / '+ item2.ss}
                  } else {
                    {item.score = item2.ss}
                  }
                  {item.ts = item2.time_status}
                  if (item2.timer) {
                    {item.tm = item2.timer.tm}
                  }
                }
              })
            })
          })
        }
      })
    },
    async closeDetails () {
      this.isSubloader = false
      this.isDetailsHandel = false
    },
    async getScoreDetails(id){
      this.isScore = true
      if (this.scores.length > 0) {
        this.scoreParts = this.scores.filter(item => item.bwin_id == id)
        if (this.scoreParts.length > 0) {
          if (this.scoreParts[0].time_status === '0') {
            this.matchStatus = 'Başlamadı'
          } else if(this.scoreParts[0].time_status === '1' || this.scoreParts[0].time_status === '2'){
            this.matchStatus = 'Devam Ediyor'
          }else{
            this.matchStatus = 'Bitti'
          }
            this.transEvent(this.scoreParts[0].events)
        }else{
          this.isScore = true
        }
      }
    },
    async betInfo() {
      const credit = await axios.post('/api/home/account/creditinfo',{userbox:'Üyeler'})
      const active = await axios.post('/api/home/account/activeinfo',{userbox:'Üyeler'})
      const total = await axios.post('/api/home/account/totalinfo',{userbox:'Üyeler'})
      const won = await axios.post('/api/home/account/woninfo',{userbox:'Üyeler'})
      Promise.all([credit, active, total, won]).then(result => {
        const final = {... result[0].data.creditinfo, ...result[1].data.activeinfo, ...result[2].data.totalinfo, ...result[3].data.woninfo}
        this.$store.commit('setBetInfo',final)
      })
    },
    transEvent(value){
      if (value) {
        value.forEach(item => {
          const text = item.text
            .replace('st','.')
            .replace('nd','.')
            .replace('rd','.')
            .replace('th','.')
            .replace('Penalty','Penaltı')
            .replace('Race to','Yarış')
            .replace('Goals','Goller')
            .replace('Goal','Gol')
            .replace('Gol Kicks','Gol Vuruşu')
            .replace('Corner','Korner')
            .replace('Korners','Kornerler')
            .replace('Throw Ins','Taç Atışı')
            .replace('Free Kicks','Serbest Vuruş')
            .replace('Yellow Ca','Sarı Kart')
            .replace('Red Ca','Kırmızı Kart')
            .replace('Score After Full Time','Maç Sonu')
            .replace('Score After Fir. Half','İlk Yarı Sonucu')
          item.text = text
        })
      }
    },
    getTotal(value){
      const won = value.filter(item => item.state === 'Aktif' || item.state === 'Kazandi')
      const amount = value.filter(item => item.state !== 'iade' && item.state !== 'iptal')
      this.totalCount = value.length
      this.totalAmount = amount.reduce((acc, item) => {
        return acc + item.amount
      },0)
      this.totalBaseEarn = won.reduce((acc, item) => {
        return acc + item.baseearn
      },0)
      setTimeout(() => {
        this.totalEarn = won.reduce((acc, item) => {
          return acc + (item.earn - ((item.baseearn * this.comission) / 100))
        },0)
        this.calcComission = won.reduce((acc, item) => {
          return acc + ((item.baseearn * this.comission) / 100)
        },0)
      }, 500)
    },
    async getBetsummaryCode(){
      this.stateBox = 'Hepsi'
      await axios.post('/api/home/account/betsummarycode', {id: this.searchBox}).then((result) => {
        if (result.data.betsummarycode.length > 0) {
          this.betSummary = result.data.betsummarycode
          this.searchBox = ''
        } else {
          this.betSummary = {}
          this.notfound = 'Kupon Yok!'
          this.searchBox = ''
        }
      })
    },
    resetFilter(){
      if (this.searchBox.length === 0) {
        this.getBetSummary()
      }
    },
    print () {
      this.$htmlToPaper('printMe')
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
    },
    goTop(){
      const el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
