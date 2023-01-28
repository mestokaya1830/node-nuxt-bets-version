<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">HESAP KESİMİ</span>
      <select v-model="userBox" v-if="checkAdmin || checkSubadmin" class="selectbox box-account" @change="getResetInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con"  v-if="checkUserbox">
      <i class="fas fa-briefcase fa-4x cl-g big-icon"/>
      <form class="reg-form">
        <div class="resetaccount-items" v-if="role.role !== 'Submember'">
          <span>Limit</span>
          <span>{{ creditInfo.credit | currency('', 0)}}</span>
        </div>
        <div class="resetaccount-items" v-if="role.role !== 'Submember'">
          <span>Kullanılan Miktar</span>
          <span v-if="role.role === 'Submember'">{{ getUsedCredit | currency('', 0)}}</span>
          <span v-else>{{ getUsedCreditAdmin | currency('', 0)}}</span>
        </div>
        <div class="resetaccount-items">
          <span>Bakiye</span>
          <span>
            {{ creditInfo.creditremain | currency('', 0)}}
            <span class="subcredit cl-r" v-if="$store.state.auth.role === 'Subadmin'  && role && role.role === 'Subadmin'">({{subCreditInfo.subcredit | currency('', 0)}})</span>
            <span class="subcredit cl-r" v-if="$store.state.auth.role === 'Admin' && role && role.role === 'Subadmin'">({{subCreditInfo.subcredit | currency('', 0)}})</span>
          </span>
        </div>
        <section>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'Submember'">
            <span>Komisyon Oran</span>
            <span class="account-result cl-r">% {{ userComission | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'Submember'">
            <span class="result">Bayi</span>
            <span class="account-result cl-g">{{ getComission | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'Submember'">
            <span class="result">Kasa</span>
            <span class="account-result cl-g">{{ getResult | currency('', 2)}}</span>
          </div>
          <footer class="form-footer" v-if="checkAdmin || role.role === 'Submember'">
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
  name: 'Resetaccount',
  data () {
    return {
      userList: {},
      creditInfo: {},
      subCreditInfo: {},
      totalInfo: {},
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
    checkAdmin (){
      if (this.$store.state.auth.role === 'Admin') {
        return true
      }
    },
    checkSubadmin (){
      if (this.$store.state.auth.role === 'Subadmin') {
        return true
      }
    },
    checkEarn () {
      return true
      if (this.creditInfo.credit > this.creditInfo.creditremain) {
        return true
      } else {
        return false
      }
    },
    getUsedCredit(){
      return this.creditInfo.credit - this.creditInfo.creditremain
    },
    getUsedCreditAdmin(){
      return ((this.creditInfo.credit - this.creditInfo.creditremain) - this.subCreditInfo.subcredit)
    },
    checkEarn () {
      if (this.creditInfo.credit > this.creditInfo.creditremain) {
        return true
      } else {
        return false
      }
    },
    getComission () {
      if (this.role.role === 'Submember') {
        const creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
        return ((creditUsed * this.userComission) / 100).toFixed(2)
      } else {
        const creditUsed = ((this.creditInfo.credit - this.creditInfo.creditremain) - this.subCreditInfo.subcredit)
        return ((creditUsed * this.userComission) / 100).toFixed(2)
      }
    },
    getResult () {
      if (this.role.role === 'Submember') {
        const wholerate = 100 - this.userComission
        const creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
        return ((creditUsed * wholerate) / 100).toFixed(2)
      } else {
        const wholerate = 100 - this.userComission
        const creditUsed = ((this.creditInfo.credit - this.creditInfo.creditremain) - this.subCreditInfo.subcredit)
        return ((creditUsed * wholerate) / 100).toFixed(2)
      }
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlistresetaccount').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getResetInfo() {
      if (this.$store.state.auth.role === 'Admin' && this.userBox === 'Üyeler' || this.$store.state.auth.role === 'Subadmin' && this.userBox === 'Üyeler') {
        this.checkUserbox = false
      }else {
        if(this.$store.state.auth.role === 'Admin' && this.userBox !== 'Üyeler' || this.$store.state.auth.role === 'Subadmin' && this.userBox !== 'Üyeler'){
          this.role = this.userList.find(item => item.user === this.userBox)
        }
        if (this.$store.state.auth.role === 'U1') {
          this.userBox = this.$store.state.auth.user
        }
        this.isLoader = true
        this.creditInfo = {}
        this.userComission = null
        this.checkUserbox = true
        this.isBtnReset = true
        const creditinfo = await axios.post('/api/home/account/creditinforeset', { userbox: this.userBox })
        const subcredit = await axios.post('/api/home/account/subcredit', {userbox: this.userBox})
        const comission = await axios.post('/api/home/account/usercomission', { userbox: this.userBox })
        const total = await axios.post('/api/home/account/totalinfo', {userbox: this.userBox})
        Promise.all([creditinfo, subcredit, comission, total]).then(result => {
          this.creditInfo = result[0].data.creditinfo
          this.subCreditInfo = result[1].data.subcredit
          this.userComission = result[2].data.usercomission
          this.totalInfo = result[3].data.totalinfo
        })
      }
      this.isLoader = false
    },
    async resetAccount () {
      const newcredit = this.creditInfo.credit-this.subCreditInfo.subcredit
      await axios.post('/api/home/account/resetaccount', { role:this.role.role, userbox: this.userBox, newcredit: newcredit }).then((result) => {
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
      const el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
