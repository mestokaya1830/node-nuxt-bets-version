<template>
  <div class="home-page">
    <header class="home-header">
      <div class="home-top-left">
        <div class="home-top-inside">
          <div class="hhli hhlli">
            <span class="htilt"><i class="fas fa-balance-scale navbar-icons  cl-y"/>Aktif Kuponlar :</span>
            <span class="cl-g">{{$store.state.activeinfo.activecount | currency('',0)}}</span>
          </div>
          <div class="hhli hhlli">
            <span class="htilt"><i class="fas fa-balance-scale navbar-icons cl-y"/>Aktif Miktar :</span>
            <span class="cl-g">{{$store.state.activeinfo.activeamount | currency('',0)}}</span>
          </div>
          <div class="hhli hhlli">
            <span class="htilt"><i class="fas fa-balance-scale navbar-icons cl-y"/>Tahmini Kazanç :</span>
            <span class="cl-g">{{$store.state.activeinfo.activeearn | currency('₺', 0)}}</span>
          </div>
        </div>
        <div class="home-top-inside htis" @click="refreshInfo()">
          <div class="hhli">
            <span class="htict"><i class="fas fa-arrow-up navbar-icons cl-g"/>Kredi :</span>
            <span class="cl-g">{{$store.state.creditinfo.credit | currency('₺', 0)}} {{$store.state.creditinfo.creditsum | currency('₺', 0)}}</span>
          </div>
          <div class="hhli">
            <span class="htict"><i class="fas fa-arrow-down navbar-icons cl-r"/>Kalan :</span>
            <span class="cl-g">{{$store.state.creditinfo.creditremain | currency('₺', 0)}} {{$store.state.creditinfo.creditremainsum | currency('₺', 0)}}</span>
          </div>
          <div class="hhli">
            <span class="htict"><i class="fas fa-briefcase navbar-icons cl-f"/>Sonuç :</span>
            <span class="cl-g">{{$store.state.creditinfo.creditused | currency('₺', 0)}}{{$store.state.creditinfo.creditusedsum | currency('', 0)}}</span>
          </div>
        </div>
      </div>
      <div class="home-top-center">
        <img src="~/assets/img/gasvet.png">
      </div>
      <div class="home-top-right">
        <div class="home-top-inside htir">
          <div class="hhli">
            <span class="htirt"><i class="fas fa-user navbar-icons cl-g"/>Merhaba,</span>
            <span class="cl-w" v-if="$store.state.auth.user">{{$store.state.auth.user | capitalize}}</span>
          </div>
          <div class="hhli">
            <span class="htirt"><i class="fas fa-calendar-alt navbar-icons cl-g"/> Tarih : </span>
            <span class="cl-g">{{new Date() |  moment("l")}}</span>
          </div>
          <div class="hhli" v-if="this.$store.state.auth.role && this.$store.state.auth.role !== 'U1'">
            <span class="htirt"><i class="fas fa-users navbar-icons cl-g"/>Aktif Bayi Sayısı:</span>
             <span class="cl-g ml10">{{activeUsers}}</span>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc"  @click="openChatHandel()" title="Chat">
            <span class="msg-info" v-if="lastMsg">{{ lastMsg }}</span>
            <span class="msg-info" v-else><i class="fas fa-comments"></i></span>
            <div class="msg-info-slide" v-if="lastMsg" :class="{newMsgClass:newMsg}">
              <span class="msg-info" >{{ lastMsg }}</span>
              <span>Yeni Mesajiniz var!</span>
            </div>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc po-r" @click="setMultiLogin" title="Çoklu Oturum İzni">
            <i class="fas fa-users fa-2x cp cl-g" v-if="multiLogin"/>
            <i class="fas fa-users fa-2x cp cl-r" v-else/>
            <span class="sessioncount">{{this.$store.state.auth.sessioncount}}</span>
          </div>
        </div>
        <div class="home-top-inside htil">
          <div class="hhli htil">
            <nuxt-link to="" class="navbar-logout cl-r" @click.native="logout" title = "Çıkış">
              <i class="fas fa-sign-out-alt fa-2x" />
              <img src="~/assets/img/loader.gif" class="mt10" alt="" v-if="loader">
              <span v-if="errorMsg">{{errorMsg}}</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </header>
    <nav class="navbar">
      <nuxt-link to="/home/soccer" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-futbol navbar-icons cl-g"/>
        <span>FUTBOL</span>
      </nuxt-link>
      <nuxt-link to="/home/soccerinplay" class="navbar-links" exact-active-class="navbar-active">
        <span class="live-logos"><i class="fas fa-bolt navbar-icons cl-y"/>FUTBOL CANLI</span>
      </nuxt-link>
      <nuxt-link to="/home/scores" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-certificate navbar-icons cl-o" />SKORLAR
      </nuxt-link>
      <nuxt-link to="/home/account" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-user-secret navbar-icons cl-f"></i>HESABIM
      </nuxt-link>
      <nuxt-link to="/welcome" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-home navbar-icons cl-w"/>
      </nuxt-link>
    </nav>
    <nuxt class="home-router"/>
    <chat v-draggable class="chat-router" v-if="$store.state.openchat"/>
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
  middleware: 'auth',
  mixins: [Vue2Filters.mixin],
  name: 'Home',
  components: {
    chat
  },
  data () {
    return {
      loader: false,
      errorMsg: '',
      multiLogin: this.$store.state.auth.multilogin,
      activeUsers:0,
      oddsAll: {},
      lastMsgCount:0
    }
  },
  computed:{
    lastMsg(){
      return this.$store.state.msgcount
    }
  },
  mounted () {
    socket.emit('activeusers', this.$store.state.auth.user)
    socket.on('msgcount',()=>{
      let oldcount = this.$store.state.msgcount
      this.lastMsgCount =  oldcount + 1
      this.$store.commit('setMsgCount', this.lastMsgCount)
    })
    if (this.$store.state.auth.role === 'U1') {
      this.getSetTime ()
      this.getSetLimit ()
      this.getCreditInfo()
      this.getActiveInfo()
      this.getSettings()
    }else if (this.$store.state.auth.role === 'A2'){
      this.getActiveInfo()
      this.getActiveUsers()
      this.getSetTime ()
      this.getSetLimit ()
      this.getSettings()
    } else if (this.$store.state.auth.role !== 'U1'){
      this.getActiveUsers()
    }
    this.getMsgCount()
  },
  methods:{
    async getCreditInfo() {
      await axios.post('/api/home/account/creditinfo', { userbox: this.userBox }).then((result) => {
        this.$store.commit('setCreditInfo', result.data.creditinfo)
      })
    },
    async getActiveInfo() {
      await axios.post('/api/home/account/activeinfo', { userbox: this.userBox }).then((result) => {
        this.$store.commit('setActiveInfo', result.data.activeinfo)
      })
    },
    async getSetTime () {
      await axios.get('/api/home/account/settime').then((result) => {
        this.$store.commit('setTime', result.data.data)
      })
    },
    async getSetLimit () {
      await axios.get('/api/home/account/setlimit').then((result) => {
        this.$store.commit('setLimit', result.data.data)
      })
    },
    async logout() {
      if (navigator.onLine === true){
        this.errorMsg = ''
        this.loader = true
        await axios.get('/api/logout').then((result) => {
          if (result.data.ok) {
            this.$router.push('/')
            this.$store.commit('setBetSlip', false)
            this.$store.commit('removeSlips','')
            this.loader = false
            socket.disconnect()
            this.$store.commit('setAuth', null)
            localStorage.clear()
          }
        })
      }else {
        this.loader = false
        this.errorMsg = 'Baglanti Yok!'
      }
    },
    async getMsgCount() {
      if (navigator.onLine === true){
        await axios.get('/api/home/msgcount').then((result) => {
          if (this.$store.state.msgcount !== result.data) {
            this.$store.commit('setMsgCount', result.data)
          }else {
          this.$store.commit('setMsgCount', '')
          }
        }).catch((error)=>{console.log(error)})
      }
    },
    refreshInfo(){
      this.getCreditInfo()
      this.getActiveInfo()
    },
    openChatHandel (){
      this.$store.commit('setOpenChat', true)
      this.newMsg = false
    },
    async setMultiLogin(){
      this.multiLogin =! this.multiLogin
      await axios.post('/api/home/multilogin',{multilogin: this.multiLogin})
    },
    async getActiveUsers (){
      await axios.get('/api/home/activeusers').then((result)=>{
        this.activeUsers = result.data.activeusers
      })
    },
    async getSettings(){
      await axios.get('/api/home/account/settings').then((result)=>{
        this.$store.commit('setRate', result.data)
      })
    }
  }
}
</script>