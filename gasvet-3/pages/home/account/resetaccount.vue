<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">HESAP KESİMİ</span>
      <select v-model="userBox" v-if="checkA2 || checkG1" class="selectbox box-account" @change="getResetInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con"  v-if="checkUserbox">
      <i class="fas fa-briefcase fa-4x cl-g big-icon"/>
      <form class="reg-form">
        <div class="resetaccount-items" v-if="role.role !== 'C1'">
          <span>Limit</span>
          <span>{{ creditInfo.credit | currency('', 0)}}</span>
        </div>
        <div class="resetaccount-items" v-if="role.role !== 'C1'">
          <span>Kullanılan Miktar</span>
          <span v-if="role.role === 'C1'">{{ getUsedCredit | currency('', 0)}}</span>
          <span v-else>{{ getUsedCreditAdmin | currency('', 0)}}</span>
        </div>
        <div class="resetaccount-items">
          <span>Bakiye</span>
          <span>
            {{ creditInfo.creditremain | currency('', 0)}}
            <span class="subcredit cl-r" v-if="$store.state.auth.role === 'G1'  && role && role.role === 'G1'">({{subCreditInfo.subcredit | currency('', 0)}})</span>
            <span class="subcredit cl-r" v-if="$store.state.auth.role === 'A2' && role && role.role === 'G1'">({{subCreditInfo.subcredit | currency('', 0)}})</span>
          </span>
        </div>
        <section>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span>Komisyon Oran</span>
            <span class="account-result cl-r">% {{ userComission | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span class="result">Bayi</span>
            <span class="account-result cl-g">{{ getComission | currency('', 0)}}</span>
          </div>
          <div class="resetaccount-items" v-if="checkEarn && role.role !== 'C1'">
            <span class="result">Kasa</span>
            <span class="account-result cl-g">{{ getResult | currency('', 2)}}</span>
          </div>
          <footer class="form-footer" v-if="checkA2 || role.role === 'C1'">
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
    checkA2 (){
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    checkG1 (){
      if (this.$store.state.auth.role === 'G1') {
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
      if (this.role.role === 'C1') {
        let creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
        return ((creditUsed * this.userComission) / 100).toFixed(2)
      } else {
        let creditUsed = ((this.creditInfo.credit - this.creditInfo.creditremain) - this.subCreditInfo.subcredit)
        return ((creditUsed * this.userComission) / 100).toFixed(2)
      }
    },
    getResult () {
      if (this.role.role === 'C1') {
        let wholerate = 100 - this.userComission
        let creditUsed = this.creditInfo.credit - this.creditInfo.creditremain
        return ((creditUsed * wholerate) / 100).toFixed(2)
      } else {
        let wholerate = 100 - this.userComission
        let creditUsed = ((this.creditInfo.credit - this.creditInfo.creditremain) - this.subCreditInfo.subcredit)
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
      try {
        if (this.$store.state.auth.role === 'A2' && this.userBox === 'Üyeler' || this.$store.state.auth.role === 'G1' && this.userBox === 'Üyeler') {
          this.checkUserbox = false
        }else {
          if(this.$store.state.auth.role === 'A2' && this.userBox !== 'Üyeler' || this.$store.state.auth.role === 'G1' && this.userBox !== 'Üyeler'){
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
      } catch (error) {
        console.log(error)
      }
    },
    async resetAccount () {
      let newcredit = this.creditInfo.credit-this.subCreditInfo.subcredit
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
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
