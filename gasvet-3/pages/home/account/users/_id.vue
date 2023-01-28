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
      <i class="fa fa-thumbs-up fa-2x cl-g slbs mb45" v-if="save === 'state'"/>
      <i class="fa fa-save fa-2x edit-save cl-f" v-if="save !== 'state'" @click="updateState()"/>
    </li>
<!-- b4-s3 section------------------------------- -->
  <span class="hr"></span>
    <section v-if="checkS3 || checkB4 || checkA2 && users.role === 'G1'">
      <li class="userdetails-items">
        <span class="userdetails-text">Üye Sayısı</span>
        <input v-model="users.userlimit" type="number" class="selectbox box-set">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb45" v-if="done === 'limit'"/>
        <i class="fa fa-save fa-2x edit-save cl-f" v-if="done !== 'limit'" @click="updateUserLimit(users.userlimit)"/>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Kalan Üye Sayısı</span>
        <span class="edit-value">{{ users.userlimit - users.usedlimit }}</span>
      </li>
      <li class="userdetails-items" v-if="checkS3 || checkB4">
        <span class="userdetails-text">Ödeme</span>
        <div class="form-rows nick-input">
          <span class="edit-value">{{ users.payment | fullFormat }}</span>
        </div>
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb45" v-if="done === 'payment'"/>
        <i class="fa fa-save fa-2x edit-save cl-f" v-if="done !== 'payment'" @click="updatePayment()"/>
      </li>
    </section>
<!-- a2-u1 section------------------------------- -->
    <span class="hr"></span>
    <section v-if="checkA2">
      <li class="userdetails-items">
        <span class="userdetails-text">Limit</span>
        <span class="userdetails-text">{{users.credit | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items" v-if="users.role === 'G1'">
        <span class="userdetails-text">Kullanılan Miktar</span>
        <span class="userdetails-text">
          {{ (getUsedCredit - $store.state.betinfo.subcredit) | currency('', 2)}}
          (<span class="cl-r">{{$store.state.betinfo.subcredit}}</span>)
        </span>
      </li>
      <li class="userdetails-items" v-else>
        <span class="userdetails-text">Kullanılan Miktar</span>
        <span class="userdetails-text">{{ getUsedCredit | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Bakiye</span>
        <span class="userdetails-text">{{users.creditremain | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Limit Ekle/Çıkar</span>
        <input v-model="updateAmount" type="number" min="0" class="set-inp" @focus="errorcredit = ''" required>
        <div v-if="this.done !== 'ucstart' && done !== 'ucdone'">
          <i class="fas fa-minus-square  fa-2x cl-r slbs" @click="updateCredit('eksi')"/>
          <i class="fas fa-plus-square  fa-2x cl-g slbs" @click="updateCredit('arti')"/>
        </div>
        <img src="~/assets/img/loader.gif" alt="" v-if="done === 'ucstart'" class="ml10">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb40" v-if="done === 'ucdone'"/>
        <span v-if="errorcredit" class="ml10 cl-r">{{errorcredit}}</span>
      </li>
    </section>
    <section v-if="checkG1">
      <li class="userdetails-items">
        <span class="userdetails-text">Bakiye</span>
        <span class="edit-value">{{ users.creditremain | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Bakiye Ekle/Çıkar</span>
        <div  class="form-rows nick-input">
          <input v-model="updateAmount" type="number" min="0" class="set-inp" @focus="errorcredit = ''" required>
        </div>
        <div v-if="this.done !== 'ucstart' && done !== 'ucdone'">
          <i class="fas fa-minus-square  fa-2x cl-r slbs" @click="updateCreditRemain('eksi')"/>
          <i class="fas fa-plus-square  fa-2x cl-g slbs" @click="updateCreditRemain('arti')"/>
        </div>
        <img src="~/assets/img/loader.gif" alt="" v-if="done === 'ucstart'" class="ml10">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb40" v-if="done === 'ucdone'"/>
        <span v-if="errorcredit" class="ml10 cl-r">{{errorcredit}}</span>
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
      errorcredit:'',
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
    checkS3 () {
      if (this.$store.state.auth.role === 'S3') {
        return true
      }
    },
    checkB4 () {
      if (this.$store.state.auth.role === 'B4') {
        return true
      }
    },
    checkA2 () {
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
    getUsedCredit(){
      return this.users.credit - this.users.creditremain
    }
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
          this.error = result.data.message
          this.isLoader = false
          setTimeout(() =>{
            this.$router.push('/home/account/users')
          }, 1000)
        } else {
          this.error = result.data.error
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
    async updateCredit (operate) {
      if (this.updateAmount && this.updateAmount > 0) {
        if (operate === 'eksi' && this.updateAmount > this.users.creditremain) {
          this.errorcredit = 'Miktar kalandan çok olamaz!'
          this.done = ''
        } else {
          this.errorcredit = ''
          this.done = 'ucstart'
          await axios.put('/api/home/account/updatecredit/' + this.$route.params.id, {operate:operate, credit:this.users.credit, updateamount: this.updateAmount}).then((result) => {
            this.done = 'ucdone'
            if (result.data.code === 200) {
              setTimeout(() =>{
                this.updateAmount = null
                this.done = ''
                this.userDetails()
                this.betInfo()
              }, 1000)
            }else{
              this.errorcredit = result.data.message
            }
          }).catch(err => {console.log(err)})
        }
      } else {
        this.errorcredit = 'Miktar sadece sayı olabilir!'
      }
    },
    async updateCreditRemain (operate) {
      if (this.updateAmount && this.updateAmount > 0) {
        if (operate === 'eksi' && this.updateAmount > this.users.creditremain) {
          this.errorcredit = 'Miktar bakiyeden büyük olamaz!'
        }else if(this.$store.state.auth.role === 'G1' && this.updateAmount > this.$store.state.auth.creditremain){
          this.errorcredit = 'Miktar bayi krediden büyük olamaz!'
        }else{
            this.errorcredit = ''
            this.done = 'ucstart'
            await axios.put('/api/home/account/updatecreditremain/' + this.$route.params.id, {operate:operate,creditremain:this.users.creditremain, updateamount: this.updateAmount}).then((result) => {
              if (result.data.code === 200) {
                this.done = 'ucdone'
                setTimeout(() =>{
                  this.updateAmount = null
                  this.done = ''
                  this.userDetails()
                  this.betInfo()
                }, 1000)
              }else{
                this.errorcredit = result.data.message
              }
            }).catch(err => {console.log(err)})
        }
      } else {
        this.errorcredit = 'Miktar sadece sayı olabilir!'
      }
    },
    async betInfo() {
      try {
        const credit = await axios.post('/api/home/account/creditinfo',{userbox:'Üyeler'})
        const subcredit = await axios.post('/api/home/account/subcredit',{userbox:'Üyeler'})
        const active = await axios.post('/api/home/account/activeinfo',{userbox:'Üyeler'})
        const won = await axios.post('/api/home/account/woninfo',{userbox:'Üyeler'})
        const total = await axios.post('/api/home/account/totalinfo',{userbox:'Üyeler'})
        const lostinfo = await axios.post('/api/home/account/lostinfo', { userbox:'Üyeler'})
        Promise.all([credit, subcredit, active, total, won, lostinfo]).then(result => {
          let final = {... result[0].data.creditinfo, ... result[1].data.subcredit, ...result[2].data.activeinfo, ...result[3].data.totalinfo, ...result[4].data.woninfo, ...result[5].data.lostinfo}
          this.$store.commit('setBetInfo',final)
        })
      } catch (error) {console.log(error)}
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
