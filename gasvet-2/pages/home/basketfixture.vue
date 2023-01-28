<template>
  <div class="pages main-page" id="content">  
    <div class="odd-center">
     <div class="title-2">
        <div class="filter-con">
          <div class="filter-icons-left">
            <span><i class="fas fa-basketball-ball navbar-icons cl-o navbar-icons" />BASKETBOL</span>
            <span class="badge bg-g ml10 mobil-length">{{leaguesLength}}</span>
            <i class="fas fa-adjust navbar-icons mobil-length cp" @click="isLeagueOpen =! isLeagueOpen" title="Aç Kapa"/>
            <input type="search" v-model="searchBox" @input="searchFilter()" class="searchbox-left searchbox-soccer" placeholder="ara...">
            <i class="fa fa-search fa-lg cl-o sbi cp" @click="searchFilter()"/>
          </div>
          <div class="filter-icons-mid">
            <select v-model="timeBox" class="selectbox1 sct" @change="filterAsTime()">
              <option value="Saat" disabled>Saat</option>
              <option value="all">Hepsi</option>
              <option :value="$moment().add(1,'hours').format('YYYY-MM-DD HH:mm')">1 Saat İçinde</option>
              <option :value="$moment().add(2,'hours').format('YYYY-MM-DD HH:mm')">2 Saat İçinde</option>
              <option :value="$moment().add(3,'hours').format('YYYY-MM-DD HH:mm')">3 Saat İçinde</option>
              <option :value="$moment().add(4,'hours').format('YYYY-MM-DD HH:mm')">4 Saat İçinde</option>
              <option :value="$moment().add(5,'hours').format('YYYY-MM-DD HH:mm')">5 Saat İçinde</option>
              <option :value="$moment().add(6,'hours').format('YYYY-MM-DD HH:mm')">6 Saat İçinde</option>
            </select>
            <select v-model="dateBox" class="selectbox1" @change="filterAsDate()">
              <option value="all">Hepsi</option>
              <option value="Hepsi" disabled>Hepsi</option>
              <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
              <option :value="$moment().add(1,'days').format('YYYY-MM-DD')">Yarın</option>
              <option :value="$moment().add(2,'days').format('YYYY-MM-DD')">Ertesi Gün</option>
            </select>
          </div>
           <i class="fas fa-globe fa-lg cp cl-o" @click="allLeagues()"/>
          <i class="fas fa-adjust navbar-icons desktop-length cp" @click="isLeagueOpen =! isLeagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-g mr10 ml10 desktop-length">{{leaguesLength}}</span>
      </div>
      <div class="odd-center-con">
        <div>
          <details :open="isLeagueOpen" class="odd-details cp" v-for="(list, index) in leagues" :key="index">
            <summary class="title-3 po-r">
             <div class="basket-left-title">
                <span class="flag-con ml5">
                  <img :src="getFlags(list[0].RegionName)">
                  <span class="leag ml10">{{list[0].RegionName}} {{list[0].leaguename}}</span>
                  <!-- <span class="leag ml10">{{list[0].RegionName}} {{list[0].leaguename}} {{list[0].leagueid}}</span> -->
                </span>
                 <span class="ottli-mbs mr5">Mbs</span>
              </div> 
              <div class="basket-right-title">
                <span class="ottli-bas">1</span>
                <span class="ottli-bas">2</span>
                <span class="ottli-bas">Alt</span>
                <span class="ottli-bas">Üst</span>
                <span class="ottli-bas">H</span>
                <span class="ottli-bas">H</span>
              </div>
            </summary>
            {{getRateToggle}}
            <div class="basket-list" v-for="(sublist, index) in filterBy(list, searchBox)" :key="index">
              <div class="basket-left-list" @click="getOdds($event,sublist.fixtureid)">
                <span class="blli code code-basket"><span class="badge bg-o">{{sublist.fixtureid.toString().slice(-3)}}</span></span>
                <span class="blli date">{{sublist.startdate | moment('MM-DD')}}</span>
                 <span class="blli time">{{$moment.utc(sublist.startdate).tz('Europe/Istanbul').format('HH:mm')}}</span>
                <span class="blli matches">{{ String(sublist.HomeTeam).slice(0,25) }} - {{ String(sublist.AwayTeam).slice(0,25) }}</span>
                <span class="mbslist">1</span>
              </div>
              <div class="basket-right-list">
                <div class="ottli-bas ottli-bas-list rate-text-basket" @click="addSlip(sublist.home, 'Evsahibi', sublist, 'Maç Sonu')">{{sublist.home | convertOdd($store.state.newrate)}}</div>
                <div class="ottli-bas ottli-bas-list rate-text-basket" @click="addSlip(sublist.away, 'Deplasman', sublist, 'Maç Sonu')">{{sublist.away | convertOdd($store.state.newrate)}}</div>
                <div class="ottli-bas ottli-bas-list rate-text-basket" @click="addSlip(sublist.underodds, sublist.under, sublist, 'Toplam Sayı Alt/Üst')">
                  <div class="rate-text-basket rt-double">
                    <span class="odds-attr" v-if="sublist.underodds">{{String(sublist.under).slice(-5)}}</span>
                    <span class="odds-value">{{sublist.underodds | convertOdd($store.state.newrate)}}</span>
                  </div>
                </div>
                <div class="ottli-bas ottli-bas-list" @click="addSlip(sublist.overodds, sublist.over, sublist, 'Toplam Sayı Alt/Üst')">
                  <div class="rate-text-basket rt-double">
                    <span class="odds-attr" v-if="sublist.overodds">{{String(sublist.over).slice(-5)}}</span>
                    <span class="odds-value">{{sublist.overodds | convertOdd($store.state.newrate)}}</span>
                  </div>
                </div>
                <div class="ottli-bas ottli-bas-list" @click="addSlip(sublist.han1, 'Evsahibi'+' '+sublist.han1attr, sublist, 'Maç Handkap')">
                  <div class="rate-text-basket rt-double">
                    <span class="odds-attr">{{sublist.han1attr}}</span>
                    <span class="odds-value">{{sublist.han1 | convertOdd($store.state.newrate)}}</span>
                  </div>
                </div>
                <div class="ottli-bas ottli-bas-list" @click="addSlip(sublist.han2, 'Deplasman'+' '+sublist.han2attr, sublist, 'Maç handkap')">
                  <div class="rate-text-basket rt-double">
                    <span class="odds-attr">{{sublist.han2attr}}</span>
                    <span class="odds-value">{{sublist.han2 | convertOdd($store.state.newrate)}}</span>
                  </div>
                </div>  
              </div>
            </div>
          </details>
        </div>
        <div class="notfound" v-if="notFound"><i class="fas fa-ban fa-4x cl-r"/></div>
      </div>
    </div>
    <preloader v-if="isLoader" class="loader-con"/>
    <aside class="right-side">
      <slipside class="slip-side" :branchimage="branchimage"/>
    </aside>
    <div class="suboption-model" v-if="isSubOptions">
      <div class="suboptions" :style="{top:top,position:pos}" :class="{opacityClass: isSubOptions}">
        <header class="suboptions-header">
          <span class="soccer-left-header">
            <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
            <span class="badge bg-g">{{subOddsLength}}</span>
            <i class="fas fa-adjust navbar-icons cp" @click="isMarketOpen =! isMarketOpen" title="Aç Kapa"/>
          </span>
          <div>
            <h2>{{teamName}}</h2>
          </div>
          <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
        </header>
        <div class="suboptions-con po-r">
          <div class="tab-content stc" id="myTabContent">
            <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(subOdds, 'templateId')" :key="index">
              <summary class="title-3 title-3-options mt2">
                <div>
                  <header>
                    <i class="fas fa-shield-alt cl-g mr5"/>
                    <span>{{oddsname.name.value}}</span>
                      <!-- <span class="cl-y">{{oddsname.templateId}}</span> -->
                  </header>
                </div>
              </summary>
              <div class="subodds-list subodds-wrapperbwin">
                <div class="subodds-wrapper prebwin" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value,'', oddsname.name.value,'', '')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
                  <div class="odds-rate-con">
                    <span class="oddsrate mr5">{{oddsvalue.name.value}}</span>
                  </div>
                    <span class="oddsrate ml5 cl-r">{{oddsvalue.odds | convertOdd($store.state.newrate)}}</span>
                </div>
              </div>
            </details>
            <img src="~/assets/img/loader2.gif" alt="" class="subloader" v-if="isSubloader">
            <span class="page-end" v-else>Başka veri yoktur!</span>
          </div>
        </div>
        <footer class="suboptions-footer"></footer>
      </div> 
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import marketsjson from '../../basketmarkets.json'
import {apimixin} from '../../mixins/api'
export default {
  mixins: [Vue2Filters.mixin,apimixin('x')],
  name: 'basket',
  components: {
    slipside
  },
  data () {
    return {
      markets: marketsjson,
      leagues: {},
      subOdds: {},
      leaguesLength: 0,
      subOddsLength: 0,
      searchBox: null,
      timeBox: 'Saat',
      dateBox: 'Hepsi',
      notFound: null,
      branchimage: 'basket',
      teamName:null,
      code:null,
      isSubOptions: false,
      isLoader: false,
      isSubloader: true,
      isBetSlip:false,
      isSubSlip:false,
      isLeagueOpen:true,
      isMarketOpen:true,
      slips: {},
      intervalLeagueList:null,
      top:0,
      pos: null,
      lid:0,
      mid:0
    }
  },
  mounted (){
    this.getLeagues()
    this.intervalLeagueList = setInterval(() => {
      this.getLeagues()
    }, 905 * 1000)
  },
  computed:{
    getRateToggle(){
      if(this.$store.state.ratetoggle){
        document.querySelectorAll('.rate-text-basket').forEach(item => {
          item.classList.remove('bg-o')
        })
      }
    }
  },
  filters:{
    convertOdd (value, store) {
      if (store) {
        let item = store.find(item => item.type === 'bar')
        if (item && value !== undefined && value !== '') {
          if (item.operate === 'Eksi') {
            return (value - item.rate).toFixed(2)
          } else if(item.operate === 'Artı'){
            return (value + parseFloat(item.rate)).toFixed(2)
          }
        }else{
          return value
        }
      }else{
        return value
      }
    }
  },
  methods: {
    async getLeagues(){
      this.isLoader = true
      this.notFound = false
      await axios.get('/api/home/basketfixture').then((result)=>{
        if (result.data) {
          let filternow = result.data.filter(item => moment(item.startdate).tz('Europe/Istanbul').format('YYYY MM DD HH:mm') > moment().format('YYYY MM DD HH:mm'))
          this.leagues = _.groupBy(filternow, 'leagueid')
          this.search = filternow
          this.leaguesLength = filternow.length
          filternow.forEach(item => {
            item.under = 'Alt' +item.under.toString().slice(-6)
            item.over = 'Üst' +item.under.toString().slice(-6)
          })
          this.transCountries(filternow)
          this.isLoader = false
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async getOdds (event,id) {
      if (screen.width < 480 || navigator.userAgent.indexOf('iPhone') != -1) {
        this.goTop()
      }
      this.subOdds = {}
      this.teamName = null
      this.subOddsLength = null
      this.isSubOptions = true
      let mid = 0
      await axios.get(`/api/home/basketfixtureodds/${id}`).then((result)=>{
        if (result.data.length > 0) {
          this.isSubSlip = true
          this.teamName = result.data[0].HomeTeam +' - '+ result.data[0].AwayTeam
          this.code = id
          if (localStorage.getItem('set')) {
            let ls = JSON.parse(localStorage.getItem('set'))
            mid = ls.map(item => {
              if (item && item.type === 'bam') {
                return {filterid:item.filterid}
              }else{return 0}
            })
          this.subOdds = result.data[0].Markets.filter(item1 => { return !mid.some(item2 => (item2.filterid === item1.templateId))})
        }else{
          this.subOdds = result.data[0].Markets
        }
          this.allOddsLength = this.subOdds.length
          this.subOdds.forEach(item => {
            this.markets.forEach(item2 => {
              if (item.templateId === item2.id) {
                item.name.value = item2.name
              }
            })
          })
          this.transOdds(this.subOdds)
          this.transMarkets(this.subOdds)
          this.subOddsLength = this.subOdds.length
        }
        this.isSubloader = false
      }).catch(err => {console.log(err)})
    },
    allLeagues(){
      this.leagues = _.groupBy(this.search, 'leagueid')
      this.leaguesLength = this.search.length
    },
    transMarkets(value){
      value.forEach(item => {
        if (item.name) {
          let Name = item.name.value
            .replace('record?','')
            .replace('score?','')
            .replace('achieve a double-double in the game (Including overtime)? ','İkide İki Yaparmı?')
            .replace('record a double-double in the game (Including overtime)?','İkide İki Yaparmı?')
            .replace('How many assists will','Oyuncu Toplam Asist Sayısı')
            .replace('How many blocks will','Oyuncu Toplam Block Sayısı')
            .replace('How many points will','Oyuncu Toplam Basket Sayısı')
            .replace('How many rebounds will','Oyuncu Toplam Rebound Sayısı')
            .replace('How many rebounds','Oyuncu Toplam Rebound Sayısı')
            .replace('How many steals will','Oyuncu Toplam Top Çalma Sayısı')
            .replace('How many three-pointers will','Oyuncu Toplam 3 lük Basket Sayısı')
            .replace('How many total points, rebounds and assists will','Oyuncu Toplam 3 lük Basket Sayısı, Asist Sayıs, Rebound Sayısı?')
            .replace('How many total 3pt shots will be scored by both teams?','Her İki Takım Toplam İsabetli 3 lük Basket Sayısı')
            .replace('Will','')
          item.name.value = Name
        }
      })
    },
    closeSub() {
      this.isSubOptions = false
      this.isSubSlip = false
      this.isLoader = false
    },
    filterAsDate() {
      if (this.dateBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'leagueid')
      } else {
        let temp = this.search.filter(item => moment(item.startdate).format('YYYY-MM-DD') === this.dateBox)
        this.leagues = _.groupBy(temp, 'leagueid')
        this.leaguesLength = temp.length
      }
    },
    filterAsTime() {
      if (this.dateBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'leagueid')
      } else {
        let temp = this.search.filter(item => moment(item.startdate).format('YYYY-MM-DD') === this.dateBox)
        this.leagues = _.groupBy(temp, 'leagueid')
        this.leaguesLength = temp.length
      }
    },
    searchFilter () {
      let searchArray = this.search.filter(item => item.HomeTeam.toLowerCase().includes(this.searchBox.toLowerCase()) || item.AwayTeam.toLowerCase().includes(this.searchBox.toLowerCase()) || item.fixtureid.toString().slice(-3).includes(this.searchBox))
      this.leagues = _.groupBy(searchArray, 'leagueid')
      this.leaguesLength = searchArray.length
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    addSlip (rate, option, sublist, games, handikap, total) {
      let rateclass = event.target.className
      let parent = event.target.parentElement
      event.target.classList.toggle('bg-o')
      parent.querySelectorAll('.bg-o').forEach(item => {
        item.classList.remove('bg-o')
        event.target.classList.add('bg-o')
      })
      this.$store.commit('setRateToggle', false)
      this.selectedId = true
      let hc = ''
      let to = ''
      let code = ''
      let match = ''
      if (sublist === '') {
        code = this.code
      } else {
        code = sublist.fixtureid
      }
      if (this.isSubSlip) {
        match = this.teamName
      } else {
        match = sublist.HomeTeam +'-'+ sublist.AwayTeam
      }
      if(handikap !== null && handikap !== undefined){
        hc = handikap
      }
      if(total !== null && total !== undefined){
        to = total
      }
      let st = moment(sublist.startdate).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm')
      let betdate = st.substr(5,5)
      let bettime = st.slice(-5)
      setTimeout(() => {
        if (rate !== '-') {
          this.slips = {
            betid:0,
            code: code.toString().slice(-3),
            user: this.$store.state.auth.user,
            admin: this.$store.state.auth.admin,
            superadmin: this.$store.state.auth.superadmin,
            matches: match,
            games: games,
            options: option +' '+ hc +' '+ to,
            rate: rate,
            stream: 'Bülten',
            state: 'Aktif',
            eventtime:betdate +'/'+ bettime,
            scoreid: code
          }
          if (!this.$store.state.betslip){
            this.$store.commit('setBetSlip', true)
          }
          setTimeout(() => {
            let t = 0
            if (this.$store.state.slips.length > 0) {
            let test = this.$store.state.slips.find((item,index) =>{
              t = index
              return item.code === code.toString().slice(-3)
            })
            if (test === undefined) {
              this.$store.commit('setSlips', this.slips)
            }else{
              if (rateclass === 'ottli-bas ottli-bas-list rate-text-basket bg-o' || 'rate-text-basket rt-double') {
                this.$store.commit('removeSlipItem', t)
                if (this.$store.state.slips < 1) {
                  this.$store.commit('setBetSlip', false)
                }
              } else {
                this.$store.commit('removeSlipItem', t)
                setTimeout(() => {
                  this.$store.commit('setSlips', this.slips)
                }, 10)
              }
            }
          } else {
            this.$store.commit('setSlips', this.slips)
          }
          }, 20)
        }
      }, 30)
    }
  },
  beforeDestroy: function(){
    clearInterval(this.intervalLeagueList)
  }
}
</script>
