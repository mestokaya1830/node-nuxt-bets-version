<template>
  <div>
    <div class="title-2">
      <span><i class="fas fa-futbol navbar-icons cl-g"/>KUPONLAR</span>
      <img src="~/assets/img/loader.gif" alt="" v-if="slipLoader">
      <span class="badge bg-g mr10" v-if="$store.state.betslip">{{slips.length}}</span>
    </div>
    <div class="slip-side-con">
      <form class="quick-bet-entry" v-if="checkQuickSection">
        <div class="quick-bet-con">
          <input type="number" v-model="codeQuick" @keyup="jumpToOption()" @blur="resetCodeClass()" :class="{quickClass: !codeClass}" id="codequick" class="inp quick-entry-inputs" minlength="3"   placeholder="Kod" required>
          <input type="text" v-model="optionInput" @focus="checkCodeEmpty()" @keyup="getOption()" @keyup.enter="addSlipQuick()" @blur="resetOptionClass()" :class="{quickClass:!optionClass}" id="optioninput" class="inp quick-entry-inputs" placeholder="Seçim" required> 
        </div>
      </form>
      <div v-if="this.$store.state.betslip">
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
                <span class="slip-match">{{ list.match }}</span>
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
      <div v-else class="slip-no-bet" :class="branchimage"></div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
