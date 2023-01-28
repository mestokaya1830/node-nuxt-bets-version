<template>
  <div class="pages main-page" id="content">
    <aside class="left">
      <div class="title-2">
        <div class="live-logo-con">
          <span><i class="fas fa-bolt navbar-icons cl-y navbar-icons" />BASKETBOL</span>
          <i class="fas fa-adjust navbar-icons ml10 cp" @click="isLeagueOpen = ! isLeagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-o">{{liveListLength}}</span>
      </div>
      <div class="left-con">
        <div class="sblc">
          <input type="search" v-model="searchBox" @input="searchFilter()" class="searchbox-left" placeholder="ara...">
          <i class="fa fa-search fa-lg cl-o sbi cp" @click="searchFilter()"/>
        </div>
         <details :open="isLeagueOpen" class="live-details" v-for="(list, index) in liveList" :key="index">
          <summary class="title-3">
            <span class="flag-con">
              <img :src="getFlags(list[0].RegionName)" class="mr5">
              <span class="left-links-text">{{list[0].RegionName}} {{String(list[0].LeagueName).slice(0,15)}}</span>
            </span>
          </summary>
          <div v-for="(sublist, index) in filterBy(list, searchBox)" :key="index" @click="setTop(),getLiveOdds(sublist)" class="live-list soccer">
            <div class="left-list-con bg-o">
              <span class="llit">
                <span>{{String(sublist.HomeTeam).slice(0,30)}}</span>
                <span>{{String(sublist.AwayTeam).slice(0,30)}}</span> 
              </span>
              <div class="left-list-items cl-y">
                <span v-if="sublist.Scoreboard.period === 'Q1'">1.Çeyrek</span>
                <span v-if="sublist.Scoreboard.period === 'Q2'">2.Çeyrek</span>
                <span v-if="sublist.Scoreboard.period === 'Q3'">3.Çeyrek</span>
                <span v-if="sublist.Scoreboard.period === 'Q4'">4.Çeyrek</span>
                <span v-if="sublist.Scoreboard.period === 'Halftime'">Devre Arası</span>
                <span>{{sublist.Scoreboard.indicator}}</span>
                <span>{{sublist.Scoreboard.score}}</span>
              </div>
            </div>
          </div>
        </details>
        <div class="page-end mt5"><span>Başka veri yoktur</span></div>
      </div>
    </aside>
    <div class="odd-center">
      <div class="title-2">
        <span>
          <i class="fas fa-futbol navbar-icons cl-g navbar-icons"/>CANLI PANO
          </span>
      </div>
      <div class="odd-center-con">
        <div v-if="isLiveBet" class="live-center-bet">
          <div  class="center-bet">
            <div class="center-panel po-r">
              <div class="scores-board cp" @click="isEventBoard = ! isEventBoard">
                <span class="sbnh">{{String(liveOddsEvent.HomeTeam).slice(0,25)}}</span>
                <div class="sbc">
                  <span class="sbt" v-if="liveOddsEvent.Scoreboard">{{liveOddsEvent.Scoreboard.score}}</span>
                </div>
                <span class="sbna">{{String(liveOddsEvent.AwayTeam).slice(0,25)}}</span>
              </div>
              <div class="center-header" v-if="liveOddsEvent.Scoreboard">
                <span class="match-minutes cl-y"><img src="~/assets/img/bars.svg" class="live-timer"/>
                  <span v-if="liveOddsEvent.Scoreboard.period === 'Q1'">1.Çeyrek</span>
                  <span v-if="liveOddsEvent.Scoreboard.period === 'Q2'">2.Çeyrek</span>
                  <span v-if="liveOddsEvent.Scoreboard.period === 'Q3'">3.Çeyrek</span>
                  <span v-if="liveOddsEvent.Scoreboard.period === 'Q4'">4.Çeyrek</span>
                  <span v-if="liveOddsEvent.Scoreboard.period === 'Halftime'">Devre Arası</span>
                  <span class="ml20">{{liveOddsEvent.Scoreboard.indicator}}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="live-suboptions">
            <header class="title-2">
              <i class="fas fa-adjust navbar-icons ml10 cp cl-w" @click="isMarketOpen = ! isMarketOpen" title="Aç Kapa"/>
              <span class="badge bg-o ml20" v-if="activeItem === 'all'">{{allOddsLength}}</span>
              <span class="badge bg-o ml20" v-else>{{partOddsLength}}</span>
            </header>
            <div class="scores-statistics-con">
              <div class="tab-container">
                <ul class="nav nav-tabs nav-justified">
                  <li class="nav-item bg-o">
                    <a class="nav-link nll" @click.prevent="setActive('all')" :class="{ active: isActive('all') }" href="#all">Hepsi</a>
                    <a class="nav-link nll" @click.prevent="setActive('firsthalf'),getFirstHalf()" :class="{ active: isActive('firsthalf') }" href="#firsthalf">İlk Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('secondhalf'),getSecondHalf()" :class="{ active: isActive('secondhalf') }" href="#firsthalf">İkinci Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('querter'),getQuerter()" :class="{ active: isActive('querter') }" href="#querter">Çeyrekler</a>
                    <i class="fas fa-adjust navbar-icons ml10 cp cl-w" @click="isMarketOpen = ! isMarketOpen" title="Aç Kapa"/>
                  </li>
                </ul>
                <div class="tab-pane po-r" :class="{ activeshow: isActive('all') }" id="all">
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(liveOdds,'name.value')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name.value}}</span>
                            <!-- <span class="cl-g">{{oddsname.templateId}}</span> -->
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 17592}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane po-r" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(firstHalf,'name.value')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name.value}}</span>
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 17592}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane po-r" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(secondHalf,'name.value')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name.value}}</span>
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 17592}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane po-r" :class="{ activeshow: isActive('querter') }" id="secondhalf">
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(querter,'name.value')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name.value}}</span>
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 17592}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
            </div>
          </div> 
        </div> 
        <div v-else class="center-no-bet ">
          <h3 class="mt20">Henüz Bir Karşılaşma Seçmediniz..</h3>
        </div>
      </div>
        <notfound v-if="notfound" :message="notfound" class="not-found"/>
    </div>
    <aside class="right-side">
      <slipside class="slip-side" :branchimage="branchimage"/>
    </aside>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import moment from 'moment'
