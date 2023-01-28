<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>PROFİL</span>
      <i class="fas fa-angle-double-up back-icons" @click="$router.back()"/>
    </header>
    <ul class="account-con">
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
          <i class="fa fa-save fa-2x  edit-save cl-f" v-else @click="updateProfile(profile.nick)"/>
          <error v-if="error" :message="error" class="error profile-error bg-r "/>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Yetki</span>
        <span class="edit-value">{{ profile.role }}</span>
      </li>
      <li v-if="!checkU1" class="userdetails-items">
        <span class="userdetails-text">Limit</span>
        <span class="edit-value">{{ profile.userlimit }}</span>
      </li>
      <li v-if="!checkU1" class="userdetails-items">
        <span class="userdetails-text">Kalan</span>
        <span class="edit-value">{{ profile.remain }}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Tarih</span>
        <span class="edit-value">{{ profile.date | fullFormat }}</span>
      </li>
      <li v-if="checkU1" class="userdetails-items">
        <span class="userdetails-text">Kredi</span>
        <span class="edit-value">{{ profile.credit | currency('₺', 0)}}</span>
      </li>
      <li v-if="checkU1" class="userdetails-items">
        <span class="userdetails-text">Kalan</span>
        <span class="edit-value">{{ profile.creditremain | currency('₺', 0)}}</span>
      </li>
      <li v-if="checkA2 || checkS3" class="userdetails-items">
        <span class="userdetails-text">Ödendi</span>
        <span class="edit-value">{{ profile.payment | fullFormat }}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Durum</span>
        <span class="edit-value">{{ profile.state | capitalize}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import error from '@/components/error.vue'
export default {
  name: 'Profile',
  components: {
   error
  },
  data () {
    return {
      profile: {},
      error: '',
      done: ''
    }
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
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
    }
  },
  filters: {
    fullFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("YYYY-MM-DD H:mm:ss")
    }
  },
  mounted () {
    this.getProfile()
  },
  methods: {
    async getProfile () {
      await axios.get('/api/home/account/profile').then((result) => {
        this.profile = result.data.profile
      })
    },
    async updateProfile (nick) {
      await axios.post('/api/home/account/updateprofile', {nick: nick}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'nick'
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1000)
        } else {
          this.error = result.data.message
          setTimeout(function () {
            this.error = ''
          }.bind(this), 2000)
        }
      })
    }
  }
}
</script>

