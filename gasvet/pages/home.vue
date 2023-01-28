<template>
  <div class="home-page">
    <header class="home-header">
      <div class="home-top-left">
        <div class="home-top-inside">
          <div class="hhli hhlli">
            <span class="htilt"><i class="fas fa-balance-scale navbar-icons  cl-y"/>Toplam Kupon:</span>
            <span class="cl-g">{{$store.state.betinfo.totalcount}}</span>
          </div>
          <div class="hhli hhlli">
            <span class="htilt"><i class="fas fa-balance-scale navbar-icons cl-y"/>Toplam Miktar :</span>
            <span class="cl-g">{{$store.state.betinfo.totalamount | currency('',2)}}</span>
          </div>
          <div class="hhli hhlli">
            <span class="htilt mr5"><i class="fas fa-balance-scale navbar-icons cl-y"/>Tahmini Kazanç :</span>
            <span class="cl-g">{{$store.state.betinfo.activeearn | currency('', 2)}}</span>
          </div>
        </div>
        <div class="home-top-inside htis">
          <div class="hhli">
            <span class="htict"><i class="fas fa-arrow-up navbar-icons cl-g"/>Kazanan Adet :</span>
            <span class="cl-g ml10">{{$store.state.betinfo.woncount}}</span>
          </div>
          <div class="hhli">
            <span class="htict"><i class="fas fa-arrow-up navbar-icons cl-g"/>Kazanan :</span>
            <span class="cl-g ml5">{{$store.state.betinfo.wonearn | currency('', 2)}}</span>
          </div>
          <div class="hhli">
            <span class="htict"><i class="fas fa-briefcase navbar-icons cl-f"/>Kasa :</span>
            <span v-if="checkC1" class="cl-g ml5">{{ getEarnSubuser | currency('', 2)}}</span>
            <span v-else class="cl-g ml5">{{ getEarnAdmin | currency('', 2)}}</span>
          </div>
        </div>
      </div>
      <div class="home-top-center">
        <img src="~/assets/img/gasvet.png">
      </div>
      <div class="home-top-right">
        <div class="home-top-inside htir">
          <div class="hhli">
            <span class="htirt" v-if="$store.state.auth"><i class="fas fa-user navbar-icons cl-g"/>{{$store.state.auth.user | capitalize}}</span>
          </div>
          <div class="hhli" v-if="$store.state.auth && $store.state.auth.role !== 'U1' && $store.state.auth.role !== 'C1'">
            <span class="htirt"><i class="fas fa-users navbar-icons cl-g"/>Aktif Bayi Sayısı:</span>
             <span class="cl-g ml10">{{activeUsers}}</span>
          </div>
          <div class="hhli">
            <span class="htirt"><i class="fas fa-briefcase navbar-icons cl-f"/>Bakiye :</span>
            <span class="cl-g">{{($store.state.betinfo.creditremain) | currency('', 2)}} {{ $store.state.betinfo.creditremainsum | currency('', 2)}}</span>
            <span class="cl-y subcredit" v-if="$store.state.auth.role !== 'C1' && $store.state.betinfo.subcredit > 0">({{$store.state.betinfo.subcredit | currency('', 0)}})</span>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc"  @click="openChatHandel()" title="Chat">
            <span class="msg-info" v-if="lastMsg">{{ lastMsg }}</span>
            <span class="msg-info" v-else><i class="fas fa-comments"></i></span>
            <div class="msg-info-slide" v-if="lastMsg" :class="{newMsgClass:isNewMsg}">
              <i class="fa fa-comments fa-3x" ></i>
            </div>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc po-r" @click="setMultiLogin" title="Çoklu Oturum İzni">
            <i class="fas fa-users fa-2x cp cl-g" v-if="multiLogin"/>
            <i class="fas fa-users fa-2x cp cl-r" v-else/>
            <span class="sessioncount" v-if="$store.state.auth">{{$store.state.auth.sessioncount}}</span>
          </div>
        </div>
        <div class="home-top-inside htil">
          <div class="hhli htil">
            <nuxt-link to="" class="navbar-logout cl-r" @click.native="logout" title = "Çıkış">
              <i class="fas fa-sign-out-alt fa-2x" v-if="!isLoader"/>
              <img src="~/assets/img/loader.gif" class="mt10" alt="" v-if="isLoader">
              <span v-if="errorMsg">{{errorMsg}}</span>
              <span v-if="!isLoader">Çıkış</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </header>
    <div class="anons" v-if="anons !== null">
      <p class="anons-item">
        <span>{{anons}}</span>
      </p>
    </div>
    <nav class="navbar">
      <nuxt-link to="/home/soccerfixture" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-futbol navbar-icons cl-g"/>
        <span>FUTBOL</span>
      </nuxt-link>
      <nuxt-link to="/home/soccerinplay" class="navbar-links" exact-active-class="navbar-active">
        <span class="live-logos"><i class="fas fa-bolt navbar-icons cl-y"/>FUTBOL CANLI</span>
      </nuxt-link>
      <nuxt-link to="/home/basketfixture" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-basketball-ball navbar-icons cl-o"/>BASKET
      </nuxt-link>
      <nuxt-link to="/home/basketinplay" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-bolt navbar-icons cl-y"/>BASKET CANLI
      </nuxt-link>
      <nuxt-link to="/home/account" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-user-secret navbar-icons cl-f"></i>HESABIM
      </nuxt-link>
      <nuxt-link to="/welcome" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-home navbar-icons cl-w"/>
      </nuxt-link>
    </nav>
    <nuxt class="home-router"/>
    <chat class="chat-router" v-if="$store.state.openchat"/>
    <footer class="home-footer">
      <h3>
        <img src="~/assets/img/18.png" />
        Sistemimizi 18 yaşından büyükler ve yurtdışında ikamet edenler kullanabilirler...!
      </h3>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import socket from '~/plugins/socket.io.js'
