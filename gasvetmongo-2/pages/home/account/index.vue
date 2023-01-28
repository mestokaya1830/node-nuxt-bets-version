<template>
  <div class="pages">
    <div>
      <header class="title-2">
        <div class="quick-report-con">
          <span class="bitems bstate" v-if="!checkS3 && !checkB4">
            <select v-model="stateBox" class="selectbox box-bet" @change="getBetSummary()">
              <option value="Aktif" selected>Aktifler</option>
              <option value="Hepsi">Hepsi</option>
              <option value="Kazandi">Kazananlar</option>
              <option value="Kaybetti">Kaybedenler</option>
              <option value="iptal">İptaller</option>
              <option value="iade">İadeler</option>
            </select>
          </span>
          <div class="date-con" v-if="!checkS3 && !checkB4">
            <select v-model="quickDate" class="selectbox boxbet" @change="quickDatefilter()">
              <option value="Tarih" disabled>Tarih</option>
              <option value="today">Bugün</option>
              <option value="yesterday">Dün</option>
            </select>
          </div>
          <div class="input-con" v-if="!checkS3 && !checkB4">
          <input v-model="dateStart" type="date" class="input-date">
            <input v-model="dateFinish" type="date" class="input-date">
            <input type="button" value="ARA" class="btn btn-date bg-f" @click="filterAsDate()">
          </div>
          <div class="quick-report cl-g">
            <div>
              <span class="mr10">Adet:</span>
              <span class="cl-y">{{totalCount}}</span>
            </div>
            <div>
              <span class="mr10">Girdi:</span>
              <span class="cl-y">{{totalAmount | currency('', 2)}}</span>
            </div>
            <div>
              <span class="mr10">Kazanç:</span>
              <span class="cl-y">{{totalEarn | currency('', 2)}}</span>
            </div>
          </div>
        </div>
        <!-- <span class="badge bg-g">{{betSummary.length}}</span> -->
      </header>
      <div class="bet-con">
        <ul>
          <li class="title-ligth">
            <div class="blinks">
              <span class="bitems bno">NO</span>
              <span class="bitems betid">
                <div>
                  <input v-model="searchBox" type="number" @keyup="resetFilter()" @keyup.enter="getBetsummaryCode()" class="bet-inp" placeholder="Ara...">
                  <span class="searchbox-border"/>
                </div>
              </span>
              <span class="bitems cp">
                <span>
                  <span v-if="checkU1 || checkC1">SAHİP</span>
                  <span v-else>
                    <select v-model="userBox" class="selectbox box-bet select-owner" @change="getBetSummary()">
                      <option value="Üyeler" selected>Üyeler</option>
                      <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
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
            <span class="bitems bstate" v-if="checkB4">AKTİFLER</span>
            <span class="bitems bstate" v-else>
              <select v-model="stateBox" class="selectbox box-bet select-inner" @change="getBetSummary()">
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
          <div class="list-bet"  v-for="(list,index) in betSummary" :key="index" :class="list.state">
            <li class="blinks"  @click="getBets($event, index, list)">
              <span class="bitems-list bno">
                <span class="bno-inside bg-b">{{ index }}</span>
              </span>
              <span class="bitems-list betid" :class="{sumIdClass: betSum.sumid === list.sumid}">{{ list.sumid }}</span>
              <span v-if="checkC1 || checkU1" class="bitems-list bowner" :class="{filterBetClass: sortName === 'owner'}">{{ list.owner }}</span>
              <span v-if="checkG1 || checkA2" class="bitems-list bowner">{{ list.user | capitalize}}</span>
              <span v-if="checkB4" class="bitems-list bowner">{{ list.admin | capitalize}}</span>
              <span class="bitems-list bdate">{{list.date | dateFormat }}</span>
              <span class="bitems-list btime">{{list.date | timeFormat}}</span>
              <span class="bitems-list bcount">{{ list.betscountremain}} / {{list.betscount}}</span>
              <span class="bitems-list bamo">{{ list.amount | currency('', 0)}}</span>
              <span class="bitems-list brate">{{ list.rate  | currency('', 2)}}</span>
              <span class="bitems-list bearn">{{ list.earn  | currency('', 2)}}</span>
              <span class="bitems-list brate">{{ list.stream }}</span>
            </li>
            <span class="bitems-list bstate">
              <div class="payment-con" v-if="checkA2 && list.state === 'Kazandi'">
                <input type="button" class="bitems-button bg-b" v-if="list.adminpay === 'no'" value="ÖDE" @click="paymentBet(list,$event)"/>
                <i class="fas fa-thumbs-up cl-bl" v-if="list.adminpay === 'yes'"/>
              </div>
              <div class="payment-con" v-if="checkG1 && list.state === 'Kazandi'">
                <input type="button" class="bitems-button bg-y" v-if="list.adminpay === 'no'" value="BEKLİYOR" disabled/>
                <input type="button" class="bitems-button bg-b" v-if="list.adminpay === 'yes' && list.userpay === 'no'" value="ÖDE" @click="paymentBet(list, $event)"/>
                <i class="fas fa-thumbs-up cl-bl" v-if="list.userpay === 'yes'"/>
              </div>
              <div class="payment-con" v-if="checkU1 && list.state === 'Kazandi'">
                <input type="button" class="bitems-button bg-y" v-if="list.adminpay === 'no'" value="BEKLİYOR" disabled/>
                <input type="button" class="bitems-button bg-b" v-if="list.adminpay === 'yes' && list.userpay === 'no'" value="ÖDE" @click="paymentBet(list, $event)"/>
                <i class="fas fa-thumbs-up cl-bl" v-if="list.userpay === 'yes'"/>
              </div>
              <div class="payment-con" v-if="checkC1 && list.state === 'Kazandi'">
                <i class="fas fa-thumbs-up cl-bl"/>
              </div>
              <i class="fas fa-thumbs-down" v-if="list.state === 'Kaybetti'" />
              <i class="fas fa-bolt" v-if="list.state === 'iptal' && !error" @click="returnBet(list, index)" />
              <span v-if="error" class="cl-r">{{error}}</span>
              <i class="fas fa-retweet" v-if="list.state === 'iade'" />
              <i class="fas fa-balance-scale" v-if="list.state === 'Aktif'" />
              <i class="fas fa-trash-alt bet-cancel" v-if="list.state === 'Aktif' && checkA2" @click="cancelBet($event, list, index)" />
              <i class="fas fa-trash-alt bet-cancel" v-if="cancelTime(list.date) < $store.state.auth.usercancelbet &&  checkU1 && list.stream === 'Bülten' && list.state === 'Aktif'" @click="cancelBet($event, list, index)" />
              <i class="fas fa-trash-alt bet-cancel" v-if="cancelTime(list.date) < $store.state.auth.usercancelbet &&  checkG1 && list.stream === 'Bülten' && list.state === 'Aktif'" @click="cancelBet($event, list, index)" />
              <i class="fas fa-trash-alt bet-cancel" v-if="cancelTime(list.date) < $store.state.auth.personcancelbet && checkC1 && list.stream === 'Bülten' && list.state === 'Aktif'" @click="cancelBet($event, list, index)" />
            </span>
          </div>
          <div v-if="isDetailsHandel" class="bet-details-model">
            <div class="bet-details-con">
              <div  class="bet-details-inside">
                <header class="title-3">
                  <div>
                  <span>Kupon Detay</span>
                    <i class="fas fa-print cp fa-lg ml20 cl-y" v-print="'#printMe'"/>
                    <span class="ml20 cl-y cp" @click="removeInnerBet()"  v-if="checkA2 && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">iptal</span>
                    <span class="ml20 cl-y cp" @click="repeatBets(bets)" v-if="checkG1 &&  repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">Tekrar Yatır</span>
                    <span class="ml20 cl-y cp" @click="removeInnerBet()"  v-if="checkG1 && (cancelTime(betSum.date) < $store.state.auth.usercancelbet) && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">iptal</span>
                    <span class="ml20 cl-y cp" @click="repeatBets(bets)" v-if="checkU1 && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">Tekrar Yatır</span>
                    <span class="ml20 cl-y cp" @click="removeInnerBet()"  v-if="checkU1 && (cancelTime(betSum.date) < $store.state.auth.usercancelbet) && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">iptal</span>
                    <span class="ml20 cl-y cp" @click="repeatBets(bets)" v-if="checkC1 && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">Tekrar Yatır</span>
                    <span class="ml20 cl-y cp" @click="removeInnerBet()"  v-if="checkC1 && (cancelTime(betSum.date) < $store.state.auth.personcancelbet) && repeatTime && betSum.state === 'Aktif' && betSum.stream === 'Bülten'">iptal</span>
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
                      <span v-if="checkA2 || checkB4" class="bitems bstate">DURUM</span>
                    </li>
                  </ul>
                  <ul class="bet-details po-r">
                    <li class="list-bet details-list"  v-for="(list,index) in bets" :key="index" :class="{innerAktif:list.state === 'Aktif',Kazandi:list.state === 'Kazandi', Kaybetti:list.state === 'Kaybetti', iade:list.state === 'iade',iptalrepeat:list.sumid === cancelInner, iptal:list.state === 'iptal'}">
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
                      <div class="bitems-list bscore po-r" @click="getScoreDetails(list.scoreid)">
                        <span class="bscore-text" :class="{green:list.state === 'Aktif' && list.ts === '1', red: list.state === 'Aktif' && list.ts === '3'}">{{list.score}}</span>
                        <span v-if="list.ts === '1'" class="bscore-text bscore-tm">{{list.tm}}</span>
                        <span v-if="list.ts === '0'" class="nostart">Başlamadı</span>
                      </div>
                      <span v-if="list.code === isBetLoader" class="bitems-list bstate"><img src="~/assets/img/loader.gif" alt="" ></span>
                      <span v-if="checkA2 || checkB4 && list.code !== isBetLoader" class="bitems-list bstate">
                        <select v-model="list.state" class="selectbox" @change="setBetState(list)" v-if="list.state !== 'iptal'">
                          <option value="Aktif">Aktif</option>
                          <option value="Kazandi" v-if="list.state !== 'iade'">Kazandi</option>
                          <option value="Kaybetti">Kaybetti</option>
                          <option value="iade" v-if="list.state !== 'Kazandi' && list.state !== 'Kaybetti'">İade</option>
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
                        <!-- <div>
                          <span class="mr10">Brüt Kazanç:</span>
                          <span class="mr20">{{cuponbaseearn  | currency('', 2)}}</span>
                        </div> -->
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
        <notfound v-if="notfound" :message="notfound" class="not-found"/>
        <span class="page-end">Başka veri yoktur</span>
      </div>
      <div v-if="isWarningOpen" class="dialog warning warning-bet" :style="{top:top}">
        <header class="cancelbet-header"><span class="cancelbet-no">{{betSum.sumid}}</span></header>
          <p class="warning-text">Nolu Kupon İptal Edilsinmi!</p>
        <footer class="dialog-footer">
          <input type="button" value="Evet" class="btn-dialog bg-g" @click="removeBet()">
          <input type="button" value="Hayır" class="btn-dialog bg-r" @click="isWarningOpen = false">
        </footer>
      </div>
      <div v-if="isScore" class="dialog-score" :style="{top:top}">
        <header class="title-3">
          <h3>Detaylar</h3>
          <i class ="fas fa-window-close fa-lg dialog-close" @click="isScore = false"/>
        </header>
        <div class="dialog-score-con" v-if="scoreParts[0] && scoreParts[0].sport_id === '1'">
          <div class="score-top" v-if="scoreParts.length > 0 && scoreParts[0].ss !== null">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span class="bsh" v-if="scoreParts[0].extra">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div v-if="!scoreParts[0].scores[1] && scoreParts[0].scores[2]">
              <span class="bsh">İlk Yarı : {{scoreParts[0].scores[2].home}} - {{scoreParts[0].scores[2].away}}</span>
            </div>
            <div class="bscore-half" v-if="scoreParts[0].scores[1] && scoreParts[0].scores[2]">
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
        <div class="dialog-score-con" v-if="scoreParts[0] && scoreParts[0].sport_id === '18'">
          <div class="score-top" v-if="scoreParts.length > 0 && scoreParts[0].ss !== null">
            <span class="bsh">Maç Durumu  : {{matchStatus}}</span>
            <span class="bsh" v-if="scoreParts[0].extra">Maç Süresi  : {{scoreParts[0].extra.length}} dk</span>
            <div class="bscore-half" v-if="scoreParts[0].scores[3] && scoreParts[0].scores[5]">
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
import socket from '~/plugins/socket.io.js'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'betsummary',
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
      bets: {},
      betSum: {},
      betPrint: {},
      removeIndex: null,
      sortName: null,
      error: false,
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
      isLoader: false,
      isSubloader: false,
      isDetailsHandel: false,
      isSort: false,
      isBetLoader:false,
      isWarningOpen: false,
      betState:null,
      isScore:false,
      scoreParts:0,
      matchStatus:null,
      cancelInner:0,
      repeatTime:true
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetSummary()
    if (this.$store.state.auth.role === 'S3') {
      this.$router.push('/home/account/users')
    }
  },
  computed: {
    checkC1 () {
      if (this.$store.state.auth.role === 'C1') {
        return true
      }
    },
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
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
      let newEarn = (this.cuponbaseearn * this.$store.state.auth.personcomission) / 100
      return this.cuponbaseearn - newEarn
    }
  },
  filters: {
    dateFormat: (value) => {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("MM-DD")
    },
    timeFormat: (value) => {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("H:mm:ss")
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getBetSummary () {
      this.isLoader = true
      await axios.post('/api/home/account/betsummary', {userbox: this.userBox, statebox: this.stateBox}).then((result) => {
        if (result.data.betsummary) {
          this.betSummary = result.data.betsummary
          this.getTotal(result.data.betsummary)
        }
        this.isLoader = false
        this.notfound = false
      }).catch(err => {console.log(err)})
    },
    async getBets (event, index, list) {
      this.isLoader = true
      await axios.get('/api/home/account/betsummary/' + list.sumid).then((result) => {
        if (result.data.bets) {
          this.bets = result.data.bets
          this.isDetailsHandel = true
          this.betSum = list
          this.removeIndex = index
          this.isLoader = false
          this.cuponbaseearn = list.baseearn
          if (list.state === 'Aktif') {
            event.target.parentElement.parentElement.classList.add('innerAktif')
          } else {
            event.target.parentElement.parentElement.classList.add('betActive')
          }
          // this.getScores(result.data.bets)
        }
      }).catch(err => {console.log(err)})
    },
    async removeBet(index){
      this.isWarningOpen = false
      await axios.put('/api/home/account/cancelbet', {betsum: this.betSum}).then((result) => {
        if (result.data.code === 200) {
          this.betSummary.splice(this.removeIndex,1)
          this.betInfo()
          this.removeIndex = null
          this.betSum = {}
          axios.post('/api/home/account/betsummary', {userbox:this.userBox, statebox: 'Aktif'}).then((result) => {
            this.getTotal(result.data.betsummary)
          })
        }
      }).catch(err => {console.log(err)})
    },
    async removeInnerBet(){
      this.cancelInner = this.betSum.sumid
      await axios.put('/api/home/account/cancelbet', {betsum: this.betSum}).then((result) => {
        if (result.data.code === 200) {
          this.betSummary.splice(this.removeIndex,1)
          this.betInfo()
          this.removeIndex = null
          axios.post('/api/home/account/betsummary', {statebox: 'Aktif'}).then((result) => {
            this.getTotal(result.data.betsummary)
          })
        }
      })
    },
    async returnBet(betsum,index){
      await axios.put('/api/home/account/returnbet', {betsum: betsum}).then((result) => {
        if (result.data.code === 200) {
          this.betSummary.splice(index, 1)
          this.betInfo()
          this.betSum = {}
        }else{
          this.error = 'Yetersiz Kredi!'
        }
      })
    },
    async filterAsDate () {
      if (!this.dateFinish) {
       this.dateFinish = moment().add(1,'days').format('YYYY-MM-DD')
      }
      await axios.post('/api/home/account/betsummary/datefilter', {userbox: this.userBox, statebox: this.stateBox, datestart: this.dateStart, datefinish:this.dateFinish}).then((result) => {
        if (result.data.datefilter) {
          this.notfound = null
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
        } else {
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
        }
      }).catch(err => {console.log(err)})
    },
    async quickDatefilter () {
      let start = ''
      let end = ''
      if (this.quickDate === 'today') {
        start = moment().format('YYYY-MM-DD 00:00:00')
        end = moment().format('YYYY-MM-DD 24:00:00')
      } else {
        start = moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00')
        end = moment().subtract(1,'days').format('YYYY-MM-DD 24:00:00')
      }
      await axios.post('/api/home/account/betsummary/quickdatefilter', {userbox: this.userBox, statebox:this.stateBox, start: start, end: end}).then((result) => {
        if (result.data.datefilter) {
          this.isDateOpen = false
          this.notfound = null
          this.betSummary = result.data.datefilter
          this.getTotal(result.data.datefilter)
          this.quickDate = 'Tarih'
        } else {
          this.isDateOpen = false
          this.betSummary = result.data.datefilter
          this.notfound = 'Böyle bir kayıt bulunmamaktadır!'
          this.quickDate = 'Tarih'
        }
      }).catch(err => {console.log(err)})
    },
    async getScores(value){
      let scoreid = value.map(item => item.scoreid)
      await axios.get(`/api/home/scores/${scoreid}`).then((scores) => {
        this.isSubloader = false
        this.scores = scores.data
        this.repeatTime = scores.data.every(item => item.time_status === '0')
        value.forEach(item => {
          scores.data.forEach(item2 => {
            if (item.scoreid == item2.bwin_id) {
              if (item2.scores[1]) {
                {item.score = item2.scores[1].home +'-'+ item2.scores[1].away +' / '+ item2.ss}
              } else {
                {item.score = item2.ss}
              }
              {item.ts = item2.time_status}
              if (item2.timer) {
                {item.tm = item2.timer.tm}
              }
            }
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
      }).catch(err => {console.log(err)})
    },
    async closeDetails () {
      this.isSubloader = false
      this.scoreId = 0
      this.isDetailsHandel = false
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
          await axios.put('/api/home/account/setbetsummarystate', {betsum:this.betSum, betstate: betstate}).then((result) => {
            if (result.data.message !== 'active') {
              setTimeout(() => {
                this.betSummary.splice(this.removeIndex,1)
                this.removeIndex = ''
                this.getDetails = ''
                this.bets = {}
                this.betId = ''
                this.betInfo()
                this.getTotal(this.betSummary)
              }, 500)
            }
          }).catch(err => {console.log(err)})
        }
      }
    },
    async getScoreDetails(id){
      this.isScore = true
      if (this.scores.length > 0) {
        this.scoreParts = this.scores.filter(item => item.bwin_id == id)
        if (this.scoreParts.length > 0) {
          if (this.scoreParts[0].time_status === '0') {
            this.matchStatus = 'Başlamadı'
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
      const subcredit = await axios.post('/api/home/account/subcredit',{userbox:'Üyeler'})
      const active = await axios.post('/api/home/account/activeinfo',{userbox:'Üyeler'})
      const total = await axios.post('/api/home/account/totalinfo',{userbox:'Üyeler'})
      const won = await axios.post('/api/home/account/woninfo',{userbox:'Üyeler'})
      Promise.all([credit, subcredit, active, total, won]).then(result => {
        let final = {... result[0].data.creditinfo,... result[1].data.subcredit, ...result[2].data.activeinfo, ...result[3].data.totalinfo, ...result[4].data.woninfo}
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
      }).catch(err => {console.log(err)})
    },
    async getBetsummaryCode(){
      this.stateBox = 'Hepsi'
      await axios.post('/api/home/account/betsummarycode', {betid: this.searchBox}).then((result) => {
        if (result.data.betsummarycode.length > 0) {
          this.betSummary = result.data.betsummarycode
          this.searchBox = ''
        } else {
          this.betSummary = {}
          this.notfound = 'Kupon Yok!'
          this.searchBox = ''
        }
      }).catch(err => {console.log(err)})
    },
    cancelBet (event, betsum,index) {
      this.betSum = betsum
      this.removeIndex = index
      this.isWarningOpen = true
      this.top = (event.pageY - 300)+ 'px'
    },
    transEvent(value){
      if (value) {
        value.forEach(item => {
          let text = item.text
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
      let wonactive = value.filter(item => item.state === 'Aktif' || item.state === 'Kazandi')
      let amount = value.filter(item => item.state !== 'iade' && item.state !== 'iptal')
      let won = value.filter(item => item.state === 'Kazandi')
      this.totalCount = value.length
      this.totalAmount = amount.reduce((acc, item)=>{
        return acc + item.amount
      },0)
      let calcearn = wonactive.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      let ecpectactive = won.reduce((acc, item)=>{
        return acc + item.earn
      },0)
      this.totalEarn = calcearn
      if (this.stateBox === 'Hepsi') {
        if (this.$store.state.auth.role === 'C1') {
          this.totalEarn = ecpectactive - this.totalAmount
        } else {
          this.totalEarn = this.totalAmount - ecpectactive
        }
        
      }else{
        this.totalEarn = calcearn
      }
    },
    cancelTime (value) {
      let diff = Date.now() - new Date(value).getTime()
      return Math.floor((diff / 1000) / 60)
    },
    resetFilter(){
      if (this.searchBox.length === 0) {
        this.getBetSummary()
      }
    },
    print () {
      this.$htmlToPaper('printMe')
    },
    repeatBets(value){
      if (this.$store.state.slips.length === 0) {
        let repeatbet = value.filter(item => {
          if (item.stream === 'Bülten') {
            this.$store.commit('setSlips', item)
            this.$router.push('/home/soccerfixture')
            this.$store.commit('setBetSlip', true)
          }
        })
      } else {
        this.$router.push('/home/soccerfixture')
      }
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