export default {
  mixins: [Vue2Filters.mixin],
  props: {
    leaguesarray:Array,
    branchimage:String
  },
  name: 'Slipside',
  data () {
    return {
      slips: this.$store.state.slips,
      scoreIdQuick:'',
      subOddsQuick: {},
      codeQuick:'',
      optionInput:'',
      gameQuick: '',
      matchQuick: '',
      optionQuick:'',
      rateQuick: '',
      slipLoader: false,
      codeClass: true,
      optionClass: true,
      creditRemain: null,
      matches: '',
      earn:0,
      totalRate: 1,
      finalRate: null,
      dialog: false,
      betMsg: '',
      role: this.$store.state.auth.role,
      quickBtn: [5,10,15,20,25,30,35,40,45,50,75,100],
      quickSlips: {},
      allDone:false,
      liveSlipLoader: false,
      suspendid: 0,
      slipSummary: {
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        amount: '',
        owner: '',
        betref: Math.floor(Math.random() * Math.floor(99999))
      }
    }
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
    },
    checkQuickSection(){
      if (this.$route.name === 'home-soccer') {
        return true
      }
    }
  },
  methods: {
    getEarn () {
      this.earn = this.slipSummary.amount * this.finalRate
      this.creditRemain = this.$store.state.creditinfo.creditremain - this.slipSummary.amount
      this.$store.commit('updateSlips', this.slipSummary.betref)
    },
    removeSlip (index) {
      this.$store.commit('removeSlipItem', index)
      if (this.slips.length === 0) {
        this.$store.commit('setBetSlip', false)
        this.betMsg = ''
        this.earn = ''
        this.creditRemain = ''
        this.slipSummary.amount = ''
        this.error = ''
        this.totalRate = 1
        this.finalRate = 1
        this.slipSummary.betref = Math.floor(Math.random() * Math.floor(9999999))
      }
    },
    removeSlipAll () {
      this.betMsg = ''
      this.earn = ''
      this.creditRemain = ''
      this.slipSummary.amount = ''
      this.error = ''
      this.totalRate = 1
      this.finalRate = 1
      this.$store.commit('setBetSlip', false)
      this.$store.commit('removeSlips', [])
      this.slipSummary.betref = Math.floor(Math.random() * Math.floor(99999))
    },
    print () {
      this.$htmlToPaper('printMe')
    },
    hidePrintDialog () {
      this.dialog = false
      this.liveSlipLoader = false
      this.getActiveInfo()
      this.getCreditInfo()
      setTimeout(() => {
        this.removeSlipAll()
      }, 500)
    },
    async addBet(){
      if (navigator.onLine === true) {
        if (this.$store.state.auth.role === 'U1'){
          let minms = this.$store.state.limitsettings.minms
          let maxms = this.$store.state.limitsettings.maxms
          let maxrate = this.$store.state.limitsettings.maxrate
          let minkm = this.$store.state.limitsettings.minkm
          let maxkm = this.$store.state.limitsettings.maxkm
          let credit = this.$store.state.creditinfo.creditremain
          if (minms !== 0 && this.slips.length < minms) {
            this.betMsg = 'Minumum Maç sayısı' +' '+ minms +' '+'olmalıdır'
          }else if(maxms !== 0 && this.slips.length > maxms){
            this.betMsg = 'Maximum Maç sayısı' +' '+ maxms +' '+'olmalıdır'
          } else if(maxrate !== 0 && maxrate > this.totalRate){
            this.betMsg = 'Maximum Oran' +' '+ maxrate +' '+'olmalıdır'
          } else if(minkm !== 0 && this.slipSummary.amount < minkm){
            this.betMsg = 'Miktar' +' '+ minkm +' TL den az olamaz! '
          } else if(maxkm !== 0 && this.slipSummary.amount > maxkm){
            this.betMsg = 'Miktar' +' '+ mazkm +' TL fazla olamaz!'
          }else if(this.slipSummary.amount > credit){
            this.betMsg = 'Yetersiz Kredi'
          }else {
            this.liveSlipLoader = true
            setTimeout(() => {
              this.$store.commit('updateSlips', this.slipSummary.betref)
              axios.post('/api/addbet', { slipSummary: this.slipSummary, slips: this.$store.state.slips }).then((result) => {
                if (result.data.code === 401) {
                  this.error = result.data.message
                } else {
                  this.liveSlip = false
                  this.error = ''
                  this.dialog = true
                }
              })
            }, 100)
          }
        }else{
          this.betMsg = 'Oyun Yetkiniz Yoktur!'
        }
        return true
      }
      this.betMsg = 'Baglantı Yok!'
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
    jumpToOption(){
      this.codeClass = true
      if (this.codeQuick !== null && this.codeQuick.length === 4) {
        document.getElementById('optioninput').focus()
      }
    },
    getOption(){
      this.optionClass = true
    },
    checkCodeEmpty(){
      if (!this.codeQuick) {
        document.getElementById('codequick').focus()
        this.codeClass = false
      }
    },
    resetCodeClass(){
      this.codeClass = true
    },
    resetOptionClass(){
      this.optionClass = true
    },
    getQuickSubId () {
      this.leaguesarray.forEach(item => {
        if (item.id.toString().slice(-4) === this.codeQuick) {
          this.scoreIdQuick = item.id
          this.matchQuick = item.home.name +' - '+ item.away.name
        }
      })
    },
    getQuickBet(){
      switch (this.optionInput.toLowerCase()) {
      //fulltime
        case '1':
          this.allDone = true
          this.gameQuick = 'Mac Sonu'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['full_time_result']) {
              this.rateQuick = item['full_time_result'][0].odds
            }
          })
          break
        case '0':
          this.allDone = true
          this.gameQuick = 'Mac Sonu'
          this.optionQuick = 'Beraberlik'
          this.subOddsQuick.forEach(item => {
            if (item['full_time_result']) {
              this.rateQuick = item['full_time_result'][1].odds
            }
          })
          break
        case '2':
          this.allDone = true
          this.gameQuick = 'Mac Sonu'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['full_time_result']) {
              this.rateQuick = item['full_time_result'][2].odds
            }
          })
        break
      //fulltime and over/under
        case 'mt1':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Evsahibi/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][0].odds
            }
          })
          break
        case 'mt2':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Beraberlik/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][1].odds
            }
          })
          break
        case 'mt3':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Deplasman/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][2].odds
            }
          })
          break
        case 'mt4':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Evsahibi/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][3].odds
            }
          })
          break
        case 'mt5':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Beraberlik/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][4].odds
            }
          })
          break
        case 'mt6':
          this.allDone = true
          this.gameQuick = 'Maç Sonu Ve Alt/Üst 2.5'
          this.optionQuick = 'Deplasman/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['result_total_goals']) {
              this.rateQuick = item['result_total_goals'][5].odds
            }
          })
          break

      //draw no bet
        case 'g1':
          this.allDone = true
          this.gameQuick = 'Beraberlikte İade'
          this.optionQuick = '1'
          this.subOddsQuick.forEach(item => {
            if (item['draw_no_bet']) {
              this.rateQuick = item['draw_no_bet'][0].odds
            }
          })
          break
        case 'g2':
          this.allDone = true
          this.gameQuick = 'Beraberlikte İade'
          this.optionQuick = '2'
          this.subOddsQuick.forEach(item => {
            if (item['draw_no_bet']) {
              this.rateQuick = item['draw_no_bet'][1].odds
            }
          })
          break
      //double chance
        case 'c1':
          this.allDone = true
          this.gameQuick = 'Çifte Şans'
          this.optionQuick = '1X'
          this.subOddsQuick.forEach(item => {
            if (item['double_chance']) {
              this.rateQuick = item['double_chance'][0].odds
            }
          })
          break
        case 'c2':
          this.allDone = true
          this.gameQuick = 'Çifte Şans'
          this.optionQuick = 'X2'
          this.subOddsQuick.forEach(item => {
            if (item['double_chance']) {
              this.rateQuick = item['double_chance'][1].odds
            }
          })
          break
        case 'c3':
          this.allDone = true
          this.gameQuick = 'Çifte Şans'
          this.optionQuick = '12'
          this.subOddsQuick.forEach(item => {
            if (item['double_chance']) {
              this.rateQuick = item['double_chance'][2].odds
            }
          })
          break
      //result_both_teams_to_score
        case 'z1':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Evet/Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][0].odds
            }
          })
          break
        case 'z2':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Evet/Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][1].odds
            }
          })
          break
        case 'z3':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Evet/Beraberlik'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][2].odds
            }
          })
          break
        case 'z4':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Hayır/Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][3].odds
            }
          })
          break
        case 'z5':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Hayır/Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][4].odds
            }
          })
          break
        case 'z6':
          this.allDone = true
          this.gameQuick = 'Karşılıklı Gol ve Maç Sonu'
          this.optionQuick = 'Hayır/Beraberlik'
          this.subOddsQuick.forEach(item => {
            if (item['result_both_teams_to_score']) {
              this.rateQuick = item['result_both_teams_to_score'][5].odds
            }
          })
          break
      //handikap sonucu
        case 'h1':
          this.allDone = true
          this.gameQuick = 'Handikap Sonucu'
          this.optionQuick = 'Evsahib (+1)'
          this.subOddsQuick.forEach(item => {
            if (item['handicap_result']) {
              this.rateQuick = item['handicap_result'][0].odds
            }
          })
          break
        case 'h2':
          this.allDone = true
          this.gameQuick = 'Handikap Sonucu'
          this.optionQuick = 'Eşit Deplasman (-1)'
          this.subOddsQuick.forEach(item => {
            if (item['handicap_result']) {
              this.rateQuick = item['handicap_result'][1].odds
            }
          })
          break
        case 'h3':
          this.allDone = true
          this.gameQuick = 'Handikap Sonucu'
          this.optionQuick = 'Deplasman (-1)'
          this.subOddsQuick.forEach(item => {
            if (item['handicap_result']) {
              this.rateQuick = item['handicap_result'][2].odds
            }
          })
          break
      //half_time_result
        case 'd1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Sonucu 3 lü'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result']) {
              this.rateQuick = item['half_time_result'][0].odds
            }
          })
          break
        case 'd0':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Sonucu 3 lü'
          this.optionQuick = 'Beraberlik'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result']) {
              this.rateQuick = item['half_time_result'][1].odds
            }
          })
          break
        case 'd2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Sonucu 3 lü'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result']) {
              this.rateQuick = item['half_time_result'][2].odds
            }
          })
          break
      //half_time_result_total_goals
        case 'dst1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Evsahibi/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][1].odds
            }
          })
          break
        case 'dst2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Evsahibi/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][0].odds
            }
          })
          break
        case 'dst3':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Beraberlik/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][3].odds
            }
          })
          break
        case 'dst4':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Beraberlik/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][2].odds
            }
          })
          break
        case 'dst5':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Deplasman/Alt'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][5].odds
            }
          })
          break
        case 'dst6':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Alt/Üst 1.5'
          this.optionQuick = 'Deplasman/Üst'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_total_goals']) {
              this.rateQuick = item['half_time_result_total_goals'][4].odds
            }
          })
          break
      //half_time_full_time
        case 'dv1':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '1/1'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][0].odds
            }
          })
          break
        case 'dv2':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '1/0'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][1].odds
            }
          })
          break
        case 'dv3':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '1/2'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][2].odds
            }
          })
          break
        case 'dv4':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '0/1'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][3].odds
            }
          })
          break
        case 'dv5':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '0/0'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][4].odds
            }
          })
          break
        case 'dv6':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '0/2'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][5].odds
            }
          })
          break
        case 'dv7':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '2/1'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][6].odds
            }
          })
          break
        case 'dv8':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '2/0'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][7].odds
            }
          })
          break
        case 'dv9':
        this.allDone = true
        this.gameQuick = 'İlk Yarı ve Maç Sonu'
          this.optionQuick = '2/2'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_full_time']) {
              this.rateQuick = item['half_time_full_time'][8].odds
            }
          })
          break
      //half_time_double_chance
        case 'dc1':
        this.allDone = true
        this.gameQuick = 'İlk Yarı Çifte Şans'
          this.optionQuick = '1X'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateQuick = item['half_time_double_chance'][0].odds
            }
          })
          break
        case 'dc2':
        this.allDone = true
        this.gameQuick = 'İlk Yarı Çifte Şans'
          this.optionQuick = 'X2'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateQuick = item['half_time_double_chance'][1].odds
            }
          })
          break
        case 'dc3':
        this.allDone = true
        this.gameQuick = 'İlk Yarı Çifte Şans'
          this.optionQuick = '12'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_double_chance']) {
              this.rateQuick = item['half_time_double_chance'][2].odds
            }
          })
          break
      //1st_half_goals_odd_even
        case 'db1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Tek/Çift'
          this.optionQuick = 'Tek'
          this.subOddsQuick.forEach(item => {
            if (item['1st_half_goals_odd_even']) {
              this.rateQuick = item['1st_half_goals_odd_even'][0].odds
            }
          })
          break
        case 'db2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Tek/Çift'
          this.optionQuick = 'Çift'
          this.subOddsQuick.forEach(item => {
            if (item['1st_half_goals_odd_even']) {
              this.rateQuick = item['1st_half_goals_odd_even'][1].odds
            }
          })
          break
      //first_half_goals
        case 'dt01':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][4].odds
            }
          })
          break
        case 'dt02':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][0].odds
            }
          })
          break
        case 'dt11':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][5].odds
            }
          })
          break
        case 'dt12':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][1].odds
            }
          })
          break
          case 'dt21':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][6].odds
            }
          })
          break
        case 'dt22':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][2].odds
            }
          })
          break
        case 'dt31':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][7].odds
            }
          })
          break
        case 'dt32':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_goals']) {
              this.rateQuick = item['first_half_goals'][3].odds
            }
          })
          break
      //exact_1st_half_goals
        case 'dtg0':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '0 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][0].odds
            }
          })
          break
        case 'dtg1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '1 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][1].odds
            }
          })
          break
        case 'dtg2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '2 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][2].odds
            }
          })
          break
        case 'dtg3':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '3 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][3].odds
            }
          })
          break
        case 'dtg4':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '4 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][4].odds
            }
          })
          break
        case 'dtg5':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kesin Gol Sayısı'
          this.optionQuick = '5+ Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_1st_half_goals']) {
              this.rateQuick = item['exact_1st_half_goals'][5].odds
            }
          })
          break
      //half_time_result_both_teams_to_score
        case 'dsbb1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Evsahibi/Evet'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][0].odds
            }
          })
          break
        case 'dsbb2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Evsahibi/Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][1].odds
            }
          })
          break
        case 'dsbb3':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Beraberlik/Evet'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][2].odds
            }
          })
          break
        case 'dsbb4':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Beraberlik/Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][3].odds
            }
          })
          break
        case 'dsbb5':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Deplasman/Evet'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][4].odds
            }
          })
          break
        case 'dsbb6':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Ve Her İki Takım Gol'
          this.optionQuick = 'Deplasman/Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['half_time_result_both_teams_to_score']) {
              this.rateQuick = item['half_time_result_both_teams_to_score'][5].odds
            }
          })
          break
      //both_teams_to_score_in_1st_half
        case 'dbb1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı İki Takımda Gol Atarmı'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_in_1st_half']) {
              this.rateQuick = item['both_teams_to_score_in_1st_half'][0].odds
            }
          })
          break
        case 'dbb2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı İki Takımda Gol Atarmı'
          this.optionQuick = 'Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_in_1st_half']) {
              this.rateQuick = item['both_teams_to_score_in_1st_half'][1].odds
            }
          })
          break
      //both_teams_to_score_in_1st_half
        case 'dk1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kornerler'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_corners']) {
              this.rateQuick = item['first_half_corners'][0].odds
            }
          })
          break
        case 'dk2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kornerler'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_corners']) {
              this.rateQuick = item['first_half_corners'][1].odds
            }
          })
          break
        case 'dk3':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Kornerler'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['first_half_corners']) {
              this.rateQuick = item['first_half_corners'][2].odds
            }
          })
          break
      //1st_half_handicap
        case 'dh1':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Handikap'
          this.optionQuick = 'Evsahibi +1.0'
          this.subOddsQuick.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateQuick = item['1st_half_handicap'][0].odds
            }
          })
          break
        case 'dh2':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Handikap'
          this.optionQuick = 'Eşit-Deplasman -1.0'
          this.subOddsQuick.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateQuick = item['1st_half_handicap'][1].odds
            }
          })
          break
        case 'dh3':
          this.allDone = true
          this.gameQuick = 'İlk Yarı Handikap'
          this.optionQuick = 'Deplasman -1.0'
          this.subOddsQuick.forEach(item => {
            if (item['1st_half_handicap']) {
              this.rateQuick = item['1st_half_handicap'][2].odds
            }
          })
          break
      //2nd_half_result
        case 'v1':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Sonucu'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateQuick = item['2nd_half_result'][0].odds
            }
          })
          break
        case 'v0':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Sonucu'
          this.optionQuick = 'Beraberlik'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateQuick = item['2nd_half_result'][1].odds
            }
          })
          break
        case 'v2':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Sonucu'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_result']) {
              this.rateQuick = item['2nd_half_result'][2].odds
            }
          })
          break
      //2nd_half_goals
        case 'vt01':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionQuick = 'Alt'
         this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][4].odds
            }
          })
          break
        case 'vt02':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 0.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][0].odds
            }
          })
          break
        case 'vt11':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][5].odds
            }
          })
          break
        case 'vt12':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][1].odds
            }
          })
          break
        case 'vt21':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][6].odds
            }
          })
          break
        case 'vt22':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][2].odds
            }
          })
          break
        case 'vt31':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][7].odds
            }
          })
          break
        case 'vt32':
        this.allDone = true
        this.gameQuick = 'İkinci Yarı Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals']) {
              this.rateQuick = item['2nd_half_goals'][3].odds
            }
          })
          break
      //exact_2nd_half_goals
        case 'vtg0':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '0 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][0].odds
            }
          })
          break
        case 'vtg1':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '1 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][1].odds
            }
          })
          break
        case 'vtg2':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '2 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][2].odds
            }
          })
          break
        case 'vtg3':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '3 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][3].odds
            }
          })
          break
        case 'vtg4':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '4 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][4].odds
            }
          })
          break
        case 'vtg5':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Kesin Gol Sayısı'
          this.optionQuick = '5+ Gol'
          this.subOddsQuick.forEach(item => {
            if (item['exact_2nd_half_goals']) {
              this.rateQuick = item['exact_2nd_half_goals'][5].odds
            }
          })
          break
      //2nd_half_goals_odd_even
        case 'vb1':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Tek/Çift'
          this.optionQuick = 'Tek'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals_odd_even']) {
              this.rateQuick = item['2nd_half_goals_odd_even'][0].odds
            }
          })
          break
        case 'vb2':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı Tek/Çift'
          this.optionQuick = 'Çift'
          this.subOddsQuick.forEach(item => {
            if (item['2nd_half_goals_odd_even']) {
              this.rateQuick = item['2nd_half_goals_odd_even'][1].odds
            }
          })
          break
      //both_teams_to_score_in_2nd_half
        case 'vbb1':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı İki Takımda Gol Atarmı'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_in_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_in_2nd_half'][0].odds
            }
          })
          break
        case 'vbb2':
          this.allDone = true
          this.gameQuick = 'İkinci Yarı İki Takımda Gol Atarmı'
          this.optionQuick = 'Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_in_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_in_2nd_half'][1].odds
            }
          })
          break
      //over under 2.5
        case 't1':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['goals_over_under']) {
              this.rateQuick = item['goals_over_under'][1].odds
            }
          })
          break
        case 't2':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['goals_over_under']) {
              this.rateQuick = item['goals_over_under'][0].odds
            }
          })
          break
      //over under
        case 't01':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 0.5 Alt/Ust'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][5].odds
            }
          })
          break
        case 't02':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 0.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][0].odds
            }
          })
          break
        case 't11':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][6].odds
            }
          })
          break
        case 't12':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 1.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][1].odds
            }
          })
          break
        case 't31':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][7].odds
            }
          })
          break
        case 't32':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 3.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][2].odds
            }
          })
          break
        case 't41':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 4.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][8].odds
            }
          })
          break
        case 't42':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 2.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][3].odds
            }
          })
          break
        case 't51':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 5.5 Alt/Üst'
          this.optionQuick = 'Alt'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][9].odds
            }
          })
          break
        case 't52':
          this.allDone = true
          this.gameQuick = 'Toplam Gol 5.5 Alt/Üst'
          this.optionQuick = 'Üst'
          this.subOddsQuick.forEach(item => {
            if (item['alternative_total_goals']) {
              this.rateQuick = item['alternative_total_goals'][4].odds
            }
          })
          break
      //odd even
        case 'b1':
          this.allDone = true
          this.gameQuick = 'Tek/Çift'
          this.optionQuick = 'Tek'
          this.subOddsQuick.forEach(item => {
            if (item['goals_odd_even']) {
              this.rateQuick = item['goals_odd_even'][0].odds
            }
          })
          break
        case 'b2':
          this.allDone = true
          this.gameQuick = 'Tek/Çift'
          this.optionQuick = 'Çift'
          this.subOddsQuick.forEach(item => {
            if (item['goals_odd_even']) {
              this.rateQuick = item['goals_odd_even'][1].odds
            }
          })
          break
      //first_team_to_score
        case 'fg1':
        this.allDone = true
        this.gameQuick = 'İlk Golü Hangi Takım Atar'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateQuick = item['first_team_to_score'][0].odds
            }
          })
          break
        case 'fg2':
        this.allDone = true
        this.gameQuick = 'İlk Golü Hangi Takım Atar'
          this.optionQuick = 'Gol Olmaz'
          this.subOddsQuick.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateQuick = item['first_team_to_score'][1].odds
            }
          })
          break
        case 'fg3':
        this.allDone = true
        this.gameQuick = 'İlk Golü Hangi Takım Atar'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['first_team_to_score']) {
              this.rateQuick = item['first_team_to_score'][1].odds
            }
          })
          break
      //last_team_to_score
        case 'lg1':
        this.allDone = true
        this.gameQuick = 'Son Golü Hangi Takım Atar'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateQuick = item['last_team_to_score'][0].odds
            }
          })
          break
        case 'lg2':
        this.allDone = true
        this.gameQuick = 'Son Golü Hangi Takım Atar'
          this.optionQuick = 'Gol Olmaz'
          this.subOddsQuick.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateQuick = item['last_team_to_score'][1].odds
            }
          })
          break
        case 'lg3':
        this.allDone = true
        this.gameQuick = 'Son Golü Hangi Takım Atar'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['last_team_to_score']) {
              this.rateQuick = item['last_team_to_score'][1].odds
            }
          })
          break
       //both_teams_to_score
        case 'bb1':
          this.allDone = true
          this.gameQuick = 'both_teams_to_score'
          this.optionQuick = 'Evet'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score']) {
              this.rateQuick = item['both_teams_to_score'][0].odds
            }
          })
          break
        case 'bb2':
          this.allDone = true
          this.gameQuick = 'both_teams_to_score'
          this.optionQuick = 'Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score']) {
              this.rateQuick = item['both_teams_to_score'][1].odds
            }
          })
          break
      //teams_to_score
        case 'wg1':
          this.allDone = true
          this.gameQuick = 'Hangi Takım Gol Atar'
          this.optionQuick = 'Her İkisi'
          this.subOddsQuick.forEach(item => {
            if (item['teams_to_score']) {
              this.rateQuick = item['teams_to_score'][0].odds
            }
          })
          break
        case 'wg2':
          this.allDone = true
          this.gameQuick = 'Hangi Takım Gol Atar'
          this.optionQuick = 'Evsahibi'
          this.subOddsQuick.forEach(item => {
            if (item['teams_to_score']) {
              this.rateQuick = item['teams_to_score'][1].odds
            }
          })
          break
        case 'wg3':
          this.allDone = true
          this.gameQuick = 'Hangi Takım Gol Atar'
          this.optionQuick = 'Gol Olmaz'
          this.subOddsQuick.forEach(item => {
            if (item['teams_to_score']) {
              this.rateQuick = item['teams_to_score'][2].odds
            }
          })
          break
        case 'wg4':
          this.allDone = true
          this.gameQuick = 'Hangi Takım Gol Atar'
          this.optionQuick = 'Deplasman'
          this.subOddsQuick.forEach(item => {
            if (item['teams_to_score']) {
              this.rateQuick = item['teams_to_score'][3].odds
            }
          })
          break
      //half_with_most_goals
        case 'hs1':
          this.allDone = true
          this.gameQuick = 'Hangi Devre Çok Gol Olur'
          this.optionQuick = '1.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateQuick = item['half_with_most_goals'][0].odds
            }
          })
          break
        case 'hs2':
          this.allDone = true
          this.gameQuick = 'Hangi Devre Çok Gol Olur'
          this.optionQuick = '2.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateQuick = item['half_with_most_goals'][1].odds
            }
          })
          break
        case 'hs3':
          this.allDone = true
          this.gameQuick = 'Hangi Devre Çok Gol Olur'
          this.optionQuick = 'Eşit'
          this.subOddsQuick.forEach(item => {
            if (item['half_with_most_goals']) {
              this.rateQuick = item['half_with_most_goals'][2].odds
            }
          })
          break
      //home_team_odd_even_goals
        case 'hb1':
        this.allDone = true
        this.gameQuick = 'Evsahibi Tek/Çift'
          this.optionQuick = 'Tek'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_odd_even_goals']) {
              this.rateQuick = item['home_team_odd_even_goals'][0].odds
            }
          })
          break
        case 'hb2':
        this.allDone = true
        this.gameQuick = 'Evsahibi Tek/Çift'
          this.optionQuick = 'Çift'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_odd_even_goals']) {
              this.rateQuick = item['home_team_odd_even_goals'][1].odds
            }
          })
          break
      //home_team_exact_goals
        case 'htg0':
        this.allDone = true
        this.gameQuick = 'Evsahibi Gol Sayısı'
          this.optionQuick = '0 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateQuick = item['home_team_exact_goals'][0].odds
            }
          })
          break
        case 'htg1':
        this.allDone = true
        this.gameQuick = 'Evsahibi Gol Sayısı'
          this.optionQuick = '1 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateQuick = item['home_team_exact_goals'][1].odds
            }
          })
          break
        case 'htg2':
        this.allDone = true
        this.gameQuick = 'Evsahibi Gol Sayısı'
          this.optionQuick = '2 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateQuick = item['home_team_exact_goals'][2].odds
            }
          })
          break
        case 'htg3':
        this.allDone = true
        this.gameQuick = 'Evsahibi Gol Sayısı'
          this.optionQuick = '3+ Gol'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_exact_goals']) {
              this.rateQuick = item['home_team_exact_goals'][3].odds
            }
          })
        break
      //home_team_highest_scoring_half
        case 'hts1':
        this.allDone = true
        this.gameQuick = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionQuick = '1.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateQuick = item['home_team_highest_scoring_half'][0].odds
            }
          })
          break
        case 'hts2':
        this.allDone = true
        this.gameQuick = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionQuick = '2.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateQuick = item['home_team_highest_scoring_half'][1].odds
            }
          })
          break
        case 'hts3':
        this.allDone = true
        this.gameQuick = 'Evsahibi Hangi Devre Çok Gol Atar'
          this.optionQuick = 'Eşit'
          this.subOddsQuick.forEach(item => {
            if (item['home_team_highest_scoring_half']) {
              this.rateQuick = item['home_team_highest_scoring_half'][2].odds
            }
          })
          break
      //away_team_odd_even_goals
        case 'ab1':
        this.allDone = true
        this.gameQuick = 'Deplasman Tek/Çift'
          this.optionQuick = 'Tek'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_odd_even_goals']) {
              this.rateQuick = item['away_team_odd_even_goals'][0].odds
            }
          })
          break
        case 'ab2':
        this.allDone = true
        this.gameQuick = 'Deplasman Tek/Çift'
          this.optionQuick = 'Çift'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_odd_even_goals']) {
              this.rateQuick = item['away_team_odd_even_goals'][1].odds
            }
          })
          break
      //away_team_exact_goals
        case 'atg0':
        this.allDone = true
        this.gameQuick = 'Deplasman Gol Sayısı'
          this.optionQuick = '0 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateQuick = item['away_team_exact_goals'][0].odds
            }
          })
          break
        case 'atg1':
        this.allDone = true
        this.gameQuick = 'Deplasman Gol Sayısı'
          this.optionQuick = '1 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateQuick = item['away_team_exact_goals'][1].odds
            }
          })
          break
        case 'atg2':
        this.allDone = true
        this.gameQuick = 'Deplasman Gol Sayısı'
          this.optionQuick = '2 Gol'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateQuick = item['away_team_exact_goals'][2].odds
            }
          })
          break
        case 'atg3':
        this.allDone = true
        this.gameQuick = 'Deplasman Gol Sayısı'
          this.optionQuick = '3+ Gol'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_exact_goals']) {
              this.rateQuick = item['away_team_exact_goals'][3].odds
            }
          })
          break
      //away_team_highest_scoring_half
        case 'ats1':
        this.allDone = true
        this.gameQuick = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionQuick = '1.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateQuick = item['away_team_highest_scoring_half'][0].odds
            }
          })
          break
        case 'ats2':
        this.allDone = true
        this.gameQuick = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionQuick = '2.Devre'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateQuick = item['away_team_highest_scoring_half'][1].odds
            }
          })
          break
        case 'ats3':
        this.allDone = true
        this.gameQuick = 'Deplasman Hangi Devre Çok Gol Atar'
          this.optionQuick = 'Eşit'
          this.subOddsQuick.forEach(item => {
            if (item['away_team_highest_scoring_half']) {
              this.rateQuick = item['away_team_highest_scoring_half'][2].odds
            }
          })
          break
      //both_teams_to_score_1st_half_2nd_half
        case 'dvh1':
        this.allDone = true
        this.gameQuick = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionQuick = 'Evet/Evet'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_1st_half_2nd_half'][0].odds
            }
          })
          break
        case 'dvh2':
        this.allDone = true
        this.gameQuick = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionQuick = 'Evet/Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_1st_half_2nd_half'][1].odds
            }
          })
          break
        case 'dvh3':
        this.allDone = true
        this.gameQuick = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionQuick = 'Hayır/Evet'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_1st_half_2nd_half'][2].odds
            }
          })
          break
        case 'dvh4':
        this.allDone = true
        this.gameQuick = 'İlk Yarı/İkinci Yarı Her İki Takım Gol'
          this.optionQuick = 'Hayır/Hayır'
          this.subOddsQuick.forEach(item => {
            if (item['both_teams_to_score_1st_half_2nd_half']) {
              this.rateQuick = item['both_teams_to_score_1st_half_2nd_half'][3].odds
            }
          })
          break
      }
    },
    async addSlipQuick () {
      this.getQuickSubId()
      if (this.scoreIdQuick) {
        this.sliploader = true
        await axios.get(`/api/home/prematchodds/${this.scoreIdQuick}`).then((result) =>{
          let mainodds = []
          result.data.results.forEach(item => {
            if (item.corners) {
              mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp,...item.corners.sp})
            } else {
              mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp})
            }
          })
          this.subOddsQuick = mainodds
          this.getQuickBet()
          if (this.allDone) {
            this.quickSlips = {
              code: this.codeQuick,
              user: this.$store.state.auth.user,
              admin: this.$store.state.auth.admin,
              superadmin: this.$store.state.auth.superadmin,
              match: this.matchQuick,
              games: this.gameQuick,
              option: this.optionQuick,
              rate: this.rateQuick,
              stream: 'Bülten',
              branch:'F',
              state: 'Aktif',
              scoreid: this.scoreIdQuick
            }
            this.sliploader = false
            if (!this.$store.state.betflex){
              this.$store.commit('setBetSlip', true)
            }
            setTimeout(() => {
               if (this.$store.state.slips.length > 0) {
                let test = this.$store.state.slips.find(o => o.match === this.matchQuick)
                if (test === undefined) {
                  this.$store.commit('setSlips', this.quickSlips)
                }
              } else {
                this.$store.commit('setSlips', this.quickSlips)
              }
            }, 50)
            this.scoreIdQuick = ''
            this.codeQuick = ''
            this.optionInput = ''
            document.getElementById('codequick').focus()
          }else {
            this.optionInput = ''
            this.optionClass = false
            this.sliploader = false
          }
        })
        this.allDone = false
      }else{
        this.scoreIdQuick = ''
        this.codeQuick = ''
        this.codeClass = false
        document.getElementById('codequick').focus()
      }
    }
  }
}
</script>