import Vue2Filters from 'vue2-filters'
import chat from '@/components/chat.vue'
export default {
  middleware: 'clientauth',
  mixins: [Vue2Filters.mixin],
  name: 'home',
  components: {
    chat
  },
  data () {
    return {
      isLoader: false,
      errorMsg: null,
      multiLogin: this.$store.state.auth.multilogin,
      activeUsers:0,
      oddsAll: {},
      lastMsgCount:0,
      isNewMsg:false,
      anons:null,
      subcredit:0
    }
  },
  mounted () {
    socket.emit('activeusers', this.$store.state.auth.user)
    socket.on('msgcount',() => {
      let oldcount = this.$store.state.msgcount
      this.lastMsgCount =  oldcount + 1
      this.$store.commit('setMsgCount', this.lastMsgCount)
    })
    socket.on('returnbetinfo',() => {
      this.betInfo()
    })
    if (this.checkRole()){
      this.getSetTime ()
      this.getSetLimit ()
      this.getSettings()
      this.betInfo()
      this.getActiveUsers()
    }
    this.getMsgCount()
    this.getAnons()
  },
  computed:{
    lastMsg(){
      return this.$store.state.msgcount
    },
    getEarnAdmin(){
      return (this.$store.state.betinfo.credit - this.$store.state.betinfo.creditremain) - this.$store.state.betinfo.subcredit
    },
    getEarnSubuser(){
      return (this.$store.state.betinfo.wonearn - this.$store.state.betinfo.totalamount)
    },
    checkC1(){
      if (this.$store.state.auth.role === 'C1') {
        return true
      }
    }
  },
  methods:{
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
    async getSetTime () {
      await axios.get('/api/home/account/settime').then((result) => {
        this.$store.commit('setTime', result.data.data)
      }).catch(err => {console.log(err)})
    },
    async getSetLimit () {
      await axios.get('/api/home/account/setlimit').then((result) => {
        this.$store.commit('setLimit', result.data.data)
      }).catch(err => {console.log(err)})
    },
    async logout() {
      if (navigator.onLine === true){
        this.errorMsg = null
        this.isLoader = true
        await axios.get('/api/logout').then((result) => {
          if (result.data.ok) {
            this.$store.commit('setBetSlip', false)
            this.$store.commit('removeSlips','')
            this.$router.push('/')
            this.isLoader = false
            socket.disconnect()
            localStorage.clear()
            this.$store.commit('setAuth', null)
          }
        }).catch(err => {console.log(err)})
      }else {
        this.isLoader = false
        this.errorMsg = 'Baglanti Yok!'
      }
    },
    async getMsgCount() {
      if (navigator.onLine === true){
        await axios.get('/api/home/msgcount').then((result) => {
          if (result.data.message !== 'null') {
            if (this.$store.state.msgcount !== result.data.message) {
              this.$store.commit('setMsgCount', result.data.message)
            }else {
            this.$store.commit('setMsgCount', '')
            }
          }
        }).catch((error)=>{console.log(error)})
      }
    },
    openChatHandel (){
      this.$store.commit('setOpenChat', true)
      this.isNewMsg = false
    },
    async setMultiLogin(){
      this.multiLogin =! this.multiLogin
      await axios.post('/api/multilogin',{multilogin: this.multiLogin})
    },
    async getActiveUsers (){
      await axios.get('/api/home/account/activeusers').then((result)=>{
        this.activeUsers = result.data.activeusers
      }).catch(err => {console.log(err)})
    },
    async getSettings(){
      await axios.get('/api/home/account/settings').then((result)=>{
        this.$store.commit('setRate', result.data)
      }).catch(err => {console.log(err)})
    },
    checkRole(){
      if (this.$store.state.auth) {
        if (this.$store.state.auth.role !== 'B1' && this.$store.state.auth.role !== 'S1') {
          return true
        }
      }
    },
    async getAnons(){
      await axios.get('/api/home/account/getanons').then((result)=>{
        if (result.data.anons && result.data.anons.length > 0) {
          console.log(this.anons)
          this.anons = result.data.anons[0].anons
        }else{this.anons = null}
      }).catch(err => {console.log(err)})
    }
  }
}
</script>