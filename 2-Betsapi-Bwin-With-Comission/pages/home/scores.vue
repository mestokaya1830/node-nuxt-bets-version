<template>
  <div class="score-page">
    <div class="title-2">
      <div>
        <i class="fas fa-certificate navbar-icons cl-g" />
        <span>SKORLAR</span>
        <i class="fas fa-adjust navbar-icons ml20 cp" @click="leagueOpen = ! leagueOpen" title="Aç Kapa"/>
      </div>
      <div>
      </div>
      <span class="badge bg-g">{{scores.length}}</span>
    </div>
    <div class="score-con">
      <details :open="leagueOpen" class="odd-details" v-for="(list, index) in scores" :key="index">
        <summary class="title-3">
          <div class="scor-title">
            <span class="flag-con">
              <img :src="list.flags">
              <span class="left-menu-links-text ml10">{{list.league}}</span> 
            </span>
          </div>
        </summary>
        <div class="score-list-con">
          <div class="score-list scor-time">
            <span class="score-items" v-for="time in list.time" :key="time.id">{{time}}</span>
          </div>
          <div class="score-list score-half cl-r">
            <span class="score-items" v-for="halfscore in list.halfscore" :key="halfscore.id">{{halfscore}}</span>
          </div>
           <div class="score-list  score-ft">
            <span class="score-items sft" v-for="firstteam in list.firstteam" :key="firstteam.id">{{firstteam}}</span>
          </div>
          <div class="score-list  score-sc cl-r">
            <span class="score-items" v-for="homescore in list.homescore" :key="homescore.id">{{homescore}}</span>
          </div>
          <div class="score-list em">
            <span class="score-items" v-for="em in list.em" :key="em.id">{{em}}</span>
          </div>
          <div class="score-list  score-sc cl-r">
            <span class="score-items" v-for="awayscore in list.awayscore" :key="awayscore.id">{{awayscore}}</span>
          </div>
          <div class="score-list score-st">
            <span class="score-items sst" v-for="secondteam in list.secondteam" :key="secondteam.id">{{secondteam}}</span>
          </div>
          <div class="score-list">
            <span class="score-items cl-r" v-for="ms in list.ms" :key="ms.id">
              <span class="scores-tm" v-if="ms !== 'MS' && ms !== 'ER' && ms !== 'MB' && ms !== 'İP'">{{ms}}</span>
              <span v-else>{{ms}}</span>
            </span>
          </div>
        </div> 
      </details>
      <preloader v-if="loader" class="loader-con"/>
      <div class="page-end"><span class="">Başka veri yoktur</span></div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import preloader from '@/components/preloader.vue'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Scor',
  components: {
    preloader
  },
  data () {
    return {
      scores: {},
      loader: false,
      intervalScoresList: '',
      leagueOpen: true
    }
  },
  mounted () {
    this.getScor()
    this.intervalScoresList = setInterval(() => {
      this.getScor()
    }, 180 * 1000)
  },
  methods: {
    async getScor() {
      this.loader = true
      await axios.get("/api/home/scores").then((result)=>{
        this.scores = result.data
        this.loader = false
      })
    }
  },
  beforeDestroy: function(){
    clearInterval(this.intervalScoresList)
  }
}
</script>