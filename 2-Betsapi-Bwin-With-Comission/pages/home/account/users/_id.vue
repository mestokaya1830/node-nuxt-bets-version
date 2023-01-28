<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">ÜYE DETAY</span>
      <i class="fas fa-angle-double-up back-icons"/>
    </header>
<!-- general info section------------------------------- -->
    <ul class="account-con" v-if="checkUser">
      <h1 class="userdetails-title">
        <i class="fas fa-user fa-3x cl-g"/>
        <span class="userdetails-title-text">{{ users.user | capitalize}}</span>
      </h1>
      <error v-if="error" :message="error" class="error user-error"/>
      <li class="userdetails-items">
        <span class="userdetails-text">Kayıt Tarihi</span>
        <span class="edit-value">{{ users.date | fullFormat }}</span>
      </li>
      <li class="userdetails-items">
      <span class="userdetails-text">Durum</span>
      <select v-model="users.state" class="selectbox box-set">
        <option value="aktif" selected>Aktif</option>
        <option value="pasif">Pasif</option>
      </select>
      <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="save === 'state'"/>
      <i class="fa fa-save fa-2x edit-save cl-f" v-if="save !== 'state'" @click="updateState()"/>
    </li>
<!-- b1-s1 section------------------------------- -->
      <section v-if="checkS1 || checkB1">
        <li class="userdetails-items">
          <span class="userdetails-text">Limit</span>
          <input v-model="users.userlimit" type="number" class="selectbox box-set">
          <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'limit'"/>
          <i class="fa fa-save fa-2x edit-save cl-f" v-if="done !== 'limit'" @click="updateUserLimit(users.userlimit)"/>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Kalan Limit</span>
          <span class="edit-value">{{ users.userlimit - users.usedlimit }}</span>
        </li>
        <li class="userdetails-items">
          <span class="userdetails-text">Ödeme</span>
          <div class="form-rows nick-input">
            <span class="edit-value">{{ users.payment | fullFormat }}</span>
          </div>
          <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'payment'"/>
          <i class="fa fa-save fa-2x edit-save cl-f" v-if="done !== 'payment'" @click="updatePayment()"/>
        </li>
      </section>
