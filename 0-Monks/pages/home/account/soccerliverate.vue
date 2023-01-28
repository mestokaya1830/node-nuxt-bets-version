<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>FUTBOL CANLI ORAN AYARLARI</span>
      <button  class="btn-set bg-g cp" @click="saveAll()">Kaydet</button>
    </header>
    <ul class="main-set-list">
     <h3>Tüm Bayiler İçin Canlı Oran Ayarları</h3>
      <li class="set-li" v-if="newRate === '0'">
        <h3 class="cl-g">Oranlar orjinal durumdadır.</h3>
      </li>
      <li class="set-li" v-else>
        <h3 class="cl-g">Ayarlı oran {{newRateText}}</h3>
      </li>
      <li class="set-li">
        <div class="mt5">Örnek Kullanım 0.10 Burda 10 yerine istedigniz oranı yazınız.</div>
      </li>
      <li class="set-li">
        <input v-model="newRate" type="number" class="rate-inp" id="newrate">
        <i class="fas fa-minus-square  fa-3x cl-r slbs" @click="updateRate('Eksi')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'Eksi'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'Eksi'"/>
        <i class="fas fa-plus-square  fa-3x cl-g slbs" @click="updateRate('Artı')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'Artı'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'Artı'"/>
        <i class="fas fa-cog  fa-3x cl-f slbs" @click="updateRate('Orjinal')"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader === 'Orjinal'">
        <i class="fas fa-thumbs-up fa-2x cl-g mb10 ml20" v-if="done === 'Orjinal'"/>
      </li>
    </ul>
    <hr>
     <ul class="main-set-list">
     <h3>Tüm Bayiler İçin Canlı Oran Kısıtlama</h3>
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
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Rate',
  data () {
    return {
      done: '',
      loader: '',
      newRate: null,
      rateLimit: null,
      newRateText:'',
      newLimitText:''
    }
  },
  mounted () {
    this.getRate()
    this.goTop()
  },
  methods: {
    getRate(){
      if (localStorage.getItem('set').length > 0) {
        let ls = localStorage.getItem('set')
        let r = JSON.parse(ls).find(item => {return item.type === 'solr'})
        if (r) {
          this.newRateText = r.operate +' '+ r.rate.toFixed(2)
        }
        let rl = JSON.parse(ls).find(item => {return item.type === 'soll'})
        if(rl){
          this.newLimitText = rl.rate
        }
      }
    },
    async updateRate (id) {
      if (this.newRate) {
        this.loader = id
        await axios.post('/api/home/account/soccerupdateliverate', {operate:id, newrate: this.newRate, ratelimit:this.rateLimit}).then((result) => {
          this.loader = ''
          this.done = id
          setTimeout(function () {
            this.done = ''
            this.newRateText = id +' '+ this.newRate
            this.newRate = null
          }.bind(this), 1500)
        })
      }
    },
     async updateLimit (id) {
      if (this.rateLimit) {
        this.loader = id
        await axios.post('/api/home/account/soccerupdateliveratelimit', {operate:id,ratelimit:this.rateLimit}).then((result) => {
          this.loader = ''
          this.done = id
          setTimeout(function () {
            this.done = ''
            this.newLimitText = this.rateLimit
            this.rateLimit = null
          }.bind(this), 1500)
        })
      }
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    saveAll(){
      this.$router.push('/welcome')
    }
  }
}
</script>
