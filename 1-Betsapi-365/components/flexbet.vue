<template>
  <div class="flex-bet-form color-black-1">
    <i class="far fa-gem flexbet-icon" @click="getFlexBetHandel()"/>
    <div class="flex-bet" :class="{flexBetClass:!flexBetHandel}">
      <header class="flex-header">
        <input type="number" v-model="codeFlex" @keyup="jumpToOption()" @blur="resetCodeClass()" :class="{quickClass: !codeClass}" id="codeflex" class="inp quick-entry-inputs" minlength="3"   placeholder="Kod" required>
        <input type="text" v-model="optionInput" @focus="checkCodeEmpty()" @keyup="getOption()" @keyup.enter="addSlip()" @blur="resetOptionClass()" :class="{quickClass:!optionClass}" id="optionInput" class="inp quick-entry-inputs" placeholder="Seçim" required>
        <span class="badge bg-g ml20" v-if="!flexLoader">{{slips.length}}</span>
        <img src="~/assets/img/loader.gif" class="quick-slip-loader" alt="" v-if="flexLoader">
      </header>
      <div class="flex-list">
        <div class="slip-side-con">
          <div v-if="this.$store.state.flexbet">
            <div class="slip-con" v-show="!liveSlipLoader">
              <ul class="slip-item-con" id="printMe">
                <div class="print-title only-print">
                  <h3 class="slip-title">Bahislerim</h3>
                  <li class="slip-date">
                    <span class="slip-items">No: {{ slipSummary.betref }}</span>
                    <span class="slip-items">Tarih: {{ $moment(new Date(),'YYYY-MM-DD H:mm').format('YYYY-MM-DD H:mm') }}</span>
                  </li>
                </div>
                <li v-for="(list, index) in slips" :key="index" class="slip print-list">
                  <div class="slip-order">
                    <span class="slip-match">{{ list.match | uppercase }}</span>
                  </div>
                  <div class="slip-order">
                    <span class="slip-items slip-items-text">Bahis:</span>
                    <span class="slip-items slip-items-break">{{ list.games }}</span>
                  </div>
                  <div class="slip-order jcsb">
                    <div>
                      <span class="slip-items slip-items-text">Seçim:</span>
                      <span class="slip-items slip-items-break">{{ list.option }}</span>
                    </div>
                    <b class="slip-items slip-rate">{{ list.rate }}</b>
                  </div>
                  <i class="fas fa-trash-alt close slip-close no-print" @click="removeSlip(index)"/>
                </li>
                <ul class="print-result only-print"> 
                  <li class="info-con">
                    <span>Toplam Bahis: </span>
                    <span> {{ slipSummary.betscount }}</span>
                  </li>
                  <li class="info-con info-con-rate">
                    <span>Toplam Oran:</span>
                    <span> {{ getTotalRate }}</span>
                  </li>
                  <li class="info-con info-con-rate">
                    <span>Miktar:</span>
                    <span> {{ slipSummary.amount }}</span>
                  </li>
                  <li class="info-con">
                    <span>Toplam Kazanç:</span>
                    <span>{{ earn | currency('₺', 0) }}</span>
                  </li>
                </ul>
              </ul>
              <div class="slip-total-rate">
                <span><b>Oran</b> : {{ getTotalRate | currency('', 2)}}</span>
                <span><b>Kazanç</b> : {{ getEarnUpdate | currency('', 2)}}</span>
              </div>
              <div class="slip-total-rate remain-credit">
                <b>Kalan Kredi: </b>
                <span>{{creditRemain}}</span>
              </div>
              <div class="quick-owner">
                <span class="cl-g"><input type="checkbox" checked>Oran Değişimlerini Kabul Ediyorum</span>
                <input type="text" v-model="slipSummary.owner" class="inp inp-owner-center" placeholder="Kupon Sahibi">
              </div>
              <ul class="quick-amount-btn">
                <li v-for="btn in quickBtn" :key="btn" class="bet-rdb">
                  <input type="radio" :value="btn" :id="btn" v-model="slipSummary.amount" @change="getEarn()">
                  <label :for="btn"  class="betrdb-lbl">{{btn}}</label>
                </li>
              </ul>
              <div v-if="betMsg" class="bet-msg cl-r">
                <span>{{betMsg}}</span>
              </div>
              <div class="slip-form">
                <input type="number" step="5" min="5" v-model="slipSummary.amount" class="inp inp-slip" placeholder="Miktar" required  @input="getEarn()">
                <input type="button" class="clear" value="Temizle" @click="removeSlipAll()">
                <input type="submit" class="done" value="Yatır" @click="addBet()">
              </div>
            </div>
            <div class="live-slip" v-show="liveSlipLoader">
              <div class="live-sliploader-con" v-if="!dialog">
                <span class="live-slip-text">Kupon Yatırılıyor</span>
                <img src="~/assets/img/loader.gif" alt="" class="live-slip-loader">
              </div>
              <div v-if="dialog" class="dialog print-dialog">
                <span class="dialog-title">Kuponu Yazdır</span>
                <div class="dialog-content-print">
                  <div class="dialog-side" @click="hidePrintDialog()">
                    <i class="fas fa-print cl-g btn-print" v-print="'#printMe'" />
                    <span>Evet</span>
                  </div>
                  <div class="dialog-side" @click="hidePrintDialog()">
                    <i class="fas fa-ban cl-r btn-print"/>
                    <span>Hayır</span>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import leaguesjson from '@/soccer.json'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'flexbet',
  data () {
    return {
      leaguesJson:leaguesjson,
      slips:this.$store.state.flexslips,
      leaguesArray:[],
      subOddsFlex:[],
      role:this.$store.state.auth.role,
      bookBox: '2',
      flexBetHandel: false,
      flexBet: false,
      scoreIdFlex: '',
      optionInput: '',
      codeFlex: null,
      optionFlex: '',
      gameFlex: '',
      rateFlex: null,
      matchFlex: '',
      betMsg:'',
      earn:0,
      totalRate: 1,
      finalRate: null,
      codeClass: true,
      optionClass: true,
      amountClass: true,
      flexLoader: false,
      dialog: false,
      creditRemain: null,
      quickBtn: [5,10,15,20,25,30,35,40,45,50,75,100],
      flexSlips: {},
      allDone:false,
      liveSlipLoader: false,
      slipSummary: {
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        branch: 'Futbol',
        amount:null,
        owner: '',
        betsCount: 1,
        betref: Math.floor(Math.random() * Math.floor(99999))
      }
    }
  },
  mounted (){
    this.getLeagues()
  },
  computed: {
    getTotalRate () {
      this.totalRate = 1
      for (const key in this.slips) {
        this.totalRate *= this.slips[key].rate
      }
        return this.totalRate
    },
    getEarnUpdate () {
      return this.earn = this.slipSummary.amount * this.totalRate
    }
  },
  methods: {
    getFlexBetHandel(){
      this.flexBetHandel =! this.flexBetHandel
      this.removeSlipAll()
    },
    async getLeagues () {
      this.leaguesArray = []
      let start = moment().format('YYYY-MM-DD HH:mm:ss')
      let end = moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      this.leaguesJson.forEach(item => {
        item.results.forEach(item2 => {
          if (moment.unix(item2.time).format('YYYY-MM-DD HH:mm:ss') > start && moment.unix(item2.time).format('YYYY-MM-DD') <= end) {
            this.leaguesArray.push(item2)
          }
        })
      })
    },
    getSubId () {
      this.leaguesArray.forEach(item => {
        if (item.id.toString().slice(-4) === this.codeFlex) {
          this.scoreIdFlex = item.id
          this.matchFlex = item.home.name +' - '+ item.away.name
        }
      })
    },
    async addSlip () {
      this.getSubId()
      if (this.scoreIdFlex) {
        this.flexLoader = true
        await axios.get(`/api/home/prematchodds/${this.scoreIdFlex}`).then((result) =>{
          let mainodds = []
          result.data.results.forEach(item => {
            if (item.corners) {
              mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp,...item.corners.sp})
            } else {
              mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp})
            }
          })
          this.subOddsFlex = mainodds
          this.getBet()
          if (this.allDone) {
            this.flexSlips = {
              code: this.codeFlex,
              betre: 0,
              user: this.$store.state.auth.user,
              admin: this.$store.state.auth.admin,
              superadmin: this.$store.state.auth.superadmin,
              match: this.matchFlex,
              games: this.gameFlex,
              option: this.optionFlex,
              rate: this.rateFlex,
              stream: 'Bülten',
              branch:'F',
              state: 'Aktif',
              scoreid:this.scoreIdFlex
            }
            this.flexLoader = false
            if (!this.$store.state.betflex){
              this.$store.commit('setFlexBet', true)
            }
            setTimeout(() => {
               if (this.$store.state.flexslips.length > 0) {
                let test = this.$store.state.flexslips.find(o => o.match === this.matchFlex)
                if (test === undefined) {
                  this.$store.commit('setFlexSlips', this.flexSlips)
                }
              } else {
                this.$store.commit('setFlexSlips', this.flexSlips)
              }
            }, 50)
            this.scoreIdFlex = ''
            this.codeFlex = ''
            this.optionInput = ''
            document.getElementById('codeflex').focus()
          }else {
            this.optionInput = ''
            this.optionClass = false
            this.flexLoader = false
          }
        })
        this.allDone = false
      }else{
        this.scoreIdFlex = ''
        this.codeFlex = ''
        this.codeClass = false
        document.getElementById('codeflex').focus()
      }
    },
    async addBet(){
      if (navigator.onLine == true){
        if (this.$store.state.auth.role  === 'U1') {
          this.flexLoader = true
          let minms = this.$store.state.limitsettings.minms
          let maxms = this.$store.state.limitsettings.maxms
          let maxrate = this.$store.state.limitsettings.maxrate
          let minkm = this.$store.state.limitsettings.minkm
          let maxkm = this.$store.state.limitsettings.maxkm
          let credit = this.$store.state.creditinfo.creditremain
          if (minms !== 0 && this.flexslips.length < minms) {
            this.betMsg = 'Minumum Maç sayısı' +' '+ minms +' '+'olmalıdır'
            this.flexLoader = false
          }else if(maxms !== 0 && this.flexslips.length > maxms){
            this.betMsg = 'Maximum Maç sayısı' +' '+ maxms +' '+'olmalıdır'
            this.flexLoader = false
          } else if(maxrate !== 0 && maxrate > this.totalRate){
            this.betMsg = 'Maximum Oran' +' '+ maxrate +' '+'olmalıdır'
            this.flexLoader = false
          } else if(minkm !== 0 && this.slipSummary.amount < minkm){
            this.betMsg = 'Miktar' +' '+ minkm +' TL den az olamaz! '
            this.flexLoader = false
          } else if(maxkm !== 0 && this.slipSummary.amount > maxkm){
            this.betMsg = 'Miktar' +' '+ mazkm +' TL fazla olamaz!'
            this.flexLoader = false
          }else if(this.slipSummary.amount > credit){
            this.betMsg = 'Yetersiz Kredi'
            this.flexLoader = false
          }else {
            this.flexLoader = false
            this.liveSlipLoader = true
            this.$store.commit('updateSlips', this.slipSummary.betref)
            await axios.post('/api/addbet', { slipSummary: this.slipSummary, slips: this.$store.state.flexslips }).then((result) => {
              if (result.data.code === 401) {
                this.error = result.data.message
              } else {
                this.error = ''
                this.dialog = true
              }
            })
          }
        } else {
          this.betMsg = 'Oyun Yetkiniz Yoktur!'
        }
        return true
      }
      this.betMsg = 'Baglantı Yok!'
    },
    jumpToOption(){
      this.codeClass = true
      if (this.codeFlex !== null && this.codeFlex.length === 4) {
        document.getElementById('optionInput').focus()
      }
    },
    getOption(){
      this.optionClass = true
    },
    checkCodeEmpty(){
      if (!this.codeFlex) {
        document.getElementById('codeflex').focus()
        this.codeClass = false
      }
    },
    resetCodeClass(){
      this.codeClass = true
    },
    resetOptionClass(){
      this.optionClass = true
    },
    print () {
      this.$htmlToPaper('printMeQuick')
    },
    async getCreditInfo() {
      await axios.post('/api/home/account/creditinfo', { userbox: this.$store.state.auth.user }).then((result) => {
        this.$store.commit('setCreditInfo', result.data.creditinfo)
      })
    },
    async getActiveInfo() {
      await axios.post('/api/home/account/activeinfo', { userbox: this.$store.state.auth.user }).then((result) => {
        this.$store.commit('setActiveInfo', result.data.activeinfo)
      })
    },
    getEarn () {
      this.earn = this.slipSummary.amount * this.finalRate
      this.creditRemain = this.$store.state.creditinfo.creditremain - this.slipSummary.amount
      this.$store.commit('updateFlexSlips', this.slipSummary.betref)
      this.betMsg = ''
    },
    removeSlip (index) {
      this.$store.commit('removeFlexSlipItem', index)
      if (this.slips.length === 0) {
        this.$store.commit('setFlexBet', false)
        this.totalRate = 1
        this.slipSummary.betref = Math.floor(Math.random() * Math.floor(9999999))
      }
    },
    removeSlipAll () {
      this.earn = ''
      this.creditRemain = ''
      this.slipSummary.amount = ''
      this.error = ''
      this.totalRate = 1
      this.finalRate = 1
      this.$store.commit('setFlexBet', false)
      this.$store.commit('removeFlexSlips', [])
      this.slipSummary.betref = Math.floor(Math.random() * Math.floor(99999))
    },
    print () {
      this.$htmlToPaper('printMe')
    },
    hidePrintDialog () {
      this.dialog = false
      this.liveSlipLoader = false
      setTimeout(() => {
        this.removeSlipAll()
        this.getActiveInfo()
        this.getCreditInfo()
      }, 500)
    },
    getBet(){
      switch (this.optionInput.toLowerCase()) {
      //fulltime
        case '1':
          this.allDone = true
          this.gameFlex = 'Mac Sonu'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['full_time_result']) {
              this.rateFlex = item['full_time_result'][0].odds
            }
          })
          break
        case '0':
          this.allDone = true
          this.gameFlex = 'Mac Sonu'
          this.optionFlex = 'Beraberlik'
          this.subOddsFlex.forEach(item => {
            if (item['full_time_result']) {
              this.rateFlex = item['full_time_result'][1].odds
            }
          })
          break
        case '2':
          this.allDone = true
          this.gameFlex = 'Mac Sonu'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['full_time_result']) {
              this.rateFlex = item['full_time_result'][2].odds
            }
          })
        break
      //fulltime and over/under
        case 'mt1':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Evsahibi/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][0].odds
            }
          })
          break
        case 'mt2':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Beraberlik/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][1].odds
            }
          })
          break
        case 'mt3':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Deplasman/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][2].odds
            }
          })
          break
        case 'mt4':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Evsahibi/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][3].odds
            }
          })
          break
        case 'mt5':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Beraberlik/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][4].odds
            }
          })
          break
        case 'mt6':
          this.allDone = true
          this.gameFlex = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionFlex = 'Deplasman/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['result_total_goals']) {
              this.rateFlex = item['result_total_goals'][5].odds
            }
          })
          break

      //draw no bet
        case 'g1':
          this.allDone = true
          this.gameFlex = 'Beraberlikte İade'
          this.optionFlex = '1'
          this.subOddsFlex.forEach(item => {
            if (item['draw_no_bet']) {
              this.rateFlex = item['draw_no_bet'][0].odds
            }
          })
          break
        case 'g2':
          this.allDone = true
          this.gameFlex = 'Beraberlikte İade'
          this.optionFlex = '2'
          this.subOddsFlex.forEach(item => {
            if (item['draw_no_bet']) {
              this.rateFlex = item['draw_no_bet'][1].odds
            }
          })
          break
      //double chance
        case 'c1':
          this.allDone = true
          this.gameFlex = 'Çifte Şans'
          this.optionFlex = '1X'
          this.subOddsFlex.forEach(item => {
            if (item['double_chance']) {
              this.rateFlex = item['double_chance'][0].odds
            }
          })
          break
        case 'c2':
          this.allDone = true
          this.gameFlex = 'Çifte Şans'
          this.optionFlex = 'X2'
          this.subOddsFlex.forEach(item => {
            if (item['double_chance']) {
              this.rateFlex = item['double_chance'][1].odds
            }
          })
          break
        case 'c3':
          this.allDone = true
          this.gameFlex = 'Çifte Şans'
          this.optionFlex = '12'
          this.subOddsFlex.forEach(item => {
            if (item['double_chance']) {
              this.rateFlex = item['double_chance'][2].odds
            }
          })
          break
      //result_both_teams_to_score
        case 'z1':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Evet/Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][0].odds
            }
          })
          break
        case 'z2':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Evet/Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][1].odds
            }
          })
          break
        case 'z3':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Evet/Beraberlik'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][2].odds
            }
          })
          break
        case 'z4':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Hayır/Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][3].odds
            }
          })
          break
        case 'z5':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Hayır/Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][4].odds
            }
          })
          break
        case 'z6':
          this.allDone = true
          this.gameFlex = 'Karşılıklı Gol ve Maç Sonu'
          this.optionFlex = 'Hayır/Beraberlik'
          this.subOddsFlex.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateFlex = item['result_both_teams_to_score'][5].odds
            }
          })
          break
      //handikap sonucu
        case 'h1':
          this.allDone = true
          this.gameFlex = 'Handikap Sonucu'
          this.optionFlex = 'Evsahib (+1)'
          this.subOddsFlex.forEach(item => {
            if (item['handicap_result']) {
              this.rateFlex = item['handicap_result'][0].odds
            }
          })
          break
        case 'h2':
          this.allDone = true
          this.gameFlex = 'Handikap Sonucu'
          this.optionFlex = 'Eşit Deplasman (-1)'
          this.subOddsFlex.forEach(item => {
            if (item['handicap_result']) {
              this.rateFlex = item['handicap_result'][1].odds
            }
          })
          break
        case 'h3':
          this.allDone = true
          this.gameFlex = 'Handikap Sonucu'
          this.optionFlex = 'Deplasman (-1)'
          this.subOddsFlex.forEach(item => {
            if (item['handicap_result']) {
              this.rateFlex = item['handicap_result'][2].odds
            }
          })
          break
      //half_time_result
        case 'd1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Sonucu 3 lü'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result']) {
              this.rateFlex = item['half_time_result'][0].odds
            }
          })
          break
        case 'd0':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Sonucu 3 lü'
          this.optionFlex = 'Beraberlik'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result']) {
              this.rateFlex = item['half_time_result'][1].odds
            }
          })
          break
        case 'd2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Sonucu 3 lü'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result']) {
              this.rateFlex = item['half_time_result'][2].odds
            }
          })
          break
      //half_time_result_total_goals
        case 'dst1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Evsahibi/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][1].odds
            }
          })
          break
        case 'dst2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Evsahibi/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][0].odds
            }
          })
          break
        case 'dst3':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Beraberlik/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][3].odds
            }
          })
          break
        case 'dst4':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Beraberlik/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][2].odds
            }
          })
          break
        case 'dst5':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Deplasman/Alt'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][5].odds
            }
          })
          break
        case 'dst6':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionFlex = 'Deplasman/Üst'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateFlex = item['half_time_result_total_goals'][4].odds
            }
          })
          break
      //half_time_full_time
        case 'dv1':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '1/1'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][0].odds
            }
          })
          break
        case 'dv2':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '1/0'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][1].odds
            }
          })
          break
        case 'dv3':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '1/2'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][2].odds
            }
          })
          break
        case 'dv4':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '0/1'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][3].odds
            }
          })
          break
        case 'dv5':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '0/0'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][4].odds
            }
          })
          break
        case 'dv6':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '0/2'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][5].odds
            }
          })
          break
        case 'dv7':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '2/1'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][6].odds
            }
          })
          break
        case 'dv8':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '2/0'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][7].odds
            }
          })
          break
        case 'dv9':
        this.allDone = true
        this.gameFlex = 'İlk Yarı ve Maç Sonu'
          this.optionFlex = '2/2'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateFlex = item['half_time_full_time'][8].odds
            }
          })
          break
      //half_time_double_chance
        case 'dc1':
        this.allDone = true
        this.gameFlex = 'İlk Yarı Çifte Şans'
          this.optionFlex = '1X'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateFlex = item['half_time_double_chance'][0].odds
            }
          })
          break
        case 'dc2':
        this.allDone = true
        this.gameFlex = 'İlk Yarı Çifte Şans'
          this.optionFlex = 'X2'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateFlex = item['half_time_double_chance'][1].odds
            }
          })
          break
        case 'dc3':
        this.allDone = true
        this.gameFlex = 'İlk Yarı Çifte Şans'
          this.optionFlex = '12'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateFlex = item['half_time_double_chance'][2].odds
            }
          })
          break
      //1st_half_goals_odd_even
        case 'db1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Tek/Çift'
          this.optionFlex = 'Tek'
          this.subOddsFlex.forEach(item => {
            if (item['1st_half_goals_odd_even']) {
              this.rateFlex = item['1st_half_goals_odd_even'][0].odds
            }
          })
          break
        case 'db2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Tek/Çift'
          this.optionFlex = 'Çift'
          this.subOddsFlex.forEach(item => {
            if (item['1st_half_goals_odd_even']) {
              this.rateFlex = item['1st_half_goals_odd_even'][1].odds
            }
          })
          break
      //first_half_goals
        case 'dt01':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][4].odds
            }
          })
          break
        case 'dt02':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][0].odds
            }
          })
          break
        case 'dt11':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][5].odds
            }
          })
          break
        case 'dt12':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][1].odds
            }
          })
          break
          case 'dt21':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][6].odds
            }
          })
          break
        case 'dt22':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][2].odds
            }
          })
          break
        case 'dt31':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][7].odds
            }
          })
          break
        case 'dt32':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_goals']) {
              this.rateFlex = item['first_half_goals'][3].odds
            }
          })
          break
      //exact_1st_half_goals
        case 'dtg0':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '0 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][0].odds
            }
          })
          break
        case 'dtg1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '1 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][1].odds
            }
          })
          break
        case 'dtg2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '2 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][2].odds
            }
          })
          break
        case 'dtg3':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '3 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][3].odds
            }
          })
          break
        case 'dtg4':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '4 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][4].odds
            }
          })
          break
        case 'dtg5':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kesin Gol Sayısı'
          this.optionFlex = '5+ Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateFlex = item['exact_1st_half_goals'][5].odds
            }
          })
          break
      //half_time_result_both_teams_to_score
        case 'dsbb1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Evsahibi/Evet'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][0].odds
            }
          })
          break
        case 'dsbb2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Evsahibi/Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][1].odds
            }
          })
          break
        case 'dsbb3':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Beraberlik/Evet'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][2].odds
            }
          })
          break
        case 'dsbb4':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Beraberlik/Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][3].odds
            }
          })
          break
        case 'dsbb5':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Deplasman/Evet'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][4].odds
            }
          })
          break
        case 'dsbb6':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionFlex = 'Deplasman/Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateFlex = item['half_time_result_both_teams_to_score'][5].odds
            }
          })
          break
      //both_teams_to_score_in_1st_half
        case 'dbb1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı İki Takımda Gol Atarmı'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_in_1st_half']) {
              this.rateFlex = item['both_teams_to_score_in_1st_half'][0].odds
            }
          })
          break
        case 'dbb2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı İki Takımda Gol Atarmı'
          this.optionFlex = 'Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_in_1st_half']) {
              this.rateFlex = item['both_teams_to_score_in_1st_half'][1].odds
            }
          })
          break
      //both_teams_to_score_in_1st_half
        case 'dk1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kornerler'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_corners']) {
              this.rateFlex = item['first_half_corners'][0].odds
            }
          })
          break
        case 'dk2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kornerler'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_corners']) {
              this.rateFlex = item['first_half_corners'][1].odds
            }
          })
          break
        case 'dk3':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Kornerler'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['first_half_corners']) {
              this.rateFlex = item['first_half_corners'][2].odds
            }
          })
          break
      //1st_half_handicap
        case 'dh1':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Handikap'
          this.optionFlex = 'Evsahibi +1.0'
          this.subOddsFlex.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateFlex = item['1st_half_handicap'][0].odds
            }
          })
          break
        case 'dh2':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Handikap'
          this.optionFlex = 'Eşit-Deplasman -1.0'
          this.subOddsFlex.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateFlex = item['1st_half_handicap'][1].odds
            }
          })
          break
        case 'dh3':
          this.allDone = true
          this.gameFlex = 'İlk Yarı Handikap'
          this.optionFlex = 'Deplasman -1.0'
          this.subOddsFlex.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateFlex = item['1st_half_handicap'][2].odds
            }
          })
          break
      //2nd_half_result
        case 'v1':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Sonucu'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateFlex = item['2nd_half_result'][0].odds
            }
          })
          break
        case 'v0':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Sonucu'
          this.optionFlex = 'Beraberlik'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateFlex = item['2nd_half_result'][1].odds
            }
          })
          break
        case 'v2':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Sonucu'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateFlex = item['2nd_half_result'][2].odds
            }
          })
          break
      //2nd_half_goals
        case 'vt01':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionFlex = 'Alt'
         this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][4].odds
            }
          })
          break
        case 'vt02':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][0].odds
            }
          })
          break
        case 'vt11':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][5].odds
            }
          })
          break
        case 'vt12':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][1].odds
            }
          })
          break
        case 'vt21':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][6].odds
            }
          })
          break
        case 'vt22':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][2].odds
            }
          })
          break
        case 'vt31':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][7].odds
            }
          })
          break
        case 'vt32':
        this.allDone = true
        this.gameFlex = 'İkinci Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateFlex = item['2nd_half_goals'][3].odds
            }
          })
          break
      //exact_2nd_half_goals
        case 'vtg0':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '0 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][0].odds
            }
          })
          break
        case 'vtg1':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '1 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][1].odds
            }
          })
          break
        case 'vtg2':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '2 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][2].odds
            }
          })
          break
        case 'vtg3':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '3 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][3].odds
            }
          })
          break
        case 'vtg4':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '4 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][4].odds
            }
          })
          break
        case 'vtg5':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionFlex = '5+ Gol'
          this.subOddsFlex.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateFlex = item['exact_2nd_half_goals'][5].odds
            }
          })
          break
      //2nd_half_goals_odd_even
        case 'vb1':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Tek/Çift'
          this.optionFlex = 'Tek'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals_odd_even']) {
              this.rateFlex = item['2nd_half_goals_odd_even'][0].odds
            }
          })
          break
        case 'vb2':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı Tek/Çift'
          this.optionFlex = 'Çift'
          this.subOddsFlex.forEach(item => {
            if (item['2nd_half_goals_odd_even']) {
              this.rateFlex = item['2nd_half_goals_odd_even'][1].odds
            }
          })
          break
      //both_teams_to_score_in_2nd_half
        case 'vbb1':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı İki Takımda Gol Atarmı'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_in_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_in_2nd_half'][0].odds
            }
          })
          break
        case 'vbb2':
          this.allDone = true
          this.gameFlex = 'İkinci Yarı İki Takımda Gol Atarmı'
          this.optionFlex = 'Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_in_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_in_2nd_half'][1].odds
            }
          })
          break
      //over under 2.5
        case 't1':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['goals_over_under']) {
              this.rateFlex = item['goals_over_under'][1].odds
            }
          })
          break
        case 't2':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['goals_over_under']) {
              this.rateFlex = item['goals_over_under'][0].odds
            }
          })
          break
      //over under
        case 't01':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 0.5 Alt/Ust'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][5].odds
            }
          })
          break
        case 't02':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 0.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][0].odds
            }
          })
          break
        case 't11':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][6].odds
            }
          })
          break
        case 't12':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 1.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][1].odds
            }
          })
          break
        case 't31':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][7].odds
            }
          })
          break
        case 't32':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 3.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][2].odds
            }
          })
          break
        case 't41':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 4.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][8].odds
            }
          })
          break
        case 't42':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 2.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][3].odds
            }
          })
          break
        case 't51':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 5.5 Alt/Üst'
          this.optionFlex = 'Alt'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][9].odds
            }
          })
          break
        case 't52':
          this.allDone = true
          this.gameFlex = 'Toplam Gol 5.5 Alt/Üst'
          this.optionFlex = 'Üst'
          this.subOddsFlex.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateFlex = item['alternative_total_goals'][4].odds
            }
          })
          break
      //odd even
        case 'b1':
          this.allDone = true
          this.gameFlex = 'Tek/Çift'
          this.optionFlex = 'Tek'
          this.subOddsFlex.forEach(item => {
            if (item['goals_odd_even']) {
              this.rateFlex = item['goals_odd_even'][0].odds
            }
          })
          break
        case 'b2':
          this.allDone = true
          this.gameFlex = 'Tek/Çift'
          this.optionFlex = 'Çift'
          this.subOddsFlex.forEach(item => {
            if (item['goals_odd_even']) {
              this.rateFlex = item['goals_odd_even'][1].odds
            }
          })
          break
      //first_team_to_score
        case 'fg1':
        this.allDone = true
        this.gameFlex = 'İlk Golü Hangi Takım Atar'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateFlex = item['first_team_to_score'][0].odds
            }
          })
          break
        case 'fg2':
        this.allDone = true
        this.gameFlex = 'İlk Golü Hangi Takım Atar'
          this.optionFlex = 'Gol Olmaz'
          this.subOddsFlex.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateFlex = item['first_team_to_score'][1].odds
            }
          })
          break
        case 'fg3':
        this.allDone = true
        this.gameFlex = 'İlk Golü Hangi Takım Atar'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateFlex = item['first_team_to_score'][1].odds
            }
          })
          break
      //last_team_to_score
        case 'lg1':
        this.allDone = true
        this.gameFlex = 'Son Golü Hangi Takım Atar'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateFlex = item['last_team_to_score'][0].odds
            }
          })
          break
        case 'lg2':
        this.allDone = true
        this.gameFlex = 'Son Golü Hangi Takım Atar'
          this.optionFlex = 'Gol Olmaz'
          this.subOddsFlex.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateFlex = item['last_team_to_score'][1].odds
            }
          })
          break
        case 'lg3':
        this.allDone = true
        this.gameFlex = 'Son Golü Hangi Takım Atar'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateFlex = item['last_team_to_score'][1].odds
            }
          })
          break
       //both_teams_to_score
        case 'bb1':
          this.allDone = true
          this.gameFlex = 'both_teams_to_score'
          this.optionFlex = 'Evet'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score']) {
              this.rateFlex = item['both_teams_to_score'][0].odds
            }
          })
          break
        case 'bb2':
          this.allDone = true
          this.gameFlex = 'both_teams_to_score'
          this.optionFlex = 'Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score']) {
              this.rateFlex = item['both_teams_to_score'][1].odds
            }
          })
          break
      //teams_to_score
        case 'wg1':
          this.allDone = true
          this.gameFlex = 'Hangi Takım Gol Atar'
          this.optionFlex = 'Her İkisi'
          this.subOddsFlex.forEach(item => {
            if (item['teams_to_score']) {
              this.rateFlex = item['teams_to_score'][0].odds
            }
          })
          break
        case 'wg2':
          this.allDone = true
          this.gameFlex = 'Hangi Takım Gol Atar'
          this.optionFlex = 'Evsahibi'
          this.subOddsFlex.forEach(item => {
            if (item['teams_to_score']) {
              this.rateFlex = item['teams_to_score'][1].odds
            }
          })
          break
        case 'wg3':
          this.allDone = true
          this.gameFlex = 'Hangi Takım Gol Atar'
          this.optionFlex = 'Gol Olmaz'
          this.subOddsFlex.forEach(item => {
            if (item['teams_to_score']) {
              this.rateFlex = item['teams_to_score'][2].odds
            }
          })
          break
        case 'wg4':
          this.allDone = true
          this.gameFlex = 'Hangi Takım Gol Atar'
          this.optionFlex = 'Deplasman'
          this.subOddsFlex.forEach(item => {
            if (item['teams_to_score']) {
              this.rateFlex = item['teams_to_score'][3].odds
            }
          })
          break
      //half_with_most_goals
        case 'hs1':
          this.allDone = true
          this.gameFlex = 'Hangi Devre Çok Gol Olur'
          this.optionFlex = '1.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateFlex = item['half_with_most_goals'][0].odds
            }
          })
          break
        case 'hs2':
          this.allDone = true
          this.gameFlex = 'Hangi Devre Çok Gol Olur'
          this.optionFlex = '2.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateFlex = item['half_with_most_goals'][1].odds
            }
          })
          break
        case 'hs3':
          this.allDone = true
          this.gameFlex = 'Hangi Devre Çok Gol Olur'
          this.optionFlex = 'Eşit'
          this.subOddsFlex.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateFlex = item['half_with_most_goals'][2].odds
            }
          })
          break
      //home_team_odd_even_goals
        case 'hb1':
        this.allDone = true
        this.gameFlex = 'Evsahibi Tek/Çift'
          this.optionFlex = 'Tek'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_odd_even_goals']) {
              this.rateFlex = item['home_team_odd_even_goals'][0].odds
            }
          })
          break
        case 'hb2':
        this.allDone = true
        this.gameFlex = 'Evsahibi Tek/Çift'
          this.optionFlex = 'Çift'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_odd_even_goals']) {
              this.rateFlex = item['home_team_odd_even_goals'][1].odds
            }
          })
          break
      //home_team_exact_goals
        case 'htg0':
        this.allDone = true
        this.gameFlex = 'Evsahibi Gol Sayısı'
          this.optionFlex = '0 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateFlex = item['home_team_exact_goals'][0].odds
            }
          })
          break
        case 'htg1':
        this.allDone = true
        this.gameFlex = 'Evsahibi Gol Sayısı'
          this.optionFlex = '1 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateFlex = item['home_team_exact_goals'][1].odds
            }
          })
          break
        case 'htg2':
        this.allDone = true
        this.gameFlex = 'Evsahibi Gol Sayısı'
          this.optionFlex = '2 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateFlex = item['home_team_exact_goals'][2].odds
            }
          })
          break
        case 'htg3':
        this.allDone = true
        this.gameFlex = 'Evsahibi Gol Sayısı'
          this.optionFlex = '3+ Gol'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateFlex = item['home_team_exact_goals'][3].odds
            }
          })
        break
      //home_team_highest_scoring_half
        case 'hts1':
        this.allDone = true
        this.gameFlex = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionFlex = '1.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateFlex = item['home_team_highest_scoring_half'][0].odds
            }
          })
          break
        case 'hts2':
        this.allDone = true
        this.gameFlex = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionFlex = '2.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateFlex = item['home_team_highest_scoring_half'][1].odds
            }
          })
          break
        case 'hts3':
        this.allDone = true
        this.gameFlex = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionFlex = 'Eşit'
          this.subOddsFlex.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateFlex = item['home_team_highest_scoring_half'][2].odds
            }
          })
          break
      //away_team_odd_even_goals
        case 'ab1':
        this.allDone = true
        this.gameFlex = 'Deplasman Tek/Çift'
          this.optionFlex = 'Tek'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_odd_even_goals']) {
              this.rateFlex = item['away_team_odd_even_goals'][0].odds
            }
          })
          break
        case 'ab2':
        this.allDone = true
        this.gameFlex = 'Deplasman Tek/Çift'
          this.optionFlex = 'Çift'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_odd_even_goals']) {
              this.rateFlex = item['away_team_odd_even_goals'][1].odds
            }
          })
          break
      //away_team_exact_goals
        case 'atg0':
        this.allDone = true
        this.gameFlex = 'Deplasman Gol Sayısı'
          this.optionFlex = '0 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateFlex = item['away_team_exact_goals'][0].odds
            }
          })
          break
        case 'atg1':
        this.allDone = true
        this.gameFlex = 'Deplasman Gol Sayısı'
          this.optionFlex = '1 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateFlex = item['away_team_exact_goals'][1].odds
            }
          })
          break
        case 'atg2':
        this.allDone = true
        this.gameFlex = 'Deplasman Gol Sayısı'
          this.optionFlex = '2 Gol'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateFlex = item['away_team_exact_goals'][2].odds
            }
          })
          break
        case 'atg3':
        this.allDone = true
        this.gameFlex = 'Deplasman Gol Sayısı'
          this.optionFlex = '3+ Gol'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateFlex = item['away_team_exact_goals'][3].odds
            }
          })
          break
      //away_team_highest_scoring_half
        case 'ats1':
        this.allDone = true
        this.gameFlex = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionFlex = '1.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateFlex = item['away_team_highest_scoring_half'][0].odds
            }
          })
          break
        case 'ats2':
        this.allDone = true
        this.gameFlex = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionFlex = '2.Devre'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateFlex = item['away_team_highest_scoring_half'][1].odds
            }
          })
          break
        case 'ats3':
        this.allDone = true
        this.gameFlex = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionFlex = 'Eşit'
          this.subOddsFlex.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateFlex = item['away_team_highest_scoring_half'][2].odds
            }
          })
          break
      //both_teams_to_score_1st_half_2nd_half
        case 'dvh1':
        this.allDone = true
        this.gameFlex = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionFlex = 'Evet/Evet'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_1st_half_2nd_half'][0].odds
            }
          })
          break
        case 'dvh2':
        this.allDone = true
        this.gameFlex = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionFlex = 'Evet/Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_1st_half_2nd_half'][1].odds
            }
          })
          break
        case 'dvh3':
        this.allDone = true
        this.gameFlex = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionFlex = 'Hayır/Evet'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_1st_half_2nd_half'][2].odds
            }
          })
          break
        case 'dvh4':
        this.allDone = true
        this.gameFlex = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionFlex = 'Hayır/Hayır'
          this.subOddsFlex.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateFlex = item['both_teams_to_score_1st_half_2nd_half'][3].odds
            }
          })
          break
      }
    },
  }
}
</script>

