<template>
  <div>
    <div class="title-2">
      <span><i class="fas fa-futbol navbar-icons cl-g"/>KUPONLAR</span>
      <span class="badge bg-g" v-if="$store.state.betslip">{{slips.length}}</span>
    </div>
    <div class="slip-side-con">
      <form class="quick-bet-entry">
        <div class="quick-bet-con">
          <input type="number" v-model="codeQuick" @keyup="jumpToOption()" @blur="resetCodeClass()" id="codequick" class="inp quick-entry-inputs" :class="{quickClass:!codeClass}" minlength="3"   placeholder="Kod" required>
          <input type="text" v-model="optionInput" @focus="checkCodeEmpty()" @keyup="getOption()" @keyup.enter="addSlipQuick()" @blur="resetOptionClass()" :class="{quickClass:!optionClass}" id="optioninput" class="inp quick-entry-inputs" placeholder="Seçim" required>
          <img src="~/assets/img/loader.gif" alt="" class="ml20" v-if="slipLoader">
        </div>
      </form>
      <div v-if="this.$store.state.betslip">
        <div class="slip-con" v-show="!addBetLoader">
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
                <span class="badge slip-code bg-r">{{list.code}}</span>
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
                <span> {{ slipSummary.amount  | currency('₺', 2) }}</span>
              </li>
              <li class="info-con">
                <span>Toplam Kazanç:</span>
                <span>{{ earn | currency('₺', 0) }}</span>
              </li>
            </ul>
          </ul>
          <div class="slip-total-rate">
            <span><b>Oran</b> : {{ getTotalRate}}</span>
            <span><b>Kazanç</b> : {{ getEarnUpdate | currency('', 0)}}</span>
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
        <div class="live-slip" v-show="addBetLoader">
          <div class="live-sliploader-con" v-if="!dialog">
            <span class="live-slip-text">Kupon Yatırılıyor</span>
            <img src="~/assets/img/loader.gif" alt="" class="live-slip-loader">
          </div>
          <div v-if="dialog" class="dialog print-dialog">
            <span class="dialog-title">Kuponu Yazdır</span>
            <div class="dialog-content-print">
              <button class="dialog-side dsp" v-print="'#printMe'" @keyup.enter="hidePrintDialog()" @click="hidePrintDialog()" id="printbutton" tabindex="5">
                <i class="fas fa-print cl-g btn-print" />
                <span>Evet</span>
              </button>
              <button class="dialog-side dsp" @keyup.enter="hidePrintDialog()" @click="hidePrintDialog()" tabindex="6">
                <i class="fas fa-ban cl-r btn-print"/>
                <span>Hayır</span>
              </button>
            </div> 
          </div>
        </div>
      </div>
      <div v-else class="slip-no-bet" :class="branchimage">
        <div v-if="checkU1" class="last-coupon" @click="lastCoupon()">Son Oynanan Kuponu Getir</div>
      </div>
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
    branchimage:String
  },
  name: 'Slipside',
  data () {
    return {
      slips: this.$store.state.slips,
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
      addBetLoader: false,
      slipSummary: {
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        amount: '',
        owner: '',
        stream:'Bülten',
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
        return this.totalRate.toFixed(2)
    },
    getEarnUpdate () {
      return this.earn = this.slipSummary.amount * this.totalRate
    },
    checkQuickSection(){
      if (this.$route.name === 'home-soccer') {
        return true
      }
    },
    checkU1(){
      return this.$store.state.auth.role === 'U1'
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
      this.addBetLoader = false
      this.getActiveInfo()
      this.getCreditInfo()
      setTimeout(() => {
        this.removeSlipAll()
      }, 500)
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
      if (this.codeQuick !== null && this.codeQuick.length === 3) {
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
    async lastCoupon(){
      await axios.get('/api/home/lastcoupon').then((result)=>{
      let bets = []
      for (const key in result.data) {
        bets.push(
          {
            code: result.data[key].code,
            user: this.$store.state.auth.user,
            admin: this.$store.state.auth.admin,
            superadmin: this.$store.state.auth.superadmin,
            match: result.data[key].matches,
            games: result.data[key].games,
            option: result.data[key].options,
            rate: result.data[key].rate,
            stream: 'Bülten',
            state: 'Aktif',
            scoreid: result.data[key].scoreId
          }
        )
        this.$store.commit('setSlips', bets[key])
      }
        if (!this.$store.state.betslip){
          this.$store.commit('setBetSlip', true)
        }
      })
    },
    getQuickBet(){
      switch (this.optionInput.toLowerCase()) {
        //fulltime
          case '1':
            this.gameQuick = 'Mac Sonu'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case '0':
            this.gameQuick = 'Mac Sonu'
            this.optionQuick = 'Beraberlik'
             this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
          case '2':
            this.gameQuick = 'Mac Sonu'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17) {
                this.rateQuick = item.results[2].odds
              }
            })
            break
        //over under 0.5
          case 't01':
            this.gameQuick = 'Toplam Gol 0.5 Alt/Ust'
            this.optionQuick = 'Alt 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7233) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't02':
            this.gameQuick = 'Toplam Gol 0.5 Alt/Ust'
            this.optionQuick = 'Üst 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7233) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //over under 1.5
          case 't11':
            this.gameQuick = 'Toplam Gol 1.5 Alt/Ust'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1772) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't12':
            this.gameQuick = 'Toplam Gol 1.5 Alt/Ust'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1772) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //over under 2.5
          case 't21':
            this.gameQuick = 'Toplam Gol 2.5 Alt/Ust'
            this.optionQuick = 'Alt 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 173) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't22':
            this.gameQuick = 'Toplam Gol 2.5 Alt/Ust'
            this.optionQuick = 'Üst 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 173) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //over under 3.5
          case 't31':
            this.gameQuick = 'Toplam Gol 3.5 Alt/Ust'
            this.optionQuick = 'Alt 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 8993) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't32':
            this.gameQuick = 'Toplam Gol 3.5 Alt/Ust'
            this.optionQuick = 'Üst 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 8993) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //over under 4.5
          case 't41':
            this.gameQuick = 'Toplam Gol 4.5 Alt/Ust'
            this.optionQuick = 'Alt 4.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1791) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't42':
            this.gameQuick = 'Toplam Gol 4.5 Alt/Ust'
            this.optionQuick = 'Üst 4.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1791) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //over under 5.5
          case 't51':
            this.gameQuick = 'Toplam Gol 5.5 Alt/Ust'
            this.optionQuick = 'Alt 5.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 859) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 't52':
            this.gameQuick = 'Toplam Gol 5.5 Alt/Ust'
            this.optionQuick = 'Üst 5.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 859) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //half time over under 0.5
          case 'dt01':
            this.gameQuick = 'İlk Yarı Gol 0.5 Alt/Ust'
            this.optionQuick = 'Alt 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7688) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'dt02':
            this.gameQuick = 'İlk Yarı Gol 0.5 Alt/Ust'
            this.optionQuick = 'Üst 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7688) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //half time over under 1.5
          case 'dt11':
            this.gameQuick = 'İlk Yarı Gol 1.5 Alt/Ust'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7689) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'dt12':
            this.gameQuick = 'İlk Yarı Gol 1.5 Alt/Ust'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7689) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //half time over under 2.5
          case 'dt21':
            this.gameQuick = 'İlk Yarı Gol 2.5 Alt/Ust'
            this.optionQuick = 'Alt 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7690) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'dt22':
            this.gameQuick = 'İlk Yarı Gol 2.5 Alt/Ust'
            this.optionQuick = 'Üst 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7690) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //half time over under 3.5
          case 'dt31':
            this.gameQuick = 'İlk Yarı Gol 3.5 Alt/Ust'
            this.optionQuick = 'Alt 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7691) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'dt32':
            this.gameQuick = 'İlk Yarı Gol 3.5 Alt/Ust'
            this.optionQuick = 'Üst 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7691) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //second half over under 0.5
          case 'vt01':
            this.gameQuick = 'İkinci Yarı Gol 0.5 Alt/Ust'
            this.optionQuick = 'Alt 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19595) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'vt02':
            this.gameQuick = 'İkinci Yarı Gol 0.5 Alt/Ust'
            this.optionQuick = 'Üst 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19595) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //second half over under 1.5
          case 'vt11':
            this.gameQuick = 'İlk Yarı Gol 1.5 Alt/Ust'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19596) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'vt12':
            this.gameQuick = 'İlk Yarı Gol 1.5 Alt/Ust'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19596) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //second half over under 2.5
          case 'vt21':
            this.gameQuick = 'İlk Yarı Gol 2.5 Alt/Ust'
            this.optionQuick = 'Alt 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19597) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'vt22':
            this.gameQuick = 'İlk Yarı Gol 2.5 Alt/Ust'
            this.optionQuick = 'Üst 2.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19597) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //second half over under 3.5
          case 'vt21':
            this.gameQuick = 'İlk Yarı Gol 3.5 Alt/Ust'
            this.optionQuick = 'Alt 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 20506) {
                this.rateQuick = item.results[0].odds
              }
            })
            break
          case 'vt22':
            this.gameQuick = 'İlk Yarı Gol 3.5 Alt/Ust'
            this.optionQuick = 'Üst 3.5'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 20506) {
                this.rateQuick = item.results[1].odds
              }
            })
            break
        //Both Teams To Score
          case 'bb1':
            this.gameQuick = 'Karşılıklı Gol'
            this.optionQuick = 'Var'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7824) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'bb2':
            this.gameQuick = 'Karşılıklı Gol'
            this.optionQuick = 'Yok'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 7824) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
        //half time Both Teams To Score
          case 'dbb1':
            this.gameQuick = 'İlk Yarı Karşılıklı Gol'
            this.optionQuick = 'Var'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 15085) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'dbb2':
            this.gameQuick = 'İlk Yarı Karşılıklı Gol'
            this.optionQuick = 'Yok'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 15085) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
        //draw no bet
          case 'g1':
            this.gameQuick = 'Beraberlikte İade'
            this.optionQuick = '1'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 12119) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'g2':
            this.gameQuick = 'Beraberlikte İade'
            this.optionQuick = '2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 12119) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
        //half time result
          case 'd1':
            this.gameQuick = 'İlk Yarı Sonucu'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 2488) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'd0':
            this.gameQuick = 'İlk Yarı Sonucu'
            this.optionQuick = 'Beraberlik'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 2488) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'd2':
            this.gameQuick = 'İlk Yarı Sonucu'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 2488) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        
        //halftime/fulltime
          case 'dv11':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '1/1'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'dv10':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '1/X'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[3].odds
              }
            })
            break
          case 'dv12':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '1/2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[6].odds
              }
            })
            break
          case 'dv01':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = 'X/1'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'dv00':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = 'X/X'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[4].odds
              }
            })
            break
          case 'dv02':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = 'X/2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[7].odds
              }
            })
            break
          case 'dv21':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '2/1'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
          case 'dv20':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '2/X'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[5].odds
              }
            })
            break
          case 'dv22':
            this.gameQuick = 'İlk Yarı ve Maç Sonu'
            this.optionQuick = '2/2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 21) {
                this.rateQuick =  item.results[8].odds
              }
            })
            break
        //odd even
          case 'b1':
            this.gameQuick = 'Tek/Çift'
            this.optionQuick = 'Tek'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4665) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'b2':
            this.gameQuick = 'Tek/Çift'
            this.optionQuick = 'Çift'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4665) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //half time odd even
          case 'db1':
            this.gameQuick = 'İlk Yarı Tek/Çift'
            this.optionQuick = 'Tek'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16449) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'db2':
            this.gameQuick = 'İlk Yarı Tek/Çift'
            this.optionQuick = 'Çift'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16449) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
         //total exact goals
          case 'tg0':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'tg1':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'tg2':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'tg3':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = '3 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
          case 'tg4':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = '4 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[4].odds
            }
          })
            break
          case 'tg5':
            this.gameQuick = 'Toplam Gol Sayısı'
            this.optionQuick = '5 Gol ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 20095) {
              this.rateQuick =  item.results[5].odds
            }
          })
            break
        //first half total exact goals
          case 'dtg0':
            this.gameQuick = 'İlk Yarı Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4718) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'dtg1':
            this.gameQuick = 'İlk Yarı Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4718) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'dtg2':
            this.gameQuick = 'İlk Yarı Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4718) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'dtg3':
            this.gameQuick = 'İlk Yarı Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4718) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //second half total exact goals
          case 'vtg0':
            this.gameQuick = 'İkinci Yarı Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4732) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'vtg1':
            this.gameQuick = 'İkinci Yarı Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4732) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'vtg2':
            this.gameQuick = 'İkinci Yarı Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4732) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'vtg3':
            this.gameQuick = 'İkinci Yarı Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4732) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //first half team 1 total exact goals
          case 'hdtg0':
            this.gameQuick = 'İlk Yarı Evsahibi Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4720) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'hdtg1':
            this.gameQuick = 'İlk Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4720) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'hdtg2':
            this.gameQuick = 'İlk Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4720) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'hdtg3':
            this.gameQuick = 'İlk Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4720) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //first half team 2 total exact goals
          case 'adtg0':
            this.gameQuick = 'İlk Yarı Delasman Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4721) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'adtg1':
            this.gameQuick = 'İlk Yarı Delasman Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4721) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'adtg2':
            this.gameQuick = 'İlk Yarı Delasman Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4721) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'adtg3':
            this.gameQuick = 'İlk Yarı Delasman Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4721) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //second half team 1 total exact goals
          case 'hvtg0':
            this.gameQuick = 'İkinci Yarı Evsahibi Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4733) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'hvtg1':
            this.gameQuick = 'İkinci Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4733) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'hvtg2':
            this.gameQuick = 'İkinci Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4733) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'hvtg3':
            this.gameQuick = 'İkinci Yarı Evsahibi Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4733) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //second half team 2 total exact goals
          case 'avtg0':
            this.gameQuick = 'İkinci Yarı Delasman Gol Sayısı'
            this.optionQuick = 'Gol Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4734) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'avtg1':
            this.gameQuick = 'İkinci Yarı Delasman Gol Sayısı'
            this.optionQuick = '1 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4734) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'avtg2':
            this.gameQuick = 'İkinci Yarı Delasman Gol Sayısı'
            this.optionQuick = '2 Gol'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4734) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
          case 'avtg3':
            this.gameQuick = 'İkinci Yarı Delasman Gol Sayısı'
            this.optionQuick = '3 Gol ve Üst'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 4734) {
              this.rateQuick =  item.results[3].odds
            }
          })
            break
        //team 1 total over/under
          case 'ht11':
            this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 1.5'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16454) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'ht12':
            this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 1.5'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16454) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //team 2 total over/under
          case 'at11':
            this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 1.5'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16455) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'at12':
            this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 1.5'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 16455) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //total 4 goal bands
          case 'tga40':
            this.gameQuick = 'Toplam Gol Aralığı (0-4)'
            this.optionQuick = '0-1'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27531) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'tga41':
            this.gameQuick = 'Toplam Gol Aralığı (0-4)'
            this.optionQuick = '2-3'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27531) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'tga42':
            this.gameQuick = 'Toplam Gol Aralığı (0-4)'
            this.optionQuick = '4 ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27531) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
        //total 5 goal bands
          case 'tga50':
            this.gameQuick = 'Toplam Gol Aralığı (0-5)'
            this.optionQuick = '0-2'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27534) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'tga51':
            this.gameQuick = 'Toplam Gol Aralığı (0-5)'
            this.optionQuick = '3-4'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27534) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'tga52':
            this.gameQuick = 'Toplam Gol Aralığı (0-5)'
            this.optionQuick = '5 ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27534) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
        //total 6 goal bands
          case 'tga60':
            this.gameQuick = 'Toplam Gol Aralığı (0-6)'
            this.optionQuick = '0-3'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27535) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'tga61':
            this.gameQuick = 'Toplam Gol Aralığı (0-6)'
            this.optionQuick = '4-5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27535) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'tga62':
            this.gameQuick = 'Toplam Gol Aralığı (0-6)'
            this.optionQuick = '6 ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27535) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
        //first half total 2 goal bands
          case 'dtga20':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-2)'
            this.optionQuick = '0'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27536) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'dtga21':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-2)'
            this.optionQuick = '1'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27536) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'dtga22':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-2)'
            this.optionQuick = '2 ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27536) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
        //first half total 2 goal bands
          case 'dtga30':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-3)'
            this.optionQuick = '1'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27537) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'dtga31':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-3)'
            this.optionQuick = '2'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27537) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
          case 'dtga32':
            this.gameQuick = 'İlk Yarı Gol Aralığı (0-3)'
            this.optionQuick = '3 ve Üstü'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 27537) {
              this.rateQuick =  item.results[2].odds
            }
          })
            break
        //team 1 first half total over/under
          case 'hdt01':
            this.gameQuick = 'İlk Yarı Evsahibi Alt/Üst 0.5'
            this.optionQuick = 'Alt 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31316) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'hdt02':
            this.gameQuick = 'İlk Yarı Evsahibi Alt/Üst 0.5'
            this.optionQuick = 'Üst 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31316) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //team 1 first half total over/under
          case 'hdt11':
            this.gameQuick = 'İlk Yarı Evsahibi Alt/Üst 1.5'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31317) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'hdt12':
            this.gameQuick = 'İlk Yarı Evsahibi Alt/Üst 1.5'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31317) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //team 2 first half total over/under
          case 'adt01':
            this.gameQuick = 'İlk Yarı Delasman Alt/Üst 0.5'
            this.optionQuick = 'Alt 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31319) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'adt02':
            this.gameQuick = 'İlk Yarı Delasman Alt/Üst 0.5'
            this.optionQuick = 'Üst 0.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31319) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //team 2 first half total over/under
          case 'adt11':
            this.gameQuick = 'İlk Yarı Delasman Alt/Üst 1.5'
            this.optionQuick = 'Alt 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31320) {
              this.rateQuick =  item.results[0].odds
            }
          })
            break
          case 'adt12':
            this.gameQuick = 'İlk Yarı Delasman Alt/Üst 1.5'
            this.optionQuick = 'Üst 1.5'
            this.subOddsQuick[0].Markets.forEach(item => {
            if (item.templateId === 31320) {
              this.rateQuick =  item.results[1].odds
            }
          })
            break
        //Results/Both Teams To Score
          case 'mbb10':
            this.gameQuick = 'Maç Sonu ve Karşılıklı Gol'
            this.optionQuick = 'Evsahibi/Yok'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24392) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'mbb20':
            this.gameQuick = 'Maç Sonu ve Karşılıklı Gol'
            this.optionQuick = 'Deplasman/Yok'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24392) {
                this.rateQuick =  item.results[3].odds
              }
            })
            break
          case 'mbb11':
            this.gameQuick = 'Maç Sonu ve Karşılıklı Gol'
            this.optionQuick = 'Beraberlik/Var'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24392) {
                this.rateQuick =  item.results[5].odds
              }
            })
            break
          case 'mbb21':
            this.gameQuick = 'Maç Sonu ve Karşılıklı Gol'
            this.optionQuick = 'Deplasman/Var'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24392) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'mbb00':
            this.gameQuick = 'Maç Sonu ve Karşılıklı Gol'
            this.optionQuick = 'Gol  Olmaz'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24392) {
                this.rateQuick =  item.results[4].odds
              }
            })
            break
        //double chance
          case 'c10':
            this.gameQuick = 'Çifte Şans'
            this.optionQuick = '1X'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 3187) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'c02':
            this.gameQuick = 'Çifte Şans'
            this.optionQuick = 'x2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 3187) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'c12':
            this.gameQuick = 'Çifte Şans'
            this.optionQuick = '12'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 3187) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //half time double chance
          case 'dc10':
            this.gameQuick = 'İlk Yarı Çifte Şans'
            this.optionQuick = '1X'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11748) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'dc02':
            this.gameQuick = 'İlk Yarı Çifte Şans'
            this.optionQuick = 'x2'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11748) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'dc12':
            this.gameQuick = 'İlk Yarı Çifte Şans'
            this.optionQuick = '12'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11748) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //team 1 to score
          case 'hg1':
            this.gameQuick = 'Evsahibi Gol Atarmı'
            this.optionQuick = 'Evet'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11087) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'hg2':
            this.gameQuick = 'Evsahibi Gol Atarmı'
            this.optionQuick = 'Hayır'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11087) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
        //team 2 to score
          case 'ag1':
            this.gameQuick = 'Deplasman Gol Atarmı'
            this.optionQuick = 'Evet'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11086) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'ag2':
            this.gameQuick = 'Deplasman Gol Atarmı'
            this.optionQuick = 'Hayır'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 11086) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
        //team 1 most score half
          case 'ah1':
            this.gameQuick = 'Evsahibi Devre Gol'
            this.optionQuick = 'İlk Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17672) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'ah0':
            this.gameQuick = 'Evsahibi Devre Gol'
            this.optionQuick = 'Eşit'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17672) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'ah2':
            this.gameQuick = 'Evsahibi Devre Gol'
            this.optionQuick = 'İkinci Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17672) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //team 2 most score half
          case 'ad1':
            this.gameQuick = 'Delasman Devre Gol'
            this.optionQuick = 'İlk Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17673) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'ad0':
            this.gameQuick = 'Delasman Devre Gol'
            this.optionQuick = 'Eşit'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17673) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'ad2':
            this.gameQuick = 'Delasman Devre Gol'
            this.optionQuick = 'İkinci Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 17673) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //which half more goals
          case 'a1':
            this.gameQuick = 'Devre Gol'
            this.optionQuick = 'İlk Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1329) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'a0':
            this.gameQuick = 'Devre Gol'
            this.optionQuick = 'Eşit'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1329) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'a2':
            this.gameQuick = 'Devre Gol'
            this.optionQuick = 'İkinci Yarı'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 1329) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //handicap 0:1
          case 'h011':
            this.gameQuick = 'Handikap 0:1'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 52) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'h010':
            this.gameQuick = 'Handikap 0:1'
            this.optionQuick = 'Beraberlik'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 52) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'h012':
            this.gameQuick = 'Handikap 0:1'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 52) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //handicap 1:0
          case 'h101':
            this.gameQuick = 'Handikap 1:0'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 54) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'h100':
            this.gameQuick = 'Handikap 1:0'
            this.optionQuick = 'Beraberlik'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 54) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'h102':
            this.gameQuick = 'Handikap 1:0'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 54) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //handicap 0:2
          case 'h021':
            this.gameQuick = 'Handikap 0:2'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 501) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'h020':
            this.gameQuick = 'Handikap 0:2'
            this.optionQuick = 'Beraberlik'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 501) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'h022':
            this.gameQuick = 'Handikap 0:2'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 501) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        //handicap 2:0
          case 'h201':
            this.gameQuick = 'Handikap 2:0'
            this.optionQuick = 'Evsahibi'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 502) {
                this.rateQuick =  item.results[0].odds
              }
            })
            break
          case 'h200':
            this.gameQuick = 'Handikap 2:0'
            this.optionQuick = 'Beraberlik'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 502) {
                this.rateQuick =  item.results[1].odds
              }
            })
            break
          case 'h202':
            this.gameQuick = 'Handikap 2:0'
            this.optionQuick = 'Deplasman'
            this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 502) {
                this.rateQuick =  item.results[2].odds
              }
            })
            break
        default: this.optionClass = false
      }
    },
    async addSlipQuick () {
      let fid = this.$store.state.fixtureid.find(item => item.toString().slice(-3) === this.codeQuick)
      if (fid) {
        await axios.get(`/api/home/soccerodds/${fid}`).then((result)=>{
          if (result.data.length > 0) {
            this.subOddsQuick = result.data
            this.matchQuick = this.subOddsQuick[0].HomeTeam +' - '+ this.subOddsQuick[0].AwayTeam
            this.slipLoader = true
            this.getQuickBet()
            if (this.optionClass) {
              if (this.rateQuick) {
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
                  state: 'Aktif',
                  scoreid: this.subOddsQuick.Id
                }
                this.slipLoader = false
                if (!this.$store.state.betquick){
                  this.$store.commit('setBetSlip', true)
                }
                setTimeout(() => {
                  let t = 0
                  if (this.$store.state.slips.length > 0) {
                  let test = this.$store.state.slips.find((item,index) =>{
                    t = index
                    return item.match === this.matchQuick
                  })
                  if (test === undefined) {
                    this.$store.commit('setSlips', this.quickSlips)
                  }else{
                    this.$store.commit('removeSlipItem', t)
                    setTimeout(() => {
                      this.$store.commit('setSlips', this.quickSlips)
                    }, 100)
                  }
                } else {
                  this.$store.commit('setSlips', this.quickSlips)
                }
                }, 50)
                this.codeQuick = ''
                this.optionInput = ''
                this.codeClass = true
                document.getElementById('codequick').focus()
              }
            }
            this.optionInput = ''
            this.optionClass = false
            document.getElementById('optioninput').focus()
            this.slipLoader = false
            this.codeClass = true
          }
        })
      }else{
        this.optionInput = ''
        this.codeClass = false
        document.getElementById('codequick').focus()
      }
    },
    async addBet(){
      if (navigator.onLine === true) {
        if (this.$store.state.auth.role === 'U1'){
          let minms = this.$store.state.limit.minms
          let maxms = this.$store.state.limit.maxms
          let maxrate = this.$store.state.limit.maxrate
          let maxearn = this.$store.state.limit.maxearn
          let minkm = this.$store.state.limit.minkm
          let maxkm = this.$store.state.limit.maxkm
          let credit = this.$store.state.creditinfo.creditremain
          let checksuspend = true
          let suspendcode = ''
          if (minms !== 0 && this.slips.length < minms) {
            this.betMsg = 'Minumum Maç sayısı' +' '+ minms +' '+'olmalıdır'
          }else if(maxms !== 0 && this.slips.length > maxms){
            this.betMsg = 'Maximum Maç sayısı' +' '+ maxms +' '+'olmalıdır'
          } else if(maxrate !== 0 && this.totalRate > maxrate){
            this.betMsg = 'Maximum Oran' +' '+ maxrate +' '+'olmalıdır'
          } else if(minkm !== 0 && this.slipSummary.amount < minkm){
            this.betMsg = 'Miktar' +' '+ minkm +' TL den az olamaz! '
          } else if(maxearn !== 0 &&  this.slipSummary.earn > maxearn){
            this.betMsg = 'Maximum Kazanç' +' '+ maxearn +' TL den fazla olamaz! '
          } else if(maxkm !== 0 && this.slipSummary.amount > maxkm){
            this.betMsg = 'Miktar' +' '+ maxkm +' TL den fazla olamaz!'
          }else if(this.slipSummary.amount > credit){
            this.betMsg = 'Yetersiz Kredi'
          }else {
            this.addBetLoader = true
            let livebet = this.$store.state.slips.filter(item => item.stream === 'Canlı')
            if (livebet.length > 0) {
              this.slipSummary.stream = 'Canlı'
              this.$store.state.suspendbet.forEach(item => {
                livebet.forEach(item2 => {
                  if (item.id === item2.code && item.score !== item2.score) {
                    checksuspend = false
                    suspendcode = item.id
                  }
               })
              })
              setTimeout(() => {
                if (checksuspend) {
                  this.addBetLoader = true
                  this.sendBet()
                } else {
                  this.betMsg = suspendcode +'  '+ 'Nolu maçın skore degişmiştir!'
                }
              }, 100)
            }else{
              this.addBetLoader = true
              this.sendBet()
            }
          }
        }else{
          this.betMsg = 'Oyun Yetkiniz Yoktur!'
        }
        return true
      }
      this.betMsg = 'Baglantı Yok!'
    },
    sendBet(){
      this.$store.commit('updateSlips', this.slipSummary.betref)
      axios.post('/api/addbet', {sliplength:this.slips.length, slipSummary: this.slipSummary, slips: this.$store.state.slips }).then((result) => {
        if (result.data.code === 401) {
          this.error = result.data.message
        } else {
          this.liveSlip = false
          this.error = ''
          this.dialog = true
          setTimeout(() => {
            document.getElementById('printbutton').focus()
          }, 100)
        }
      })
    }
  }
}
</script>