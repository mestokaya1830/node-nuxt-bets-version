<template>
  <div v-if="$store.state.auth.role === 'Admin'" class="pages po-r">
    <header class="title-2">
      <span>{{title}}</span>
      <span class="badge bg-g">{{marketsLength}}</span>
    </header>
    <ul>
      <div class="main-set-list">
        <section class="user-id-section">
          <li v-for="(list, index) in markets" :key="index" class="fix-li">
            <div class="fix-1">
              <input v-model="list[$store.state.auth.user]" :id="list.mid" type="checkbox" class="set-cb"  @change="updateMarkets(list[$store.state.auth.user], list.mid)" />
              <label class="set-lb" :for="list.mid"></label>
              <span class="list-mn">{{list.mn}}</span>
            </div>
          </li>
          <li>
            <button  class="btn-set" @click="saveAll()">Yenile</button>
          </li>
        </section>
      </div>
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
  },
  methods: {
    async getMarkets () {
      this.isLoader = true
      await axios.get(`/api/home/account/markets/${this.market}`).then((result) => {
        this.markets = result.data.market
        this.marketsLength = result.data.market.length
        this.isLoader = false
      })
    },
    async updateMarkets (state, mid) {
      this.setloader = mid
      await axios.put('/api/home/account/updatemarkets', {table:this.table, type:this.type, state, mid})
    },
    saveAll (){
       this.$router.push('/welcome')
    }
  }
}
</script>
