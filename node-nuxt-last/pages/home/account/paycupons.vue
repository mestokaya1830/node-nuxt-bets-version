<template>
  <div v-if="$store.state.auth.role === 'Admin'" class="pages">
    <div>
      <header class="title-2">
        <span class="set-title">Kupon Ödeme</span>
        <div class="quick-report cl-g">
          <div>
            <span class="mr10">Adet:</span>
            <span class="cl-y">{{totalCount}}</span>
          </div>
          <div>
            <span class="mr10">Girdi:</span>
            <span class="cl-y">{{totalAmount | currency('₺', 2)}}</span>
          </div>
          <div>
            <span class="mr10">Kazanç:</span>
            <span class="cl-y">{{totalEarn | currency('₺', 2)}}</span>
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
                  <input v-model="searchBox" type="text" class="bet-inp" placeholder="Ara...">
                  <span class="searchbox-border"/>
                </div>
              </span>
              <span class="bitems cp">
                <span>
                  <span v-if="!checkAdmin">SAHİP</span>
                  <span v-else>
                    <select v-model="userBox" class="selectbox box-bet select-owner" @change="getBetSummary()">
                      <option value="Üyeler" selected>Üyeler</option>
                      <option v-for="list in userList" :value="list.user" :key="list.betid">{{ list.user }}</option>
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
              <span class="bitems brate cp" @click="sortList('stream')">TÜR</span>
            </div>
            <span class="bitems bstate">ÖDENMEMİŞ</span>
          </li>
        </ul>
        <ul class="bet-summary-con po-r">
          <div class="list-bet"  v-for="(list,index) in filterBy(betSummary, searchBox)" :key="index" :class="list.state">
            <li class="blinks"  @click="getBets($event, index, list)">
              <span class="bitems-list bno">
                <span class="bno-inside bg-b">{{ index }}</span>
              </span>
              <span class="bitems-list bid" :class="{sumIdClass: sumId === list.sumid}">{{ list.sumid }}</span>
              <span v-if="checkSubmember || checkMember" class="bitems-list bowner" :class="{filterBetClass: sortName === 'owner'}">{{ list.owner }}</span>
              <span v-if="checkAdmin" class="bitems-list bowner">{{ list.user | capitalize}}</span>
              <span v-if="checkBoss || checkSuperadmin" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
              <span class="bitems-list bdate">{{list.date | dateFormat }}</span>
              <span class="bitems-list btime">{{list.date | timeFormat}}</span>
              <span class="bitems-list bcount">{{ list.betscountremain}} / {{list.betscount}}</span>
              <span class="bitems-list bamo">{{ list.amount | currency('', 0)}}</span>
              <span class="bitems-list brate">{{ list.rate  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ list.earn  | currency('', 2)}}</span>
              <span class="bitems-list brate">{{ list.stream }}</span>
            </li>
            <span class="bitems-list bstate">
              <div v-if="checkAdmin && list.state === 'Kazandi'" class="payment-con">
                <input v-if="list.adminpay === 'no'" value="ÖDE" type="button" class="bitems-button bg-b" @click="paymentBet(list,$event)"/>
                <i v-if="list.adminpay === 'yes'" class="fas fa-thumbs-up cl-bl"/>
              </div>
            </span>
          </div>
          <div v-if="isDetailsHandel" class="bet-details-model">
            <div class="bet-details-con">
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
                      <span v-if="checkAdmin || checkSuperadmin || checkBoss" class="bitems bstate">DURUM</span>
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
                      <div class="bitems-list bscore po-r" @click="getScore(list.scoreid)">
                        <span class="bscore-text" :class="{green:list.state === 'Aktif' && list.ts === '1', red: list.state === 'Aktif' && list.ts === '3'}">{{list.score}}</span>
                        <span v-if="list.ts === '1'" class="bscore-text bscore-tm">{{list.tm}}</span>
                      </div>
                      <span v-if="list.code === isBetLoader" class="bitems-list bstate">
                        <img src="~/static/img/loader.gif" alt="" >
                      </span>
                      <span v-if="checkAdmin || checkSuperadmin || checkBoss && list.code !== isBetLoader" class="bitems-list bstate">
                        <select v-model="list.state" class="selectbox" @change="setBetState(list)" v-if="list.state !== 'iptal'">
                          <option value="Aktif">Aktif</option>
                          <option v-if="list.state !== 'iade'" value="Kazandi">Kazandi</option>
                          <option value="Kaybetti">Kaybetti</option>
                          <option v-if="list.state !== 'Kazandi' && list.state !== 'Kaybetti'" value="iade">İade</option>
                        </select>
                      </span>
                      <!--print sub-->
                      <div id="printMe">
                        <ul class="slip-item-con only-print">
                          <div class="print-title">
                            <h3 class="slip-title">Bahislerim</h3>
                            <li class="slip-date">
                              <span class="slip-items">No: {{ list.sumid }}</span>
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
                        <div>
                          <span class="mr10">Brüt Kazanç:</span>
                          <span class="mr20">{{cuponbaseearn  | currency('', 2)}}</span>
                        </div>
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
      <div v-if="isScore" class="dialog-score" :style="{top:top}">
        <header class="title-3">
          <h3>Detaylar</h3>
          <i class ="fas fa-window-close fa-lg dialog-close" @click="isScore = false"/>
        </header>
        <div v-if="scoreParts[0] && scoreParts[0].sport_id === '1'" class="dialog-score-con">
          <div v-if="scoreParts.length > 0 && scoreParts[0].ss !== null" class="score-top">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span v-if="scoreParts[0].extra" class="bsh">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div v-if="!scoreParts[0].scores[1] && scoreParts[0].scores[2]">
              <span class="bsh">İlk Yarı : {{scoreParts[0].scores[2].home}} - {{scoreParts[0].scores[2].away}}</span>
            </div>
            <div v-if="scoreParts[0].scores[1] && scoreParts[0].scores[2]" class="bscore-half">
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
        <div v-if="scoreParts[0] && scoreParts[0].sport_id === '18'" class="dialog-score-con">
          <div v-if="scoreParts.length > 0 && scoreParts[0].ss !== null" class="score-top">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span v-if="scoreParts[0].extra" class="bsh">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div v-if="scoreParts[0].scores[3] && scoreParts[0].scores[5]" class="bscore-half">
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
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Paycupons',
  data () {
    return {
      betSummary: {},
      userList: {},
      userBox: 'Üyeler',
      searchBox: null,
      notfound: null,
      bets: {},
      betSum: {},
      betPrint: {},
      sumId: null,
      removeIndex: null,
      sortName: null,
      error: null,
      betstate: null,
      getDetails:[],
      scores:{},
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalEarn:0,
      quickDate:'Tarih',
      cuponbaseearn:0,
      betScore:null,
      scoreId:0,
      isDateOpen: false,
      isLoader: false,
      isSubloader: false,
      isDetailsHandel: false,
      isSort: false,
      isBetLoader:false,
      isWarningOpen: false,
      betState:null,
      isScore:false,
      scoreParts:0,
      matchStatus:null
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetSummary()
  },
  computed: {
    checkSubmember () {
      if (this.$store.state.auth.role === 'Submember') {
        return true
      }
    },
    checkMember () {
      if (this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    checkAdmin () {
      if (this.$store.state.auth.role === 'Admin') {
        return true
      }
    },
    checkSuperadmin () {
      if (this.$store.state.auth.role === 'Superadmin') {
        return true
      }
    },
    checkBoss () {
      if (this.$store.state.auth.role === 'Boss') {
        return true
      }
    },
    getComission(){
      let newEarn = (this.cuponbaseearn * this.$store.state.auth.personcomission) / 100
      return this.cuponbaseearn - newEarn
    }
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('MM-DD')
    },
    timeFormat: function (value) {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('H:mm:ss')
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getBetSummary () {
      this.isLoader = true
      await axios.post('/api/home/account/paycupons', {userbox: this.userBox, statebox: this.stateBox}).then((result) => {
        this.isLoader = false
        this.notfound = false
        this.betSummary = result.data.betsummary
        this.getTotal(this.betSummary)
      })
    },
    async getBets (event, index, list) {
      this.isLoader = true
      this.betsum = {}
      await axios.get('/api/home/account/betsummary/' + list.sumid).then((result) => {
        this.bets = result.data.bets
        this.isDetailsHandel = true
        this.betSum = list
        this.sumId = list.sumid
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
          result.data.bets.forEach(item => {
            scores.data.forEach(item2 => {
              if (item.scoreid == item2.bwin_id) {
                {item.score = item2.ss}
                {item.ts = item2.time_status}
                if (item2.timer) {
                  {item.tm = item2.timer.tm}
                }
              }
            })
          })
        })
      })
    },
    async setBetState (betdetail) {
      this.isBetLoader = betdetail.code
      this.getDetails = this.bets.map(item => item.state)
      await axios.put('/api/home/account/setbetstate', {betsum:this.betSum,betdetail: betdetail}).then((result) => {
        if(result.data.code === 200){
          setTimeout(() => {
            this.isBetLoader = false
          }, 500)
        }
      })
    },
    async closeDetails () {
      this.isSubloader = false
      this.scoreId = 0
      this.isDetailsHandel = false
      this.sumId =''
      let betstate = ''
      if (this.getDetails.length > 0) {
        const l = this.getDetails.includes('Kaybetti')
        const a = this.getDetails.includes('Aktif')
        const w = this.getDetails.includes('Kazandi')
        const i = this.getDetails.includes('iade')
        if (l) {
          betstate = 'Kaybetti'
        }else if(this.getDetails.length === 1 && i){
          betstate = 'iade'
        }else if(w && !a){
          betstate = 'Kazandi'
        }else{
          betstate = 'Aktif'
        }
        if (betstate !== '') {
          await axios.put('/api/home/account/setbetsummarystate', {betsum:this.betSum, betstate: betstate}).then((result) => {
            if (result.data.message !== 'active') {
              setTimeout(() => {
                this.betSummary.splice(this.removeIndex,1)
                this.removeIndex = ''
                this.getDetails = ''
                this.bets = {}
                this.sumId = ''
                this.betInfo()
                this.getTotal(this.betSummary)
              }, 500)
            }
          })
        }
      }
    },
    async getScore(id){
      this.isScore = true
      if (this.scores.length > 0) {
        this.scoreParts = this.scores.filter(item => item.bwin_id == id)
        if (this.scoreParts.length > 0) {
          if (this.scoreParts[0].time_status === '0') {
            this.matchStatus = 'Baslamadi'
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
        let final = {... result[0].data.creditinfo, ...result[1].data.activeinfo, ...result[2].data.totalinfo, ...result[3].data.woninfo}
        this.$store.commit('setBetInfo',final)
      })
    },
    async paymentBet(list, event){
      await axios.put('/api/home/account/paymentbet', {betsum:list}).then((result) => {
        if (result.data.code === 200) {
          event.target.value = 'ÖDENDİ'
          event.target.style.backgroundColor = '#1A6D91'
          this.betInfo()
        }
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
      this.totalAmount = amount.reduce((acc, item)=>{
        return acc + item.amount
      },0)
      const calcearn = won.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      this.totalEarn = calcearn
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
    }
  }
}
</script>
