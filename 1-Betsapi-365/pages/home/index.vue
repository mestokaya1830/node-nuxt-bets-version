<template>
  <div class="pages main-page">
    <aside class="left" >
      <div class="title-2" id="content">
        <div>
          <i class="fas fa-bolt navbar-icons cl-y navbar-icons ml10"/>
          <select v-model="sportBox" class="selectbox1 selectbox1-live" @change="getLive()">
            <option value="1" disabled>Futbol</option>
            <option value="1">Futbol</option>
            <option value="18">Basketbol</option>
          </select>
          <i class="fas fa-adjust navbar-icons ml10 cp" @click="leagueOpen = ! leagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge soccer">{{liveListLength}}</span>
      </div>
      <div class="left-con po-r">
        <div class="sblc"><input type="search" v-model="searchBox" @keyup="searchFilter" class="searchbox-left" placeholder="ara..."></div>
         <details :open="leagueOpen" class="left-details" v-for="(list, index) in liveList" :key="index">
          <summary class="title-3">
            <span class="flag-con">
              <img :src="getFlags(list[0].NA.replace(/ .*/,''))" class="mr5">
              <span class="left-links-text">{{list[0].NA}}</span>
            </span>
          </summary>
          <div>
            <div v-for="(sublist, index) in list[1]" :key="index" class="live-list soccer">
              <div class="left-list" :class="{soccer:sportBox === '1', basketball:sportBox === '18'}" @click="getLiveOdds(sublist.FI, sublist.NA)">
                <span class="left-list-con">
                  <span class="left-list-items">{{sublist.NA}}</span>
                  <div class="left-list-items">
                    <span class="cl-y"> {{getMatchMinutes(sublist.FS, sublist.TT, sublist.TU,sublist.TM, sublist.TS)}}</span>
                    <span class="cl-y"> {{sublist.SS}}</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </details>
        <div class="page-end mt5"><span>Başka veri yoktur</span></div>
      </div>
    </aside>
    <div class="center">
      <div class="title-2">
        <span><i class="fas fa-bolt navbar-icons cl-y navbar-icons"/>CANLI PANO</span>
        <span class="badge soccer">{{marketName.length}}</span>
      </div>
      <div class="center-con">
        <div v-if="options">
          <div  class="center-bet" v-for="(liveoddlist, index) in liveOdds" :key="index">
            <div class="center-panel" v-if="sportBox === '1'">
              <div class="score-board">
                <span class="sbt sbth">{{statsHome['0']}}</span>
                <span class="sbs sbss">{{statsHome['1']}}</span>
                <span class="sbs sbss">{{statsAway['1']}}</span>
                <span class="sbt">{{statsAway['0']}}</span>
              </div>
               <div class="center-header">
                <span class="match-minutes cl-y"><img src="~/assets/img/bars.svg" class="live-timer"/>{{matchTime}}</span>
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
                <div class="lcs-con lcs-con-center">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-g mr10"/>{{statsHome['0']}}</span>
                  <span class="lcs-items">{{statsHome['2']}}</span>
                  <span class="lcs-items">{{statsHome['3']}}</span>
                  <span class="lcs-items">{{statsHome['4']}}</span>
                  <span class="lcs-items">{{statsHome['5']}}</span>
                  <span class="lcs-items">{{statsHome['1']}}</span>
                </div>
                <div class="lcs-con">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-r mr10"/>{{statsAway['0']}}</span>
                  <span class="lcs-items">{{statsAway['2']}}</span>
                  <span class="lcs-items">{{statsAway['3']}}</span>
                  <span class="lcs-items">{{statsAway['4']}}</span>
                  <span class="lcs-items">{{statsAway['5']}}</span>
                  <span class="lcs-items">{{statsAway['1']}}</span>
                </div>
              </div>
            </div>
             <div class="center-panel"  v-if="sportBox === '18'">
              <div class="score-board">
                <span class="sbt sbth">{{statsHome['0']}}</span>
                <span class="sbs sbsb">{{statsHome['7']}}</span>
                <span class="sbs sbsb">{{statsAway['7']}}</span>
                <span class="sbt">{{statsAway['0']}}</span>
              </div>
               <div class="center-header">
                <span class="match-minutes cl-y"><img src="~/assets/img/bars.svg" class="live-timer"/>{{matchTime}}</span>
                <span class="match-minutes cl-y">{{period}}</span>
              </div>
              <div class="center-stats">
                <div class="lcs-con">
                  <span class="lcs1">OLAYLAR</span>
                  <span class="lcs-items-title-bas cl-y">1</span>
                  <span class="lcs-items-title-bas cl-y">2</span>
                  <span class="lcs-items-title-bas cl-y">Devre</span>
                  <span class="lcs-items-title-bas cl-y">3</span>
                  <span class="lcs-items-title-bas cl-y">4</span>
                  <span class="lcs-items-title-bas cl-y">T</span>
                </div>
                <div class="lcs-con lcs-con-center">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-g mr10"/>{{statsHome['0']}}</span>
                  <span class="lcs-items-bas">{{statsHome['1']}}</span>
                  <span class="lcs-items-bas">{{statsHome['2']}}</span>
                  <span class="lcs-items-bas">{{statsHome['3']}}</span>
                  <span class="lcs-items-bas">{{statsHome['4']}}</span>
                  <span class="lcs-items-bas">{{statsHome['5']}}</span>
                  <span class="lcs-items-bas">{{statsHome['7']}}</span>
                </div>
                <div class="lcs-con">
                  <span class="lcs1"><i class="fas fa-shield-alt cl-r mr10"/>{{statsAway['0']}}</span>
                  <span class="lcs-items-bas">{{statsAway['1']}}</span>
                  <span class="lcs-items-bas">{{statsAway['2']}}</span>
                  <span class="lcs-items-bas">{{statsAway['3']}}</span>
                  <span class="lcs-items-bas">{{statsAway['4']}}</span>
                  <span class="lcs-items-bas">{{statsAway['5']}}</span>
                  <span class="lcs-items-bas">{{statsAway['7']}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="live-lock" v-if="matchTime === 'Başlamadı' || matchTime === 'Maç Sona Erdi' || $store.state.auth.role === 'U1' && $store.state.timesettings.bksur !== 0 && $store.state.timesettings.bksur <= matchTime">
            <i class="fas fa-lock fa-4x" />
          </div>
          <div v-else>
            <div class="suboptions" v-if="sportBox === '1'">
              <div class="tab-container">
                <ul class="nav nav-tabs nav-justified">
                  <li class="nav-item soccer">
                    <a class="nav-link nll" @click.prevent="setActive('fulltime')" :class="{ active: isActive('fulltime') }" href="#fulltime">Maç Sonu</a>
                    <a class="nav-link nll" @click.prevent="setActive('firsthalf'), getFirstHalf()" :class="{ active: isActive('firsthalf') }" href="#firsthalf">1.Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('secondhalf'), getSecondHalf()" :class="{ active: isActive('secondhalf') }" href="#secondhalf">2.Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('goals'), getGoals()" :class="{ active: isActive('goals') }" href="#goals">Goller</a>
                    <a class="nav-link nll" @click.prevent="setActive('corners'), getCorners()" :class="{ active: isActive('corners') }" href="#corners">Kornerler</a>
                    <a class="nav-link nll" @click.prevent="setActive('handicap'), getHandicap()" :class="{ active: isActive('handicap') }" href="#handicap">Handikap</a>
                    <i class="fas fa-adjust navbar-icons ml10 cl-w cp" @click="marketOpen = ! marketOpen" title="Aç Kapa"/>
                  </li>
                </ul>
                <div class="tab-pane" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
                  <details :open="marketOpen" v-for="(list, index) in fullTime" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                      <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'"
                        :class="{dis:list3[0].OR === '0' && list[0].ID === '10124'
                        || list3[0].OR === '0' && list[0].ID ==='50461'
                        || list3[0].OR === '0' && list[0].ID ==='50193'
                        || list3[0].OR === '0' && list[0].ID ==='50189',
                        liveClass1:list[0].ID === '1777' || list[0].ID === '10563' || list[0].ID === '10562' || list[0].ID === '10147'}">
                          <h4 class="co soccer" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)"
                            :class="{liveClass2:list[0].ID === '10563' || list[0].ID === '10562' || list[0].ID === '10147', liveClass3:list[0].ID === '1777'}">
                            <span class="oddsrate na"  v-if="list4.type === 'PA' && list4.OD !== '0/0' && list[0].ID !== '50193'" :class="{dis:!list4.NA}">{{list4.NA}}</span>
                            <span class="oddsrate ha-full"  v-if="list4.type==='PA' && list[0].ID ==='10124'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate bs"  v-if="list4.type==='PA' && list[0].ID === '50461'" :class="{dis:!list4.BS}">{{list4.BS}}</span>
                            <span class="oddsrate la"  v-if="list4.type==='PA' && list[0].ID === '10159' || list[0].ID ==='50193'" :class="{dis:!list4.LA}">{{list4.LA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                  <details :open="marketOpen" v-for="(list, index) in firstHalf" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                      <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'"
                        :class="{dis:list3[0].OR === '0' && list3[0].OR === '0' && list[0].ID ==='10568' || list3[0].OR === '0' && list[0].ID === '10171',
                        liveClass1:list[0].ID === '50186' || list[0].ID === '10161' || list[0].ID === '50390' || list[0].ID === '50180' || list[0].ID === '10560'}">
                          <h4 class="co soccer" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)"
                            :class="{liveClass2:list[0].ID === '50390' || list[0].ID === '50186' || list[0].ID === '10560', liveClass3:list[0].ID === '10161' || list[0].ID === '50180'}">
                            <div class="oddsrate ha">
                              <span class="oddsrate na mr10"  v-if="list4.type === 'PA' && list4.OD !== '0/0' && list4.NA !== ' '" :class="{dis:!list4.NA}">{{list4.NA}}</span>
                              <span class="oddsrate ha"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            </div>
                            <span class="oddsrate bs"  v-if="list4.type==='PA' && list[0].ID !== '10160' && list[0].ID !== '10170' && list[0].ID !== '50346' && list[0].ID !== '10171'" :class="{dis:!list4.BS}">{{list4.BS}}</span>
                            <span class="oddsrate la"  v-if="list4.type==='PA' && list[0].ID !== '10160' && list[0].ID !== '10170' && list[0].ID !== '10171' && list[0].ID !== '50346' && list[0].ID !== '50186'" :class="{dis:!list4.LA}">{{list4.LA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                  <details :open="marketOpen" v-for="(list, index) in secondHalf" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                      <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'"
                          :class="{dis:list3[0].OR === '0' 
                          && list3[0].OR === '0' && list[0].ID ==='50180',
                          liveClass1:list[0].ID === '50391'
                          || list[0].ID === '50246'
                          }">
                            <h4 class="co soccer" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                            <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)"
                              :class="{liveClass2:list[0].ID === '50391',
                              liveClass3:list[0].ID === '50246'
                              }">
                              <span class="oddsrate na"  v-if="list4.type === 'PA' 
                                && list4.OD !== '0/0'
                                && list[0].ID !== '50180'"
                                :class="{dis:!list4.NA}"
                                >{{list4.NA}}
                              </span>
                              <span class="oddsrate bs"  v-if="list4.type==='PA'
                                && list[0].ID === '10567'
                                || list[0].ID === '50365'
                                || list[0].ID === '50180'
                                || list[0].ID === '50461'"
                                :class="{dis:!list4.BS}"
                                >{{list4.BS}}
                              </span>
                              <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}" >{{list4.HA}}</span>
                              <span class="oddsrate"  v-if="list4.type==='PA'
                                && list[0].ID === '50193'"
                                :class="{dis:!list4.LA}"
                                >{{list4.LA}}
                              </span>
                              <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('goals') }" id="goals">
                  <details :open="marketOpen" v-for="(list, index) in goals" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                        <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'"
                          :class="{dis:list3[0].OR === '0' 
                          && list3[0].OR === '0' && list[0].ID ==='10567'
                          || list3[0].OR === '0' && list[0].ID ==='50365'
                          || list3[0].OR === '0' && list[0].ID ==='50335'
                          || list3[0].OR === '0' && list[0].ID ==='50349'
                          || list3[0].OR === '0' && list[0].ID ==='50357'
                          || list3[0].OR === '0' && list[0].ID ==='10171'
                          || list3[0].OR === '0' && list[0].ID ==='50162'
                          || list3[0].OR === '0' && list[0].ID ==='10566'
                          || list3[0].OR === '0' && list[0].ID ==='50365',
                          liveClass1:list[0].ID === '50285'
                          || list[0].ID === '10564'
                          || list[0].ID === '10562'
                          || list[0].ID === '10565'
                          || list[0].ID === '1778'
                          || list[0].ID === '10516'
                          || list[0].ID === '10148'
                          || list[0].ID === '50396'
                          || list[0].ID === '50397'
                          || list[0].NA.indexOf('10 Dakika Olayı')>-1
                          || list[0].NA.match(/[0-9]\.\sGol$/)
                          }">
                            <h4 class="co soccer" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                            <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)"
                              :class="{liveClass2:list[0].NA.match(/Alternatif Gol Aralığı\s.+/)
                              || list[0].ID === '10562'
                              || list[0].ID === '50285'
                              || list[0].ID === '10565'
                              || list[0].ID === '10148'
                              || list[0].ID === '10516'
                              || list[0].ID === '50396'
                              || list[0].ID === '50397'
                              || list[0].NA.indexOf('10 Dakika Olayı')>-1,
                              liveClass3:list[0].ID === '10564'
                              || list[0].ID ==='1778'
                              }">
                              <span class="oddsrate na"  v-if="list4.type === 'PA' 
                                && list4.OD !== '0/0'
                                && list[0].ID !== '10567'
                                && list[0].ID !== '50365'
                                && list[0].ID !== '10171'
                                && list[0].ID !== '50391'"
                                :class="{dis:!list4.NA}"
                                >{{list4.NA}}
                              </span>
                              <span class="oddsrate bs"  v-if="list4.type==='PA'
                                && list[0].ID === '10567'
                                || list[0].ID === '50365'
                                || list[0].ID === '50391'
                                || list[0].ID === '50461'"
                                :class="{dis:!list4.BS}"
                                >{{list4.BS}}</span>
                              <span class="oddsrate ha"  v-if="list4.type==='PA' 
                                && list[0].ID === '10171'"
                                :class="{dis:!list4.HA}"
                                >{{list4.HA}}
                              </span>
                              <span class="oddsrate la"  v-if="list4.type==='PA'
                                && list[0].ID === '50193'"
                                :class="{dis:!list4.LA}"
                                >{{list4.LA}}
                              </span>
                              <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('corners') }" id="corners">
                  <details :open="marketOpen" v-for="(list, index) in corners" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                        <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'"
                          :class="{liveClass1:list[0].ID === '50285'
                          || list[0].ID === '50187'
                          || list[0].ID === '10515'
                          || list[0].ID === '10565'
                          || list[0].ID === '1778'
                          || list[0].ID === '50186'
                          || list[0].ID === '50185'
                          || list[0].ID === '10516'
                          || list[0].ID === '10148'
                          || list[0].ID === '10569'
                          }">
                            <h4 class="co soccer" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                            <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)"
                              :class="{liveClass2:list[0].NA.match(/Alternatif Gol Aralığı\s.+/)
                              || list[0].ID === '50187'
                              || list[0].ID === '10565'
                              || list[0].ID === '10515'
                              || list[0].ID === '50185'
                              || list[0].ID === '10516',
                              liveClass3:list[0].ID === '10564'
                              || list[0].ID ==='1778'
                              || list[0].ID ==='10516'
                              }">
                              <span class="oddsrate"  v-if="list4.type === 'PA' 
                                && list4.OD !== '0/0'
                                || list[0].ID !== '10567'
                                || list[0].ID !== '50365'
                                || list[0].ID !== '50391'"
                                :class="{dis:!list4.NA}"
                                >{{list4.NA}}
                              </span>
                              <span class="oddsrate"  v-if="list4.type==='PA'
                                && list[0].ID === '10567'
                                || list[0].ID === '50365'
                                || list[0].ID === '50391'
                                || list[0].ID === '50461'"
                                :class="{dis:!list4.BS}"
                                >{{list4.BS}}</span>
                              <span class="oddsrate"  v-if="list4.type==='PA' 
                                && list[0].ID === '10171'"
                                :class="{dis:!list4.HA}"
                                >{{list4.HA}}
                              </span>
                              <span class="oddsrate ha-full"  v-if="list4.type==='PA'
                                && list[0].ID === '50193'
                                || list[0].ID === '50187'"
                                :class="{dis:!list4.LA}"
                                >{{list4.LA}}
                              </span>
                              <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('handicap') }" id="handicap">
                  <details :open="marketOpen" v-for="(list, index) in handicap" :key="index">
                    <summary class="title-3" :class="{hideSuspend: list[0].SU === '1'}">
                      <div class="summary-con">
                        <span class="badge mr10 soccer">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                        <span class="mr20" v-if="list[0].SU === '1'">Askıda</span>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list" v-for="(list3, index) in list2" :key="index" v-if="list[0].SU !=='1'" 
                        :class="{liveClass1:list[0].ID === '10147' || list[0].ID === '50281'}">
                            <h4 class="co soccer" v-if="list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                            <div class="subodds-wrapper" v-for="(list4, index) in list3" :key="index" :class="{liveClass2:list[0].ID === '10147' || list[0].ID === '50281'}" v-if="index > 0" @click="addSlip(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.LA, list4.BS, list4.OD)">
                              <span class="oddsrate na"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}</span>
                              <span class="oddsrate bs"  v-if="list4.type==='PA'&& list[0].ID === '10567'" :class="{dis:!list4.BS}">{{list4.BS}}</span>
                              <span class="oddsrate ha"  v-if="list4.type==='PA' && list[0].ID === '10159' || list[0].ID === '50346'">{{list4.HA}}</span>
                              <span class="oddsrate la"  v-if="list4.type==='PA'&& list[0].ID === '10170'" :class="{dis:!list4.LA}">{{list4.LA}}</span>
                              <span class="oddsrate odd cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOddSoccer($store.state.auth)}} {{list4.length}}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
            </div>
            <div class="suboptions" v-else>
              <div class="tab-container">
                <ul class="nav nav-tabs nav-justified">
                  <li class="nav-item basketball">
                    <a class="nav-link nll" @click.prevent="setActive('all')" :class="{ active: isActive('all') }" href="#all">Hepsi</a>
                    <a class="nav-link nll" @click.prevent="setActive('fulltime'), getFullTime()" :class="{ active: isActive('fulltime') }" href="#fulltime">Maç Sonu</a>
                    <a class="nav-link nll" @click.prevent="setActive('firsthalf'), getFirstHalf()" :class="{ active: isActive('firsthalf') }" href="#firsthalf">1.Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('secondhalf'), getSecondHalf()" :class="{ active: isActive('secondhalf') }" href="#secondhalf">2.Yarı</a>
                    <a class="nav-link nll" @click.prevent="setActive('firstquarter'), getFirstQuarter()" :class="{ active: isActive('firstquarter') }" href="#firstquarter">1.Çey</a>
                    <a class="nav-link nll" @click.prevent="setActive('secondquarter'), getSecondQuarter()" :class="{ active: isActive('secondquarter') }" href="#secondquarter">2.Çey</a>
                    <a class="nav-link nll" @click.prevent="setActive('thirdquarter'), getThirdQuarter()" :class="{ active: isActive('thirdquarter') }" href="#thirdquarter">3.Çey</a>
                    <a class="nav-link nll" @click.prevent="setActive('fourthquarter'), getFourthQuarter()" :class="{ active: isActive('fourthquarter') }" href="#fourthquarter">4.Çey</a>
                    <span><i class="fas fa-adjust navbar-icons ml20 cp" @click="marketOpen = ! marketOpen" title="Aç Kapa"/></span>
                  </li>
                </ul>
                <div class="tab-pane" :class="{ activeshow: isActive('all') }" id="all">
                  <details :open="marketOpen" v-for="(list, index) in marketName" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                      <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' 
                          && list[0].ID === '1450'
                          || list3[0].OR === '0' && list[0].ID === '111'
                          || list3[0].OR === '0' && list[0].ID === '101'
                          || list3[0].OR === '0' && list[0].ID === '109'
                          || list3[0].OR === '0' && list[0].ID === '105'
                          || list3[0].OR === '0' && list[0].ID === '566'
                          || list3[0].OR === '0' && list[0].ID === '575'
                          || list3[0].OR === '0' && list[0].ID === '563'
                          || list3[0].OR === '0' && list[0].ID === '567'
                          || list3[0].OR === '0' && list[0].ID === '180611'
                          || list3[0].OR === '0' && list[0].ID === '180621'
                          || list3[0].OR === '0' && list[0].ID === '180239'
                          || list3[0].OR === '0' && list[0].ID === '180058'
                          || list3[0].OR === '0' && list[0].ID === '180189'
                          || list3[0].OR === '0' && list[0].ID === '180193'
                          || list3[0].OR === '0' && list[0].ID === '180240'
                          || list3[0].OR === '0' && list[0].ID === '180098'
                          || list3[0].OR === '0' && list[0].ID === '180099'
                          || list3[0].OR === '0' && list[0].ID === '180277'
                          || list3[0].OR === '0' && list[0].ID === '180281'
                          || list3[0].OR === '0' && list[0].ID === '180719'
                          || list3[0].OR === '0' && list[0].ID === '180192'
                          || list3[0].OR === '0' && list[0].ID === '180278'
                          || list3[0].OR === '0' && list[0].ID === '180282'
                          || list3[0].OR === '0' && list[0].ID === '180108'
                          || list3[0].OR === '0' && list[0].ID === '180107'
                          || list3[0].OR === '0' && list[0].ID === '180062'
                          || list3[0].OR === '0' && list[0].ID === '180063'
                          || list3[0].OR === '0' && list[0].ID === '180373'
                          || list3[0].OR === '0' && list[0].ID === '180773'
                          || list3[0].OR === '0' && list[0].ID === '180243'
                          || list3[0].OR === '0' && list[0].ID === '180089'
                          || list3[0].OR === '0' && list[0].ID === '180090'
                          || list3[0].OR === '0' && list[0].ID === '107'
                          || list3[0].OR === '0' && list[0].ID === '561'
                          || list3[0].OR === '0' && list[0].ID === '565'
                          || list3[0].OR === '0' && list[0].ID === '573'
                          || list3[0].OR === '0' && list[0].ID === '180777'
                          || list3[0].OR === '0' && list[0].ID === '180191'
                          || list3[0].OR === '0' && list[0].ID === '180651'
                          || list3[0].OR === '0' && list[0].ID === '180718'
                          || list3[0].OR === '0' && list[0].ID === '180080'
                          || list3[0].OR === '0' && list[0].ID === '180081'
                          || list3[0].OR === '0' && list[0].ID === '103'
                          || list3[0].OR === '0' && list[0].ID === '564'
                          || list3[0].OR === '0' && list[0].ID === '560'
                          || list3[0].OR === '0' && list[0].ID === '562'
                          || list3[0].OR === '0' && list[0].ID === '572'
                          || list3[0].OR === '0' && list[0].ID === '574'
                          || list3[0].OR === '0' && list[0].ID === '180190'
                          || list3[0].OR === '0' && list[0].ID === '180275'
                          || list3[0].OR === '0' && list[0].ID === '180279'
                          || list3[0].OR === '0' && list[0].ID === '180717'
                          || list3[0].OR === '0' && list[0].ID === '180071'
                          || list3[0].OR === '0' && list[0].ID === '180072'
                          || list3[0].OR === '0' && list[0].ID === '180242'
                          || list3[0].OR === '0' && list[0].ID === '180244'
                          || list3[0].OR === '0' && list[0].ID === '180276'
                          || list3[0].OR === '0' && list[0].ID === '180276'
                          || list3[0].OR === '0' && list[0].ID === '180280'
                          || list3[0].OR === '0' && list[0].ID === '180625'
                          || list3[0].OR === '0' && list[0].ID === '180791'
                          || list3[0].OR === '0' && list[0].ID === '180783'
                          || list3[0].OR === '0' && list[0].ID === '180785'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].ID === '180068'
                            || list[0].ID === '180647'
                            || list[0].ID === '180078'
                            || list[0].ID === '180059'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'
                            && list[0].ID === '180061'
                            || list[0].ID === '180605'
                            || list[0].ID === '180088'
                            || list[0].ID === '180753'
                            " >{{list4.HD}}</span>
                            <span class="oddsrate"  v-if="list4.type === 'PA'" >{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''"
                            :class="{dis2:!list4.OD.match(/\d/)}">{{list4.OD | convertOdd}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
                  <details :open="marketOpen" v-for="(list, index) in fullTime" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                  <details :open="marketOpen" v-for="(list, index) in firstHalfBasket" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                  <details :open="marketOpen" v-for="(list, index) in secondHalfBasket" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('firstquarter') }" id="firstquarter">
                  <details :open="marketOpen" v-for="(list, index) in firstQuarter" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('secondquarter') }" id="secondquarter">
                  <details :open="marketOpen" v-for="(list, index) in secondQuarter" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('thirdquarter') }" id="thirdquarter">
                  <details :open="marketOpen" v-for="(list, index) in thirdQuarter" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
                <div class="tab-pane" :class="{ activeshow: isActive('fourthquarter') }" id="fourthquarter">
                  <details :open="marketOpen" v-for="(list, index) in fourthQuarter" :key="index">
                    <summary class="title-3">
                      <div class="summary-con">
                        <span class="badge mr10 basketball">{{index}}</span>
                        <header>{{list[0].NA}}</header>
                      </div>
                    </summary>
                    <div>
                        <div class="subodds-list-wrapper" v-for="(list2, index) in list"  :key="index" v-if="index > 0">
                        <div class="subodds-list slb" v-for="(list3, index) in list2" :key="index" 
                        :class="{dis:list3[0].OR === '0' && list[0].NA.match(/\d\.Çeyrek Galibiyet Aralığı/)
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Galibiyet Aralığı'
                          || list3[0].OR === '0' && list[0].NA === 'Maç Sonucu ve Alt/Üst'
                          || list3[0].OR === '0' && list[0].NA === 'ilk Yarı Sonucu and Alt/Üst'
                          }">
                          <h4 class="co basketball" v-if="list3[0].NA !== '' && list3[0].NA !== ' '">{{list3[0].NA}}</h4>
                          <div class="subodds-wrapper slwb" v-for="(list4, index) in list3" :key="index" v-if="index > 0" @click="addSlipBasket(list[0].NA, list4.NA, list3[0].NA,  list4.HA, list4.OD)"
                            :class="{liveClass3: 
                            list[0].NA.match(/3 lü$/)
                            || list[0].NA.indexOf('Yarışı')>-1,
                            liveClassFull:list[0].NA.match(/\d\.Çeyrek Galibiyet Farkı/)
                            || list[0].NA.match(/\d\.Çeyrek Çifte Şans/)
                            ||list[0].NA === 'Galibiyet Aralığı 3 lü'
                            ||list[0].NA === 'ilk Yarı Çifte Şans'
                            }">
                            <span class="oddsrate"  v-if="list4.type === 'PA' && list4.OD !== '0/0'" :class="{dis:!list4.NA}">{{list4.NA}}
                            </span>
                            <span class="oddsrate"  v-if="list4.type==='PA'" :class="{dis:!list4.HA}">{{list4.HA}}</span>
                            <span class="oddsrate cl-r" v-if="list4.OD !== ''">{{list4.OD | convertOdd}} {{list4.length}}</span>
                          </div>
                        </div>
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
          <h3>Henüz Bir Karşılaşma Seçmediniz..</h3>
        </div>
      </div>
      <preloader v-if="loader" class="loader-con"/>
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
import preloader from '@/components/preloader'
import moment from 'moment'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Live',
  components: {
    slipside,
    preloader
  },
  data () {
    return {
      liveList: {},
      liveOdds: {},
      search: {},
      liveListLength: '',
      marketName: {},
      slips: [],
      statsHome:[],
      statsAway:[],
      searchBox: '',
      sportBox: '1',
      totalRate: 1,
      options: false,
      id: '',
      liveValue:'',
      matchTeams:'',
      matchMinutes: '',
      matchTime: '',
      loader: false,
      activeItem: 'fulltime',
      fullTime: [],
      firstHalf: [],
      secondHalf: [],
      corners: [],
      goals: [],
      handicap: [],
      firstHalfBasket: [],
      secondHalfbasket: [],
      firstQuarter: [],
      secondQuarter: [],
      thirdQuarter: [],
      fourthQuarter: [],
      testEv:  [],
      subSlip: false,
      intervalLiveList: null,
      intervalLiveOdds: null,
      period: 0,
      liveId: '',
      liveHandel: false,
      branchimage: 'live',
      stream: 'Canlı',
      slips: {},
      siteOpen: true,
      slipScore: false,
      leagueOpen: false,
      marketOpen: false,
    }
  },
  mounted () {
    this.getLive()
    this.intervalLiveList = setInterval(() => {
      this.liveFunc()
    }, 62 * 1000)
  },
  filters: {
    convertOddSoccer (value, store, sportbox) {
      if (store.role === 'U1' && store.liverate !== '0') {
        let newvalue = value.split('/')[0] / value.split('/')[1] + 1
        if (value !== undefined) {
          if (store.liveoperate === 'minus') {
            return (newvalue - store.liverate).toFixed(2)
          } else if(store.liveoperate === 'adding'){
            return (newvalue + parseFloat(store.liverate)).toFixed(2)
          }
        }
      }else{
        return (value.split('/')[0] / value.split('/')[1] + 1).toFixed(2)
      }
    },
    convertOdd (value) {
      return (value.split('/')[0] / value.split('/')[1] + 1).toFixed(2)
    }
  },
  methods: {
    getFlags (flags) {
      try {
        return require(`~/assets/img/${flags}.png`)
      } catch (error) {
        return require(`~/assets/img/Dünya.png`)
      }
    },
    getLive() {
      this.options = false
      this.liveList = {}
      this.liveOdds = {}
      this.loader = true
      this.liveHandel = false
      this.liveFunc()
    },
    async liveFunc(){
      await axios.get(`/api/home/inplay`).then((result) =>{
        let leaguearrays = []
        let fullapi = []
        let leaguename = []
        setTimeout(() => {
          if (this.sportBox === '1') {
            result.data.results[0].forEach(item => {
              if(item.ID === '1'){
                leaguename.push(item.NA)
                const newArray = [item,[]]
                fullapi.push(newArray)
              }else if(item.type === 'EV'){
                leaguename.forEach(item2 => {
                  if (item.CT.indexOf(item2) > -1) {
                    fullapi[fullapi.length - 1][1].push(item)
                  }
                })
              }
            })
            fullapi.forEach(item => {
              if (item[0].NA !== 'Soccer') {
                leaguearrays.push(item)
              }
            })
            this.transCountry(leaguearrays)
            if (this.$store.state.auth.role === 'U1') {
              if (this.$store.state.liveleaguesname.length > 0) {
                var newleagues = leaguearrays.filter(item1 => 
              !this.$store.state.liveleaguesname[0].some(item2 => (item2.name === item1[0].NA)))
              }else{
                newleagues = leaguearrays
              }
            } else {
              newleagues = leaguearrays
            }
            setTimeout(() => {
              let test = []
              this.liveList = newleagues
              newleagues.forEach(element => {
                element[1].forEach(element2 => {
                  test.push(element)
                })
              })
              this.liveListLength = test.length
              this.search = newleagues
            }, 100)
          }
          if(this.sportBox === '18') {
            result.data.results[0].forEach(item => {
              if(item.ID === '18'){
                leaguename.push(item.NA)
                const newArray = [item,[]]
                fullapi.push(newArray)
              }else if(item.type === 'EV'){
                leaguename.forEach(item2 => {
                  if (item.CT.indexOf(item2) > -1) {
                    fullapi[fullapi.length - 1][1].push(item)
                  }
                })
              }
            })
            fullapi.forEach(item => {
              if (item[0].NA !== 'Basketball') {
                leaguearrays.push(item)
              }
            })
            setTimeout(() => {
              this.liveList = leaguearrays
              this.liveListLength = leaguearrays.length
              this.search = leaguearrays
            }, 100)
          }
          this.loader = false
        }, 200)
      })
    },
    getMatchMinutes(fs, tt, tu, tm, ts){
      this.matchMinutes = ''
      var current = moment().tz('Europe/London').format('YYYY-MM-DD H:mm:ss')
      var currenttimesamp = moment(current).unix()
      if (fs === '0') {
        return this.matchMinutes = 'Başlamadı'
      }else{
        if (this.sportBox === '1') {
          if(tt === '1'){
            var tu = moment(tu, 'YYYY-MM-DD H:mm:ss')
            var cts = currenttimesamp-moment(tu).unix()
            var cs = Math.floor(parseInt(cts)+parseInt(ts))
            return this.matchMinutes =  (parseInt(cs/60) + parseInt(tm)) +'. '+'Dakika'
          }else if(tt === '0' && tm === '45'){
            return this.matchMinutes = 'Devre'
          }else if(tt === '0' && tm === '90'){
            return this.matchMinutes = 'Maç Sona Erdi'
          }
        }else{
          if (tt === '1') {
            var tu = moment(tu, 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD H:mm:ss')
            var cts = currenttimesamp-moment(tu).unix()
            var cs = Math.floor(parseInt(cts)+parseInt(ts))
            this.matchMinutes = parseInt(cs/60) + parseInt(tm) 
          }else{
            this.matchMinutes = parseInt(tm) +'. dk  Duraklama'
          }
        }
      }
    },
    getLiveOdds(id, teamname) {
      this.liveHandel = true
      this.options = true
      this.liveId = id
      this.loader = true
      this.liveOddsFunc()
      this.loader = false
      this.matchTeams = teamname
      this.setActive ('fulltime')
      if (this.liveHandel) {
        this.intervalLiveOdds = setInterval(() => {
          this.liveOddsFunc()
        }, 10 * 1000)
      }
       this.goTop()
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async liveOddsFunc(){
      await axios.get(`/api/home/inplayodds/${this.liveId}`).then((result) => {
        var current = moment().tz('Europe/London').format('YYYY-MM-DD H:mm:ss')
        var currenttimesamp = moment(current).unix()
        result.data.results[0].forEach(item => {
          if (item.type === 'EV') {
            if (item.FS === '0') {
              this.matchTime = 'Başlamadı'
            }else {
              this.liveOdds = result.data.results
              if (this.sportBox === '1') {
                if(item.TT === '1'){
                  var tu = moment(item.TU, 'YYYY-MM-DD H:mm:ss')
                  var cts = currenttimesamp-moment(tu).unix()
                  var cs = Math.floor(parseInt(cts)+parseInt(item.TS))
                  this.matchTime = parseInt(cs/60) + parseInt(item.TM)
                }else if(item.TT === '0' && item.TM === '45'){
                  this.matchTime = 'Devre'
                }else if(item.TT === '0' && item.TM === '90'){
                  this.matchTime = 'Maç Sona Erdi'
                }
              } else {
                if (item.TT === '1') {
                  var tu = moment(item.TU, 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD H:mm:ss')
                  var cts = currenttimesamp-moment(tu).unix()
                  var cs = Math.floor(parseInt(cts)+parseInt(item.TS))
                  this.matchTime = parseInt(cs/60) + parseInt(item.TM) 
                  this.period = item.MD + '.Çeyrek'
                }else{
                  this.matchTime = parseInt(item.TM) +'. dk  Duraklama'
                  this.period = item.MD + '.Çeyrek'
                }
              }
            }
          }
        })
        let stats1 = []
        let stats2 = []
        result.data.results[0].forEach(item => {
          if (item.ID === '0' && item.type === 'SL' && item.D1 !== '-') {
            stats1.push(item.D1)
          }
        })
        result.data.results[0].forEach(item => {
          if (item.ID === '1' && item.type === 'SL' && item.D1 !== '-') {
            stats2.push(item.D1)
          }
        })
        setTimeout(() => {
          this.statsHome = stats1
          this.statsAway = stats2
          const newApi = []
          result.data.results[0].forEach(item => {
            if(item.type === 'MA'){
              const newArray = [item,[]]
              newApi.push(newArray)
            }else if(item.type === 'CO'){
              newApi[newApi.length-1][1].push([item])
            }else if(item.type === 'PA' && item.ID !== '0' && item.ID !== ''){
              const PA = newApi[newApi.length-1][1]
              PA[PA.length-1].push(item)
            }
          })
          if (this.$store.state.auth.role === 'U1') {
            setTimeout(() => {
              if (this.$store.state.livemarketsid.length > 0) {
                this.marketName = newApi.filter(item1 => 
                !this.$store.state.livemarketsid[0].some(item2 => (item2.id.toString() === item1[0].ID)))
              }else{
                this.marketName = newApi
              }
            }, 100)
          } else {
            this.marketName = newApi
          }
          if (this.sportBox ==='1') {
            setTimeout(() => {
              this.fullTime = []
              this.marketName.forEach(item => {
                item.forEach(item2 => {
                  if(item2.type === 'MA'){
                    if (item2.ID === '1777'  
                      || item2.ID === '10124'
                      || item2.ID === '50193'
                      || item2.ID === '10115'
                      || item2.ID === '10563'
                      || item2.ID === '10562'
                      || item2.ID === '50461'
                      || item2.ID === '50189'
                      || item2.ID === '50276'
                      || item2.ID === '50277'
                      || item2.ID === '10147'
                      || item2.ID === '10159'
                      || item2.ID === '50276'
                      || item2.ID === '50277'
                      || item2.ID === '1786') {
                        this.fullTime.push(item)
                      }
                  }
                })
              })
            }, 300)
          }else if(this.sportBox === '18'){
            this.fullTime = []
            newApi.forEach(item => {
              item.forEach(item2 => {
                if(item2.type === 'MA'){
                  if (item2.NA === 'Maç Sonu'
                  || item2.NA === 'Maç Handikap'
                  || item2.NA === 'Alt/Üst 2 li'
                  || item2.NA === 'Takımlar Alt/Üst'
                  || item2.NA === 'Galibiyet Aralığı'
                  || item2.NA === 'Galibiyet Aralığı 3 lü'
                  || item2.NA === 'Maç Uzatmaya Gidermi'
                  || item2.NA === 'Toplam Tek/Çift'
                  || item2.NA === 'Maç Handikap 3 lü') {
                      this.fullTime.push(item)
                    }
                }
              })
            })
          }
        }, 100)
        this.transColumn(result.data.results[0])
        if (this.sportBox === '1') {
          this.transMarketsSoccer(result.data.results[0])
          this.transOddsSoccer(result.data.results[0])
        }
        if (this.sportBox === '18') {
          this.transMarketsBasket(result.data.results[0])
          this.transOddsBasket(result.data.results[0])
        }
      })
    },
    searchFilter () {
      let searchArray = []
      this.search.forEach(item => {
        if (item[0].NA.toLowerCase().indexOf(this.searchBox.toLowerCase()) > -1) {
          searchArray.push(item)
          this.liveListLength = searchArray.length
        }
      })
      this.liveList = searchArray
    },
    transCountry (value) {
      value.forEach(item => {
        let countryname = item[0].NA
          .replace('England Championship','ingiltere Şampiyonlar Ligi')
          .replace('Algeria','Cezayir')
          .replace('Asia','Asya')
          .replace('Friendlies','Dostluk Maçları')
          .replace('Cuba','Küba')
          .replace('Championship',' Şampiyonlar Ligi')
          .replace('Armenia','Ermenistan')
          .replace('Argentina','Arjantin')
          .replace('Albania','Arnavutluk')
          .replace('Africa','Afrika')
          .replace('U23 Afrika','Afrika U23')
          .replace('Australia','Avusturalya')
          .replace('Avusturalya & Oceania','Avusturalya')
          .replace('Austria','Avusturya')
          .replace('Azerbaijan','Azerbaycan')
          .replace('Belarus','Rusya Beyaz')
          .replace('Bolivia','Bolivya')
          .replace('Bosnia','Bosna Hersek')
          .replace('Brazil','Brezilya')
          .replace('Brezilyaian','Brezilya')
          .replace('Bulgaria','Bulgaristan')
          .replace('Canada','Kanada')
          .replace('Cameroon','Kamerun')
          .replace('Cape Verde','Fildişi Sahili')
          .replace("Côte d'Ivoire",'Fildişi Sahili')
          .replace('Colombia','Kolombiya')
          .replace('China','Çin')
          .replace('Cambodia','Kamboçya')
          .replace('Chile','Şili')
          .replace('Costa Rica','Kosta Rika')
          .replace('Cyprus','Kıbrıs')
          .replace('Croatia','Hırvatistan')
          .replace('Czech Republic','Çek Cumhuriyeti')
          .replace('Belgium','Belçika')
          .replace('Denmark','Danimarka')
          .replace('Dominican Republic','Dominik Cumhuriyeti')
          .replace('DR Congo','Kongo')
          .replace('Ecuador','Ekvator')
          .replace('Egypt','Mısır')
          .replace('England','ingiltere')
          .replace('Estonia','Estonya')
          .replace('Ethiopia','Etyopya')
          .replace('Europe','Avrupa')
          .replace('France','Fransa')
          .replace('Faroe Islands','Faroe Adaları')
          .replace('FYR of Macedonia','Makedonya')
          .replace('Georgia','Gürcistan')
          .replace('Germany','Almanya')
          .replace('Ghana','Gana')
          .replace('Greece','Yunanistan')
          .replace('Gulf','Papua Yeni Gine')
          .replace('Hungary','Macaristan')
          .replace('Italy','italya')
          .replace('Iceland','izlanda')
          .replace('India','Hindistan')
          .replace('Indonesia','Endenozya')
          .replace('International','Uluslararası')
          .replace('Republic of Ireland','irlanda Cum')
          .replace('Iraq','Irak')
          .replace('Iran','iran')
          .replace('Ireland','irlanda')
          .replace('Israel','israil')
          .replace('Ivory Coast','Fildişi Sahili')
          .replace('Japan','Japonya')
          .replace('Jordan','Urdün')
          .replace('Kazakhstan','Kazakistan')
          .replace('Korea Republic','Kore Cumhuriyeti')
          .replace('Kosovo','Kosova')
          .replace('Kongo','Kongo Cumhuriyeti')
          .replace('Kyrgyzstan','Kırgızistan')
          .replace('Latvia','Letonya')
          .replace('Lebanon','Lübnan')
          .replace('Lithuania','Litvanya')
          .replace('Macedonia','Makedonya')
          .replace('Malaysia','Malezya')
          .replace('Mauritania','Marutanya')
          .replace('Mexico','Meksika')
          .replace('Moldova','Moldovya')
          .replace('Morocco','Fas')
          .replace('Maldives','Maldivler')
          .replace('Netherlands','Hollanda')
          .replace('Holland','Hollanda')
          .replace('Nigeria','Nijerya')
          .replace('New Caledonia','Yeni Kaledonya')
          .replace('New Zealand','Yeni Zellanda')
          .replace('Northern İrlanda','irlanda Kuzey')
          .replace('North & Central America','Amerika')
          .replace('Norway','Norveç')
          .replace('Nicaragua','Nikaraguay')
          .replace('Oman','Umman')
          .replace('Qatar','Katar')
          .replace('Poland','Polonya')
          .replace('Palestine','Filistin')
          .replace('Portugal','Portekiz')
          .replace('Republic of the Congo','Kongo Cumhuriyeti')
          .replace('Russia','Rusya')
          .replace('Romania','Romanya')
          .replace('Réunion','Reunion')
          .replace('Saudi Arabia','Sudi Arabistan')
          .replace('Turkey','Türkiye')
          .replace('Seychelles','Seyşeller')
          .replace('Switzerland','isviçre')
          .replace('Spain','ispanya')
          .replace('Spain Copa del Rey','ispanya Kral Kupası')
          .replace('Sweden','isveç')
          .replace('South Korea','Kore Güney')
          .replace('South Afrika','Afrika Güney')
          .replace('South America','Amerika Güney')
          .replace('Slovakia','Slovakya')
          .replace('Serbia','Sırbistan')
          .replace('Scotland','iskoçya')
          .replace('Syria','Suriye')
          .replace('Tanzania','Tanzanya')
          .replace('Tajikistan','Tacikistan')
          .replace('Thailand','Tayland')
          .replace('Taiwan','Tayvan')
          .replace('Tournament','Turnuvası')
          .replace('Tunisia','Tunus')
          .replace('Ukraine','Ukrayna')
          .replace('Uruguay','Uruguay')
          .replace('United Arab Emirates','Birleşik Arap Emirlikleri')
          .replace('UAE','Birleşik Arap Emirlikleri')
          .replace('UEFA Champions Ligi','UEFA Şampiyonlar Ligi')
          .replace('Wales','Galler')
          .replace('World','Dünya')
          .replace('Womens','Kadınlar')
          .replace('Euro','Avrupa')
          .replace('Qualifying','Elemeleri')
          .replace('iskoçya Ligi Challenge Kupası','iskoçya Lig Kupası')
          .replace('USA','Amerika')
          .replace('Matches','Maçları')
          .replace('Superliga','Süperligi')
          .replace('CONCACAF','Amerika Karayipler')
          .replace('Ermenistann','Ermenistan')
          .replace('Kupa Peru','Peru')
          .replace('Women','Kadınlar')
          .replace('Matches','Maçları')
          .replace('Lancashire','ingiltere')
          .replace('Kupa Sudamericana','Amerika Suda Kupasi')
          .replace('Basketball Champions Ligi Americas','Amerika Şampiyonlar Ligi')
        item[0].NA = countryname
      })
    },
    transColumn (value) {
      value.forEach(element => {
         if (element.type === 'CO' && element.NA !== undefined) {
          let marketname = element.NA
            .replace('Count','Sayı')
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Exactly','Kesin')
            .replace('Neither','Hiçbiri')
            .replace('Draw','Beraberlik')
            .replace('No Goal Before','Erken Gol Olmaz')
            .replace('Goal Before','Erken Gol Olur')
            .replace('Yes','Evet')
            .replace('No','Hayır')
           element.NA = marketname
         }
      })
    },
    transMarketsSoccer (value) {
       value.forEach(element => {
         if (element.type === 'MA' && element.NA !== undefined) {
          let marketname = element.NA
            .replace('1st','1.')
            .replace('2nd','2.')
            .replace('3rd','3.')
            .replace('4th','4.')
            .replace('5th','5.')
            .replace('6th','6.')
            .replace('7th','7.')
            .replace('8th','8.')
            .replace('9th','9.')
            .replace('10th','10.')
            .replace('11th','11.')
            .replace('12th','12.')
            .replace('13th','13.')
            .replace('14th','14.')
            .replace('15th','15.')
            

            .replace('Fulltime Result','Maç Sonu')
            .replace('Double Chance','Çifte Şans')
            .replace('Draw No Bet','Beraberlikte iade')
            .replace('Goals Odd/Even','Tek/Çift')
            .replace('Match Goals','Maç Sonu ve Alt/Üst')
            .replace('Match Time Result','Maç Zamanı Sonucu')
            .replace('Result / Both Teams To Score','Maç Sonu ve İki Takım Gol')
            .replace('3-Way Handicap','Maç Handikap')

            .replace('Half Time Result','İlk Yarı Sonucu')
            .replace('First Half Goals','İlk Yarı Alt/Üst')
            .replace('Half Time/Full Time','İlk Yarı ve Maç Sonu')
            .replace('Half Time Correct Score','İlk Yarı Kesin Skor')
            .replace('1. Half Goal Line','İlk Yarı Gol Aralığı')
            .replace('Both Teams to Score in 1. Half','İlk Yarı İki Takım da Gol Atarmı')
            .replace('1. Half Corners','İlk Yarı Kornerler')
            .replace('1. Half - Handicap','İlk Yarı Handikap')
           
            .replace('Both Teams to Score in 2. Half','İkinci Yarı İki Takım da Gol Atarmı')
            .replace('To Win 2. Half','İkinci Yarı Kazananı')
            .replace('Team to Score in 2. Half','İkinci Yarı Hangi Takım Gol Atar')
            .replace('2. Half Corners','İkinci Yarı Kornerler')
           
            .replace('Final Score','Kesin Skor')
            .replace('Team to Score in Both Halves','Hangi Takım İki Yarıda Gol Atar')
            .replace('Both Teams to Score','İki Takım da Gol Atarmı')
            .replace('Goal Line','Gol Aralığı')
            .replace('Last Team to Score','Son Golü Hangi Takım Atar')
            .replace('Exact Goals','Gol Sayısı')
            .replace('Ten Minute Goals','10 Dakika Olayı Alt/Üst')
            .replace('Team Clean Sheet','Hangi Takım Gol Yemez')

            .replace('Total Corners','Kornerler')
            .replace('2-Way Corners','Kornerler 2 li')
            .replace('1st Half Corners','İlk Yarı Kornerler')
            .replace('2nd Half Corners','İkinci Yarı Kornerler')
            .replace('Last Corner','Son Korner')
            .replace('Corner','Korner')

            .replace('Time of','Erken Gol')

            .replace('Goals','Gol')
            .replace('Goal','Gol')
            
           element.NA = marketname
         }
      })
    },
    transOddsSoccer (value) {
      value.forEach(element => {
         if (element.type === 'PA' && element.NA !== undefined) {
          let marketname = element.NA
            .replace('Count','Sayı')
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Exactly','Kesin')
            .replace('Neither','Hiçbiri')
            .replace('Draw - Draw','Beraberlik - Beraberlik')
            .replace('Draw','Beraberlik')
            .replace('Win in Extra Time','Uzatmalar')
            .replace('Win after Penalties','Penaltilar')
            .replace(/No Goals/,'Gol Olmaz')
            .replace('Odd','Tek')
            .replace('Even','Çift')
            .replace(' or ',' ve ')
            .replace('1st','1.')
            .replace('2nd','2.')
            .replace('3rd','3.')
            .replace('4th','4.')
            .replace('5th','5.')
            .replace('6th','6.')
            .replace('7th','7.')
            .replace('8th','8.')
            .replace('9th','9.')
            .replace('10th','10.')
            .replace('Penalty','Penaltı')
            .replace('Free Kick','Serbest Vuruş')
            .replace('Header','Kafa')
            .replace(/Own Goal/,'Kendi Kalesine')
            .replace('Shot','Şut')
            .replace('No','Hayır')
            .replace(/^d{1}\s\Goal\d/,'Gol')
            .replace(/Gol Before/,'Olur < ')
            .replace(/Hayır Gol/,'Gol Olmaz < ')
            .replace('Hayır Erken Gol','Erken Gol Olmaz ')
            .replace('Yes','Evet')
            .replace('Goals','Gol')
            .replace('Goal','Gol')
            .replace('Gol Before','Erken Olur ')
            .replace('Hayır Erken Olur','Erken Olmaz ')
            .replace(/Hayır \d. Gol/,'Gol Olmaz ')
           element.NA = marketname
         }
      })
      value.forEach(element => {
         if (element.type === 'PA' && element.HA !== undefined) {
          let marketname = element.HA
            .replace('Count','Sayı')
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Exactly','Kesin')
            .replace('Neither','Hiçbiri')
            .replace('Draw - Draw','Beraberlik - Beraberlik')
            .replace('Draw','Beraberlik')
            .replace('Yes','Evet')
           element.HA = marketname
         }
      })
      value.forEach(element => {
         if (element.type === 'PA' && element.LA !== undefined) {
          let marketname = element.LA
            .replace('Goal','Gol')
            .replace('Card','Kart')
            .replace('Gol Kick','Gol Vuruşu')
            .replace('Free Kick','Serbest Vuruş')
            .replace('Corner','Korner')
            .replace('Penalty Awarded','Penaltı')
            .replace('Throw In','Oyuncu Degişiklgi')
           element.LA = marketname
         }
      })
      value.forEach(element => {
         if (element.type === 'PA' && element.BS !== undefined) {
          let marketname = element.BS
            .replace('& Yes','ve Evet')
            .replace('Yes','Evet')
            .replace('& No','ve Hayır')
            .replace('No','Hayır')
            .replace('Draw','Beraberlik')
            .replace('to score in 2nd half','Gol Atar')
            .replace('not Gol Atar',' Gol Atamaz')
           element.BS = marketname
         }
      })
    },
    transMarketsBasket (value) {
       value.forEach(element => {
         if (element.type === 'MA' && element.NA !== undefined) {
          let marketname = element.NA
            .replace('Money Line','Maç Sonu')
            .replace('Odd/Even','Tek/Çift')
            .replace('Game Total','Toplam')
            .replace('Handicap','Handikap')
            .replace('Winner','Kazananı')
            .replace('Total','Alt/Üst')
            .replace('Team Toplams','Takimlar Alt/Üst')
            .replace("Both Teams to Score 'X' Points",'Her iki Takım Basket')
            .replace("Highest Scoring Half",'En Yüksek Basket Devresi')
            .replace("To Score",'Basket')
            .replace("Points",'Sayı')
            .replace("points",'Sayı')
            .replace("Double Chance",'Çifte Şans')
            .replace("Margin of Victory",'Galibiyet Farkı')
            .replace("Winning Margin",'Galibiyet Aralığı')
            .replace("Match Result",'Maç Sonucu')
            .replace("Point Spread 3-Way",'Maç Handikap 3 lü')
            .replace("Spread",'Maç Handikap')
            .replace("Toplam 2-Way",'Alt/Üst 2 li')
            .replace("Double Result",'Çifte Sonuç')
            .replace("Will There Be Overtime",'Maç Uzatmaya Gidermi')
            .replace("Alt/Üst Tek/Çift",'Toplam - Tek/Çift')
            .replace("Team Alt/Üsts",'Takımlar Alt/Üst')
            .replace("Result",'Sonucu')
            .replace('Handikap - 3-way','Handikap 3 lü')
            .replace("Maç Sonucu and Alt/Üst",'Maç Sonucu ve Alt/Üst')
            .replace("Alternative",'Alternatif')
            .replace("Alt/Üsts",'Alt/Üst')
            .replace("Alternatif Point Maç Handikap",'Alternatif Maç Handikap')
            .replace("Team to Score Last Basket",'Son Basket')
            .replace('(3-Way)','3 lü')
            .replace('(2-Way)','2 li')
            .replace('3-Way','3 lü')
            .replace("Race to",'Yarışı')
            .replace("1st Half",'ilk Yarı')
            .replace('2nd Half','ikinci Yarı')
            .replace('1st Quarter','1.Çeyrek')
            .replace('2nd Quarter','2.Çeyrek')
            .replace('3rd Quarter','3.Çeyrek')
            .replace('4th Quarter','4.Çeyrek')
            .replace('Both Teams Basket','iki Takım Basket ')
           element.NA = marketname
         }
      })
    },
    transOddsBasket (value) {
      value.forEach(element => {
         if (element.type === 'PA' && element.NA !== undefined) {
          let marketname = element.NA
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Tie','Eşitlik')
            .replace('Any Other Result','Diger Sonuçlar')
            .replace('or more','veya  daha fazla')
            .replace('or Draw','veya  Beraberlik')
            .replace('Neither','Hiçbiri')
            .replace('to score','Basket')
            .replace('not to score','Basket Olmaz')
            .replace('Exactly','Kesin')
            .replace('Yes','Evet')
            .replace('No','Hayır')
            .replace('Odd','Tek')
            .replace('Even','Çift')
            .replace('1st Half','ilk Yarı')
            .replace('2nd Half','ikinci Yarı')
            .replace('Even','Çift')
            .replace('Both Teams Basket','iki Takım Basket ')
           element.NA = marketname
         }
      })
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    },
    getFirstHalf(){
      this.firstHalf = []
      this.marketName.forEach(item => {
        item.forEach(item2 => {
          if(item2.type === 'MA'){
            if (item2.ID === '50346'
              || item2.ID === '10561'
              || item2.ID === '10160'
              || item2.ID === '10568'
              || item2.ID === '10161'
              || item2.ID === '10560'
              || item2.ID === '50390'
              || item2.ID === '10171'
            ) {
                this.firstHalf.push(item)
              }
          }
        })
      })
    },
    getSecondHalf(){
      this.secondHalf = []
      this.marketName.forEach(item => {
        item.forEach(item2 => {
          if(item2.type === 'MA'){
            if (item2.ID === '50391'
              || item2.ID === '50246'
              || item2.ID === '50180'
              || item2.ID === '50197'
            ) {
                this.secondHalf.push(item)
              }
          }
        })
      })
    },
    getGoals(){
      this.goals = []
      this.marketName.forEach(item => {
        item.forEach(item2 => {
          if(item2.type === 'MA'){
            if (item2.ID === '50365'  
              || item2.ID === '10565'
              || item2.ID === '10564'
              || item2.ID === '10566'
              || item2.ID === '10567'
              || item2.ID === '50396'
              || item2.ID === '50397'
              || item2.ID === '50162'
              || item2.NA.match(/[0-9]\.\sGol$/)
              || item2.NA.match(/Gol Aralığı\s.+/)
              || item2.ID === '10562'
              || item2.NA.indexOf('Gol Zamanı')>-1
              || item2.NA === '1.Gol'
              || item2.NA === '2.Gol'
              || item2.NA === '3.Gol'
              || item2.NA === '4.Gol'
              || item2.NA === '5.Gol'
              || item2.NA === '6.Gol'
              || item2.NA === '7.Gol'
              || item2.NA === '8.Gol'
              || item2.NA === '9.Gol'
              || item2.NA === '10.Gol'
              || item2.ID === '50166') {
                this.goals.push(item)
              }
            }
          })
        })
    },
    getCorners(){
      this.corners = []
        this.marketName.forEach(item => {
          item.forEach(item2 => {
            if(item2.type === 'MA'){
              if (item2.ID === '1780'
                || item2.ID === '50187'
                || item2.ID === '10160'
                || item2.ID === '10515'
                || item2.ID === '10516'
                || item2.ID === '50197'
              ) {
                this.corners.push(item)
              }
            }
          })
        })
    },
    getHandicap(){
      this.handicap = []
      this.marketName.forEach(element => {
        element.forEach(element2 => {
          if(element2.type === 'MA'){
            if (element2.NA.indexOf('Handikap')>-1) {
                this.handicap.push(element)
              }
            }
          })
        })
    },
    //basket
    getFirstHalfBasket(){
      this.firstHalfBasket = []
      this.marketName.forEach(item => {
        item.forEach(item2 => {
          if(item2.type === 'MA'){
            if (item2.ID === '50346'
              || item2.ID === '10561'
              || item2.ID === '10160'
              || item2.ID === '10568'
              || item2.ID === '10161'
              || item2.ID === '10560'
              || item2.ID === '50390'
              || item2.ID === '10171'
            ) {
                this.firstHalfBasket.push(item)
              }
          }
        })
      })
    },
    getSecondHalfBasket(){
      this.secondHalfBasket = []
      this.marketName.forEach(item => {
        item.forEach(item2 => {
          if(item2.type === 'MA'){
            if (item2.ID === '50391'
              || item2.ID === '50246'
              || item2.ID === '50180'
              || item2.ID === '50197'
            ) {
                this.secondHalfBasket.push(item)
              }
          }
        })
      })
    },
    getFirstQuarter(){
      this.firstQuarter = []
      this.marketName.forEach(element => {
        element.forEach(element2 => {
          if(element2.type === 'MA'){
            if (element2.NA.indexOf('1.Çeyrek')>-1) {
              this.firstQuarter.push(element)
            }
          }
        })
      })
    },
    getSecondQuarter(){
      this.secondQuarter = []
      this.marketName.forEach(element => {
        element.forEach(element2 => {
          if(element2.type === 'MA'){
            if (element2.NA.indexOf('2.Çeyrek')>-1) {
              this.secondQuarter.push(element)
            }
          }
        })
      })
    },
    getThirdQuarter(){
      if (this.sportBox === '18') {
        this.thirdQuarter = []
        this.marketName.forEach(element => {
          element.forEach(element2 => {
            if(element2.type === 'MA'){
              if (element2.NA.indexOf('3.Çeyrek')>-1) {
                this.thirdQuarter.push(element)
              }
            }
          })
        })
      }
    },
    getFourthQuarter(){
      if (this.sportBox === '18') {
        this.fourthQuarter = []
        this.marketName.forEach(element => {
          element.forEach(element2 => {
            if(element2.type === 'MA'){
              if (element2.NA.indexOf('4.Çeyrek')>-1) {
                this.fourthQuarter.push(element)
              }
            }
          })
        })
      }
    },
    addSlip (market, opt, column, ha, la, bs, rate) {
      let option = ''
      if (market === 'Maç Zamanı Sonucu') {
        option = opt +' '+ la
      }else if(market === 'Hangi Takım Gol Yemez' || market === 'Hangi Takım İki Yarıda Gol Atar' || market === 'İkinci Yarı Hangi Takım Gol Atar' || market === 'Maç Sonu ve İki Takım Gol'){
        option = bs
      }else if (market === 'Maç Sonu ve Alt/Üst' 
      || market === 'İlk Yarı Alt/Üst' 
      || market === 'Kornerler 2 li' 
      || market === 'İlk Yarı Kornerler' 
      || market.indexOf('İlk Yarı Asya Handikap')>-1 
      || market.indexOf('İlk Yarı Gol Aralığı')>-1 
      || market === 'Kornerler Asya' 
      || market === 'İlk Yarı Kornerler Asya' 
      || market === 'Maç Handikap' 
      || market === 'İlk Yarı Handikap'){
        if(market === 'İlk Yarı Kornerler'
        || market === 'Maç Handikap'
        || market === 'İlk Yarı Handikap'
        || market.indexOf('İlk Yarı Asya Handikap')>-1 
        || market.indexOf('İlk Yarı Gol Aralığı')>-1 ){
          option = opt +' '+ column +' '+ ha
        }else {
          option = opt  +' '+ ha
        }
      }else if (market === 'Kornerler' 
      || market === 'İlk Yarı Kesin Skor' 
      || market === 'Kesin Skor'
      || market === 'Kornerler Yarışı'){
        option = opt  +' '+ column
      }else {
        option = opt
      }
      let newrate = 0
      if (this.$store.state.auth.role === 'U1' && this.$store.state.auth.liverate !== '0') {
        let rateparam = rate.split('/')[0] / rate.split('/')[1] + 1
        if (rateparam !== undefined) {
          if (this.$store.state.auth.liveoperate === 'minus') {
            newrate = (rateparam - this.$store.state.auth.liverate).toFixed(2)
          } else if(this.$store.state.auth.liveoperate === 'adding'){
            newrate = (rateparam + parseFloat(this.$store.state.auth.liverate)).toFixed(2)
          }
        }
      }else{
        newrate = (rate.split('/')[0] / rate.split('/')[1] + 1).toFixed(2)
      }
      this.slips = {
        code: this.liveId.toString().slice(-4),
        betref: 0,
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        match: this.matchTeams,
        games: market,
        option: option,
        rate: newrate,
        stream: 'Canlı',
        branch: 'F',
        state: 'Aktif',
        scoreid:0
      }      
      if (!this.$store.state.betslip){
        this.$store.commit('setBetSlip', true)
      }
      setTimeout(() => {
        if (this.$store.state.slips.length > 0) {
          let test = this.$store.state.slips.find(o => o.match === this.matchTeams)
          if (test === undefined) {
            this.$store.commit('setSlips', this.slips)
          }
        } else {
          this.$store.commit('setSlips', this.slips)
        }
      }, 50)
    },
    addSlipBasket (market, opt, column, ha, rate) {
      let option = ''
      if (market.indexOf('Handikap')>-1
      || market.indexOf('Alt/Üst')>-1
      ) {
        option = opt +' '+ ha
      }else {
        option = opt
      }
      this.slips = {
        code: 0,
        betref:0,
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        match: this.matchTeams,
        games: market,
        option: option,
        rate: (rate.split('/')[0] / rate.split('/')[1] + 1).toFixed(2),
        stream: 'Canlı',
        branch: 'B',
        state: 'Aktif',
        scoreid:0
      }
     if (!this.$store.state.betslip){
        this.$store.commit('setBetSlip', true)
      }
      setTimeout(() => {
        if (this.$store.state.slips.length > 0) {
          let test = this.$store.state.slips.find(o => o.match === this.matchTeams)
          if (test === undefined) {
            this.$store.commit('setSlips', this.slips)
          }
        } else {
          this.$store.commit('setSlips', this.slips)
        }
      }, 50)
    }
  },
  beforeDestroy: function(){
    clearInterval(this.intervalLiveList)
    clearInterval(this.intervalLiveOdds)
  }
}
</script>