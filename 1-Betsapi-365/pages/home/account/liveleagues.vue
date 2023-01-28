<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Canlı Lig Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getLiveLeagues()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list">
      <li><h3>Toplam Canlı Lig Sayısı {{liveLeaguesLength}}</h3></li>
      <li v-for="(list, index) in liveLeagues" :key="index" class="set-li">
        <span class="badge bg-f mr10">{{index}}</span>
        <span class="set-li-text-set">{{list.name}}</span>
        <input v-model="list[userBox]" type="checkbox" class="check-inp" @change="updateLiveLeagues(list[userBox], list.id)">
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
      liveLeagues: {},
      userBox: 'Üyeler',
      done: '',
      loader: '',
      liveLeaguesLength: 0
    }
  },
  mounted () {
    this.getUserList()
    this.insertLiveLeagues()
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
    async insertLiveLeagues(){
      this.preloader = true
      let insertArray  = []
      await axios.get(`/api/home/1`).then((result) =>{
        result.data.results.forEach(item => {
          insertArray.push({id:item.league.id, name:item.league.name})
        })
        axios.post('/api/home/account/insertliveleagues',{liveleagues:insertArray}).then((result)=>{
          if (result.data.code === 200) {
            this.preloader = false
          }
        })
      })
    },
    async getLiveLeagues () {
      if (this.userBox === 'Üyeler') {
        this.liveLeagues = {}
      } else {
        await axios.post('/api/home/account/liveleagues', {userbox: this.userBox }).then((result) => {
          this.liveLeagues = result.data.liveleagues
          this.liveLeaguesLength = result.data.liveleagues.length
        })
      }
    },
    async updateLiveLeagues (state, id) {
      if (this.userBox !== 'Üyeler') {
        this.loader = id
        await axios.post('/api/home/account/updateliveleagues', {state:state, id: id, userbox: this.userBox }).then((result) => {
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
