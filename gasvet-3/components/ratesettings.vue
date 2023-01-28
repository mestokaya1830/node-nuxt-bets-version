<template>
  <div class="pages">
    <header class="title-2" id="content" v-if="$store.state.auth.role === 'A2'">
      <span>{{title}}</span>
    </header>
    <ul class="main-set-list" v-if="$route.name === 'home-account-soccerliverate' || $route.name === 'home-account-basketliverate'">
     <h3 class="mt20 ml10">Tüm Bayiler İçin Oran Limiti</h3>
      <li class="set-li" v-if="rateLimit === '0'">
        <h3 class="cl-g">Oranlar orjinal durumdadır.</h3>
      </li>
      <li class="set-li" v-else>
        <h3 class="cl-g">Ayarlı Limit {{newLimitText}}</h3>
      </li>
      <li class="set-li">
        <input v-model="rateLimit" type="number" class="rate-inp" id="rateLimit">
        <i class="fas fa-save  fa-3x cl-g slbs" @click="updateLimit('limit')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader=== 'limit'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'limit'"/>
        <i class="fas fa-cog  fa-3x cl-f slbs" @click="updateLimit('reset')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader=== 'reset'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'reset'"/>
      </li>
    </ul>
    <div>
      <button  class="btn-set btn-set-fix cp bg-g" @click="saveAll()">Kaydet</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name:'ratesettings',
  props:{
    rate:String,
    limit:String,
    title:String,
    type:String,
    typelimit:String,
    table:String,
    color:String
  },
  data () {
    return {
      done: null,
      loader: null,
      newRate: null,
      rateLimit: null,
      newRateText:null,
      newLimitText:null
    }
  },
  mounted () {
    this.getRate()
    this.goTop()
  },
  methods: {
    getRate(){
      if (localStorage.getItem('set') && localStorage.getItem('set').length > 0) {
        let ls = localStorage.getItem('set')
        let r = JSON.parse(ls).find(item => {return item.type === this.type})
        if (r) {
          this.newRateText = r.operate +' '+ r.rate.toFixed(2)
        }
        let rl = JSON.parse(ls).find(item => {return item.type === this.typelimit})
        if(rl){
          this.newLimitText = rl.rate
        }
      }
    },
    async updateRate (id) {
      if (this.newRate) {
        this.loader = id
        await axios.put('/api/home/account/updaterates', {table:this.table, type:this.type, operate:id, newrate: this.newRate, ratelimit:this.rateLimit}).then((result) => {
          this.loader = null
          this.done = id
          setTimeout(function () {
            this.done = null
            this.newRateText = id +' '+ this.newRate
            this.newRate = null
          }.bind(this), 1500)
        }).catch(err => {console.log(err)})
      }
    },
    async updateLimit (id) {
      if (this.rateLimit) {
        this.loader = id
        await axios.put('/api/home/account/updatelimits', {typelimit:this.typelimit, operate:id,ratelimit:this.rateLimit}).then((result) => {
          this.loader = null
          this.done = id
          setTimeout(function () {
            this.done = null
            this.newLimitText = this.rateLimit
            this.rateLimit = null
          }.bind(this), 1500)
        }).catch(err => {console.log(err)})
      }
    },
    saveAll(){
      this.$router.push('/welcome')
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>