<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Bahis Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getMarkets()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list">
      <li><h3>Toplam Bahis Sayısı {{marketsLength}}</h3></li>
      <li v-for="(list, index) in markets" :key="index" class="set-li">
        <span class="badge bg-f mr10">{{index}}</span>
        <span class="set-li-text-set">{{list.name}}</span>
        <input v-model="list[userBox]" type="checkbox" class="check-inp" @change="updateMarkets(list[userBox], list.id)">
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === list.id">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === list.id"/>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Markets',
  data () {
    return {
      userList: {},
      markets: {},
      userBox: 'Üyeler',
      done: '',
      loader: '',
      marketsLength:0
    }
  },
  mounted () {
    this.getUserList()
    this.goTop()
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getMarkets () {
      if (this.userBox === 'Üyeler') {
        this.markets = {}
      } else {
        await axios.post('/api/home/account/markets', {userbox: this.userBox }).then((result) => {
          this.markets = result.data.markets
          this.marketsLength = result.data.markets.length
        })
      }
    },
    async updateMarkets (state, id) {
      if (this.userBox !== 'Üyeler') {
        this.loader = id
        await axios.post('/api/home/account/updatemarkets', {state:state, id: id, userbox: this.userBox }).then((result) => {
          this.alert = result.data.message
          this.loader = ''
          this.done = id
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1500)
        })
      }
    }
  }
}
</script>
