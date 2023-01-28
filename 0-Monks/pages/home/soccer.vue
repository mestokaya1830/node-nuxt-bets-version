<template>
  <div class="pages main-page">  
    <div class="odd-center">
     <div class="title-2">
        <div class="filter-con">
          <span><i class="fas fa-futbol navbar-icons cl-g navbar-icons" />FUTBOL</span>
          <span class="badge bg-g mr10 ml10 mobil-length">{{leaguesLength}}</span>
          <i class="fas fa-adjust navbar-icons mobil-length ml20 cp" @click="leagueOpen =! leagueOpen" title="Aç Kapa"/>
          <input type="search" v-model="searchBox" @keyup="searchFilter()" class="searchbox-left searchbox-soccer" placeholder="ara...">
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
            <option :value="$moment().add(2,'days').format('YYYY-MM-DD')">3. Gün</option>
            <option :value="$moment().add(3,'days').format('YYYY-MM-DD')">4. Gün</option>
          </select>
          <i class="fas fa-globe fa-lg ml10 cp cl-f" @click="resetFav()"/>
          <i class="fas fa-adjust navbar-icons desktop-length ml20 cp" @click="leagueOpen =! leagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-g mr10 ml10 desktop-length">{{leaguesLength}}</span>
      </div>
      <div class="odd-center-con">
        <div>
          <details :open="leagueOpen" class="odd-details cp" v-for="(list, index) in leagues" :key="index">
            <summary class="title-3 po-r">
              <div class="odd-left-title">
                <span class="flag-con ml5">
                  <img :src="getFlags(list[0].cn)">
                  <span class="leag ml10">{{list[0].cn}} {{list[0].lgn}} {{list[0].lid}}</span>
                </span>
                <span class="ottli-mbs">Mbs</span>
              </div>
              <div class="odd-right-title">
                <span class="ottli-title">1</span>
                <span class="ottli-title">0</span>
                <span class="ottli-title">2</span>
                <span class="ottli-title">Alt</span>
                <span class="ottli-title">Üst</span>
                <span class="ottli-title">A 1.5</span>
                <span class="ottli-title">Ü 1.5</span>
                <span class="ottli-title">Var</span>
                <span class="ottli-title">Yok</span>
                <span class="ottli-title ottli-last-title cl-y">{{list.length}}</span>
              </div>
            </summary>
            <div class="list odd-list" v-for="(sublist, index) in filterBy(list, searchBox)" :key="index">
              <div class="odd-left-list" @click="getOdds($event,sublist)">
                <span class="blli code"><span class="badge bg-f">{{sublist.fid | getCode}}</span></span>
                <span class="blli date">{{sublist.st | moment('DD-MM')}}</span>
                <span class="blli time">{{$moment.utc(sublist.st,'YYYY-MM-DD HH:mm').tz('Europe/Istanbul').format('HH:mm')}}</span>
                <span class="blli matches">{{ sublist.lt }} - {{ sublist.vt }}</span>
                <span class="mbslist">1</span>
              </div>
              <div class="odd-right-list-con">
                <div class="odd-right-list">
                  <span class="ottli" @click="addSlip(sublist.r1, 'Evsahibi', sublist,'Maç Sonu')">
                    <span class="rate-text">{{sublist.r1}}</span>
                  </span>
                 <span class="ottli" @click="addSlip(sublist.r0, 'Beraberlik', sublist, 'Maç Sonu')">
                    <span class="rate-text">{{sublist.r0}}</span>
                  </span>
                  <span class="ottli" @click="addSlip(sublist.r2, 'Deplasman', sublist, 'Maç Sonu')">
                    <span class="rate-text">{{sublist.r2}}</span>
                  </span>
                  <span class="ottli-items" @click="addSlip(sublist.u25, 'Alt 2.5', sublist, 'Alt/Üst 2.5')">
                    <span class="rate-text">{{sublist.u25}}</span>
                  </span>
                  <span class="ottli-items" @click="addSlip(sublist.o25, 'Üst 2.5', sublist, 'Alt/Üst 2.5')">
                    <span class="rate-text">{{sublist.o25}}</span>
                  </span>
                  <span class="ottli-items" @click="addSlip(sublist.u15, 'Alt 1.5', sublist, 'Alt/Üst 1.5')">
                    <span class="rate-text">{{sublist.u15}}</span>
                  </span>
                  <span class="ottli-items" @click="addSlip(sublist.o15, 'Üst 1.5', sublist, 'Alt/Üst 1.5')">
                    <span class="rate-text">{{sublist.o15}}</span>
                  </span>
                  <span class="ottli" @click="addSlip(sublist.yes, 'Evet', sublist, 'Karşılıklı Gol')">
                    <span class="rate-text">{{sublist.yes}}</span>
                  </span>
                  <span class="ottli" @click="addSlip(sublist.no, 'Hayır', sublist, 'Karşılıklı Gol')">
                    <span class="rate-text">{{sublist.no}}</span>
                  </span>
                </div> 
                <span class="ottli ottli-last" @click="getOdds($event,sublist)"><i class="fas fa-plus-square sso cp cl-f"/></span>
              </div>
            </div>
          </details>
        </div>
        <notfound v-if="notfound" :message="notfound" class="not-found" />
        <div>
          <div v-if="subOptions" class="suboptions" :style="{top:top,position:pos}" :class="{opacityClass: subOptions}">
            <header class="suboptions-header">
              <span class="soccer-left-header">
                <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
                <span class="badge bg-g">{{subOddsLength}}</span>
                <i class="fas fa-adjust navbar-icons cp" @click="marketOpen =! marketOpen" title="Aç Kapa"/>
              </span>
              <div>
                <h2>{{teamName}}</h2>
              </div>
              <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
            </header>
            <div class="suboptions-con">
              <div class="tab-content stc" id="myTabContent">
                <details :open="marketOpen" v-for="(oddsname, index) in orderBy(subOdds, 'name')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddsvalue, index) in oddsname.bookmaker.data[0].odds.data" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)" :class="{liveClass3:oddsname.id === 1 || oddsname.id === 37 || oddsname.id === 63 || oddsname.id === 69 || oddsname.id === 80 || oddsname.id === 83 || oddsname.id === 75 || oddsname.id === 976334 || oddsname.id === 2977179 || oddsname.id === 137918019 || oddsname.id === 137918017 || oddsname.id === 137918016 || oddsname.id === 975905 || oddsname.id === 976144 || oddsname.id === 137918033 || oddsname.id === 976384 || oddsname.id === 136703823 || oddsname.id === 975926,liveClass4: oddsname.id === 975916 || oddsname.id === 975909 || oddsname === 976389 || oddsname.id === 136830688}">
                      <div class="odds-rate-con">
                        <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                        <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                        <span class="oddsrate">{{oddsvalue.total}}</span>
                      </div>
                      <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                    </div>
                  </div>
                </details>
                <div v-if="overUnder">
                  <details :open="marketOpen" v-for="(oddsname, index) in overUnder" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-y mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                      <div class="subodds-list-pre">
                        <div class="subodds-wrapper-pre liveClass1" v-for="(oddsvalue, index) in orderBy(oddsname.odds,'label')" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)">
                          <div class="odds-rate-con">
                            <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                            <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                            <span class="oddsrate">{{oddsvalue.total}}</span>
                          </div>
                          <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                        </div>
                      </div>
                  </details>
                </div>
                <div v-if="overUnderFirst">
                  <details :open="marketOpen" v-for="(oddsname, index) in overUnderFirst" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-o mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                      <div class="subodds-list-pre">
                        <div class="subodds-wrapper-pre liveClass1" v-for="(oddsvalue, index) in orderBy(oddsname.odds,'label')" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)">
                          <div class="odds-rate-con">
                            <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                            <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                            <span class="oddsrate">{{oddsvalue.total}}</span>
                          </div>
                          <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                        </div>
                      </div>
                  </details>
                </div>
                <div v-if="overUnderSecond">
                  <details :open="marketOpen" v-for="(oddsname, index) in overUnderSecond" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-h mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                      <div class="subodds-list-pre">
                        <div class="subodds-wrapper-pre liveClass1" v-for="(oddsvalue, index) in orderBy(oddsname.odds,'label')" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)">
                          <div class="odds-rate-con">
                            <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                            <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                            <span class="oddsrate">{{oddsvalue.total}}</span>
                          </div>
                          <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                        </div>
                      </div>
                  </details>
                </div>
                <div v-if="overUnderHome">
                  <details :open="marketOpen" v-for="(oddsname, index) in overUnderHome" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-f mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list-pre">
                      <div class="subodds-wrapper-pre liveClass1" v-for="(oddsvalue, index) in orderBy(oddsname.odds,'label')" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)">
                        <div class="odds-rate-con">
                          <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                          <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                          <span class="oddsrate">{{oddsvalue.total}}</span>
                        </div>
                        <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div v-if="overUnderAway">
                  <details :open="marketOpen" v-for="(oddsname, index) in overUnderAway" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-r mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list-pre">
                      <div class="subodds-wrapper-pre liveClass1" v-for="(oddsvalue, index) in orderBy(oddsname.odds,'label')" :key="index" @click="addSlip(oddsvalue.value, oddsvalue.label,'', oddsname.name,oddsvalue.handicap, oddsvalue.total)">
                        <div class="odds-rate-con">
                          <span class="oddsrate mr5">{{oddsvalue.label}}</span>
                          <span class="oddsrate ml5">{{oddsvalue.handicap}}</span>
                          <span class="oddsrate">{{oddsvalue.total}}</span>
                        </div>
                        <span class="oddsrate cl-r" v-if="oddsvalue.value">{{oddsvalue.value}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
            </div>
            <footer class="suboptions-footer"></footer>
          </div> 
        </div>
      </div>
    </div>
    <preloader v-if="loader" class="loader-con"/>
    <aside class="right-side">
      <slipside class="slip-side" :branchimage="branchimage"/>
      <div class="favorite-leags">
        <details class="left-details cp" v-for="(list, index) in favorites" :key="index">
          <summary class="title-3 fav-title" @click="getFav(list[0].lid)">
            <div class="left-title">
              <span class="flag-con">
                <img :src="getFlags(list[0].cn)" class="fav-flags">
                <span class="leag ml10">{{list[0].cn}}</span>
              </span>
            </div>
          </summary>
        </details>
      </div>
    </aside>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import notfound from '@/components/notfound'
import preloader from '@/components/preloader'
import marketsjson from '../../markets.json'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Odd',
  components: {
    slipside,
    notfound,
    preloader
  },
  data () {
    return {
      markets: marketsjson,
      leagues: {},
      subOdds: {},
      search: {},
      favorites: {},
      leaguesLength: 0,
      subOddsLength: 0,
      searchBox: '',
      timeBox: 'Saat',
      dateBox: 'Hepsi',
      subOptions: false,
      notfound: '',
      loader: false,
      betSlip:false,
      branchimage: 'futbol',
      subSlip:false,
      teamName:'',
      code:'',
      leagueOpen:false,
      marketOpen:false,
      slips: {},
      intervalLeagueList:'',
      overUnder:[],
      overUnderFirst:[],
      overUnderSecond:[],
      overUnderHome:[],
      overUnderAway:[],
      top:0,
      pos: ''
    }
  },
  mounted (){
    this.getLeagues()
    this.intervalLeagueList = setInterval(() => {
      this.getLeagues()
    }, 300 * 1000)
  },
  filters:{
    getCode(value){
      return value.toString().slice(-3)
    },
    convertOdd (value, store) {
      if (store.role === 'U1' && store.rate !== '0') {
        if (value !== undefined) {
          if (store.operate === 'minus') {
            return (value - store.rate).toFixed(2)
          } else if(store.operate === 'adding'){
            return (value + parseFloat(store.rate)).toFixed(2)
          }
        }
      }else{
        return value
      }
    }
  },
  methods: {
    async getLeagues(){
      this.loader = true
      await axios.get('/api/home/soccer').then((result)=>{
        let datefilter = result.data.filter(item => moment(item.st).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm'))
        this.leagues = _.groupBy(datefilter, 'lid')
        this.loader = false
        let favtemp = datefilter.filter(item => item.lid === 8 || item.lid === 600 || item.lid === 648 || item.lid === 82 || item.lid === 301 || item.lid === 384 || item.lid === 564)
        this.favorites = _.groupBy(favtemp, 'lid')
        this.search = datefilter
        this.leaguesLength = datefilter.length
        this.$store.commit('setFixtureId', datefilter.map(item => {return item.fid.toString()}))
      })
    },
    async getOdds (event,sublist) {
      await axios.get(`/api/home/soccerodds/${sublist.fid}`).then((result)=>{
      this.subOdds = {}
      this.overUnder = []
      this.overUnderFirst = []
      this.overUnderSecond = []
      this.overUnderHome = []
      this.overUnderAway = []
      this.subOptions = true
      this.subSlip = true
      this.teamName = sublist.lt +' - '+ sublist.vt
      this.code = sublist.id
      let mainodds = result.data.filter(item => item.id !== 12 && item.id !== 38 && item.id !== 975903 && item.id !== 976198 && item.id !== 976204 && item.id !== 47)
      // if (this.$store.state.auth.role === 'U1' && this.$store.state.marketsid.length > 0) {
      //   this.subOdds = mainodds.filter(item1 => !this.$store.state.marketsid[0].some(item2 => (item2.id === item1.id)))
      // } else {
      //   this.subOdds = mainodds
      // }
      this.subOdds = mainodds
      mainodds.forEach(element => {
        this.markets.data.forEach(element2 => {
          if (element.id === element2.id) {
            element.name = element2.name
          }
        })
      })
      let mou = result.data.filter(item => item.id === 12)
      if (mou.length > 0) {
        this.overUnder = [
          {name: 'Toplam Gol Alt/Üst 0.5',odds: mou[0].bookmaker.data[0].odds.data.filter(item => item.total === '0.5')},
          {name: 'Toplam Gol Alt/Üst 3.5',odds: mou[0].bookmaker.data[0].odds.data.filter(item => item.total === '3.5')},
          {name: 'Toplam Gol Alt/Üst 4.5',odds: mou[0].bookmaker.data[0].odds.data.filter(item => item.total === '4.5')},
          {name: 'Toplam Gol Alt/Üst 5.5',odds: mou[0].bookmaker.data[0].odds.data.filter(item => item.total === '5.5')},
          {name: 'Toplam Gol Alt/Üst 6.5',odds: mou[0].bookmaker.data[0].odds.data.filter(item => item.total === '6.5')}
        ]
        this.overUnder = this.overUnder.filter(item => item.odds.length > 0)
      }
      let mouf = result.data.filter(item => item.id === 975903)
      if (mouf.length > 0) {
          this.overUnderFirst = [
            {name: 'İlk Yarı Gol Alt/Üst 0.5',odds: mouf[0].bookmaker.data[0].odds.data.filter(item => item.total === '0.5')},
            {name: 'İlk Yarı Gol Alt/Üst 3.5',odds: mouf[0].bookmaker.data[0].odds.data.filter(item => item.total === '3.5')},
            {name: 'İlk Yarı Gol Alt/Üst 4.5',odds: mouf[0].bookmaker.data[0].odds.data.filter(item => item.total === '4.5')},
            {name: 'İlk Yarı Gol Alt/Üst 5.5',odds: mouf[0].bookmaker.data[0].odds.data.filter(item => item.total === '5.5')},
            {name: 'İlk Yarı Gol Alt/Üst 6.5',odds: mouf[0].bookmaker.data[0].odds.data.filter(item => item.total === '6.5')}
          ]
          this.overUnderFirst = this.overUnderFirst.filter(item => item.odds.length > 0)
      }
      let mous = result.data.filter(item => item.id === 38)
      if (mous.length > 0) {
        this.overUnderSecond = [
          {name: 'İkinci Yarı Gol Alt/Üst 0.5',odds: mous[0].bookmaker.data[0].odds.data.filter(item => item.total === '0.5')},
          {name: 'İkinci Yarı Gol Alt/Üst 3.5',odds: mous[0].bookmaker.data[0].odds.data.filter(item => item.total === '3.5')},
          {name: 'İkinci Yarı Gol Alt/Üst 4.5',odds: mous[0].bookmaker.data[0].odds.data.filter(item => item.total === '4.5')},
          {name: 'İkinci Yarı Gol Alt/Üst 5.5',odds: mous[0].bookmaker.data[0].odds.data.filter(item => item.total === '5.5')},
          {name: 'İkinci Yarı Gol Alt/Üst 6.5',odds: mous[0].bookmaker.data[0].odds.data.filter(item => item.total === '6.5')}
        ]
        this.overUnderSecond = this.overUnderSecond.filter(item => item.odds.length > 0)
      }
      let mouh = result.data.filter(item => item.id === 976198)
      if (mouh.length > 0) {
        this.overUnderHome = [
          {name: 'Evsahibi Gol Alt/Üst 0.5',odds: mouh[0].bookmaker.data[0].odds.data.filter(item => item.total === '0.5')},
          {name: 'Evsahibi Gol Alt/Üst 3.5',odds: mouh[0].bookmaker.data[0].odds.data.filter(item => item.total === '3.5')},
          {name: 'Evsahibi Gol Alt/Üst 4.5',odds: mouh[0].bookmaker.data[0].odds.data.filter(item => item.total === '4.5')},
          {name: 'Evsahibi Gol Alt/Üst 5.5',odds: mouh[0].bookmaker.data[0].odds.data.filter(item => item.total === '5.5')},
          {name: 'Evsahibi Gol Alt/Üst 6.5',odds: mouh[0].bookmaker.data[0].odds.data.filter(item => item.total === '6.5')}
        ]
        this.overUnderHome = this.overUnderHome.filter(item => item.odds.length > 0)
      }
      let moua = result.data.filter(item => item.id === 976204)
      if (moua.length > 0) {
        this.overUnderAway = [
          {name: 'Deplasman Gol Alt/Üst 0.5',odds: moua[0].bookmaker.data[0].odds.data.filter(item => item.total === '0.5')},
          {name: 'Deplasman Gol Alt/Üst 3.5',odds: moua[0].bookmaker.data[0].odds.data.filter(item => item.total === '3.5')},
          {name: 'Deplasman Gol Alt/Üst 4.5',odds: moua[0].bookmaker.data[0].odds.data.filter(item => item.total === '4.5')},
          {name: 'Deplasman Gol Alt/Üst 5.5',odds: moua[0].bookmaker.data[0].odds.data.filter(item => item.total === '5.5')},
          {name: 'Deplasman Gol Alt/Üst 6.5',odds: moua[0].bookmaker.data[0].odds.data.filter(item => item.total === '6.5')}
        ]
        this.overUnderAway = this.overUnderAway.filter(item => item.odds.length > 0)
      }
      this.transOdds(result.data)
      this.subOddsLength = result.data.length
      if (screen.width < 480 || navigator.userAgent.indexOf('iPhone') != -1) {
        this.top = (event.pageY - 400)+ 'px'
        this.pos = 'absolute'
      }
      })
    },
    getFlags (flags) {
      try {
        return require(`~/assets/img/${flags}.png`)
      } catch (error) {
        return require(`~/assets/img/Dünya.png`)
      }
    },
    getFav (id) {
      let test = this.search.filter(item => item.lid === id)
      this.leagues = _.groupBy(test, 'lid')
      this.leaguesLength = test.length
    },
    resetFav(){
      this.leagues = _.groupBy(this.search, 'lid')
      this.leaguesLength = this.search.length
    },
    closeSub() {
      this.subOptions = false
      this.subSlip = false
      this.loader = false
    },
    transOdds(value){
      value.forEach(element => {
        element.bookmaker.data[0].odds.data.forEach(item => {
          let oddoptions = item.label
          .replace('Draw & No','Beraberlik & Hayır')
          .replace('Draw & Yes','Beraberlik & Evet')
          .replace('Draw & Over','Beraberlik & Üst')
          .replace('Draw & Under','Beraberlik & Alt')
          .replace('Draw : Draw','Beraberlik : Beraberlik')
          .replace('Draw/Draw','Beraberlik / Beraberlik')
          .replace('No Goals','Gol Olmaz')
          .replace('No Goal','Gol Olmaz')
          .replace('Full Time','Tüm Zaman')
          .replace('Anytime','Herhangi Bir Zamanda')
          .replace('Both Teams','Her ikiside')
          .replace('Only','Sadece')
          .replace('Home Score Draw','Skorda Beraberlik')
          .replace('Home No Gol','Gol Atamaz')
          .replace('Yes / Yes','Evet / Evet')
          .replace('No / No','Hayır / Hayır')
          .replace('Draw','Beraberlik')
          .replace('Goals','Gol')
          .replace('Goal','Gol')
          .replace('Home','Evsahibi')
          .replace('Away','Deplasman')
          .replace('1st Half','1.Devre')
          .replace('2nd Half','2.Devre')
          .replace('or More','veya daha fazla')
          .replace('Odd','Tek')
          .replace('Even','Çift')
          .replace('Tie','Eşitlik')
          .replace('minutes','dakika')
          .replace('First','İlk')
          .replace('Last','Son')
          .replace('Over','Üst')
          .replace('Under','Alt')
          .replace('Yes','Evet')
          .replace(/No$/,'Hayır')
          .replace('more','Daha Fazla')
          item.label = oddoptions
        }) 
      })
      value.forEach(element => {
        element.bookmaker.data[0].odds.data.forEach(item => {
          if(item.total !== null){
            let oddoptions = item.total
            .replace('Score Draw','Skorda Beraberlik')
            .replace('No Goal','Gol Olmaz')
            item.total = oddoptions
          }
        }) 
      })
      value.forEach(element => {
        element.bookmaker.data[0].odds.data.forEach(item => {
          if(item.handicap !== null){
            let oddoptions = item.handicap
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('to','arası')
            .replace('more','fazlası')
            item.handicap = oddoptions
          }
        }) 
      })
    },
    searchFilter () {
      let searchArray = this.search.filter(item => item.lt.toLowerCase().indexOf(this.searchBox.toLowerCase()) === 0 || item.vt.toLowerCase().indexOf(this.searchBox.toLowerCase()) === 0)
      this.leagues = _.groupBy(searchArray, 'lid')
      this.leaguesLength = searchArray.length
    },
    filterAsDate() {
      if (this.dateBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'lid')
      } else {
        let temp = this.search.filter(item => moment(item.st).format('YYYY-MM-DD') === this.dateBox)
        this.leagues = _.groupBy(temp, 'lid')
        this.leaguesLength = temp.length
      }
    },
    filterAsTime() {
      if (this.timeBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'lid')
      } else {
        let temp = this.search.filter(item => moment(item.st).format('YYYY-MM-DD HH:mm').toString() >  moment().format('YYYY-MM-DD HH:mm') && moment(item.st).format('YYYY-MM-DD HH:mm').toString() < this.timeBox)
        this.leagues = _.groupBy(temp, 'lid')
        this.leaguesLength = temp.length
      }
    },
    addSlip (rate, option, sublist, games, handikap, total) {
      this.selectedId = true
      let hc = ''
      let to = ''
      let code = ''
      let match = ''
      if (sublist === '') {
        code = this.code
      } else {
        code = sublist.id
      }
      if (this.subSlip) {
        match = this.teamName
      } else {
        match = sublist.lt +'-'+ sublist.vt
      }
      if(handikap !== null && handikap !== undefined){
        hc = handikap
      }
      if(total !== null && total !== undefined){
        to = total
      }
      if (rate !== '-') {
        this.slips = {
          betid:0,
          code: code.toString().slice(-3),
          user: this.$store.state.auth.user,
          admin: this.$store.state.auth.admin,
          superadmin: this.$store.state.auth.superadmin,
          match: match,
          games: games,
          option: option +' '+ hc +' '+ to,
          rate: rate,
          stream: 'Bülten',
          state: 'Aktif',
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
            this.$store.commit('removeSlipItem', t)
            setTimeout(() => {
              this.$store.commit('setSlips', this.slips)
            }, 100)
          }
        } else {
          this.$store.commit('setSlips', this.slips)
        }
        }, 50)
      }
    }
  },
  beforeDestroy: function(){
    clearInterval(this.intervalLeagueList)
  }
}
</script>
