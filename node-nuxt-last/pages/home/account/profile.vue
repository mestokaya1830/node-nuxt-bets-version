<template>
  <div class="pages">
    <header class="title-2">
      <span class="set-title">Profil</span>
      <i class="fas fa-angle-double-up back-icons"/>
    </header>
    <ul class="account-con">
<!-- general info section ---------------------------------->
      <section  class="user-id-section">
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
            <i class="fa fa-save fa-2x  edit-save cl-f" v-if="done !== 'nick'" @click="updateProfile(profile.nick)"/>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Kayıt Tarih</span>
          <span class="edit-value">{{ profile.date | fullFormat }}</span>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Durum</span>
          <span class="edit-value">{{ profile.state | capitalize}}</span>
        </li>
      </section>
<!-- Subadmin-Member section ---------------------------------->
      <section v-if="checkMember || checkSubadmin"  class="user-id-section">
        <li class="userdetails-items">
          <span class="userdetails-text">Bayi Komisyon</span>
          <span class="edit-value">%{{ profile.usercomission }}</span>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Müşteri Komisyon</span>
          <span class="edit-value">%{{ profile.personcomission }}</span>
        </li>
      </section>
<!-- b4-s3 section ---------------------------------->
      <section v-if="!checkMember && !checkSubmember" class="user-id-section">
        <li class="userdetails-items">
          <span class="userdetails-text">Üye Limiti</span>
          <span class="edit-value">{{ profile.userlimit }}</span>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Kalan Üye Limiti</span>
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
  name: 'Profile',
  data () {
    return {
      profile: {},
      done: null
    }
  },
  mounted () {
    this.getProfile()
  },
  computed:{
    checkSubmember () {
      if (this.$store.state.auth.role === 'Submember') {
        return true
      }
    },
    checkMember () {
      if (this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    checkSubadmin () {
      if (this.$store.state.auth.role === 'Subadmin') {
        return true
      }
    }
  },
  filters: {
    fullFormat: function (value) {
      return moment.utc(value, 'YYYY-MM-DD H:mm:ss').tz('Europe/Istanbul').format('YYYY-MM-DD H:mm:ss')
    }
  },
  methods: {
    async getProfile () {
      await axios.get('/api/home/account/profile').then((result) => {
        this.profile = result.data.profile
      })
    },
    async updateProfile (value) {
      if(value.length < 4 || !String(value).match(/^[a-zA-Z0-9]/)){
        alert('Nick alanı en az 4 karekter ve ilk karekter Harf yada Sayı olabilir!')
      } else {
        await axios.put('/api/home/account/updateprofile', {nick: value}).then((result) => {
          if (result.data.code === 200) {
            this.done = 'nick'
            setTimeout(() => {
              this.done = null
            }, 1000)
          } else {
            alert(result.data.message)
          }
        })
      }
    }
  }
}
</script>

