<template>
  <div class="resetpass-page">
    <transition name="slayt" appear>
      <form class="resetpass-form" @submit.prevent="resetPass">
        <header class="login-header">
          <span>Şifre Sıfırlama</span>
          <i class=""/>
          <nuxt-link to="/" class="form-close" title="Şifre Sıfırla">
            <i class="fas fa-user fa-lg form-close cl-w"/>
          </nuxt-link>
        </header>
        <div class="login-center">
          <div class="login-inputs-con">
            <i class="fas fa-user fa-lg login-icons" />
            <input type="text" v-model="setPass.user" class="login-inputs" required oninvalid="this.setCustomValidity('Üye alanı boş bırakılamaz!')" oninput="setCustomValidity('')" placeholder="Üye Adı">
          </div>
          <div class="login-inputs-con">
            <i class="fas fa-user-plus fa-lg login-icons" />
            <input type="text" v-model="setPass.nick" class="login-inputs" required oninvalid="this.setCustomValidity('Nick alanı boş bırakılamaz!')" oninput="setCustomValidity('')" placeholder="Nick">
          </div>
          <div class="login-inputs-con">
            <i class="fas fa-unlock fa-lg login-icons" />
            <input type="password" v-model="setPass.pass" class="login-inputs" required pattern=".{6,}" oninvalid="this.setCustomValidity('Şifre en az 6 karekter olmalıdır!')" oninput="setCustomValidity('')" placeholder="Yeni Şifre">
          </div>
        </div>
        <footer class="login-footer">
          <input type="submit" v-if="btnLogin" value="Şifre Sıfırla" class="alert btn-alert cl-d">
          <alert v-if="alert" :message="alert" class="alert"/>
          <error v-if="error" :message="error" class="error"/>
        </footer>
      </form>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
import alert from '../components/alert.vue'
import error from '../components/error.vue'
export default {
  name: 'Resetpass',
  components: {
    alert,
    error
  },
  data () {
    return {
      setPass: {
        user: '',
        nick: '',
        pass: ''
      },
      btnLogin: true,
      alert: '',
      error: ''
    }
  },
  methods: {
    async resetPass () {
      await axios.post('/api/resetpass', this.setPass).then((result) => {
        if (result.data.code === 200) {
          this.error = false
          this.btnLogin = false
          this.alert = result.data.message
          setTimeout(function () {
            this.$router.push('/')
          }.bind(this), 1000)
        } else {
          this.btnLogin = false
          this.error = result.data.message
          setTimeout(() => {
            this.error = false
            this.btnLogin = true
          }, 2000)
        }
      })
    }
  }
}
</script>

