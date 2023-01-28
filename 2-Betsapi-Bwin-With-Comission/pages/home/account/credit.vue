<template>
  <div class="pages" v-if="$store.state.auth.role === 'A1'">
    <header class="title-2" id="content">
      <span class="set-title">LİMİT TRANSFERİ</span>
      <i class="fas fa-angle-double-up back-icons"/>
    </header>
    <ul>
      <li class="title-ligth">
        <span class="citems bitems-title cowner-title">
          <select v-model="userBox" class="selectbox box-credit" @change="userdetails()">
            <option disabled>Üyeler</option>
            <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
          </select>
        </span>
      </li>
    </ul>
<!-- general info section------------------------------- -->
    <ul class="account-con" v-if="userSelected">
     <li class="userdetails-items">
        <span class="userdetails-text">Mevcut Limit</span>
        <span class="userdetails-text">{{users.credit | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Kullanılan Miktar</span>
        <span class="userdetails-text">{{ getUsedCredit | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Kalan Miktar</span>
        <span class="userdetails-text">{{users.creditremain | currency('', 2)}}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Limit Ekle/Çıkar</span>
        <input v-model="updateAmount" type="number" min="0" class="set-inp" @focus="errorcredit = ''" required>
        <i class="fas fa-minus-square  fa-2x cl-r slbs" @click="updateCredit('eksi')"/>
        <i class="fas fa-plus-square  fa-2x cl-g slbs" @click="updateCredit('arti')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="done === 'ucstart'">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb10" v-if="done === 'ucdone'"/>
        <span v-if="errorcredit" class="ml10 cl-r">{{errorcredit}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'creditremain',
  data () {
    return {
      userList: {},
      users:{},
      userBox:'Üyeler',
      userSelected:false,
      save:'',
      done:'',
      errorcredit:'',
      updateAmount:null
    }
  },
  mounted () {
    this.getUserList()
    this.goTop()
  },
  computed:{
    getUsedCredit(){
      return this.users.credit - this.users.creditremain
    }
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async userdetails () {
      await axios.get('/api/home/account/users/' + this.userBox).then((result) => {
        if (result.data.users) {
          this.users = result.data.users
        }
        this.userSelected = true
      }).catch(err => {console.log(err)})
    },
    async updateCredit (operate) {
      this.done = 'ucstart'
      if (this.updateAmount && this.updateAmount > 0) {
        if (operate === 'eksi' && this.updateAmount > this.users.creditremain) {
          this.errorcredit = 'Miktar kalandan az aolamaz!'
          this.done = ''
        } else {
          await axios.put('/api/home/account/updatecredit/' + this.userBox, {operate:operate, creditremain:this.users.creditremain, updateamount: this.updateAmount}).then((result) => {
            if (result.data.code === 200) {
              this.done = 'ucdone'
              setTimeout(() =>{
                this.updateAmount = null
                this.done = ''
                this.userdetails()
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
