<template>
  <div class="pages main-page" id="content">
    <aside class="left">
      <div class="title-2">
        <div class="live-logo-con">
          <span><i class="fas fa-bolt navbar-icons cl-y navbar-icons"/>FUTBOL</span>
          <i class="fas fa-adjust navbar-icons ml10 cp" @click="isLeagueOpen = ! isLeagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-g">{{liveListLength}}</span>
      </div>
      <div class="left-con">
        <div class="sblc">
          <input type="search" v-model="searchBox" @input="searchFilter()" class="searchbox-left" placeholder="ara...">
          <i class="fa fa-search fa-lg cl-g sbi cp" @click="searchFilter()"/>
        </div>
         <details :open="isLeagueOpen" class="live-details" v-for="(list, index) in liveList" :key="index">
          <summary class="title-3">
            <span class="flag-con">
              <img :src="getFlags(list[0].RegionName)" class="mr5">
              <span class="left-links-text">{{list[0].RegionName}} {{String(list[0].LeagueName).slice(0,15)}}</span>
              <!-- <span class="left-links-text">{{list[0].RegionName}} {{String(list[0].LeagueName).slice(0,15)}} {{list[0].LeagueId}}</span> -->
            </span>
          </summary>
          <div v-for="(sublist, index) in list" :key="index" @click="setTop(),getLiveOdds(sublist)" class="live-list soccer">
            <!-- <div class="left-list-con"> -->
            <div class="left-list-con" v-if="sublist.Scoreboard.period !== 'Finished'">
              <span class="llit">
                <span>{{sublist.HomeTeam}}</span>
                <span>{{sublist.AwayTeam}}</span> 
              </span>
              <div class="left-list-items cl-y">
                <span v-if="sublist.Scoreboard.period === '1H'">1.Devre</span>
                <span v-if="sublist.Scoreboard.period === 'Halftime'">Devre Arası</span>
                <span v-if="sublist.Scoreboard.period === '2H'">2.Devre</span>
                <span>{{sublist.Scoreboard.timer.base}} dk</span>
                <i class="fas fa-lock" v-if="checkLockTime(minute)"/>
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
              <div class="scores-board po-r cp" @click="isEventBoard = ! isEventBoard">
                <span class="sbnh">{{liveOddsEvent.HomeTeam}}</span>
                 <span class="sbs" v-if="liveOddsEvent.Scoreboard">{{liveOddsEvent.Scoreboard.score}}</span>
                <span class="sbna">{{liveOddsEvent.AwayTeam}}</span>
                <i class="fas fa-window-close event-close fa-lg" v-if="isEvent" @click="closeEvents()"/>
              </div>
              <div class="inplay-events-con" v-if="isEvent">
                <div class="inplay-events" v-if="inplayEvents">
                  <span class="mt5" v-for="(eventlist,index) in inplayEvents.events" :key="index">
                    <span>{{eventlist.text}}</span>
                  </span>
                </div>
                <span v-else>Veri Yok!</span>
              </div>
              <div class="center-header">
                <span class="match-minutes cl-y"><img src="~/assets/img/bars.svg" class="live-timer"/>{{minute}} dk</span>
                <span class="cp" @click="getEvents(liveOddsEvent.Id)">OLAYLAR</span>
              </div>
              <div class="stats">
                <div class="stats-title">
                  <span class="sti">Gol</span>
                  <span class="sti">Penaltı</span>
                  <span class="sti">Korner</span>
                  <span class="sti">Kımızı Kart</span>
                  <span class="sti">Sarı Kart</span>
                </div>
                <div class="stats-con">
                  <div class="sti">
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.score !== undefined">{{String(liveOddsEvent.Scoreboard.score).slice(0,1)}}</span>
                    <i class="fas fa-futbol fa-lg cl-g lcs-items-title" title="Goller"/>
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.score !== undefined">{{String(liveOddsEvent.Scoreboard.score).slice(-1)}}</span>
                  </div>
                  <div class="sti">
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.penalties !== undefined">{{liveOddsEvent.Scoreboard.penalties.player1['255']}}</span>
                    <i class="fas fa-futbol fa-lg cl-r lcs-items-title" title="Penaltılar"/>
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.penalties !== undefined">{{liveOddsEvent.Scoreboard.penalties.player2['255']}}</span>
                  </div>
                  <div class="sti">
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.corners !== undefined">{{liveOddsEvent.Scoreboard.corners.player1['255']}}</span>
                    <i class="fas fa-compress fa-lg cl-y lcs-items-title" title="Kornerler"/>
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.corners !== undefined">{{liveOddsEvent.Scoreboard.corners.player2['255']}}</span>
                  </div>
                  <div class="sti">
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.redCards !== undefined">{{liveOddsEvent.Scoreboard.redCards.player1['255']}}</span>
                    <i class="fas fa-file fa-lg cl-r lcs-items-title" title="Kırmızı Kartlar"/>
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.redCards !== undefined">{{liveOddsEvent.Scoreboard.redCards.player2['255']}}</span>
                  </div>
                  <div class="sti">
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.yellowCards !== undefined">{{liveOddsEvent.Scoreboard.yellowCards.player1['255']}}</span>
                    <i class="fas fa-file fa-lg cl-y lcs-items-title" title="Sarı Kartlar"/>
                    <span class="stats-item" v-if="liveOddsEvent.Scoreboard && liveOddsEvent.Scoreboard.yellowCards !== undefined">{{liveOddsEvent.Scoreboard.yellowCards.player2['255']}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="live-lock" v-if="checkLockTime(minute)">
            <i class="fas fa-lock fa-4x" />
          </div>
          <div v-else class="live-suboptions">
            <header class="title-2">
              <div>
                <i class="fas fa-adjust navbar-icons ml10 cp cl-w" @click="isMarketOpen = ! isMarketOpen" title="Aç Kapa"/>
              </div>
              <span class="badge bg-g ml20" v-if="activeItem === 'all'">{{allOddsLength}}</span>
              <span class="badge bg-g ml20" v-else>{{partOddsLength}}</span>
            </header>
            <div class="scores-statistics-con">
              <div class="tab-container">
                <ul class="nav nav-tabs nav-justified">
                  <li class="nav-item soccer">
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
                <div class="tab-pane po-r" :class="{ activeshow: isActive('all') }" id="all">
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(liveoddsSort1,'templateId')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-g mr5"/>
                            <span>{{oddsname.name.value}}</span>
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div>
                    <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(liveoddsSort2,'name.value')" :key="index">
                      <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-g mr5"/>
                            <span>{{oddsname.name.value}}</span>
                            <!-- <span class="cl-y">{{oddsname.templateId}}</span> -->
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                      </summary>
                      <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                        <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                          <span class="oddsrate">{{oddslist.name.value}}</span>
                          <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(fullTime,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.TemplateId === 4733 || oddsname.TemplateId === 19193 || oddsname.TemplateId === 4734 ||oddsname.TemplateId === 4727 || oddsname.TemplateId === 4732 || oddsname.TemplateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(firstHalf,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(secondHalf,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('home') }" id="home">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(home,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('away') }" id="away">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(away,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin"  v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('goals') }" id="goals">
                  <details :open="isMarketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(goals,'name.value')" :key="index">
                    <summary class="title-3" :class="{suspendColor:oddsname.visibility === 'Suspended'}">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name.value}}</span>
                        </header>
                      </div>
                      <span class="suspendClass" v-if="oddsname.visibility === 'Suspended'">Askıda</span>
                    </summary>
                    <div class="subodds-list subodds-wrapperbwin" v-if="oddsname.visibility === 'Visible'">
                      <div class="subodds-wrapper prebwin"  v-for="(oddslist, index) in oddsname.results" :key="index" :class="{liveClass4:oddsname.templateId === 4720 || oddsname.templateId === 4721 || oddsname.templateId === 26644 || oddsname.templateId === 4733 || oddsname.templateId === 19193 || oddsname.templateId === 4734 ||oddsname.templateId === 4727 || oddsname.templateId === 4732 || oddsname.templateId === 4718}" @click="addSlip(oddslist.odds,oddslist.name.value,oddsname.name.value,oddsname.templateId)">
                        <span class="oddsrate">{{oddslist.name.value}}</span>
                        <span class="oddsrate cl-r">{{oddslist.odds | convertOdd($store.state.newrate)}}</span>
                      </div>
                    </div>
                  </details>
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
import notfound from '@/components/notfound'
import moment from 'moment'
import marketsjson from '../../soccerinplaymarkets.json'
import {apimixin} from '../../mixins/api'
export default {
  mixins: [Vue2Filters.mixin, apimixin('x')],
  name: 'Soccerinplay',
  components: {
    slipside,
    notfound
  },
  data () {
    return {
      liveList: {},
      liveOdds: {},
      liveoddsSort1:{},
      liveoddsSort2:{},
      liveOddsEvent: {},
      liveEvents: {},
      liveListLength: null,
      allOddsLength:null,
      partOddsLength:null,
      slips: [],
      searchBox: null,
      totalRate: 1,
      activeItem: 'all',
      notfound: null,
      markets: marketsjson,
      branchimage: 'live',
      intervalLiveList: null,
      intervalLiveOdds: null,
      slips: {},
      fullTime: [],
      firstHalf: [],
      secondHalf: [],
      home: [],
      away: [],
      goals: [],
      totalRate: 1,
      minute:0,
      ls:null,
      inplayEvents:{},
      isEventBoard: false,
      isLiveBet: false,
      isBetSlip: false,
      isSiteOpen: true,
      isSlipScore: false,
      isLeagueOpen: true,
      isMarketOpen: true,
      isScrollTop: false,
      isEvent:false
    }
  },
  mounted () {
    this.getLive()
    this.intervalLiveList = setInterval(() => {
      this.getLive()
    }, 60 * 1000)
  },
  filters:{
    convertOdd (value, store) {
      if (store) {
        let item = store.find(item => item.type === 'solr')
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
      let d = new Date()
      let lid = 0
      await axios.get("/api/home/soccerinplay").then((result) => {
        const mainfilter = result.data.filter(item =>  !item.LeagueName.includes('eSoccer') && !item.LeagueName.includes('Price Boost') && !item.LeagueName.includes('Enhanced Accas'))
        if (localStorage.getItem('set')) {
          const ls = JSON.parse(localStorage.getItem('set'))
          lid = ls.map(item => {
            if (item && item.type === 'soi') {
              return {filterid:item.filterid}
            }else{return 0}
          })
          final = mainfilter.filter(item1 => !lid.some(item2 => (item2.filterid === item1.LeagueId) && !item1.LeagueName.includes('Kosta')))
        }else{
          final = mainfilter
        }
        final.forEach(item => {
          if (item.Scoreboard.period === '1H') {
            const x = new Date(moment.utc(item.Scoreboard.timer.base).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm:ss'))
            item.Scoreboard.timer.base = ((d.getTime() - x.getTime())/60000).toFixed(0)
          }else if(item.Scoreboard.period === '2H'){
            const x = new Date(moment.utc(item.Scoreboard.timer.base).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm:ss'))
            item.Scoreboard.timer.base = ((d.getTime() - x.getTime())/60000  + parseInt(45)).toFixed(0)
          }else{
            item.Scoreboard.timer.base = null
          }
        })
        this.liveList = _.groupBy(final,'LeagueId')
        this.search = final
        this.liveListLength = final.length
        this.transCountries(result.data)
      }).catch(err => {console.log(err)})
    },
    getLiveOdds(value) {
      this.liveOdds = {}
      this.liveEvents = value
      this.isLiveBet = true
      this.isEvent = false
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
      let d = new Date()
      let mid = 0
      let newlimit = 30
      await axios.get(`/api/home/inplayodds/${this.liveEvents.Id}`).then((result) => {
        this.liveOddsEvent = result.data[0]
        var defaultfilter = result.data[0].Markets.filter(item => !item.name.value.includes('Scorecast') && !item.name.value.includes('Star Player') && item.templateId !== 509 && item.templateId !== 11474 && item.templateId !== 12121 && item.templateId !== 16450 && item.templateId !== 16451 && !item.name.value.includes('Yellow Card') && !item.name.value.includes('Goalscorer') && !item.name.value.includes('between') && !item.name.value.includes('Race to')  && item.templateId !== 22505 && item.templateId !== 12120 && item.templateId !== 16986 && item.templateId !== 3912 && item.templateId !== 20590 && item.templateId !== 1328 && item.templateId !== 19976)
        if (localStorage.getItem('set')) {
          const ls = JSON.parse(localStorage.getItem('set'))
          const lt = ls.find(item => item.type === 'soll')
          if (lt) {
            newlimit = lt.rate
          }
          mid = ls.map(item => {
            if (item && item.type === 'soim') {
              return {filterid:item.filterid}
            }else{return 0}
          })
          const filteredodds = defaultfilter.filter(item1 => { return !mid.some(item2 => (item2.filterid === item1.templateId))})
          this.liveOdds = filteredodds.map(item => {
            return{
              id:item.id,
              name:item.name,
              templateId:item.templateId,
              visibility:item.visibility,
              results:item.results.filter(item => {return item.visibility === 'Visible' && item.odds <= newlimit})
            }
          })
        }else{
          this.liveOdds = defaultfilter.map(item => {
            return{
              id:item.id,
              name:item.name,
              templateId:item.templateId,
              visibility:item.visibility,
              results:item.results.filter(item => {return item.visibility === 'Visible' && item.odds <= newlimit})
            }
          })
        }
        this.allOddsLength = this.liveOdds.length
        defaultfilter.forEach(item => {
          this.markets.forEach(item2 => {
            if (item.templateId === item2.id) {
             item.name.value = item2.name
            }
          })
        })
        if (result.data[0].Scoreboard.period && result.data[0].Scoreboard.period === '1H') {
            const x = new Date(moment.utc(result.data[0].Scoreboard.timer.base).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm:ss'))
            this.minute = ((d.getTime() - x.getTime())/60000).toFixed(0)
          }else if(result.data[0].Scoreboard.period && result.data[0].Scoreboard.period === '2H'){
            const x = new Date(moment.utc(result.data[0].Scoreboard.timer.base).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm:ss'))
            this.minute = ((d.getTime() - x.getTime())/60000  + parseInt(45)).toFixed(0)
          }else if(result.data[0].Scoreboard.period && result.data[0].Scoreboard.period === 'Halftime'){
            this.minute = 'Devre Arası'
          }else{this.minute = 'Bitti'}
        this.transOdds(this.liveOdds)
        this.transMarkets(this.liveOdds)
        this.liveoddsSort1 = this.liveOdds.filter(item => item.templateId === 17 || item.templateId === 21 || item.templateId === 2488 || item.templateId === 3187 || item.templateId === 24392 || item.templateId === 20589 || item.templateId === 20592)
        this.liveoddsSort2 = this.liveOdds.filter(item => item.templateId !== 17 && item.templateId !== 21 && item.templateId !== 2488 && item.templateId !== 3187 && item.templateId !== 24392 && item.templateId !== 20589 && item.templateId !== 20592)
      }).catch(err => {console.log(err)})
    },
    async getEvents(id){
      this.isEvent = true
      await axios.get(`/api/home/scores/${id}`).then((result) => {
        if (result.data[0]) {
          this.inplayEvents = result.data[0]
          this.transEvent(result.data[0].events)
        }
      }).catch(err => {console.log(err)})
    },
    closeEvents(){
      this.isEvent = false
    },
    transEvent(value){
      if (value) {
        value.forEach(item => {
          const text = item.text
            .replace('st','.')
            .replace('nd','.')
            .replace('rd','.')
            .replace('th','.')
            .replace('Throw Ins','Taç Atışı')
            .replace('Free Kicks','Serbest Vuruş')
            .replace('Penalty','Penaltı')
            .replace('Race to','Yarış')
            .replace('Goals','Goller')
            .replace('Goal','Gol')
            .replace('Gol Kicks','Gol Vuruşu')
            .replace('Sub.itution','Oyuncu Degişimi')
            .replace('Corner','Korner')
            .replace('Korners','Kornerler')
            .replace('Yellow Ca','Sarı Kart')
            .replace('Red Ca','Kırmızı Kart')
            .replace('Score After Fir. Half','İlk Yarı Sonucu')
            .replace('Score After Full Time','Maç Bahsi')
          item.text = text
        })
      }
    },
    searchFilter () {
      const searchArray = this.search.filter(item => item.HomeTeam.toLowerCase().includes(this.searchBox.toLowerCase()) || item.AwayTeam.toLowerCase().includes(this.searchBox.toLowerCase()))
      this.liveList = _.groupBy(searchArray, 'LeagueId')
      this.liveListLength = searchArray.length
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
    checkLockTime(value){
      if (this.$store.state.time.ilkcbk !== 0 && value <= 45 && value > this.$store.state.time.ilkcbk) {
        return  true
      } else if(this.$store.state.time.ikicbk !== 0 && value > this.$store.state.time.ikicbk) {
        return true
      }else{return false}
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
    getHome(){
      this.home = []
      this.home = this.liveOdds.filter(item => item.name.value.includes('Evsahibi'))
      this.partOddsLength = this.home.length
    },
    getAway(){
      this.away = []
      this.away = this.liveOdds.filter(item => item.name.value.includes('Deplasman'))
      this.partOddsLength = this.away.length
    },
    getGoals(){
      this.goals = []
      this.goals = this.liveOdds.filter(item => item.name.value.includes('Toplam Gol Alt/Üst'))
      this.partOddsLength = this.goals.length
    },
    addSlip (rate,option,game,tid) {
      const match = this.liveEvents.HomeTeam +' - '+ this.liveEvents.AwayTeam
      if (this.minute === 'Devre Arası') {
        this.minute = 'DA'
      }
      if (this.minute !== 'Bitti') {
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
            eventtime:'D-' + this.minute +' : S-'+ this.liveOddsEvent.Scoreboard.score,
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
}
</script>