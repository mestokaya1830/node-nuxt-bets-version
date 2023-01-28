<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>FUTBOL BÜLTEN BAHİS DÜZENLE</span>
      <span class="badge bg-g">{{marketsLength}}</span>
    </header>
    <ul class="main-set-list">
      <li>
        <summary class="title-3 set-li">
          <div class="set-li">
            <span class="set-li-text-set">
              <span>KOD</span>
              <span class="set-li-text-set ml20">BAHİSLER</span>
            </span>
          </div>
          <button  class="btn-set bg-g cp" @click="saveAll()">Kaydet</button>
        </summary>
      </li>
      <li v-for="(list, index) in markets" :key="index" class="fix-li">
        <div class="fix-1">
          <span class="badge bg-f mr10">{{index}}</span>
          <span class="set-li-text-set">{{list.mn}}</span>
        </div>
        <input v-model="list[$store.state.auth.user]" type="checkbox" class="check-inp" @change="updateMarkets(list[$store.state.auth.user], list.mid)">
        <img src="~/assets/img/loader.gif" alt="" v-if="setloader === list.mid">
        <i class="fas fa-thumbs-up fa-2x cl-g" v-if="done === list.mid"/>
      </li>
    </ul>
    <preloader v-if="loader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
import preloader from '@/components/preloader'
export default {
  name: 'Markets',
  components: {
    preloader
  },
  data () {
    return {
      markets: {},
      done: '',
      loader: '',
      marketsLength:0,
      checkUserBox: false,
      setloader:'',
      newRate:''
    }
  },
  mounted () {
    this.getMarkets()
    this.goTop()
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getMarkets () {
      this.loader = true
      await axios.get('/api/home/account/markets/soccermarkets').then((result) => {
        this.markets = result.data.data
        this.marketsLength = result.data.data.length
        this.loader = false
      })
    },
    async updateMarkets (state, mid) {
      this.setloader = mid
      await axios.post('/api/home/account/soccermarketsupdate', {state:state, mid: mid}).then((result) => {
        this.done = mid
        this.setloader = ''
        setTimeout(function () {
          this.done = ''
        }.bind(this), 1500)
      })
    },
    saveAll(){
       this.$router.push('/welcome')
    }
  }
}
</script>
