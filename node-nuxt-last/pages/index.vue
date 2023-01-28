<template>
  <section class="login-page">
    <transition name="slayt" appear>
      <form class="login-form" @submit.prevent="login">
        <header class="login-header">
          <img src="~/static/img/logo.png" alt="" class="login-logo">
          <img  v-if="isLoader" src="~/static/img/loader.gif" alt="" class="login-loader">
        </header>
        <div class="login-center">
          <input v-model="user" type="text" @focus="removeError()" class="login-inputs" placeholder="Üye Adı" required pattern="^[A-Za-z0-9].{3,50}" oninvalid="this.setCustomValidity('Üye alanı en az 4 karekter ilk karekter Harf yada Sayı olmalıdır')" oninput="setCustomValidity('')" tabindex='1' autofocus>
          <input v-model="pass" type="password" @focus="removeError()" class="login-inputs" placeholder="Şifre" required oninvalid="this.setCustomValidity('Şifre alanı boş bırakılamaz!')" oninput="setCustomValidity('')" tabindex='2'>
          <input v-if="isBtnLogin" type="submit" value="Giriş" class="alert btn-alert" id="login-btn">
          <alert v-if="alert" :message="alert" class="alert"/>
          <error v-if="error" :message="error" class="error"/>
          <nuxt-link to="/resetpass" class="password-reset">
            <span>Şifre Sıfırlama</span>
          </nuxt-link>
        </div>
      </form>
    </transition>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  name:'Index',
  data() {
    return {
      user: null,
      pass: null,
      alert: false,
      error: null,
      isBtnLogin: true,
      isLoader: false
    }
  },
  mounted () {
    if (!this.$store.state.auth) {
      this.$router.push('/')
    }
  },
  methods: {
    async login () {
      if (navigator.onLine === true){
        this.isLoader = true
        await axios.post('/api/login', { user: this.user, pass: this.pass }).then((result) => {
          if (result.data.code === 200) {
            this.$store.commit('setAuth', result.data.auth)
            this.error = null
            this.isBtnLogin = false
            this.alert = result.data.message
            setTimeout(() => {
              this.$router.push('/welcome')
              this.isLoader = false
            }, 1000)
          } else {
            this.isLoader = false
            this.isBtnLogin = false
            this.error = result.data.message
          }
        })
      }else {
        this.isBtnLogin = false
        this.error = 'Baglanti Yok!'
      }
    },
    removeError () {
      this.error = false
      this.isBtnLogin = true
    },
    
  }
}
</script>