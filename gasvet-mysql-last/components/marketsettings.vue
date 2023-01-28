<template>
  <div class="pages po-r" v-if="$store.state.auth.role === 'Admin'">
    <header class="title-2" id="content">
      <span>{{title}}</span>
      <span class="badge bg-g">{{marketsLength}}</span>
    </header>
    <ul class="main-set-list">
      <li v-for="(list, index) in markets" :key="index" class="fix-li">
        <div class="fix-1">
          <input type="checkbox" class="set-cb" v-model="list[$store.state.auth.user]" :id="list.mid"  @change="updateMarkets(list[$store.state.auth.user], list.mid)" />
          <label class="set-lb" :for="list.mid"></label>
          <span class="list-mn">{{list.mn}}</span>
        </div>
      </li>
      <li>
        <button  class="btn-set btn-set-fix cp bg-g" @click="saveAll()">Kaydet</button>
      </li>
    </ul>
    <preloader v-if="isLoader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Marketsettings',
  props:{
    market:{ type: String, default: '' },
    title:{ type: String, default: '' },
    table:{ type: String, default: '' },
    type:{ type: String, default: '' },
    color:{ type: String, default: '' }
  },
  data () {
    return {
      markets: {},
      isLoader: false,
      marketsLength:0,
      newRate:null
    }
  },
  mounted () {
    this.getMarkets()
    this.goTop()
  },
  methods: {
    async getMarkets () {
      this.isLoader = true
      await axios.get(`/api/home/account/markets/${this.market}`).then((result) => {
        this.markets = result.data.data
        this.marketsLength = result.data.data.length
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async updateMarkets (state, mid) {
      this.setloader = mid
      await axios.put('/api/home/account/updatemarkets', {table:this.table, type:this.type, state:state, mid: mid}).then((result) => {
        
      }).catch(err => {console.log(err)})
    },
    saveAll(){
       this.$router.push('/welcome')
    },
    goTop(){
      const el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
