<template>
  <div class="pages" v-if="checkU1 || checkA2">
    <header class="title-2">
      <span>KUPONLAR</span>
      <div class="date-con">
        <select v-model="quickDate" class="selectbox boxbet" @change="quickDatefilter()">
          <option value="Tarih" disabled>Tarih</option>
          <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
          <option :value="$moment().subtract(1,'days').format('YYYY-MM-DD')">Dün</option>
          <option :value="$moment().subtract(2,'days').format('YYYY-MM-DD')">Önceki Gün</option>
        </select>
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
        <li class="title-ligth">
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
                   <select v-if="!checkU1" v-model="userBox" class="selectbox box-bet select-owner" @change="getBetSummary()">
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
            <span class="bitems brate cp" @click="sortStream('stream')">TÜR</span>
          </div>
          <span class="bitems bstate" v-if="checkS3 || checkB4">AKTİFLER</span>
          <span class="bitems bstate" v-else>
            <select v-model="stateBox" class="selectbox box-bet" @change="getBetSummary()">
              <option value="Aktif" selected>Aktifler</option>
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
        <div class="list-bet" :class="list.state" v-for="(list,index) in filterBy(betSummary, searchBox)" :key="index">
          <li class="blinks"  @click="getBets($event, index, list)">
            <span class="bitems-list bno">
              <span class="bno-inside bg-b">{{ index }}</span>
            </span>
            <span class="bitems-list" :class="{betIdClass: betid === list.id}">{{ list.id }}</span>
            <span v-if="checkU1" class="bitems-list bowner" :class="{filterBetClass: sortName === 'owner'}">{{ list.owner }}</span>
            <span v-if="checkA2" class="bitems-list bowner">{{ list.user | capitalize}}</span>
            <span v-if="checkB4 || checkS3" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
            <span class="bitems-list bdate">{{list.date | dateFormat }}</span>
            <span class="bitems-list btime">{{list.date | timeFormat}}</span>
            <span class="bitems-list bcount">{{ list.betscountremain}} / {{list.betscount}}</span>
            <span class="bitems-list bamo">{{ list.amount | currency('₺', 0)}}</span>
            <span class="bitems-list brate">{{ list.rate }}</span>
            <span class="bitems-list bearn">{{ list.earn  | currency('₺', 2)}}</span>
            <span class="bitems-list brate">{{ list.stream }}</span>
          </li>
          <span class="bitems-list bstate">
            <div class="payment-con" v-if="list.state === 'Kazandi' && checkU1">
              <input type="button" class="bitems-button bg-b" v-if="list.payment === 'no'" value="ÖDE" @click="paymentBet('yes',list.betid)"/>
              <input type="button" class="bitems-button bg-b" v-if="list.payment === 'yes'" value="ÖDENDİ" @click="paymentBet('no',list.betid)"/>
            </div>
            <i class="fas fa-thumbs-up" v-if="list.state ==='Kazandi'  && !checkU1"/>
            <i class="fas fa-thumbs-down" v-if="list.state ==='Kaybetti'" />
            <i class="fas fa-ban" v-if="list.state ==='iptal'" />
            <i class="fas fa-retweet" v-if="list.state ==='iade'" />
            <i class="fas fa-balance-scale" v-if="list.state ==='Aktif'" />
            <i class="fas fa-trash-alt bet-cancel" v-if="(cancelTime(list.date) < 15 && checkU1 && list.stream === 'Bülten') || list.state === 'Aktif' && checkA2" @click="cancelBet($event, list.id, list.amount, list.user,index)" />
          </span>
        </div>
        <div v-if="detailsHandel" class="bet-details-con" :style="{top:top}">
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
                <span class="bitems bmatch">MAÇ</span>
                <span class="bitems bgame">OYUN</span>
                <span class="bitems boption">SEÇİM</span>
                <span class="bitems brate">ORAN</span>
                <span class="bitems bstream">TÜRÜ</span>
                <span class="bitems bscore">SKOR</span>
                <span v-if="$store.state.auth.role !== 'U1'" class="bitems bstate">DURUM</span>
              </li>
            </ul>
            <ul class="bet-details">
              <li class="list-bet details-list" :class="list.state" v-for="(list,index) in bets" :key="index">
                <span class="bitems-list betDetailsClass">{{ list.betid }}</span>
                <span class="bitems-list bcode">{{ list.code }}</span>
                <span class="bitems-list bmatch">{{ list.matches }}</span>
                <span class="bitems-list bgame">{{ list.games }}</span>
                <span class="bitems-list boption">{{ list.options }}</span>
                <span class="bitems-list brate">{{ list.rate }}</span>
                <span class="bitems-list bstream">{{ list.stream }}</span>
                <span class="bitems-list bscore">{{list.score}}</span>
                <span v-if="list.code === betloader" class="bitems-list bstate"><img src="~/assets/img/loader.gif" alt="" ></span>
                <span v-if="$store.state.auth.role !== 'U1' && list.code !== betloader" class="bitems-list bstate">
                  <select v-model="list.state" class="selectbox" @change="setBetState(list)" v-if="list.state !== 'iptal'">
                    <option value="Aktif">Aktif</option>
                    <option value="Kazandi">Kazandi</option>
                    <option value="Kaybetti">Kaybetti</option>
                    <option value="iade">İade</option>
                  </select>
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
              <li v-if="checkU1">
                <div class="user-comission mt20">
                  <select class="selectbox boxbet" v-model="userComission" @change="setComission()">
                    <option value="5" selected>5</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <div>
                    <span class="mr10">Brüt Kazanç:</span>
                    <span>{{totalEarn  | currency('₺', 2)}}</span>
                  </div>
                  <div>
                    <span class="mr10">Bayi Kesinti:</span>
                    <span>{{userComission}} %</span>
                  </div>
                  <div>
                    <span class="mr10">Net Kazanç:</span>
                    <span>{{getComission | currency('₺', 2)}}</span>
                  </div>
                </div>
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
        <h3>Tarih</h3>
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
    <div v-if="warningOpen" :style="{top:top}" class="dialog warning warning-bet">
      <header class="title-2">
        <h3 class="cl-w">Uyarı</h3>
      </header>
      <div class="dialog-content">
        <p class="warning-text">{{bId }} Nolu Kupon İptal Edilsinmi!</p>
      </div> 
      <footer class="dialog-footer">
        <input type="button" value="Evet" class="btn-dialog bg-f" @click="removeBet()">
        <input type="button" value="Hayır" class="btn-dialog bg-r" @click="warningOpen = false">
      </footer>
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
      betPrint: {},
      betid: '',
      detailsHandel: false,
      removeIndex: '',
      sort: false,
      sortName: '',
      error: '',
      betstate: '',
      getDetails:[],
      betloader:false,
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalEarn:0,
      quickDate:'Tarih',
      userComission: '5',
      warningOpen: false,
      bId: '',
      bAmount: '',
      bUser: '',
      bIndex: ''
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
    },
    getComission(){
      let newEarn = (this.totalEarn * this.userComission) / 100
      return this.totalEarn - newEarn
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
        this.getTotal(result.data.betsummary)
      })
    },
    cancelBet (event, id, amount, user,index) {
      this.warningOpen = true
      this.bId = id
      this.bAmount = amount
      this.bUser = user
      this.bIndex = index
      this.top = (event.pageY - 200)+ 'px'
    },
    async removeBet(){
      this.warningOpen = false
      this.removeIndex = this.bIndex
      if (this.$store.state.auth.role === 'U1') {
        if (this.$store.state.limitsettings.maxkis !== 0 && this.$store.state.limitsettings.maxkisremain === this.$store.state.limitsettings.maxkis) {
          this.error = 'İptal sınırınız dolmuştur!'
          setTimeout(() => {
            this.error = ''
          }, 1000)
        }else{
          await axios.post('/api/home/account/cancelbet', {id: this.bId, amount: this.bAmount, user: this.bUser}).then((result) => {
            if (result.data.code === 200) {
              this.betSummary.splice(this.removeIndex,1)
              this.getCreditInfo()
              this.getActiveInfo()
              this.removeIndex = ''
            }
          })
        }
      } else {
         await axios.post('/api/home/account/cancelbet', {id: this.bId, amount: this.bAmount, user: this.bUser}).then((result) => {
          if (result.data.code === 200) {
            this.betSummary.splice(this.removeIndex,1)
            this.getCreditInfo()
            this.getActiveInfo()
            this.removeIndex = ''
          }
        })
      }
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/betsummary/datefilter', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish:this.dateFinish}).then((result) => {
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
    async quickDatefilter () {
      await axios.post('/api/home/account/betsummary/quickdatefilter', {userbox: this.userBox, statebox:this.stateBox, quickdate:this.quickDate}).then((result) => {
        if (result.data.datefilter.length > 0) {
          this.dateOpen = false
          this.notfound = ''
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
          this.quickDate = 'Tarih'
        } else {
          this.dateOpen = false
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
          this.quickDate = 'Tarih'
        }
      })
    },
    async getBets (event, index, list) {
      this.loader = true
      this.betsum = {}
      await axios.get('/api/home/account/betsummary/' + list.id).then((result) => {
        this.bets = result.data.bets
        this.detailsHandel = true
        this.betSum = list
        this.betid = list.id
        this.removeIndex = index
        this.loader = false
        this.top = (event.pageY - 166)+ 'px'
      })
    },
    async setBetState (betdetail) {
      this.betloader = betdetail.code
      this.getDetails = this.bets.map(item => item.state)
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
      this.betid =''
      let betstate = ""
      if (this.getDetails.length > 0) {
        let l = this.getDetails.includes('Kaybetti')
        let a = this.getDetails.includes('Aktif')
        let w = this.getDetails.includes('Kazandi')
        let i = this.getDetails.includes('iade')
        if (l) {
          betstate = 'Kaybetti'
        }else if(this.getDetails.length === 1 && i){
          betstate = "iade"
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
                  this.betid = ''
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
    async paymentBet(value,betid){
      await axios.post('/api/home/account/paymentbet', {betid: betid, value: value }).then((result) => {
        if (result.data.code === 200) {
          this.getBetSummary()
        }
      })
    },
    getTotal(value){
      let won = value.filter(item => item.state === 'Aktif' || item.state === 'Kazandi')
      let amount = value.filter(item => item.state !== 'iade' && item.state !== 'iptal')
      this.totalCount = value.length
      this.totalAmount = amount.reduce((acc, item)=>{
        return acc + item.amount
      },0)
      let calcearn = won.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      this.totalEarn = calcearn
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
    setComission(){
      let newEarn = (this.totalEarn * this.userComission) / 100
      return this.totalEarn - newEarn
    },
    print () {
      this.$htmlToPaper('printMe')
    },
    sortOwner (name) {
      this.sort =! this.sort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.owner > b.owner ? 1:-1               
         }else{
          return a.owner > b.owner ? -1:1   
        }
      })
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
    },
    sortStream (name) {
      this.sort =! this.sort
      this.sortName = name
      this.betSummary.sort((a, b) => {
       if(this.sort){
          return a.stream > b.stream ? 1:-1                  
         }else{
          return a.stream > b.stream ? -1:1        
        }
      })
    }
  },
  beforeDestroy: function(){
    clearInterval(this.scoreInterval)
  }
}
</script>
