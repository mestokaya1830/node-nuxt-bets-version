<template>
  <div class="pages main-page" id="content">
    <aside class="left">
      <div class="title-2">
        <div class="live-logo-con">
          <span><i class="fas fa-futbol navbar-icons cl-g navbar-icons"/>FUTBOL</span>
          <i class="fas fa-adjust navbar-icons ml10 cp" @click="leagueOpen = ! leagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-g">{{liveListLength}}</span>
      </div>
      <div class="left-con">
        <div class="sblc"><input type="search" v-model="searchBox" @keyup="searchFilter()" class="searchbox-left" placeholder="ara..."></div>
         <details :open="leagueOpen" class="live-details" v-for="(list, index) in liveList" :key="index">
          <summary class="title-3">
            <span class="flag-con">
              <img :src="getFlags(list[0].league_country_name)" class="mr5">
              <span class="left-links-text">{{list[0].league_country_name}} {{list[0].league_name}}</span>
            </span>
          </summary>
          <div v-for="(sublist, index) in filterBy(list, searchBox)" :key="index" @click="setTop(),getLiveOdds(sublist)" class="live-list soccer">
            <div class="left-list-con">
              <span class="llit">
                <span>{{sublist.localTeam}}</span>
                <span>{{sublist.visitorTeam}}</span> 
              </span>
              <div class="left-list-items cl-y">
                <span>{{ sublist.time_status}}</span>
                <span>{{ sublist.time_minute}} dk</span>
                <span>{{sublist.localteam_score}} - {{sublist.visitorteam_score}}</span>
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
        <div v-if="liveBet" class="live-center-bet">
          <div  class="center-bet">
            <div class="center-panel po-r">
              <div class="scores-board cp" @click="eventBoard = ! eventBoard">
                <span class="sbnh">{{liveEvents.localTeam}}</span>
                <div class="sbc">
                  <span class="sbs">{{liveEvents.localteam_score}}</span>
                  <span class="sbt"></span>
                  <span class="sbs">{{liveEvents.visitorteam_score}}</span>
                </div>
                <span class="sbna">{{liveEvents.visitorTeam}}</span>
              </div>
              <div v-if="eventBoard" class="scores-board live-events">
                <div class="lii-con" v-if="liveEvents.goals.data.length > 0">
                  <div class="lii" v-for="(eventgoals,index) in liveEvents.goals.data" :key="index">
                    <span class="sep">{{eventgoals.player_name}}</span>
                    <span>{{eventgoals.minute}} dk</span>
                    <span>{{eventgoals.result}}</span>
                  </div>
                </div>
                <span class="lii" v-else>Henüz Bilgiler Güncellenmedi</span>
              </div>
               <div class="center-header">
                <span class="match-minutes cl-y"><img src="~/assets/img/bars.svg" class="live-timer"/>{{liveEvents.time_minute}} dk</span>
              </div>
              <div class="center-stats">
                <div class="lcs-con">
                  <span class="lcs1">OLAYLAR</span>
                  <i class="fas fa-compress fa-lg cl-y lcs-items-title" title="Kornerler"/>
                  <i class="fas fa-file fa-lg cl-y lcs-items-title" title="Sarı Kartlar"/>
                  <i class="fas fa-file fa-lg cl-r lcs-items-title" title="Kırmızı Kartlar"/>
                  <i class="fas fa-futbol fa-lg cl-r lcs-items-title" title="Penaltılar"/>
                  <i class="fas fa-futbol fa-lg cl-g lcs-items-title" title="Goller"/>
                </div>
                <div class="lcs-con lcs-con-center" v-if="liveEvents.stats.data[0]">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-g mr10"/>{{liveEvents.localTeam}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[0].corners}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[0].yellowcards}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[0].redcards}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[0].penalties}}</span>
                  <span class="lcs-items">{{liveEvents.localteam_score}}</span>
                </div>
                <div class="lcs-con" v-if="liveEvents.stats.data[1]">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-r mr10"/>{{liveEvents.visitorTeam}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[1].corners}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[1].yellowcards}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[1].redcards}}</span>
                  <span class="lcs-items">{{liveEvents.stats.data[1].penalties}}</span>
                  <span class="lcs-items">{{liveEvents.visitorteam_score}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="live-lock" v-if="$store.state.auth.role === 'U1' && checkMinute">
            <i class="fas fa-lock fa-4x" />
          </div>
          <div v-else class="live-suboptions">
            <header class="title-2">
              <div>
                <div class="flag-con">
                  <img :src="getFlags(liveEvents.league_country_name)" class="mr10">
                  <span>{{liveEvents.localTeam}}</span>
                  <span>-</span>
                  <span>{{liveEvents.visitorTeam}}</span>
                </div>
              </div>
              <span class="badge bg-g ml20" v-if="activeItem === 'all'">{{liveOdds.length}}</span>
              <span class="badge bg-g ml20" v-else>{{liveOddsLength}}</span>
            </header>
            <div class="scores-statistics-con">
              <div class="tab-container">
                <ul class="nav nav-tabs nav-justified">
                  <li class="nav-item soccer">
                    <a class="nav-link nll" @click.prevent="setActive('all')" :class="{ active: isActive('all') }" href="#all">Hepsi</a>
                    <a class="nav-link nll" @click.prevent="setActive('fulltime'), getFullTime()" :class="{ active: isActive('fulltime') }" href="#fulltime">Maç Sonu</a>
                    <a class="nav-link nll" @click.prevent="setActive('firsthalf'), getFirstHalf()" :class="{ active: isActive('firsthalf') }" href="#firsthalf">İlk Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('secondhalf'), getSecondHalf()" :class="{ active: isActive('secondhalf') }" href="#secondhalf">İkinci Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('goals'), getGoals()" :class="{ active: isActive('goals') }" href="#goals">Goller</a>
                    <i class="fas fa-adjust navbar-icons ml10 cp cl-w" @click="marketOpen = ! marketOpen" title="Aç Kapa"/>
                  </li>
                </ul>
                <div class="tab-pane po-r" :class="{ activeshow: isActive('all') }" id="all">
                  <div>
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in orderBy(liveOdds,'market_id')" :key="index">
                      <summary class="title-3" v-if="oddsname.values">
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-g mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                          <span class="suspendClass" v-if="oddsname.values[0].suspend">Askıda</span>
                      </summary>
                      <div class="subodds-list po-r" :class="{liveClass1:oddsname.market_id === 1 || oddsname.market_id === 28076 || oddsname.market_id === 136703821 || oddsname.market_id === 63 || oddsname.market_id === 31355 || oddsname.market_id === 136703823 || oddsname.market_id === 1256989855 || oddsname.market_id === 136706307 || oddsname.market_id === 1265634165 || oddsname.market_id === 1265634178 || oddsname.market_id === 28077 || oddsname.market_id === 28085 || oddsname.market_id === 28086 || oddsname.market_id === 28088 || oddsname.market_id === 28098 || oddsname.market_id === 28099 || oddsname.market_id === 28182 || oddsname.market_id === 976105 || oddsname.market_id === 136703860 || oddsname.market_id === 136703823 || oddsname.market_id === 31369 || oddsname.market_id === 28182 || oddsname.market_id === 31379 || oddsname.market_id === 136703863 || oddsname.market_id === 136706561 || oddsname.market_id === 136703868  || oddsname.market_id === 136703842 || oddsname.market_id === 1265634183 || oddsname.market_id === 136696391 || oddsname.market_id === 136703836 || oddsname.market_id === 975903 || oddsname.name && oddsname.name.match(/\d\.\sGol/)  || oddsname.market_id === 28100 || oddsname.market_id === 28101}">
                        <div class="subodds-wrapper"  v-for="(oddslist, index) in orderBy(oddsname.values,'handicap')" :key="index" :class="{dis:oddslist.suspend, liveClass3: oddsname.market_id === 1 || oddsname.market_id === 63 || oddsname.market_id === 28076 || oddsname.market_id === 136703823 || oddsname.market_id === 31355 || oddsname.market_id === 136703823 || oddsname.market_id === 1256989855 || oddsname.market_id === 136706307 || oddsname.market_id === 1265634165 || oddsname.market_id === 1265634178 || oddsname.market_id === 28182 || oddsname.market_id === 136703842 || oddsname.name && oddsname.name.match(/\d\.\sGol/), liveClass2:oddsname.market_id === 28077 || oddsname.market_id === 136703860 || oddsname.market_id === 136703821 || oddsname.market_id === 31369 || oddsname.market_id === 28085 || oddsname.market_id === 28086 || oddsname.market_id === 28088 || oddsname.market_id === 28098 || oddsname.market_id === 28099 || oddsname.market_id === 31379 || oddsname.market_id === 975903 || oddsname.market_id === 136703836 || oddsname.market_id === 136696391 || oddsname.market_id === 136703863 || oddsname.market_id === 136706561 || oddsname.market_id === 136703868 || oddsname.market_id === 1265634183 || oddsname.market_id === 976105,liveClass4: oddsname.market_id === 28100 || oddsname.market_id === 28101}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate" v-if="oddsname.market_id === 136703823 || oddsname.market_id === 136706307 ">{{oddslist.description}}</span>
                            <span class="oddsrate" v-if="oddsname.market_id === 136703821 || oddsname.market_id === 136703823 || oddsname.market_id === 136706307 || oddsname.market_id === 136703842 ||oddsname.market_id === 975903">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnder">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnder" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-y mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderFirst">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderFirst" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderHome">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderHome" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-f mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,'','',liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderAway">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderAway" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-r mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,'','',liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
                  <details :open="marketOpen" class="suboptions-scroll" v-for="(oddsname, index) in orderBy(fullTime,'market_id')" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list" :class="{liveClass1:oddsname.market_id === 1 || oddsname.market_id === 28077 || oddsname.market_id === 28080 || oddsname.market_id === 28085 || oddsname.market_id === 28182 || oddsname.market_id === 976105 || oddsname.market_id === 31369 || oddsname.market_id === 28182 || oddsname.market_id === 136696391 || oddsname.market_id === 136703863}">
                      <div class="subodds-wrapper" v-for="(oddslist, index) in orderBy(oddsname.values,'total')" :key="index" :class="{dis: oddslist.suspend,liveClass3: oddsname.market_id === 1 || oddsname.market_id === 28182 || oddsname.market_id === 28080,liveClass2:oddsname.market_id === 28077 || oddsname.market_id === 31369 || oddsname.market_id === 28085 || oddsname.market_id === 28182 || oddsname.market_id === 976105 || oddsname.market_id === 136696391 || oddsname.market_id === 136703863}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                        <div>
                          <span class="oddsrate" v-if="oddslist.info">{{oddslist.info}}</span>
                          <span v-if="oddsname.market_id === 28077 || oddsname.market_id === 28080">{{oddslist.handicap}}</span>
                        </div>
                        <span class="oddsrate cl-r">{{oddslist.value}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                  <details :open="marketOpen" class="suboptions-scroll" v-for="(oddsname, index) in orderBy(firstHalf,'market_id')" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list" :class="{liveClass1:oddsname.market_id === 31355 || oddsname.market_id === 31369 || oddsname.market_id === 975903 || oddsname.market_id === 31355 || oddsname.market_id === 31379}">
                      <div class="subodds-wrapper" v-for="(oddslist, index) in orderBy(oddsname.values,'total')" :key="index" :class="{dis: oddslist.suspend,liveClass3: oddsname.market_id === 31355,liveClass2:oddsname.market_id === 31379 || oddsname.market_id === 31369 || oddsname.market_id === 975903}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                        <div>
                          <span class="oddsrate">{{oddslist.info}}</span>
                          <span class="oddsrate">{{oddslist.handicap}}</span>
                        </div>
                        <span class="oddsrate cl-r">{{oddslist.value}}</span>
                      </div>
                    </div>
                  </details>
                  <div v-if="overUnderFirst">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderFirst" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                  <details :open="marketOpen" class="suboptions-scroll" v-for="(oddsname, index) in orderBy(secondHalf,'market_id')" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list" :class="{liveClass1:oddsname.market_id === 28076 || oddsname.market_id === 28099 }">
                      <div class="subodds-wrapper" v-for="(oddslist, index) in orderBy(oddsname.values,'total')" :key="index" :class="{dis: oddslist.suspend,liveClass3: oddsname.market_id === 28076 || oddsname.market_id === 28099}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                        <div>
                          <span class="oddsrate">{{oddslist.info}}</span>
                        </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('goals') }" id="goals">
                  <details :open="marketOpen" class="suboptions-scroll" v-for="(oddsname, index) in orderBy(goals,'market_id')" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <header>
                          <i class="fas fa-shield-alt cl-g mr5"/>
                          <span>{{oddsname.name}}</span>
                        </header>
                      </div>
                    </summary>
                    <div class="subodds-list" :class="{liveClass1:oddsname.market_id === 28080 || oddsname.market_id === 28099 || oddsname.market_id === 28100 || oddsname.market_id === 28101 || oddsname.market_id === 28182 
                    || oddsname.market_id === 28096 
                    || oddsname.market_id === 1256989855
                    || oddsname.market_id === 1265634174
                    || oddsname.market_id === 1265634165
                    || oddsname.market_id === 1265634178
                    }">
                      <div class="subodds-wrapper" v-for="(oddslist, index) in orderBy(oddsname.values,'total')" :key="index" :class="{dis: oddslist.suspend,liveClass3:oddsname.market_id === 28182 
                      || oddsname.market_id === 28096 
                      || oddsname.market_id === 1256989855
                      || oddsname.market_id === 1265634174
                      || oddsname.market_id === 1265634165
                      || oddsname.market_id === 1265634178
                      ,liveClass2: oddsname.market_id === 28080 || oddsname.market_id === 28099  || oddsname.market_id === 28100 || oddsname.market_id === 28101}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                        <span class="oddsrate">{{oddslist.info}}</span>
                        <span class="oddsrate cl-r">{{oddslist.value}}</span>
                      </div>
                    </div>
                  </details>
                  <div v-if="overUnder">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnder" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-y mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderFirst">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderFirst" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-o mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,oddslist.handicap,oddslist.description,liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                            <span class="oddsrate">{{oddslist.handicap}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderHome">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderHome" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-f mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,'','',liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                  <div v-if="overUnderAway">
                    <details :open="marketOpen" class="suboptions-scroll po-r" v-for="(oddsname, index) in overUnderAway" :key="index">
                      <summary class="title-3" >
                        <div class="summary-con">
                          <header>
                            <i class="fas fa-shield-alt cl-r mr5"/>
                            <span>{{oddsname.name}}</span>
                          </header>
                        </div>
                      </summary>
                      <div class="subodds-list liveClass1">
                        <div class="subodds-wrapper liveClass2"  v-for="(oddslist, index) in orderBy(oddsname.odds,'info')" :key="index" :class="{dis:oddslist.suspend}" @click="addSlip(oddslist.value,oddslist.info,oddsname.name,'','',liveEvents)">
                          <div>
                            <span class="oddsrate">{{oddslist.info}}</span>
                          </div>
                          <span class="oddsrate cl-r">{{oddslist.value}}</span>
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
          <h3>Henüz Bir Karşılaşma Seçmediniz..</h3>
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
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import notfound from '@/components/notfound'
import marketsjson from '../../markets.json'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'odd',
  components: {
    slipside,
    notfound
  },
  data () {
    return {
      liveList: {},
      liveOdds: {},
      liveOddsId: {},
      liveEvents: {},
      liveBox:'Futbol',
      eventBoard: false,
      liveListLength: '',
      slips: [],
      search:{},
      searchBox: '',
      totalRate: 1,
      liveBet: false,
      betSlip: false,
      activeItem: 'all',
      notfound: '',
      markets: marketsjson,
      branchimage: 'live',
      intervalLiveList: null,
      slips: {},
      siteOpen: true,
      slipScore: false,
      leagueOpen: false,
      marketOpen: true,
      scrollTop: false,
      fullTime: [],
      firstHalf: [],
      secondHalf: [],
      goals: [],
      totalRate: 1,
      checkMinute:false,
      suspendBet: [],
      overUnder: [],
      overUnderFirst: [],
      overUnderHome: [],
      overUnderAway: []
    }
  },
  mounted () {
    this.getLive()
    this.loader = true
    this.intervalLiveList = setInterval(() => {
      this.getLive()
    }, 5 * 1000)
  },
  filters:{
    convertOdd (value, store) {
      if (store.role === 'U1' && store.liverate !== '0') {
        if (value !== undefined) {
          if (store.liveoperate === 'minus') {
            return (value - store.liverate).toFixed(2)
          } else if(store.liveoperate === 'adding'){
            return (value + parseFloat(store.liverate)).toFixed(2)
          }
        }
      }else{
        return value
      }
    }
  },
  methods: {
    async getLive() {
      let newarray = {}
        await axios.get("/api/home/inplay").then((result) => {
          if (this.$store.state.auth.role === 'U1' && this.$store.state.liveleaguesid.length > 0) {
            newarray = result.data.filter(item1 => !this.$store.state.liveleaguesid[0].some(item2 => (item2.id === item1.league_id)))
          } else {
            newarray = result.data
          }
        this.suspendBet = newarray.map(item => {
          return {
            id:item.id.toString().slice(-3),
            score:item.localteam_score +'-'+ item.visitorteam_score
          }
        })
        this.$store.commit('setSuspendBet',this.suspendBet)
        this.liveList = _.groupBy(newarray, 'league_id')
        this.search = newarray
        this.liveListLength = newarray.length
        if (this.liveBet) {
          let newvalue = newarray.filter(item => item.id === this.liveOddsId)
          this.getLiveOdds(newvalue[0])
        }
      })
    },
    getLiveOdds(value) {
      this.liveOddsId = value.id
      this.overUnder = []
      this.liveOdds = {}
      this.overUnder = []
      this.overUnderFirst = []
      this.overUnderHome = []
      this.overUnderAway = []
      this.liveBet = true
      this.matchTime = value.time_minute
      this.liveEvents = value
      let storearray = []
      let mou = ''
      let mouf = ''
      let mouh = ''
      let moua = ''
      if (this.$store.state.auth.role === 'U1') {
        if (this.$store.state.timesettings.ilkcbk !== 0 && value.time_minute <= 45 && value.time_minute > this.$store.state.timesettings.ilkcbk) {
          this.checkMinute = true
        } else if(this.$store.state.timesettings.ikicbk !== 0 && value.time_minute >= 45 && value.time_minute > this.$store.state.timesettings.ikicbk) {
          this.checkMinute = true
        }else{this.checkMinute = false}
      }
      if (this.$store.state.auth.role === 'U1' && this.$store.state.livemarketsid.length > 0) {
        storearray = value.inplayOdds.data.filter(item1 => !this.$store.state.livemarketsid[0].some(item2 => (item2.id === item1.market_id)))
      } else {
        storearray = value.inplayOdds.data
      }
      this.liveOdds = storearray.filter(item => item.market_id !== 28077 && item.market_id !== 28086 && item.market_id !== 28088 && item.market_id !== 975903)
      mou = value.inplayOdds.data.filter(item => item.market_id === 28077)
      if (mou.length > 0) {
        this.overUnder = [
            {name: 'Toplam Gol Alt/Üst 0.5', odds: mou[0].values.filter(item => item.handicap === '0.5')},
            {name: 'Toplam Gol Alt/Üst 1.5', odds: mou[0].values.filter(item => item.handicap === '1.5')},
            {name: 'Toplam Gol Alt/Üst 2.5', odds: mou[0].values.filter(item => item.handicap === '2.5')},
            {name: 'Toplam Gol Alt/Üst 3.5', odds: mou[0].values.filter(item => item.handicap === '3.5')},
            {name: 'Toplam Gol Alt/Üst 4.5', odds: mou[0].values.filter(item => item.handicap === '4.5')},
            {name: 'Toplam Gol Alt/Üst 5.5', odds: mou[0].values.filter(item => item.handicap === '5.5')},
            {name: 'Toplam Gol Alt/Üst 6.5', odds: mou[0].values.filter(item => item.handicap === '6.5')},
            {name: 'Toplam Gol Alt/Üst 7.5', odds: mou[0].values.filter(item => item.handicap === '7.5')},
            {name: 'Toplam Gol Alt/Üst 8.5', odds: mou[0].values.filter(item => item.handicap === '8.5')}
        ]
        this.overUnder = this.overUnder.filter(item => item.odds.length > 0)
      }
      mouf = value.inplayOdds.data.filter(item => item.market_id === 975903)
      if (mouf.length > 0) {
        this.overUnderFirst = [
            {name: 'İlk Yarı Gol Alt/Üst 0.5', odds: mouf[0].values.filter(item => item.handicap === '0.5')},
            {name: 'İlk Yarı Gol Alt/Üst 1.5', odds: mouf[0].values.filter(item => item.handicap === '1.5')},
            {name: 'İlk Yarı Gol Alt/Üst 2.5', odds: mouf[0].values.filter(item => item.handicap === '2.5')},
            {name: 'İlk Yarı Gol Alt/Üst 3.5', odds: mouf[0].values.filter(item => item.handicap === '3.5')},
            {name: 'İlk Yarı Gol Alt/Üst 4.5', odds: mouf[0].values.filter(item => item.handicap === '4.5')},
            {name: 'İlk Yarı Gol Alt/Üst 5.5', odds: mouf[0].values.filter(item => item.handicap === '5.5')}
        ]
        this.overUnderFirst = this.overUnderFirst.filter(item => item.odds.length > 0)
      }
      mouh = value.inplayOdds.data.filter(item => item.market_id === 28086)
      if (mouh.length > 0) {
        this.overUnderHome = [
            {name: 'Evsahibi Gol Alt/Üst 0.5', odds: mouh[0].values.filter(item => item.handicap === '0.5')},
            {name: 'Evsahibi Gol Alt/Üst 1.5', odds: mouh[0].values.filter(item => item.handicap === '1.5')},
            {name: 'Evsahibi Gol Alt/Üst 2.5', odds: mouh[0].values.filter(item => item.handicap === '2.5')},
            {name: 'Evsahibi Gol Alt/Üst 3.5', odds: mouh[0].values.filter(item => item.handicap === '3.5')},
            {name: 'Evsahibi Gol Alt/Üst 4.5', odds: mouh[0].values.filter(item => item.handicap === '4.5')},
            {name: 'Evsahibi Gol Alt/Üst 5.5', odds: mouh[0].values.filter(item => item.handicap === '5.5')}
        ]
        this.overUnderHome = this.overUnderHome.filter(item => item.odds.length > 0)
      }
      moua = value.inplayOdds.data.filter(item => item.market_id === 28088)
      if (moua.length > 0) {
        this.overUnderAway = [
            {name: 'Deplasman Gol Alt/Üst 0.5', odds: moua[0].values.filter(item => item.handicap === '0.5')},
            {name: 'Deplasman Gol Alt/Üst 1.5', odds: moua[0].values.filter(item => item.handicap === '1.5')},
            {name: 'Deplasman Gol Alt/Üst 2.5', odds: moua[0].values.filter(item => item.handicap === '2.5')},
            {name: 'Deplasman Gol Alt/Üst 3.5', odds: moua[0].values.filter(item => item.handicap === '3.5')},
            {name: 'Deplasman Gol Alt/Üst 4.5', odds: moua[0].values.filter(item => item.handicap === '4.5')},
            {name: 'Deplasman Gol Alt/Üst 5.5', odds: moua[0].values.filter(item => item.handicap === '5.5')}
        ]
        this.overUnderAway = this.overUnderAway.filter(item => item.odds.length > 0)
      }
      storearray.forEach(element => {
        this.markets.data.forEach(element2 => {
          if (element.market_id === element2.id) {
            element.name = element2.name
          }
        })
      })
      this.liveOddsLength =  storearray.length
      if (this.scrollTop) {
        this.goTop()
        this.setActive ('all')
        this.scrollTop = false
      }
    },
    setTop(){
      this.scrollTop = true
    },
    getFlags (flags) {
      try {
        return require(`~/assets/img/${flags}.png`)
      } catch (error) {
        return require(`~/assets/img/Dünya.png`)
      }
    },
    getTotalRate () {
      this.totalRate *= this.slips[0].rate
      this.totalRate =  this.totalRate.toFixed(2)
    },
    searchFilter () {
      let searchArray = this.search.filter(item => item.localTeam.toLowerCase().indexOf(this.searchBox.toLowerCase()) === 0 || item.visitorTeam.toLowerCase().indexOf(this.searchBox.toLowerCase()) === 0)
      this.liveList = _.groupBy(searchArray, 'league_id')
      this.liveListLength = searchArray.length
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
      this.fullTime = this.liveOdds.filter(item => item.market_id === 1 
      || item.market_id === 63
      || item.market_id === 28077
      || item.market_id === 28085
      || item.market_id === 31369
      || item.market_id === 976105
      || item.market_id === 136696391
      || item.market_id === 136703863
      || item.market_id === 136703866
      )
      this.liveOddsLength = this.fullTime.length
    },
    getFirstHalf(){
      this.firstHalf = []
      this.firstHalf = this.liveOdds.filter(item => item.market_id === 31355 
      || item.market_id === 975903  
      || item.market_id === 31369  
      || item.market_id === 31379
      || item.market_id === 136703842  
      )
      this.liveOddsLength = this.firstHalf.length
    },
    getSecondHalf(){
      this.secondHalf = []
      this.secondHalf = this.liveOdds.filter(item => item.market_id === 28076
      || item.market_id === 28099
      )
      this.liveOddsLength = this.secondHalf.length
    },
    getGoals(){
      this.goals = []
      this.goals = this.liveOdds.filter(item => item.market_id === 28182
      || item.market_id === 28086
      || item.market_id === 1256989855
      || item.market_id === 1265634174
      || item.market_id === 28096
      || item.market_id === 1265634165
      || item.market_id === 1265634178
      )
      this.liveOddsLength = this.goals.length
    },
    addSlip (rate,option,game,handicap,des,liveEvents) {
      let newoption = ''
      if (handicap) {
        newoption = option  +' '+ des +' '+ handicap
      } else {
        newoption = option
      }
      let match = liveEvents.localTeam +'-'+ liveEvents.visitorTeam
      this.slips = {
        betid:0,
        code: liveEvents.id.toString().slice(-3),
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        match: match,
        games: game,
        option: newoption,
        rate: rate,
        stream: 'Canlı',
        state: 'Aktif',
        scoreid: liveEvents.id,
        score: liveEvents.localteam_score +'-'+ liveEvents.visitorteam_score
      }
      if (!this.$store.state.betslip){
        this.$store.commit('setBetSlip', true)
      }
      setTimeout(() => {
        let t = 0
        if (this.$store.state.slips.length > 0) {
        let test = this.$store.state.slips.find((item,index) =>{
          t = index
          return item.match === match
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
  },
  beforeDestroy: function(){
    clearInterval(this.intervalLiveList)
  }
}
</script>