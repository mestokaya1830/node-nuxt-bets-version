<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Canlı Oran Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getLiveRate()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list" v-if="userBox !== 'Üyeler'">
      <li class="set-li" v-if="newRate === '0'">
        <h3>Oranlar orjinal durumdadır.</h3>
      </li>
      <li class="set-li" v-else>
        <h3>Ayarlı oran {{newRateText}}</h3>
      </li>
      <li class="set-li">
        <input v-model="newRate" type="number" class="rate-inp" id="newrate">
        <i class="fas fa-minus-square  fa-3x cl-r slbs" @click="updateLiveRate('minus')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'minus'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'minus'"/>
        <i class="fas fa-plus-square  fa-3x cl-g slbs" @click="updateLiveRate('adding')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'adding'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'adding'"/>
        <i class="fas fa-cog  fa-3x cl-f slbs" @click="updateLiveRate('orjinal')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'orjinal'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'orjinal'"/>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Liverate',
  data () {
    return {
      userList: {},
      liveRate: {},
      userBox: 'Üyeler',
      done: '',
      loader: '',
      newRate: null,
      newRateText: ''
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
      this.newRate = 0
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getLiveRate(){
      if (this.userBox !== 'Üyeler'){
        this.newRateText = ''
        this.newRate = null
        await axios.post('/api/home/account/liverate',{userbox:this.userBox}).then((result) => {
          this.newRateText = result.data.liverate[0].liverate
        })
      }
    },
    async updateLiveRate (id) {
      if (this.newRate) {
        this.loader = id
        await axios.post('/api/home/account/updateliverate', {operate:id, newrate: this.newRate, userbox: this.userBox }).then((result) => {
          this.loader = ''
          this.done = id
          setTimeout(function () {
            this.done = ''
            this.newRateText = this.newRate
            this.newRate = null
          }.bind(this), 1500)
        })
      }else{
        document.getElementById('newrate').focus()
      }
    },
  }
}
</script>
