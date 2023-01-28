<template>
  <div class="pages" >
    <div>
      <header class="title-2">
        <div class="quick-report-con">
          <div class="input-con">
          <input v-model="dateStart" type="date" class="input-date">
            <input v-model="dateFinish" type="date" class="input-date">
            <input type="button" value="ARA" class="btn btn-date bg-m" @click="filterAsDate()">
          </div>
          <div class="quick-report qrcom cl-g">
            <span class="uci">
              <span>Adet:</span>
              <span class="cl-y">{{totalCount}}</span>
            </span>
            <span>
              <span>Girdi:</span>
              <span class="cl-y">{{totalAmount | currency('', 2)}}</span>
            </span>
            <span>
              <span>Brüt Kazanc:</span>
              <span class="cl-y">{{totalBaseEarn | currency('', 2)}}</span>
            </span>
            <span>
              <span>Net Kazanc:</span>
              <span class="cl-y">{{totalEarn | currency('', 2)}}</span>
            </span>
            <span>
              <span>Kom:</span>
              <span class="cl-y">{{calcComission | currency('', 2)}}</span>
            </span>
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
                  <input v-model="searchBox" type="number" class="bet-inp" placeholder="Ara...">
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
            <li class="blinks">
              <span class="bitems-list bno">
                <span class="bno-inside bg-b">{{ index }}</span>
              </span>
              <span class="bitems-list bid">{{ list.sumid }}</span>
              <span class="bitems-list bowner">{{ list.user | capitalize}}</span>
              <span class="bitems-list bdate">{{list.date | dateFormat }}</span>
              <span class="bitems-list btime">{{list.date | timeFormat}}</span>
              <span class="bitems-list bcount">{{ list.betscountremain}} / {{list.betscount}}</span>
              <span class="bitems-list bamo">{{ list.amount | currency('', 0)}}</span>
              <span class="bitems-list brate">{{ list.rate  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ list.baseearn  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ (list.baseearn - (list.earn * $store.state.auth.personcomission) / 100)  | currency('', 2)}}</span>
              <span class="bitems-list brate">{{ list.stream }}</span>
            </li>
            <span class="bitems-list bstate">{{((list.baseearn * $store.state.auth.personcomission) / 100) | currency('', 2)}}</span>
          </div>
        </ul>
        <notfound v-if="notfound" :message="notfound" class="not-found"/>
        <span class="page-end">Başka veri yoktur</span>
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
      sortName: null,
      error: false,
      top: 0,
      totalCount:0,
      totalAmount:0,
      totalBaseEarn:0,
      totalEarn:0,
      cuponbaseearn:0,
      isLoader: false,
      isSort: false,
      calcComission:0,
      comission:0
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetSummary()
  },
  computed: {
    getComission () {
      const newEarn = (this.cuponbaseearn * this.$store.state.auth.personcomission) / 100
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
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
        if (this.userList[0]) {
          this.comission = this.userList[0].personcomission
        }
      })
    },
    async getBetSummary () {
      this.isLoader = true
      const today = moment().format('YYYY-MM-DD')
      await axios.post('/api/home/account/detailscomission', {userbox: this.userBox}).then((result) => {
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
    getTotal(value){
      const won = value.filter(item => item.state === 'Kazandi')
      this.totalCount = value.length
      this.totalAmount = won.reduce((acc, item) => {
        return acc + item.amount
      },0)
      this.totalBaseEarn = won.reduce((acc, item) => {
        return acc + item.baseearn
      },0)
      setTimeout(() => {
        this.totalEarn = won.reduce((acc, item) => {
          return acc + (item.earn - ((item.baseearn * this.$store.state.auth.personcomission) / 100))
        },0)
        this.calcComission = won.reduce((acc, item) => {
          return acc + ((item.baseearn * this.$store.state.auth.personcomission) / 100)
        },0)
      }, 500)
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
