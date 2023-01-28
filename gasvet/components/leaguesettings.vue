<template>
  <div class="pages" id="content" v-if="$store.state.auth.role === 'A1'">
    <header class="title-2">
      <span>{{title}}</span>
      <span class="badge bg-g" :color='"color"'>{{leaguesLength}}</span>
    </header>
    <ul class="main-set-list">
      <li v-for="(list, index) in leagues" :key="index" class="fix-li">
        <div class="fix-1">
          <input type="checkbox" class="set-cb" v-model="list[$store.state.auth.user]" :id="list.lid"  @change="updateLeagues(list[$store.state.auth.user], list.lid)" />
          <label class="set-lb" :for="list.lid"></label>
          <span class="list-mn">{{list.cn}} {{list.ln}}</span>
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
  name: 'leaguemarketsettings',
  props:{
    links:String,
    title:String,
    table:String,
    type:String,
    color:String
  },
  data () {
    return {
      leagues: {},
      isLoader: false,
      leaguesLength:0
    }
  },
  mounted () {
    this.getLeagues()
    this.goTop()
  },
  methods: {
    async getLeagues () {
      this.isLoader = true
      await axios.get(`/api/home/account/leagues/${this.links}`).then((result) => {
        if (result.data.data) {
          this.leagues = result.data.data
          this.leaguesLength = result.data.data.length
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async updateLeagues (state,lid) {
      this.setloader = lid
      await axios.put('/api/home/account/updateleagues', {table:this.table, type: this.type, state:state, lid:lid}).then().catch(err => {console.log(err)})
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