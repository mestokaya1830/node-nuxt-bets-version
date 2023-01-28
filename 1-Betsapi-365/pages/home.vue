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
            <span class="cl-g">{{$store.state.activeinfo.activeearn | currency('₺', 1)}}</span>
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
            <span class="cl-g">{{$store.state.creditinfo.creditused | currency('₺', 1)}}{{$store.state.creditinfo.creditusedsum | currency('', 0)}}</span>
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
            <span class="cl-w">{{$store.state.auth.user | capitalize}}</span>
          </div>
          <div class="hhli">
            <span class="htirt"><i class="fas fa-calendar-alt navbar-icons cl-g"/> Tarih : </span>
            <span class="cl-g">{{new Date() |  moment("l")}}</span>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc"  @click="openChatHandel()" title="Chat">
            <span class="msg-info" v-if="$store.state.msgcount">{{ $store.state.msgcount }}</span>
            <span class="msg-info" v-if="!$store.state.msgcount"><i class="fas fa-comments"></i></span>
          </div>
        </div>
        <div class="home-top-inside htil htill">
          <div class="hhli htil htilc" @click="setMultiLogin" title="Çoklu Oturum İzni">
            <i class="fas fa-users fa-2x cp cl-g" v-if="multiLogin"/>
            <i class="fas fa-users fa-2x cp cl-r" v-else/>
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
      <flexbet />
    <nav class="navbar">
      <nuxt-link to="/home" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-bolt navbar-icons cl-y"/>CANLI
      </nuxt-link>
      <nuxt-link to="/home/soccer" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-futbol navbar-icons cl-f"/>
        <span>FUTBOL</span>
      </nuxt-link>
      <nuxt-link to="/home/basketball" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-basketball-ball navbar-icons cl-o"/>
        <span>BASKETBOL</span>
      </nuxt-link>
      <nuxt-link to="/home/scores" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-certificate navbar-icons cl-y" />SKORLAR
      </nuxt-link>
      <nuxt-link to="/home/standings" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-calendar-alt navbar-icons cl-r" />PUANLAR
      </nuxt-link>
      <nuxt-link to="/home/account" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-user-secret navbar-icons cl-g"></i>HESABIM
      </nuxt-link>
      <nuxt-link to="/home/info" class="navbar-links" exact-active-class="navbar-active">
        <i class="fas fa-info-circle navbar-icons cl-y"></i>Kurallar
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
import flexbet from '@/components/flexbet.vue'
export default {
  middleware: 'auth',
  mixins: [Vue2Filters.mixin],
  name: 'Home',
  components: {
    chat,
    flexbet
  },
  data () {
    return {
      userbox: '',
      audio: '',
      loader: false,
      errorMsg: '',
      multiLogin: this.$store.state.auth.multilogin
    }
  },
  mounted () {
    if (this.$store.state.auth.role === 'U1') {
      this.getLeaguesId ()
      this.getLiveleaguesName ()
      this.getMarketsName ()
      this.getLiveMarketsId ()
    }
    this.checkUser()
    this.getCreditInfo()
    this.getActiveInfo()
    this.getTimeSettings ()
    this.getLimitSettings ()
    this.getMsgCount ()
    setInterval(() => {
      this.getMsgCount ()
    }, 60 * 1000)
  },
  methods:{
    checkUser(){
      if (this.$store.state.auth.role === 'U1') {
        this.userBox = this.$store.state.auth.user
      } else {
        this.userBox = 'Üyeler'
      }
    },
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
    async getTimeSettings () {
      await axios.post('/api/home/account/timesettings',{userbox:this.$store.state.auth.user}).then((result) => {
        this.$store.commit('setTimeSettings', result.data.timesettings)
      })
    },
    async getLimitSettings () {
      await axios.post('/api/home/account/limitsettings',{userbox:this.$store.state.auth.user}).then((result) => {
        this.$store.commit('setLimitSettings', result.data.limitsettings)
      })
    },
    async logout() {
      if (navigator.onLine === true){
        this.errorMsg = ''
        this.loader = true
        await axios.post('/api/logout').then(() => {
          this.$store.commit('setCheckAuth', 'false')
          this.$store.commit('setBetSlip', false)
          this.$store.commit('removeSlips','')
          this.$router.push('/')
          this.loader = false
        })
      }else {
        this.loader = false
        this.errorMsg = 'Baglanti Yok!'
      }
    },
    async getMsgCount() {
      if (navigator.onLine === true){
        await axios.get('/api/home/msgcount').then((result) => {
          if (result.data.code === 200) {
            if (this.$store.state.msgcount !== result.data.message) {
              this.$store.commit('setMsgCount', result.data.message)
              this.audio = new Audio(require('~/assets/nodification.mp3'))
              this.audio.play()
            }
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
      socket.disconnect()
      socket.connect('localhost:3000',{'forceNew':true })
      this.$store.commit('setOpenChat', true)
    },
    async getLeaguesId() {
      await axios.post('/api/home/account/leaguesid',{userbox: this.$store.state.auth.user}).then((result) => {
        if (result.data.leaguesid.length > 0) {
          this.$store.commit('setLeaguesId', result.data.leaguesid)
        }
      })
    },
    async getLiveleaguesName() {
      await axios.post('/api/home/account/liveleaguesname',{userbox: this.$store.state.auth.user}).then((result) => {
        if (result.data.liveleaguesname.length > 0) {
          this.$store.commit('setLiveLeaguesName', result.data.liveleaguesname)
        }
      })
    },
    async getMarketsName() {
      await axios.post('/api/home/account/marketsname',{userbox: this.$store.state.auth.user}).then((result) => {
        if (result.data.marketsname.length > 0) {
          this.$store.commit('setMarketsName', result.data.marketsname)
        }
      })
    },
    async getLiveMarketsId() {
      await axios.post('/api/home/account/livemarketsid',{userbox: this.$store.state.auth.user}).then((result) => {
        if (result.data.livemarketsid.length > 0) {
          this.$store.commit('setLiveMarketsId', result.data.livemarketsid)
        }
      })
    },
    async setMultiLogin(){
      this.multiLogin =! this.multiLogin
      await axios.post('/api/home/multilogin',{multilogin: this.multiLogin})
    }
  }
}
</script>