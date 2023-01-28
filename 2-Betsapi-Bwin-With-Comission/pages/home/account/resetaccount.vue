<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">HESAP KESİMİ</span>
      <select v-model="userBox" v-if="checkA1 || checkG1" class="selectbox box-account" @change="getResetInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con">
      <i class="fas fa-briefcase fa-4x cl-g big-icon"/>
      <form class="reg-form">
        <div class="resetaccount-items" v-if="role.role !== 'C1'">
          <span>Limit</span>
          <span>{{ creditInfo.credit | currency('', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items"  v-if="role.role !== 'C1'">
          <span>Kullanılan Miktar</span>
          <span>{{ getUsedCredit | currency('', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}}</span>
        </div>
        <div class="resetaccount-items">
          <span>Bakiye</span>
          <span>{{ creditInfo.creditremain | currency('', 0, { symbolOnLeft: false, spaceBetweenAmountAndSymbol: true })}} </span>
        </div>
        <section v-if="checkUserbox">
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span>Komisyon Oran</span>
            <span class="account-result cl-r">% {{ comissionRate | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span class="result">Komisyon Miktar</span>
            <span class="account-result cl-g">{{ getComission | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span class="result">Kasa</span>
            <span class="account-result cl-g">{{ getResult | currency('', 2)}}</span>
          </div>
          <footer class="form-footer" v-if="checkA1 || checkG1 && role.role === 'C1'">
            <input type="button" v-if="isBtnReset" class="btn-reg bg-g" value="Sıfırla" @click="resetAccount()">
            <alert v-if="alert" :message="alert" class="alert"/>
            <error v-if="error" :message="error" class="error"/>
          </footer>
        </section>
        <preloader v-if="isLoader" class="loader-con loader-flex"/>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'resetaccount',
  data () {
    return {
      creditInfo: {},
      userList: {},
      comissionRate:null,
      userBox: 'Üyeler',
      role:'',
      error: null,
      isBtnReset: false,
      alert: false,
      isLoader:false,
      checkUserbox:false
    }
  },
  mounted() {
    this.getUserlist ()
    this.getResetInfo()
    this.goTop()
  },
  computed: {
    checkA1 (){
      if (this.$store.state.auth.role === 'A1') {
        return true
      }
    },
    checkG1 (){
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
    checkEarn () {
      if (this.creditInfo.credit > this.creditInfo.creditremain || this.creditInfo.credit > this.creditInfo.creditremain) {
        return true
      } else {
        return false
      }
    },
    getUsedCredit(){
      return this.creditInfo.credit - this.creditInfo.creditremain
    },
    checkEarn () {
      if (this.creditInfo.credit > this.creditInfo.creditremain) {
        return true
      } else {
        return false
      }
    },
    getComission () {
      let creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
      return ((creditUsed * this.comissionRate) / 100).toFixed(2)
    },
    getResult () {
      let wholerate = 100 - this.comissionRate
      let creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
      return ((creditUsed * wholerate) / 100).toFixed(2)
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlistresetaccount').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getResetInfo() {
      if (this.userBox !== 'Üyeler') {
      this.isLoader = true
      this.creditInfo = {}
      this.comissionRate = null
        await axios.post('/api/home/account/creditinforeset', { userbox: this.userBox }).then((result) => {
          axios.put('/api/home/account/usercomission', {userbox: this.userBox }).then((comission) => {
            this.creditInfo = result.data.creditinfo
            this.comissionRate = comission.data.usercomission
            this.checkUserbox = true
            this.isBtnReset = true
            this.role = this.userList.find(item => item.user === this.userBox)
          })
          this.isLoader = false
        }).catch(err => {console.log(err)})
      }else{
        this.isLoader = false
        this.creditInfo = {}
        this.comissionRate = null
        this.isBtnReset = false
      }
    },
    async resetAccount () {
      await axios.post('/api/home/account/resetaccount', { role:this.userList[0].role, userbox: this.userBox }).then((result) => {
        if (result.data.code === 200) {
          this.alert = result.data.message
          this.isBtnReset = false
          setTimeout(() => {
            this.alert = null
            this.isBtnReset = true
            location.reload()
          }, 2000)
        } else {
          this.isBtnReset = false
          this.error = result.data.message
          setTimeout(() => {
            this.error = null
            this.isBtnReset = true
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