import marketsjson from '../../basketinplaymarkets.json'
import {apimixin} from '../../mixins/api'
export default {
  mixins: [Vue2Filters.mixin,apimixin('x')],
  name: 'Basketinplay',
  components: {
    slipside
  },
  data () {
    return {
      liveList: {},
      liveOdds: {},
      liveEvents: {},
      liveOddsEvent: {},
      liveListLength: null,
      allOddsLength:null,
      partOddsLength:null,
      slips: [],
      searchBox: null,
      totalRate: 1,
      activeItem: 'all',
      notfound: null,
      markets: marketsjson,
      branchimage: 'basketlive',
      intervalLiveList: null,
      intervalLiveOdds: null,
      slips: {},
      isEventBoard: false,
      isLiveBet: false,
      isBetSlip: false,
      isSiteOpen: true,
      isSlipScore: false,
      isLeagueOpen: true,
      isMarketOpen: true,
      isScrollTop: false,
      fullTime: [],
      firstHalf: [],
      secondHalf: [],
      querter: [],
      totalRate: 1,
    }
  },
  mounted () {
   this.getLive()
    this.intervalLiveList = setInterval(() => {
      this.getLive()
    }, 30 * 1000)
  },
  filters:{
    convertOdd (value, store) {
      if (store) {
        let item = store.find(item => item.type === 'balr')
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
  beforeDestroy: function(){
    clearInterval(this.intervalLiveList)
    clearInterval(this.intervalLiveOdds)
  },
  methods: {
    async getLive() {
      let final = {}
      let lid = 0
      await axios.get("/api/home/basketinplay").then((result) => {
        const mainfilter = result.data.filter(item1 =>  !item1.LeagueName.includes('E-Spor'))
        if (localStorage.getItem('set')) {
            const ls = JSON.parse(localStorage.getItem('set'))
            lid = ls.map(item => {
              if (item && item.type === 'bai') {
                return {filterid:item.filterid}
              }else{return 0}
            })
          final = mainfilter.filter(item1 => !lid.some(item2 => (item2.filterid === item1.LeagueId)))
        }else{
          final = mainfilter
        }
        this.liveList = _.groupBy(final,'LeagueId')
        this.search = final
        this.liveListLength = final.length
        this.suspendBet = final.map(item => {
          return {
            id:String(item.Id).slice(-3),
            score:item.HomeTeam +'-'+ item.AwayTeam
          }
        })
        this.transCountries(final)
      })
    },
    getLiveOdds(value) {
      this.liveOdds = {}
      this.liveEvents = value
      this.isLiveBet = true
      if (this.isScrollTop) {
        this.goTop()
        this.setActive ('all')
        this.isScrollTop = false
      }
      if (this.isLiveBet) {
        this.liveOddsFunc()
        this.intervalLiveOdds = setInterval(() => {
          this.liveOddsFunc()
        }, 9 * 1000)
      }
    },
    async liveOddsFunc(){
      let final= {}
      const d = new Date()
      let mid = 0
      let newlimit = 30
      await axios.get(`/api/home/inplayodds/${this.liveEvents.Id}`).then((result) => {
        this.liveOddsEvent = result.data[0]
        if (localStorage.getItem('set')) {
          const ls = JSON.parse(localStorage.getItem('set'))
          const lt = ls.find(item => item.type === 'ball')
          if (lt) {
            newlimit = lt.rate
          }
          mid = ls.map(item => {
            if (item && item.type === 'baim') {
              return {filterid:item.filterid}
            }else{return 0}
          })
          const filteredodds = result.data[0].Markets.filter(item1 => { return !mid.some(item2 => (item2.filterid === item1.templateId))})
          final = filteredodds.map(item => {
            return{
              id:item.id,
              name:item.name,
              templateId:item.templateId,
              visibility:item.visibility,
              results:item.results.filter(item => {return item.visibility === 'Visible' && item.odds <= newlimit})
            }
          })
        }else{
          final = result.data[0].Markets.map(item => {
            return{
              id:item.id,
              name:item.name,
              templateId:item.templateId,
              visibility:item.visibility,
              results:item.results.filter(item => {return item.visibility === 'Visible' && item.odds <= newlimit})
            }
          })
        }
        this.liveOdds = final
        this.allOddsLength = final.length
        final.forEach(item => {
          this.markets.forEach(item2 => {
            if (item.templateId === item2.id) {
             item.name.value = item2.name
            }
          })
        })
        this.transOdds(final)
        this.transMarkets(final)
      })
    },
    setTop(){
      this.isScrollTop = true
    },
    getTotalRate () {
      this.totalRate *= this.slips[0].rate
      this.totalRate =  this.totalRate.toFixed(2)
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    },
    goTop(){
      const el = document.getElementById('content')
      el.scrollIntoView()
    },
    getFullTime(){
      this.fullTime = []
      this.fullTime = this.liveOdds.filter(item => item.templateId === 17
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
      this.firstHalf = this.liveOdds.filter(item => item.name.value.includes('İlk Yarı'))
      this.partOddsLength = this.firstHalf.length
    },
    getSecondHalf(){
      this.secondHalf = []
      this.secondHalf = this.liveOdds.filter(item => item.name.value.includes('İkinci Yarı'))
      this.partOddsLength = this.secondHalf.length
    },
    getQuerter(){
      this.querter = []
      this.querter = this.liveOdds.filter(item => item.name.value.includes('Çeyrek'))
      this.partOddsLength = this.querter.length
    },
    searchFilter () {
      const searchArray = this.search.filter(item => item.HomeTeam.toLowerCase().includes(this.searchBox.toLowerCase()) || item.AwayTeam.toLowerCase().includes(this.searchBox.toLowerCase()))
      this.liveList = _.groupBy(searchArray, 'LeagueId')
      this.leaguesLength = searchArray.length
    },
    transMarkets(value){
        value.forEach(item => {
          if (item.name) {
            const Name = item.name.value
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
              .replace('Handicap','Handikap')
            item.name.value = Name
          }
        })
    },
    addSlip (rate,option,game,tid) {
      const match = this.liveEvents.HomeTeam +'-'+ this.liveEvents.AwayTeam
      let eventtime = ''
      if (!this.liveOddsEvent.Scoreboard.indicator) {
        if(this.liveOddsEvent.Scoreboard.period !== 'HalfTime'){
          eventtime = 'D- '+ this.liveOddsEvent.Scoreboard.period +' : S- '+ this.liveOddsEvent.Scoreboard.score
        }else{
          eventtime = 'D- '+ 'Devre' +' : S- '+ this.liveOddsEvent.Scoreboard.score
        }
      } else {
        eventtime = 'D-'+ this.liveOddsEvent.Scoreboard.indicator  +' : S-'+ this.liveOddsEvent.Scoreboard.score
      }
      setTimeout(() => {
        this.slips = {
          betid:0,
          code: String(this.liveEvents.Id).slice(-3),
          user: this.$store.state.auth.user,
          admin: this.$store.state.auth.admin,
          superadmin: this.$store.state.auth.superadmin,
          matches: match,
          games: game,
          options: option,
          rate: rate,
          stream: 'Canlı',
          state: 'Aktif',
          eventtime:eventtime,
          scoreid: this.liveEvents.Id,
          score:this.liveOddsEvent.Scoreboard.score,
          tid:tid
        }
        if (!this.$store.state.betslip){
          this.$store.commit('setBetSlip', true)
        }
        setTimeout(() => {
          let t = 0
          if (this.$store.state.slips.length > 0) {
          const test = this.$store.state.slips.find((item,index) =>{
            t = index
            return item.scoreid === this.liveEvents.Id
          })
          if (test === undefined) {
            this.$store.commit('setSlips', this.slips)
          }else{
            this.$store.commit('removeSlipItem', t)
            setTimeout(() => {
              this.$store.commit('setSlips', this.slips)
            }, 10)
          }
        } else {
          this.$store.commit('setSlips', this.slips)
        }
        }, 20)
      }, 30)
    }
  }
}
</script>