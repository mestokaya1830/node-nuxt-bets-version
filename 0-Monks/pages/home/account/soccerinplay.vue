<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>FUTBOL CANLI LİG DÜZENLE</span>
      <span class="badge bg-g">{{leaguesLength}}</span>
    </header>
    <ul class="main-set-list">
      <li>
        <summary class="title-3 set-li">
          <div class="set-li">
            <span class="set-li-text-set">
              <span>KOD</span>
              <span class="set-li-text-set ml20">LİG</span>
            </span>
          </div>
          <button  class="btn-set bg-g cp" @click="saveAll()">Kaydet</button>
        </summary>
      </li>
      <li v-for="(list, index) in leagues" :key="index" class="fix-li">
        <div class="fix-1">
          <span class="badge bg-f mr20">{{index}}</span>
          <span class="set-li-text-set">{{list.cn}} {{list.ln}}</span>
        </div>
        <input v-model="list[$store.state.auth.user]" type="checkbox" class="check-inp" @change="updateLiveLeagues(list[$store.state.auth.user], list.lid)">
        <img src="~/assets/img/loader.gif" alt="" v-if="setloader === list.lid">
        <i class="fas fa-thumbs-up fa-2x cl-g" v-if="done === list.lid"/>
      </li>
    </ul>
    <preloader v-if="loader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
import preloader from '@/components/preloader'
export default {
  name: 'Leagues',
  components: {
    preloader
  },
  data () {
    return {
      leagues: {},
      done: '',
      loader: '',
      setloader:'',
      newRate:'',
      leaguesLength:0,
      liveState: true
    }
  },
  mounted () {
    this.getLeagues()
    this.goTop()
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getLeagues () {
      this.loader = true
      await axios.get('/api/home/account/leagues/soccerinplay').then((result) => {
        this.leagues = result.data.data
        this.leaguesLength = result.data.data.length
        this.loader = false
      })
    },
    async updateLiveLeagues (state,lid) {
      this.setloader = lid
      await axios.post('/api/home/account/soccerinplayupdate', {state:state, lid: lid}).then((result) => {
        this.done = lid
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