<!-- a1-u1 section------------------------------- -->
    <section v-if="checkA1 || checkG1">
      <li class="userdetails-items">
        <span class="userdetails-text">Bakiye</span>
        <span class="edit-value">{{ users.creditremain | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Bakiye Ekle/Çıkar</span>
        <div  class="form-rows nick-input">
          <input v-model="updateAmount" type="number" min="0" class="set-inp" @focus="errorcreditremain = ''" required>
        </div>
        <i class="fas fa-minus-square  fa-2x cl-r slbs" @click="updateCreditRemain('eksi')"/>
        <i class="fas fa-plus-square  fa-2x cl-g slbs" @click="updateCreditRemain('arti')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="done === 'ucrstart'">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb10" v-if="done === 'ucrdone'"/>
        <span v-if="errorcreditremain" class="ml10 cl-r">{{errorcreditremain}}</span>
      </li>
    </section>
    <li class="userdetails-trash">
      <i class="fa fa-trash fa-2x cl-r" v-if="!isLoader" @click="isWarningOpen = true"/>
      <img src="~/assets/img/loader.gif" alt="" v-if="isLoader">
    </li>
  </ul>
<!-- general warning------------------------------- -->
    <div v-if="isWarningOpen" class="dialog warning warning-user">
       <header class="cancelbet-header"><span class="cancelbet-no">{{users.user}}</span></header>
        <p class="warning-text">Bu kullanıcıyı ona ait tüm bilgiler silinecektir!</p>
      <footer class="dialog-footer">
        <input type="button" value="Vazgeç" class="btn-dialog bg-r" @click="isWarningOpen = false">
        <input type="button" value="Sil" class="btn-dialog bg-g" @click="deleteUser($route.params.id)">
      </footer>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'userdetails',
  data () {
    return {
      users: {},
      isLoader: false,
      isWarningOpen: false,
      errorcreditremain:'',
      updateAmount:null,
      save:'',
      done:'',
      error:'',
      isLoader:false,
      checkUser:false
    }
  },
  mounted () {
    this.userDetails()
    this.goTop()
  },
  computed:{
    checkS1 () {
      if (this.$store.state.auth.role === 'S1') {
        return true
      }
    },
    checkB1 () {
      if (this.$store.state.auth.role === 'B1') {
        return true
      }
    },
    checkA1 () {
      if (this.$store.state.auth.role === 'A1') {
        return true
      }
    },
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
  },
  filters: {
    fullFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("YYYY-MM-DD H:mm:ss")
    }
  },
  methods: {
    async userDetails () {
      await axios.get('/api/home/account/users/' + this.$route.params.id).then((result) => {
        if(result.data.users.admin === this.$store.state.auth.user){
          this.checkUser = true
          this.users = result.data.users
        }
      }).catch(err => {console.log(err)})
    },
    async updatePayment () {
      await axios.put('/api/home/account/updatepayment/' + this.$route.params.id, this.users).then((result) => {
        if (result.data.code === 200) {
          this.done = 'payment'
          setTimeout(() => {
            this.done = ''
          }, 1000)
        }
      }).catch(err => {console.log(err)})
    },
    async updateState () {
      await axios.put('/api/home/account/updatestate/' + this.$route.params.id, this.users).then((result) => {
        if (result.data.code === 200) {
          this.save = 'state'
          setTimeout(() =>{
            this.save = ''
          }, 1000)
        }
      }).catch(err => {console.log(err)})
    },
    async deleteUser (id) {
      this.isWarningOpen = false
      this.isLoader = true
      await axios.delete('/api/home/account/usersdelete/' + id).then((result) => {
        if (result.data.code === 200) {
          setTimeout(() =>{
            this.$router.push('/home/account/users')
          }, 1000)
        } else {
          this.error = result.data.error.code
          this.isLoader = false
          setTimeout(() =>{
            this.error = ''
          }, 3000)
        }
      }).catch(err => {console.log(err)})
    },
    async updateUserLimit (value) {
      await axios.put('/api/home/account/updateuserlimit/' + this.$route.params.id, {newlimit:value}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'limit'
          setTimeout(() => {
            this.done = ''
          }, 1000)
        }
      }).catch(err => {console.log(err)})
    },
    async updateCreditRemain (operate) {
      if (this.updateAmount && this.updateAmount > 0) {
        if (operate === 'eksi' && this.updateAmount > this.users.creditremain) {
          this.errorcreditremain = 'Miktar bakiyeden büyük olamaz!'
        }else if(this.updateAmount > this.$store.state.auth.creditremain){
          this.errorcreditremain = 'Miktar Üst Krediden büyük olamaz!'
        }else{
            this.errorcreditremain = ''
            this.done = 'ucrstart'
            await axios.put('/api/home/account/updatecreditremain/' + this.$route.params.id, {operate:operate, creditremain:this.users.creditremain, updateamount: this.updateAmount}).then((result) => {
              if (result.data.code === 200) {
                this.done = 'ucrdone'
                setTimeout(() =>{
                  this.updateAmount = null
                  this.done = ''
                  this.userDetails()
                  this.betInfo()
                }, 1000)
              }else{
                this.errorcreditremain = result.data.message
              }
            }).catch(err => {console.log(err)})
        }
      } else {
        this.errorcreditremain = 'Miktar sadece sayı olabilir!'
      }
    },
    async betInfo() {
      const credit = await axios.post('/api/home/account/creditinfo',{userbox:'Üyeler'})
      const active = await axios.post('/api/home/account/activeinfo',{userbox:'Üyeler'})
      const total = await axios.post('/api/home/account/totalinfo',{userbox:'Üyeler'})
      const won = await axios.post('/api/home/account/woninfo',{userbox:'Üyeler'})
      Promise.all([credit, active, total, won]).then(result => {
        let final = {... result[0].data.creditinfo, ...result[1].data.activeinfo, ...result[2].data.totalinfo, ...result[3].data.woninfo}
        this.$store.commit('setBetInfo',final)
      })
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
