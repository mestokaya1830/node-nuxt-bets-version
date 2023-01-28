<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Lig Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getLeagues()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list">
      <li><h3>Toplam Lig Sayısı {{leaguesLength}}</h3></li>
      <li v-for="(list, index) in leagues" :key="index" class="set-li">
        <span class="badge bg-f mr10">{{index}}</span>
        <span class="set-li-text-set">{{list.name}}</span>
        <input v-model="list[userBox]" type="checkbox" class="check-inp" @change="updateLeagues(list[userBox], list.id)">
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === list.id">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === list.id"/>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Leagues',
  data () {
    return {
      userList: {},
      leagues: {},
      userBox: 'Üyeler',
      done: '',
      loader: '',
      leaguesLength:0
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
    async getLeagues () {
      if (this.userBox === 'Üyeler') {
        this.leagues = {}
      } else {
        await axios.post('/api/home/account/leagues', {userbox: this.userBox }).then((result) => {
          this.leagues = result.data.leagues
          this.leaguesLength = result.data.leagues.length
        })
      }
    },
    async updateLeagues (state, id) {
      if (this.userBox !== 'Üyeler') {
        this.loader = id
        await axios.post('/api/home/account/updateleagues', {state:state, id: id, userbox: this.userBox }).then((result) => {
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
