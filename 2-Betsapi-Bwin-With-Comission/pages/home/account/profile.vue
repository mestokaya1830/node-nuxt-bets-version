<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">PROFİL</span>
      <i class="fas fa-angle-double-up back-icons"/>
    </header>
    <ul class="account-con">
<!-- general info section ---------------------------------->
      <h1 class="userdetails-title">
        <i class="fas fa-user fa-3x cl-g"/>
        <span class="userdetails-title-text">{{ profile.user | capitalize}}</span>
      </h1>
      <li class="userdetails-items po-r">
        <span class="userdetails-text">Kod Ad</span>
        <div class="form-rows">
          <input v-model="profile.nick" type="text" class="set-inp inp-profile" required>
        </div>
          <span class="info" title="Bu alan şifre sıfırlama için özeldir.Lütfen kimseyle paylaşmayınız!">?</span>
          <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'nick'"/>
          <i class="fa fa-save fa-2x  edit-save cl-f" v-if="done !== 'nick' && !error" @click="updateProfile(profile.nick)"/>
          <error v-if="error" :message="error" class="error profile-error bg-r "/>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Kayıt Tarih</span>
        <span class="edit-value">{{ profile.date | fullFormat }}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Durum</span>
        <span class="edit-value">{{ profile.state | capitalize}}</span>
      </li>
<!-- b4-s3 section ---------------------------------->
      <section v-if="!checkU1 && !checkC1">
        <li class="userdetails-items">
          <span class="userdetails-text">Limit</span>
          <span class="edit-value">{{ profile.userlimit }}</span>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Kalan</span>
          <span class="edit-value">{{ profile.userlimit - profile.usedlimit }}</span>
        </li>
      </section>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'profile',
  data () {
    return {
      profile: {},
      error: null,
      done: null
    }
  },
  mounted () {
    this.getProfile()
    this.goTop()
  },
  computed:{
    checkC1 () {
      if (this.$store.state.auth.role === 'C1') {
        return true
      }
    },
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    }
  },
  filters: {
    fullFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("YYYY-MM-DD H:mm:ss")
    }
  },
  methods: {
    async getProfile () {
      await axios.get('/api/home/account/profile').then((result) => {
        this.profile = result.data.profile
      }).catch(err => {console.log(err)})
    },
    async updateProfile (nick) {
      await axios.put('/api/home/account/updateprofile', {nick: nick}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'nick'
          setTimeout(() => {
            this.done = null
          }, 1000)
        } else {
          this.error = result.data.message
          setTimeout(() => {
            this.error = null
          }, 2000)
        }
      }).catch(err => {console.log(err)})
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>

