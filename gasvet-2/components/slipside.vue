<template>
  <div>
    <div class="title-2">
      <span><i class="fas fa-futbol navbar-icons cl-g"/>KUPONLAR</span>
      <span class="badge bg-g" v-if="$store.state.betslip">{{slips.length}}</span>
    </div>
    <div class="slip-side-con">
      <form class="quick-bet-entry">
        <div class="quick-bet-con">
          <input type="number" v-model="codeQuick" @keyup="jumpToOption()" @blur="resetCodeClass()" id="codequick" class="inp quick-entry-inputs" :class="{quickClass:!isCodeClass}" minlength="3"   placeholder="Kod" required>
          <input type="text" v-model="optionInput" @focus="checkCodeEmpty()" @keyup="getOption()" @keyup.enter="addSlipQuick()" @blur="resetisOptionClass()" :class="{quickClass:!isOptionClass}" id="optioninput" class="inp quick-entry-inputs" placeholder="Seçim" required>
          <img src="~/assets/img/loader.gif" alt="" class="ml20" v-if="isSlipLoader">
        </div>
      </form>
        <div v-if="this.$store.state.betslip">
          <div class="slip-con"  v-show="!isAddBetLoader">
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
                  <span class="slip-match">{{ list.matches }}</span>
                </div>
                <div class="slip-order">
                  <span class="slip-items slip-items-text">Bahis:</span>
                  <span class="slip-items slip-items-break">{{ list.games }}</span>
                </div>
                <div class="slip-order jcsb">
                  <div>
                    <span class="slip-items slip-items-text">Seçim:</span>
                    <span class="slip-items slip-items-break">{{ list.options }}</span>
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
                  <span> {{ slipSummary.amount  | currency('', 2) }}</span>
                </li>
                <li class="info-con">
                  <span>Toplam Kazanç:</span>
                  <span>{{ getNetEarn | currency('', 2) }}</span>
                </li>
              </ul>
            </ul>
            <div class="slip-total-rate">
              <span><b>Oran</b> : {{ getTotalRate}}</span>
              <span><b>Brüt</b> : {{ getEarnUpdate | currency('', 2)}}</span>
            </div>
            <div class="slip-total-rate cl-f">
              <span><b>Komisyon</b> : % {{ $store.state.auth.personcomission }}</span>
              <span><b>Net</b> : {{ getNetEarn | currency('', 2)}}</span>
            </div>
            <!-- <div class="slip-total-rate remain-credit">
              <b>Yeni Bakiye: </b>
              <span>{{creditRemain | currency('', 2)}}</span>
            </div> -->
            <div class="quick-owner">
              <span class="cl-g"><input type="checkbox" checked>Oran Değişimlerini Kabul Ediyorum</span>
            </div>
            <div class="quick-owner">
              <input type="text" v-model="slipSummary.owner" @focus="clearOwner($event)" class="inp inp-owner-center" placeholder="Kupon Sahibi">
            </div>
            <ul class="quick-amount-btn">
              <li v-for="btn in quickBtn" :key="btn" class="bet-rdb">
                <input type="radio" :value="btn" :id="btn" v-model="slipSummary.amount" @change="getEarn()">
                <label :for="btn"  class="betrdb-lbl">{{btn}}</label>
              </li>
            </ul>
            <div v-if="betMsg" class="bet-msg">
              <span>{{betMsg}}</span>
            </div>
            <div class="slip-form">
              <input type="number" step="5" min="5" v-model="slipSummary.amount" class="inp inp-slip" placeholder="Miktar" @input="getEarn()">
              <input type="button" class="clear" value="Temizle" @click="removeSlipAll()">
              <input type="submit" class="done" value="Yatır" @click="addBet()">
            </div>
          </div>
          <div class="live-slip" v-show="isAddBetLoader">
            <div class="live-sliploader-con" v-if="!isDialog">
              <span class="live-slip-text">Kupon Yatırılıyor</span>
              <img src="~/assets/img/loader.gif" alt="" class="live-slip-loader">
            </div>
            <div v-if="isDialog" class="dialog print-dialog">
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
        <div v-if="checkU1 || checkC1" class="last-coupon" @click="getLastCoupon()">{{lastCoupon}}</div>
      </div>
    </div>
    <div class="code-error" v-if="codeError.length > 0">{{codeError}}</div>
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
      codeQuick:null,
      optionInput:null,
      gameQuick: null,
      matchQuick: null,
      optionQuick:null,
      rateQuick: null,
      creditRemain: null,
      matches: null,
      earn:0,
      totalRate: 1,
      finalRate: null,
      betMsg: null,
      role: this.$store.state.auth.role,
      quickBtn: [5,10,15,20,25,30,35,40,45,50,75,100],
      quickSlips: {},
      isDialog: false,
      isSlipLoader: false,
      isCodeClass: true,
      isOptionClass: true,
      isAddBetLoader: false,
      lastCoupon:'Son Oynanan Kuponu Getir',
      codeError:'',
      slipSummary: {
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        amount: null,
        owner: 'Sahip',
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
      return (this.earn = this.slipSummary.amount * this.totalRate).toFixed(0)
    },
    getNetEarn () {
      let earn = this.slipSummary.amount * this.totalRate
      let comission = (earn * this.$store.state.auth.personcomission) / 100
      return earn - comission
    },
    checkQuickSection(){
      if (this.$route.name === 'home-soccer') {
        return true
      }
    },
    checkC1(){
      if (this.$store.state.auth) {
        return this.$store.state.auth.role === 'C1'
      }
    },
    checkU1(){
      if (this.$store.state.auth) {
        return this.$store.state.auth.role === 'U1'
      }
    }
  },
  methods: {
    async addSlipQuick () {
      let fid = this.$store.state.fixtureid.filter(item => item.toString().slice(-3) === this.codeQuick)
      if (fid.length === 0) {
        this.optionInput = null
        this.isCodeClass = false
        document.getElementById('codequick').focus()
      }else if (fid.length > 1){
        this.optionInput = null
        this.isCodeClass = false
        document.getElementById('codequick').focus()
        this.codeError = 'Uyarı! İkiz Kod'
        setTimeout(() => {
          this.codeError = ''
        }, 5000)
      }else{
        this.codeError = ''
        await axios.get(`/api/home/soccerfixtureodds/${fid}`).then((result)=>{
          if (result.data.length > 0) {
            this.subOddsQuick = result.data
            this.matchQuick = this.subOddsQuick[0].HomeTeam +' - '+ this.subOddsQuick[0].AwayTeam
            this.isSlipLoader = true
            this.getQuickBet()
            let st = moment.utc(this.subOddsQuick[0].Date).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm')
            let betdate = st.substr(5,5)
            let bettime = st.slice(-5)
            if (this.isOptionClass) {
              if (this.rateQuick) {
                this.quickSlips = {
                  code: this.codeQuick,
                  user: this.$store.state.auth.user,
                  admin: this.$store.state.auth.admin,
                  superadmin: this.$store.state.auth.superadmin,
                  matches: this.matchQuick,
                  games: this.gameQuick,
                  options: this.optionQuick,
                  rate: this.rateQuick,
                  stream: 'Bülten',
                  state: 'Aktif',
                  scoreid: this.subOddsQuick[0].Id,
                  eventtime:betdate +'/'+ bettime
                }
                this.isSlipLoader = false
                if (!this.$store.state.betquick){
                  this.$store.commit('setBetSlip', true)
                }
                setTimeout(() => {
                  let t = 0
                  if (this.$store.state.slips.length > 0) {
                  let test = this.$store.state.slips.find((item,index) =>{
                    t = index
                    return item.code === this.subOddsQuick[0].Id.toString().slice(-3)
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
                
                this.codeQuick = null
                this.optionInput = null
                this.isCodeClass = true
                document.getElementById('codequick').focus()
              }
            }
            this.optionInput = null
            this.isOptionClass = false
            document.getElementById('optioninput').focus()
            this.isSlipLoader = false
            this.isCodeClass = true
          }
        })
      }
    },
    async getLastCoupon(){
      await axios.get('/api/home/account/lastcoupon').then((result)=>{
        if(result.data.status === 401){
          this.lastCoupon = 'Kupon Bulunamadı!'
          setTimeout(() => {
            this.lastCoupon = 'Son Oynanan Kuponu Getir'
          }, 3000)
        }else{
          let bets = []
          for (const key in result.data) {
            bets.push(
              {
                code: result.data[key].code,
                user: this.$store.state.auth.user,
                admin: this.$store.state.auth.admin,
                superadmin: this.$store.state.auth.superadmin,
                matches: result.data[key].matches,
                games: result.data[key].games,
                options: result.data[key].options,
                rate: result.data[key].rate,
                stream: 'Bülten',
                state: 'Aktif',
                scoreid: result.data[key].scoreid,
                eventtime: result.data[key].eventtime
              }
            )
            this.$store.commit('setSlips', bets[key])
          }
          if (!this.$store.state.betslip){
            this.$store.commit('setBetSlip', true)
          }
        }
      })
    },
    async addBet(){
      if (navigator.onLine === true) {
        if (this.$store.state.auth.role === 'G1' || this.$store.state.auth.role === 'U1' || this.$store.state.auth.role === 'C1'){
          let minms = this.$store.state.limit.minms
          let maxms = this.$store.state.limit.maxms
          let minkm = this.$store.state.limit.minkm
          let maxkm = this.$store.state.limit.maxkm
          let cminms = this.$store.state.limit.cminms
          let cmaxms = this.$store.state.limit.cmaxms
          let cminkm = this.$store.state.limit.cminkm
          let cmaxkm = this.$store.state.limit.cmaxkm
          let creditremain = this.$store.state.betinfo.creditremain
          let checksuspend = false
          let suspendcode = null
          if (minms !== 0 && this.slips.length < minms) {
            this.betMsg = 'Minumum Maç sayısı' +' '+ minms +' '+'olmalıdır'
          } else if(maxms !== 0 && this.slips.length > maxms){
            this.betMsg = 'Maximum Maç sayısı' +' '+ maxms +' '+'olmalıdır'
          } else if(minkm !== 0 && this.slipSummary.amount < minkm){
            this.betMsg = 'Miktar' +' '+ minkm +' TL den az olamaz! '
          } else if(maxkm !== 0 && this.slipSummary.amount > maxkm){
            this.betMsg = 'Miktar' +' '+ maxkm +' TL den fazla olamaz!'
          } else if (cminms !== 0 && this.slips.length < cminms) {
            this.betMsg = 'Minumum Maç sayısı' +' '+ cminms +' '+'olmalıdır'
          } else if (cmaxms !== 0 && this.slips.length < cmaxms) {
            this.betMsg = 'Maximum Maç sayısı' +' '+ cmaxms +' '+'olmalıdır'
          } else if(cminkm !== 0 && this.slipSummary.amount < cminkm){
            this.betMsg = 'Miktar' +' '+ cminkm +' TL den az olamaz! '
          } else if(cmaxkm !== 0 && this.slipSummary.amount > cmaxkm){
            this.betMsg = 'Miktar' +' '+ cmaxkm +' TL den fazla olamaz!'
          } else if(this.slipSummary.amount > creditremain){
            this.betMsg = 'Yetersiz Bakiye'
          } else if(!this.slipSummary.amount || this.slipSummary.amount < 1) {
            this.betMsg = 'Miktar Boş Bırakılamaz!'
          } else{
            this.isAddBetLoader = true
            let livebet = this.$store.state.slips.filter(item => item.stream === 'Canlı')
            if (livebet.length > 0) {
              this.slipSummary.stream = 'Canlı'
              setTimeout(() => {
                let livebetid = livebet.map(item => item.scoreid)
                axios.get(`/api/home/inplayodds/${livebetid}`).then((result) =>{
                  var lastodds = result.data.map(item => {
                    return{
                      scoreboard:item.Scoreboard,
                      id:item.Id,
                      markets:item.Markets.filter(item2 => 
                        { return livebet.every(item3 => (item3.tid === item2.templateId))}
                      )
                    }
                  })
                  if (lastodds.length > 0) {
                    livebet.forEach(item => {
                      lastodds.forEach(item2 => {
                        if (item.scoreid === item2.id && !item2.markets) {
                          suspendcode = item.scoreid
                          checksuspend = true
                          this.betMsg = suspendcode.slice(-3) +'  '+ 'Bahise Kapalıdır!'
                        }else if(item.scoreid === item2.id && item.score !== item2.scoreboard.score){
                          suspendcode = item.scoreid
                          checksuspend = true
                          this.betMsg = suspendcode.slice(-3) +'  '+ 'Skoru Degişti!'
                        }else if(item.tid === item2.markets.templateId && item2.markets.visibility === 'Suspended'){
                          suspendcode = item.scoreid
                          checksuspend = true
                          this.betMsg = suspendcode.slice(-3) +'  '+ 'Bahisi Askıdadır!'
                        }else{
                          checksuspend = false
                        }
                      })
                    })
                    if (checksuspend) {
                      this.isAddBetLoader = false
                    }else{
                      this.sendBet()
                    }
                  }else {
                    this.isAddBetLoader = false
                    this.betMsg = 'Bahise Kapalıdır!'
                  }
                })
              }, 10 * 1000)
            }else{
              this.sendBet()
            }
          }
        }else{
          this.betMsg = 'Oyun Yetkiniz Yoktur!'
        }
        return true
      }else{
        this.betMsg = 'Baglantı Yok!'
      }
    },
    async sendBet(){
      this.$store.commit('updateSlips', this.slipSummary.betref)
      await axios.post('/api/home/account/addbet', {sliplength:this.slips.length, slipSummary: this.slipSummary, slips: this.$store.state.slips, maxrate:this.$store.state.limit.maxrate, maxearn:this.$store.state.limit.maxearn}).then((result) => {
        if (result.data.error) {
          this.isAddBetLoader = false
          this.betMsg = result.data.error
        }else{
          this.error = null
          this.isDialog = true
          this.slipSummary.owner = 'Sahip'
          setTimeout(() => {
            document.getElementById('printbutton').focus()
          }, 100)
          setTimeout(() => {
            this.hidePrintDialog()
          }, 3000)
        }
      })
    },
    async betInfo() {
      try {
        const credit = await axios.post('/api/home/account/creditinfo',{userbox:'Üyeler'})
        const subcredit = await axios.post('/api/home/account/subcredit',{userbox:'Üyeler'})
        const active = await axios.post('/api/home/account/activeinfo',{userbox:'Üyeler'})
        const won = await axios.post('/api/home/account/woninfo',{userbox:'Üyeler'})
        const total = await axios.post('/api/home/account/totalinfo',{userbox:'Üyeler'})
        const lostinfo = await axios.post('/api/home/account/lostinfo', { userbox:'Üyeler'})
        Promise.all([credit, subcredit, active, total, won, lostinfo]).then(result => {
          let final = {... result[0].data.creditinfo, ... result[1].data.subcredit, ...result[2].data.activeinfo, ...result[3].data.totalinfo, ...result[4].data.woninfo, ...result[5].data.lostinfo}
          this.$store.commit('setBetInfo',final)
        })
      } catch (error) {console.log(error)}
    },
    jumpToOption(){
      this.isCodeClass = true
      if (this.codeQuick !== null && this.codeQuick.length === 3) {
        document.getElementById('optioninput').focus()
      }
    },
    getOption(){
      this.isOptionClass = true
    },
    checkCodeEmpty(){
      if (!this.codeQuick) {
        document.getElementById('codequick').focus()
        this.isCodeClass = false
      }
    },
    resetCodeClass(){
      this.isCodeClass = true
    },
    resetisOptionClass(){
      this.isOptionClass = true
    },
    clearOwner(event){
      event.target.value = ''
    },
    getEarn () {
      this.earn = this.slipSummary.amount * this.finalRate
      this.creditRemain = this.$store.state.betinfo.creditremain - this.slipSummary.amount
      this.$store.commit('updateSlips', this.slipSummary.betref)
    },
    removeSlip (index) {
      this.$store.commit('removeSlipItem', index)
      if (this.slips.length === 0) {
        this.$store.commit('setBetSlip', false)
        this.betMsg = null
        this.earn = null
        this.creditRemain = null
        this.slipSummary.amount = null
        this.error = null
        this.totalRate = 1
        this.finalRate = 1
        this.slipSummary.betref = Math.floor(Math.random() * Math.floor(9999999))
      }
    },
    removeSlipAll () {
      this.betMsg = null
      this.earn = null
      this.creditRemain = null
      this.slipSummary.amount = null
      this.error = null
      this.totalRate = 1
      this.finalRate = 1
      this.$store.commit('setBetSlip', false)
      this.$store.commit('removeSlips', [])
      this.slipSummary.betref = Math.floor(Math.random() * Math.floor(99999))
      this.$store.commit('setRateToggle', true)
    },
    print () {
      this.$store.commit('setRateToggle', true)
      this.$htmlToPaper('printMe')
    },
    hidePrintDialog () {
      this.isDialog = false
      this.isAddBetLoader = false
      setTimeout(() => {
        this.removeSlipAll()
        this.betInfo()
      }, 100)
    },
    getQuickBet(){
      if (this.optionInput) {
        switch (this.optionInput.toLowerCase()) {
          //draw no bet
            case 'g1':
              this.gameQuick = 'Beraberlikte İade'
              this.optionQuick = 'Evsahibi'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 12119) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'g2':
              this.gameQuick = 'Beraberlikte İade'
              this.optionQuick = 'Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 12119) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
          //double chance
            case 'c10':
              this.gameQuick = 'Çifte Şans'
              this.optionQuick = 'Evsahibi/Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 3187) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'c02':
              this.gameQuick = 'Çifte Şans'
              this.optionQuick = 'Beraberlik/Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 3187) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'c12':
              this.gameQuick = 'Çifte Şans'
              this.optionQuick = 'Evsahibi/Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 3187) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
          //team 1 total over/under
            case 'ht11':
              this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16454) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'ht12':
              this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16454) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'ht21':
              this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Alt 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24138) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'ht22':
              this.gameQuick = 'Evsahibi Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Üst 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 24138) {
                this.rateQuick =  item.results[0].odds
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
          //team 1 most score half
            case 'hts1':
              this.gameQuick = 'Evsahibi Devre Gol'
              this.optionQuick = 'İlk Yarı'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17672) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'hts0':
              this.gameQuick = 'Evsahibi Devre Gol'
              this.optionQuick = 'Eşitlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17672) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'hts2':
              this.gameQuick = 'Evsahibi Devre Gol'
              this.optionQuick = 'İkinci Yarı'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17672) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
          //team 1 to score bothhalf
            case 'hgdv1':
              this.gameQuick = 'Evsahibi Her İki Devre Gol'
              this.optionQuick = 'Evet'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19704) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'hgdv2':
              this.gameQuick = 'Evsahibi Her İki Devre Gol'
              this.optionQuick = 'Hayır'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19704) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
          //team 1 first half total over/under
            case 'hdt01':
              this.gameQuick = 'İlk Yarı Evsahibi Gol Alt/Üst 0.5'
              this.optionQuick = 'Alt 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31316) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'hdt02':
              this.gameQuick = 'İlk Yarı Evsahibi Gol Alt/Üst 0.5'
              this.optionQuick = 'Üst 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31316) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'hdt11':
              this.gameQuick = 'İlk Yarı Evsahibi Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31317) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'hdt12':
              this.gameQuick = 'İlk Yarı Evsahibi Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31317) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
          //team 2 total over/under
            case 'at11':
              this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16455) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'at12':
              this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16455) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'at21':
              this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Alt 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 20085) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'at22':
              this.gameQuick = 'Deplasman Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Üst 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 20085) {
                this.rateQuick =  item.results[0].odds
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
          //team 2 most score half
            case 'ats1':
              this.gameQuick = 'Delasman Devre Gol'
              this.optionQuick = 'İlk Yarı'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17673) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'ats0':
              this.gameQuick = 'Delasman Devre Gol'
              this.optionQuick = 'Eşitlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17673) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'ats2':
              this.gameQuick = 'Delasman Devre Gol'
              this.optionQuick = 'İkinci Yarı'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 17673) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
          //team 2 to score bothhalf
            case 'agdv1':
              this.gameQuick = 'Deplasman Her İki Devre Gol'
              this.optionQuick = 'Evet'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19705) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'agdv2':
              this.gameQuick = 'Deplasman Her İki Devre Gol'
              this.optionQuick = 'Hayır'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 19705) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
          //team 2 first half total over/under
            case 'adt01':
              this.gameQuick = 'İlk Yarı Delasman Gol Alt/Üst 0.5'
              this.optionQuick = 'Alt 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31319) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'adt02':
              this.gameQuick = 'İlk Yarı Delasman Gol Alt/Üst 0.5'
              this.optionQuick = 'Üst 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31319) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
            case 'adt11':
              this.gameQuick = 'İlk Yarı Delasman Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31320) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'adt12':
              this.gameQuick = 'İlk Yarı Delasman Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 31320) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
          //which half more goals
            case 'a1':
              this.gameQuick = 'Hangi Devre Çok Gol Olur'
              this.optionQuick = 'İlk Yarı'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1329) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'a0':
              this.gameQuick = 'Hangi Devre Çok Gol Olur'
              this.optionQuick = 'Eşitlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1329) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'a2':
              this.gameQuick = 'Hangi Devre Çok Gol Olur'
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
          //half time result
            case 'd1':
              this.gameQuick = 'İlk Yarı Bahsi'
              this.optionQuick = 'Evsahibi'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 2488) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'd0':
              this.gameQuick = 'İlk Yarı Bahsi'
              this.optionQuick = 'Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 2488) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'd2':
              this.gameQuick = 'İlk Yarı Bahsi'
              this.optionQuick = 'Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 2488) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
          
          //halftime/fulltime
            case 'dv11':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Evsahibi/Evsahibi'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'dv10':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Evsahibi/Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[3].odds
                }
              })
              break
            case 'dv12':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Evsahibi/Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[6].odds
                }
              })
              break
            case 'dv01':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Beraberlik/Evsahibi'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'dv00':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Beraberlik/Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[4].odds
                }
              })
              break
            case 'dv02':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Beraberlik/Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[7].odds
                }
              })
              break
            case 'dv21':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Deplasman/Evsahibi'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
            case 'dv20':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Deplasman/Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[5].odds
                }
              })
              break
            case 'dv22':
              this.gameQuick = 'İlk Yarı ve Maç Bahsi'
              this.optionQuick = 'Deplasman/Deplasman'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 21) {
                  this.rateQuick =  item.results[8].odds
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
              this.optionQuick = '2+'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 27536) {
                this.rateQuick =  item.results[2].odds
              }
            })
              break
          //first half total 3 goal bands
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
          //first half double chance
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
          //first half Both Teams To Score
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
          
          //first half over under
            case 'dt01':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Alt 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7688) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'dt02':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Üst 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7688) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'dt11':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7689) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'dt12':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7689) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'dt21':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Alt 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7890) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'dt22':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Üst 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7890) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'dt31':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Alt 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7891) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'dt32':
              this.gameQuick = 'İlk Yarı Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Üst 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7891) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
          //half time odd even
            case 'db1':
              this.gameQuick = 'İlk Yarı Tek/Çift'
              this.optionQuick = 'Tek'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16449) {
                this.rateQuick =  item.results[1].odds
              }
            })
              break
            case 'db2':
              this.gameQuick = 'İlk Yarı Tek/Çift'
              this.optionQuick = 'Çift'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 16449) {
                this.rateQuick =  item.results[0].odds
              }
            })
              break
          //second half over under
            case 'vt01':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Alt 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19595) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'vt02':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Üst 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19595) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'vt11':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19596) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'vt12':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19596) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'vt21':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Alt 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19597) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'vt22':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Üst 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19597) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'vt31':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Alt 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20506) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'vt32':
              this.gameQuick = 'İkinci Yarı Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Üst 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20506) {
                  this.rateQuick = item.results[0].odds
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
          //Results/Both Teams To Score
            case 'mbb11':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Evsahibi/Var'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'mbb12':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Evsahibi/Yok'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[2].odds
                }
              })
              break
            case 'mbb22':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Deplasman/Yok'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[3].odds
                }
              })
              break
            
            case 'mbb01':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Beraberlik/Var'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[5].odds
                }
              })
              break
            case 'mbb21':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Deplasman/Var'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
            case 'mbb02':
              this.gameQuick = 'Maç Bahsi ve Karşılıklı Gol'
              this.optionQuick = 'Gol  Olmaz'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 24392) {
                  this.rateQuick =  item.results[4].odds
                }
              })
              break
          //fulltime and over 2.5
            case 'mt212':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Evsahibi/Üst'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20589) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 'mt222':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Deplasman/Üst'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20589) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'mt211':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Evsahibi/Alt'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20589) {
                  this.rateQuick = item.results[2].odds
                }
              })
              break
            case 'mt221':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Deplasman/Alt'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20589) {
                  this.rateQuick = item.results[3].odds
                }
              })
              break
            case 'mt20':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20589) {
                  this.rateQuick = item.results[4].odds
                }
              })
              break
          //fulltime and over 3.5
            case 'mt312':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Evsahibi/Üst'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20592) {
                  this.rateQuick = item.results[0].odds
                  console.log(this.rateQuick)
                }
              })
              break
            case 'mt322':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Deplasman/Üst'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20592) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 'mt311':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Evsahibi/Alt'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20592) {
                  this.rateQuick = item.results[2].odds
                }
              })
              break
            case 'mt321':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Deplasman/Alt'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20592) {
                  this.rateQuick = item.results[3].odds
                }
              })
              break
            case 'mt30':
              this.gameQuick = 'Maç Bahsi ve Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Beraberlik'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 20592) {
                  this.rateQuick = item.results[4].odds
                }
              })
              break
          //team to win 1
            case 'tb11':
              this.gameQuick = 'Takımlardan Biri 1 Farkla Kazanırmı'
              this.optionQuick = 'Evet'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19508) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'tb12':
              this.gameQuick = 'Takımlardan Biri 1 Farkla Kazanırmı'
              this.optionQuick = 'Hayır'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19508) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
          //team to win 2
            case 'tb21':
              this.gameQuick = 'Takımlardan Biri 2 Farkla Kazanırmı'
              this.optionQuick = 'Evet'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19509) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'tb22':
              this.gameQuick = 'Takımlardan Biri 2 Farkla Kazanırmı'
              this.optionQuick = 'Hayır'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19509) {
                  this.rateQuick =  item.results[1].odds
                }
              })
              break
          //team to win 3
            case 'tb31':
              this.gameQuick = 'Takımlardan Biri 3 Farkla Kazanırmı'
              this.optionQuick = 'Evet'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19510) {
                  this.rateQuick =  item.results[0].odds
                }
              })
              break
            case 'tb32':
              this.gameQuick = 'Takımlardan Biri 3 Farkla Kazanırmı'
              this.optionQuick = 'Hayır'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 19510) {
                  this.rateQuick =  item.results[1].odds
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
          //total over under
            case 't01':
              this.gameQuick = 'Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Alt 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7233) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't02':
              this.gameQuick = 'Toplam Gol Alt/Üst 0.5'
              this.optionQuick = 'Üst 0.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 7233) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 't11':
              this.gameQuick = 'Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Alt 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1772) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't12':
              this.gameQuick = 'Toplam Gol Alt/Üst 1.5'
              this.optionQuick = 'Üst 1.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1772) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 't21':
              this.gameQuick = 'Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Alt 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 173) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't22':
              this.gameQuick = 'Toplam Gol Alt/Üst 2.5'
              this.optionQuick = 'Üst 2.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 173) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 't31':
              this.gameQuick = 'Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Alt 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 8933) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't32':
              this.gameQuick = 'Toplam Gol Alt/Üst 3.5'
              this.optionQuick = 'Üst 3.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 8933) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 't41':
              this.gameQuick = 'Toplam Gol Alt/Üst 4.5'
              this.optionQuick = 'Alt 4.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1791) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't42':
              this.gameQuick = 'Toplam Gol Alt/Üst 4.5'
              this.optionQuick = 'Üst 4.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 1791) {
                  this.rateQuick = item.results[0].odds
                }
              })
              break
            case 't51':
              this.gameQuick = 'Toplam Gol Alt/Üst 5.5'
              this.optionQuick = 'Alt 5.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 859) {
                  this.rateQuick = item.results[1].odds
                }
              })
              break
            case 't52':
              this.gameQuick = 'Toplam Gol Alt/Üst 5.5'
              this.optionQuick = 'Üst 5.5'
              this.subOddsQuick[0].Markets.forEach(item => {
                if (item.templateId === 859) {
                  this.rateQuick = item.results[0].odds
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
              this.optionQuick = '4+'
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
              this.optionQuick = '5+'
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
              this.optionQuick = '6+'
              this.subOddsQuick[0].Markets.forEach(item => {
              if (item.templateId === 27535) {
                this.rateQuick =  item.results[2].odds
              }
            })
              break
          //total exact goals 5+
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
          default: this.isOptionClass = false
        }
      }
    }
  }
}
</script>