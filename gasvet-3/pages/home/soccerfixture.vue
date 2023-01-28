<template>
  <div class="pages main-page" id="content">  
    <div class="odd-center">
     <div class="title-2">
        <div class="filter-con">
          <div class="filter-icons-left">
            <span><i class="fas fa-futbol navbar-icons cl-g navbar-icons" />FUTBOL</span>
            <span class="badge bg-g ml10 mobil-length">{{leaguesLength}}</span>
            <i class="fas fa-adjust navbar-icons mobil-length cp" @click="isLeagueOpen =! isLeagueOpen" title="Aç Kapa"/>
            <input type="search" v-model="searchBox" @input="searchFilter()" class="searchbox-left searchbox-soccer" placeholder="ara...">
            <i class="fa fa-search fa-lg cl-g sbi cp" @click="searchFilter()"/>
          </div>
          {{getRateToggle}}
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
            <select v-model="dateBox" class="selectbox1" @change="getLeagues()">
              <option value="Bugün" disabled>Bugün</option>
              <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
              <option :value="$moment().add(1,'days').format('YYYY-MM-DD')">Yarın</option>
              <option :value="$moment().add(2,'days').format('YYYY-MM-DD')">Ertesi Gün</option>
              <option value="Hepsi">Hepsi</option>
            </select>
          </div>
          <i class="fas fa-globe fa-lg cp cl-g" @click="allLeagues()"/>
          <i class="fas fa-adjust navbar-icons desktop-length cp" @click="isLeagueOpen =! isLeagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-g mr10 ml10 desktop-length">{{leaguesLength}}</span>
      </div>
      <div class="odd-center-con">
        <div>
          <details :open="isLeagueOpen" class="odd-details cp" v-for="(list, index) in leagues" :key="index">
            <summary class="title-3 po-r">
              <div class="odd-left-title">
                <span class="flag-con">
                  <img :src="getFlags(list[0].RegionName)">
                  <span class="leag ml10">{{list[0].RegionName}} {{list[0].leaguename}}</span>
                  <!-- <span class="leag ml10">{{list[0].RegionName}} {{list[0].leaguename}} {{list[0].leagueid}}</span> -->
                </span>
                <span class="ottli-mbs">Mbs</span>
              </div>
              <div class="odd-right-title">
                <span class="ottli-title">1</span>
                <span class="ottli-title">X</span>
                <span class="ottli-title">2</span>
                <span class="ottli-title">Alt</span>
                <span class="ottli-title">Üst</span>
                <span class="ottli-title">Var</span>
                <span class="ottli-title">Yok</span>
              </div>
            </summary>
            <div class="list odd-list" v-for="(sublist, index) in list" :key="index">
              <div class="odd-left-list" @click="getOdds($event,sublist.fixtureid)">
                <span class="blli code"><span class="badge bg-f">{{String(sublist.fixtureid).slice(-3)}}</span></span>
                <span class="blli date">{{sublist.startdate | moment('MM-DD')}}</span>
                 <span class="blli time">{{$moment.utc(sublist.startdate).tz('Europe/Istanbul').format('HH:mm')}}</span>
                <span class="blli matches">{{ sublist.HomeTeam }} - {{ sublist.AwayTeam }}</span>
                <span class="mbslist">1</span>
              </div>
              <div class="odd-right-list-con">
                <div class="odd-right-list">
                  <div class="ottli rate-text" @click="addSlip(sublist.home, sublist.HomeTeam, sublist, 'Maç Bahsi')">{{sublist.home | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.draw, 'X', sublist, 'Maç Bahsi')">{{sublist.draw | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.away, sublist.AwayTeam, sublist, 'Maç Bahsi')">{{sublist.away | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.under, 'Alt 2.5', sublist, 'Toplam Gol Alt/Üst 2.5')">{{sublist.under | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.over, 'Üst 2.5', sublist, 'Toplam Gol Alt/Üst 2.5')">{{sublist.over | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.yes, 'Var', sublist, 'Karşılıklı Gol')">{{sublist.yes | convertOdd($store.state.newrate)}}</div>
                  <div class="ottli rate-text" @click="addSlip(sublist.no, 'Yok', sublist, 'Karşılıklı Gol')">{{sublist.no | convertOdd($store.state.newrate)}}</div>
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
      <div class="suboptions" >
        <header class="suboptions-header">
          <span class="soccer-left-header">
            <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
            <span class="badge bg-g ml20" v-if="activeItem === 'all'">{{allOddsLength}}</span>
            <span class="badge bg-g ml20" v-else>{{partOddsLength}}</span>
            <i class="fas fa-adjust navbar-icons cp" @click="isMarketOpen =! isMarketOpen" title="Aç Kapa"/>
          </span>
          <div>
            <h2>{{teamName}}</h2>
          </div>
          <i class="fas fa-window-close sub-close cp" @click="closeSub()"/>
        </header>
        <div class="suboptions-con ">
          <ul class="nav nav-tabs nav-justified">
            <li class="nav-item bg-f">
              <a class="nav-link nll" @click.prevent="setActive('all')" :class="{ active: isActive('all') }" href="#all">Hepsi</a>
              <a class="nav-link nll" @click.prevent="setActive('fulltime'), getFullTime()" :class="{ active: isActive('fulltime') }" href="#fulltime">Maç Bahsi</a>
              <a class="nav-link nll" @click.prevent="setActive('goals'), getGoals()" :class="{ active: isActive('goals') }" href="#goals">Alt/Üst</a>
              <a class="nav-link nll" @click.prevent="setActive('firsthalf'), getFirstHalf()" :class="{ active: isActive('firsthalf') }" href="#firsthalf">İlk Yarı</a>
              <a class="nav-link nll" @click.prevent="setActive('secondhalf'), getSecondHalf()" :class="{ active: isActive('secondhalf') }" href="#secondhalf">İkinci Yarı</a>
              <a class="nav-link nll" @click.prevent="setActive('home'), getHome()" :class="{ active: isActive('home') }" href="#home">Ev</a>
              <a class="nav-link nll" @click.prevent="setActive('away'), getAway()" :class="{ active: isActive('away') }" href="#away">Dep</a>
              <i class="fas fa-adjust navbar-icons ml10 cp cl-w" @click="isMarketOpen = ! isMarketOpen" title="Aç Kapa"/>
            </li>
          </ul>
          <div class="tab-container-sub po-r">
            <div class="tab-pane po-r" :class="{ activeshow: isActive('all') }" id="all">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(suboddsSort1, 'templateId')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value,'', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
                      <div class="odds-rate-con">
                        <span class="oddsrate mr5">{{oddsvalue.name.value}}</span>
                      </div>
                      <span class="oddsrate ml5 cl-r">{{oddsvalue.odds | convertOdd($store.state.newrate)}}</span>
                    </div>
                  </div>
                </details>
              </div>
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(suboddsSort2, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                        <!-- <span class="cl-r">{{oddsname.templateId}}</span> -->
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value,'', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(fullTime, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('goals') }" id="goals">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(goals, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(firstHalf, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(secondHalf, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('home') }" id="home">
              <div>
                <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(home, 'name.value')" :key="index">
                  <summary class="title-3 title-3-options mt2">
                    <div>
                      <header>
                        <i class="fas fa-shield-alt cl-g mr5"/>
                        <span>{{oddsname.name.value}}</span>
                      </header>
                    </div>
                  </summary>
                  <div class="subodds-list subodds-wrapperbwin">
                    <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
            <div class="tab-pane po-r" :class="{ activeshow: isActive('away') }" id="away">
                <div>
                  <details :open="isMarketOpen" v-for="(oddsname, index) in orderBy(away, 'name.value')" :key="index">
                    <summary class="title-3 title-3-options mt2">
                      <div>
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin">
                      <div class="subodds-wrapper prebwinfixture" v-for="(oddsvalue, index) in oddsname.results" :key="index" @click="addSlip(oddsvalue.odds, oddsvalue.name.value, '', oddsname.name.value,'','')" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 || oddsname.templateId === 4727 || oddsname.templateId === 4726 || oddsname.templateId === 4732 || oddsname.templateId === 4718 || oddsname.templateId === 17592}">
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
          </div>
        </div>
        <footer class="suboptions-footer"></footer>
      </div> 
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import marketsjson from '../../soccermarkets.json'
import {apimixin} from '../../mixins/api'
export default {
  mixins: [Vue2Filters.mixin, apimixin('x')],
  name: 'soccer',
  components: {
    slipside
  },
  data () {
    return {
      markets: marketsjson,
      leagues: {},
      subOdds: {},
      suboddsSort1:{},
      suboddsSort2:{},
      leaguesLength: 0,
      searchBox: null,
      timeBox: 'Saat',
      dateBox: moment().format('YYYY-MM-DD'),
      isSubOptions: false,
      notFound: false,
      isLoader: false,
      isSubloader: true,
      betSlip:false,
      branchimage: 'futbol',
      teamName:null,
      code:null,
      isLeagueOpen:true,
      isMarketOpen:true,
      slips: {},
      intervalLeagueList:null,
      lid:0,
      mid:0,
      activeItem: 'all',
      fullTime:[],
      firstHalf:[],
      secondHalf:[],
      home:[],
      away:[],
      goals:[],
      partOddsLength:0,
      allOddsLength:0,
      subTime:0
    }
  },
  mounted (){
    this.getLeagues()
    this.intervalLeagueList = setInterval(() => {
      this.getLeagues()
    }, 905 * 1000)
  },
  filters:{
    convertOdd (value, store) {
      if (store) {
        let item = store.find(item => item.type === 'sor')
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
  computed:{
    getRateToggle(){
      if(this.$store.state.ratetoggle){
        document.querySelectorAll('.rate-text').forEach(item => {
          item.classList.remove('bg-f')
        })
      }
    }
  },
  methods: {
    async getLeagues(){
      this.timeBox = 'Saat'
      this.isLoader = true
      this.notFound = false
      await axios.get(`/api/home/soccerfixture/${this.dateBox}`).then((result)=>{
        let filternow = result.data.filter(item => moment(item.startdate).tz('Europe/Istanbul').format('YYYY MM DD HH:mm') > moment().format('YYYY MM DD HH:mm'))
        if (filternow.length > 0) {
          this.leagues = _.groupBy(filternow, 'leagueid')
          this.search = filternow
          this.leaguesLength = filternow.length
          this.isLoader = false
          let fixtureid = filternow.map(item => item.fixtureid)
          this.$store.commit('setFixtureId', fixtureid)
        }else{
          this.leagues = {}
          this.notFound = true
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async getOdds (event,id) {
      this.isSubloader = true
      this.subOdds = {}
      this.teamName = null
      this.allOddsLength = null
      this.isSubOptions = true
      let mid = 0
      this.setActive ('all')
      await axios.get(`/api/home/soccerfixtureodds/${id}`).then((result)=>{
        if (result.data.length > 0) {
          let final = {}
          this.teamName = result.data[0].HomeTeam +' - '+ result.data[0].AwayTeam
          this.code = id
          this.subTime = result.data[0].Date
          if (localStorage.getItem('set')) {
            let ls = JSON.parse(localStorage.getItem('set'))
            mid = ls.map(item => {
              if (item && item.type === 'som') {
                return {filterid:item.filterid}
              }else{return 0}
            })
            this.subOdds = result.data[0].Markets.filter(item1 => { return !mid.some(item2 => (item2.filterid === item1.templateId))})
          }else{
            this.subOdds = result.data[0].Markets
          }
          this.subOdds.forEach(item => {
            this.markets.forEach(item2 => {
              if (item.templateId === item2.id || item.id === item2.id) {
                item.name.value = item2.name
              }
            })
          })
          this.transOdds(this.subOdds)
          this.allOddsLength = this.subOdds.length
          this.suboddsSort1 = this.subOdds.filter(item => item.templateId === 17 || item.templateId === 21 || item.templateId === 2488 || item.templateId === 3187 || item.templateId === 24392 || item.templateId === 20589 || item.templateId === 20592)
          this.suboddsSort2 = this.subOdds.filter(item => item.templateId !== 17 && item.templateId !== 21 && item.templateId !== 2488 && item.templateId !== 3187 && item.templateId !== 24392 && item.templateId !== 20589 && item.templateId !== 20592)
          this.isSubloader = false
        }
      }).catch(err => {console.log(err)})
      if (screen.width < 480 || navigator.userAgent.indexOf('iPhone') != -1) {
        this.goTop()
      }
    },
    async searchFilter () {
      if (this.searchBox) {
        this.dateBox = 'Hepsi'
        await axios.get(`/api/home/soccerfixturesearch/${this.searchBox}`).then((result)=>{
          if (result.data.length > 0) {
            this.leagues = _.groupBy(result.data, 'leagueid')
            this.search = result.data
            this.leaguesLength = result.data.length
          }else{
            this.leagues = {}
            this.notFound = true
          }
          this.isLoader = false
        }).catch(err => {console.log(err)})
      } else {
        this.dateBox = moment().format('YYYY-MM-DD')
        this.getLeagues()
      }
    },
    allLeagues(){
      this.dateBox = 'Hepsi'
      this.getLeagues()
    },
    closeSub() {
      this.isSubOptions = false
      this.loader = false
    },
    filterAsTime() {
      this.notFound = false
      if (this.timeBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'leagueid')
      } else {
        let temp = this.search.filter(item => moment(item.startdate).format('YYYY-MM-DD HH:mm').toString() >  moment().format('YYYY-MM-DD HH:mm') && moment(item.startdate).format('YYYY-MM-DD HH:mm').toString() < this.timeBox)
        console.log(temp.length)
        if (temp.length > 0) {
          this.leagues = _.groupBy(temp, 'leagueid')
          this.leaguesLength = temp.length
        } else {
          this.leagues = {}
          this.notFound = true
        }
      }
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    getFullTime(){
      this.fullTime = []
      this.fullTime = this.subOdds.filter(item => item.templateId === 17
        || item.templateId === 3187
        || item.templateId === 24392
        || item.templateId === 4665
        || item.templateId === 19193
        || item.templateId === 20590
        || item.templateId === 7824
        || item.templateId === 19508
        || item.templateId === 19509
        || item.templateId === 19510
        || item.templateId === 19511
        || item.templateId === 19512
      )
      this.partOddsLength = this.fullTime.length
    },
    getFirstHalf(){
      this.firstHalf = []
      this.firstHalf = this.subOdds.filter(item => item.name.value.includes('İlk Yarı'))
      this.partOddsLength = this.firstHalf.length
    },
    getSecondHalf(){
      this.secondHalf = []
      this.secondHalf = this.subOdds.filter(item => item.name.value.includes('İkinci Yarı'))
      this.partOddsLength = this.secondHalf.length
    },
    getHome(){
      this.home = []
      this.home = this.subOdds.filter(item => item.name.value.includes('Evsahibi'))
      this.partOddsLength = this.home.length
    },
    getAway(){
      this.away = []
      this.away = this.subOdds.filter(item => item.name.value.includes('Deplasman'))
      this.partOddsLength = this.away.length
    },
    getGoals(){
      this.goals = []
      this.goals = this.subOdds.filter(item => item.name.value.includes('Toplam Gol Alt/Üst'))
      this.partOddsLength = this.goals.length
    },
    addSlip (...args) {
      let rateclass = event.target.className
      let parent = event.target.parentElement
      event.target.classList.toggle('bg-f')
      parent.querySelectorAll('.bg-f').forEach(item => {
        item.classList.remove('bg-f')
        event.target.classList.add('bg-f')
      })
      this.$store.commit('setRateToggle', false)
      this.selectedId = true
      let hc = ''
      let to = ''
      let code = ''
      let match = ''
      if (args[2] === '') {
        code = this.code
      } else {
        code = args[2].fixtureid
      }
      if (args[2] === '') {
        match = this.teamName
      } else {
        match = args[2].HomeTeam +' - '+ args[2].AwayTeam
      }
      if(args[4] !== null && args[4] !== undefined){
        hc = args[4]
      }
      if(args[5] !== null && args[5] !== undefined){
        to = args[5]
      }
      let st = ''
      if (args[2]) {
        st = moment(args[2].startdate).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm')
        
      } else {
        st = moment(this.subTime).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm')
        
      }
      let betdate = st.substr(5,5)
      let bettime = st.slice(-5)
      setTimeout(() => {
        if (args[0] !== '-') {
          this.slips = {
            betid:0,
            code: String(code).slice(-3),
            user: this.$store.state.auth.user,
            admin: this.$store.state.auth.admin,
            superadmin: this.$store.state.auth.superadmin,
            matches: match,
            games: args[3],
            options: args[1] +''+ hc +''+ to,
            rate: args[0],
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
                return item.code === String(code).slice(-3)
              })
              if (test === undefined) {
                this.$store.commit('setSlips', this.slips)
              }else{
                if (rateclass === 'ottli rate-text bg-f') {
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
