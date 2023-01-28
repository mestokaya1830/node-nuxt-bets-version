<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Hesap Kesimi</span>
      <select v-if="!checkU1" v-model="userBox" class="selectbox box-account" @change="getResetInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con">
      <i class="fas fa-briefcase fa-4x cl-g big-icon"/>
      <form class="reg-form">
        <div class="resetaccount-items">
          <span>Tanımlı Kredi</span>
          <span>{{ creditInfo.credit | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}} {{ creditInfo.creditsum | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items">
          <span>Kalan Kredi</span>
          <span>{{ creditInfo.creditremain | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}} {{ creditInfo.creditremainsum | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items">
          <span>Kullanılan Kredi</span>
          <span>{{ creditInfo.creditused | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}} {{ creditInfo.creditusedsum | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items" v-if="checkEarn">
          <span>%Oran</span>
          <span>
            <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done"/>
            <span v-if="!checkU1 && !done" class="badge bg-f"  @click="updateComission()">Kaydet</span>
            <input type="number" min="5" step="5" class="rate-select" v-model="comissionRate.comission">
          </span>
        </div>
        <div class="resetaccount-items">
          <span class="result">Komisyon</span>
          <span class="account-result cl-g">{{ getMemberRate | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items">
          <span class="result">Kasa</span>
          <span class="account-result cl-g">{{ getAdminRate | currency('₺', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <footer class="form-footer">
          <input type="button" v-if="btnReset" class="btn-reg bg-g" value="Sıfırla" @click="resetAccount()">
          <alert v-if="alert" :message="alert" class="alert"/>
          <error v-if="error" :message="error" class="error"/>
        </footer>
      <preloader v-if="loader" class="loader-con loader-flex"/>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import alert from '@/components/alert.vue'
import error from '@/components/error.vue'
import preloader from '@/components/preloader.vue'
export default {
  name: 'Resetaccount',
  components: {
    alert,
    error,
    preloader
  },
  data () {
    return {
      creditInfo: {},
      userList: {},
      comissionRate:'',
      userBox: 'Üyeler',
      btnReset: false,
      alert: false,
      error: '',
      loader:false,
      done: false
    }
  },
  mounted() {
    this.getUserlist ()
    this.getResetInfo()
    this.goTop()
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkEarn () {
      if (this.creditInfo.credit <= this.creditInfo.creditremain || this.creditInfo.creditsum <= this.creditInfo.creditremainsum) {
        return false
      } else {
        return true
      }
    },
    getAdminRate () {
      let wholerate = 100 - this.comissionRate.comission
      if (this.$store.state.auth.role === 'U1') {
        return ((this.creditInfo.creditused * wholerate) / 100).toFixed(2)
      } else {
        if (this.userBox === 'Üyeler') {
          return ((this.creditInfo.creditusedsum * wholerate) / 100).toFixed(2)
        } else {
          return ((this.creditInfo.creditused * wholerate) / 100).toFixed(2)
        }
      }
    },
    getMemberRate () {
      if (this.$store.state.auth.role === 'U1') {
        return ((this.creditInfo.creditused * this.comissionRate.comission) / 100).toFixed(2)
      } else {
        if (this.userBox === 'Üyeler') {
          return ((this.creditInfo.creditusedsum * this.comissionRate.comission) / 100).toFixed(2)
        } else {
          return ((this.creditInfo.creditused * this.comissionRate.comission) / 100).toFixed(2)
        }
      }
    }
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getResetInfo() {
      this.loader = true
      await axios.post('/api/home/account/creditinfo', { userbox: this.userBox }).then((result) => {
        axios.get('/api/home/account/comission').then((comission) => {
          this.comissionRate = comission.data.comissionrate[0]
          this.creditInfo = result.data.creditinfo
          if (this.userBox !=='Üyeler') {
            this.btnReset = true
          } else {
            this.btnReset = false
          }
          this.loader = false
        })
      })
    },
    async resetAccount () {
      await axios.post('/api/home/account/resetaccount', { userbox: this.userBox }).then((result) => {
        if (result.data.code === 200) {
          this.alert = result.data.message
          this.btnReset = false
          setTimeout(() => {
            this.alert = ''
            this.btnReset = true
            location.reload()
          }, 2000)
        } else {
          this.btnReset = false
          this.error = result.data.message
          setTimeout(() => {
            this.error = ''
            this.btnReset = true
          }, 2000)
        }
      })
    },
    async updateComission(){
      this.done = true
      await axios.post('/api/home/account/comissionupdate', { comission: this.comissionRate.comission }).then((result) => {
        if (result.data.code === 200) {
          setTimeout(() => {
            this.done = false
          }, 500)
        }
      })
    }
  }
}
</script>
