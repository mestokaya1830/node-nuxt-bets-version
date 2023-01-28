<template>
  <div v-if="$store.state.auth.role !== 'U1'" class="pages">
    <header class="title-2" id="content">
      <div>
        <i class ="fas fa-user-plus fa-lg cl-g" />
        <span class="reg-text">ÜYE EKLE</span>
      </div>
    </header>
    <div class="account-con">
      <i class="fas fa-user-plus fa-4x cl-g big-icon"/>
      <form class="reg-form" @submit.prevent="register">
        <div class="reg-rows">
          <input type="text" v-model="setUser.user"  @focus="removeError()" required oninvalid="this.setCustomValidity('Üye alanı boş bırakılamaz!')" oninput="setCustomValidity('')" class="reg-inp" placeholder="Ad">
        </div>
        <div class="reg-rows">
          <input type="text" v-model="setUser.nick" @focus="removeError()" required oninvalid="this.setCustomValidity('Nick alanı boş bırakılamaz!')" oninput="setCustomValidity('')" class="reg-inp" placeholder="Kod Ad">
        </div>
        <div class="reg-rows">
          <input type="text" v-model="setUser.pass" required pattern=".{6,}" oninvalid="this.setCustomValidity('Şifre en az 6 karekter olmalıdır!')" oninput="setCustomValidity('')" class="reg-inp" placeholder="Şifre">
        </div>
        <div v-if="checkLimitCredit" class="reg-rows">
          <input v-model="setUser.credit" type="number" min="300" required oninvalid="this.setCustomValidity('Minumum Kredi Tutarı 300 Tl Olmalıdır!')" oninput="setCustomValidity('')" class="reg-inp" placeholder="Kredi">
        </div>
        <div v-if="!checkLimitCredit" class="reg-rows">
          <span class="reg-select-text mr-10">Üye Limiti</span>
          <select v-model="setUser.userlimit" class="selectbox ml10" required oninvalid="this.setCustomValidity('Limit alanı boş bırakılamaz!')" oninput="setCustomValidity('')">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="15">20</option>
            <option value="15">30</option>
            <option value="15">40</option>
          </select>
        </div>
        <footer class="form-footer register">
          <button v-if="btnReg && !loader" class="btn-reg bg-g">Ekle</button>
          <img src="~/assets/img/loader.gif" alt="" v-if="loader">
          <alert v-if="alert" :message="alert" class="alert"/>
          <error v-if="error" :message="error" class="error"/>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import alert from '@/components/alert'
import error from '@/components/error'
export default {
  name: 'Register',
  components: {
   alert,
   error
  },
  data () {
    return {
      setUser: {
        user: null,
        nick: null,
        pass: null,
        credit: null,
        role: this.$store.state.auth.role,
        userlimit: null,
        remain: null,
        admin: this.$store.state.auth.user
      },
      btnReg: true,
      alert: '',
      error: '',
      loader: false
    }
  },
  computed: {
    checkLimitCredit () {
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
  },
  methods: {
    async register () {
      this.setUser.remain = this.setUser.userlimit
      this.loader = true
      await axios.post('/api/home/account/register', this.setUser).then((result) => {
        if (result.data.code === 200) {
          this.btnReg = false
          this.alert = result.data.message
          this.loader = false
          setTimeout(function () {
            this.$router.push('/home/account/users')
          }.bind(this), 1500)
        } else {
          this.error = result.data.message
          this.loader = false
          this.btnReg = false
          setTimeout(() => {
            this.error = ''
            this.btnReg = true
          }, 1500)
        }
      })
    },
    removeError () {
      this.error = ''
      this.btnReg = true
    }
  }
}
</script>
