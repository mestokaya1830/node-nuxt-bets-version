<template>
   <div class="pages main-page">
      <aside class="left">
        <details open>
          <summary class="title-2">
            <div>
              <i class="fas fa-futbol fa-lg cl-g"/>
              <span>FUTBOL</span>
            </div>
            <span class="badge bg-g">{{standingsJson.length}}</span>
          </summary>
          <div class="left-menu-con">
            <div class="sblc"><input type="search" @keyup="searchFilter()" v-model="searchBox" class="searchbox-left" placeholder="ara..."></div>
            <div class="left-menu-wrap">
              <details v-for="(list, index) in orderBy(standingsJson, 'country')" :key="index">
                <summary class="title-list" @click="clearCountryName()">
                  <div class="flag-con">
                    <img :src="require(`~/assets/img/${list.country}.png`)" class="fl-flags mr10">
                    <span class="left-menu-links-text">{{list.country}}</span>
                  </div>
                </summary>
                <div class="standings-leags" v-for="(league, index) in list.leagues" :key="index" @click="getStandings(league.url)">
                  <span class="badge bg-y mr10">{{index+1}}</span>
                  <span>{{league.name}}</span>
                </div>
              </details>
              <div class="page-end mt5">Başka veri yoktur</div>
            </div>
          </div>
        </details>
      </aside>
      <aside class="standings-right">
        <details open class="odd-details">
          <summary class="title-2">
            <div class="odd-left-title">
              <span class="leag ml10">{{ countryName }}</span>
            </div>
          </summary>
          <div>
            <header class="standings-title">
              <span class="stand-team-title slt">KULÜPLER</span>
              <span class="stand-o slt">O</span>
              <span class="stand-g slt">G</span>
              <span class="stand-b slt">B</span>
              <span class="stand-m slt">M</span>
              <span class="stand-b slt">A</span>
              <span class="stand-b slt">Y</span>
              <span class="stand-av slt">AV</span>
              <span class="stand-p slt">P</span>
            </header>
              <div v-for="list in standings" :key="list.id">
                <ul class="list standings-list" v-for="(sublist, index) in list.standings.data" :key="index">
                  <li class="stand-no stl"><span class="st-no">{{index + 1}}</span></li>
                  <li class="stand-team stl">{{sublist.team_name}}</li>
                  <li class="stl">{{sublist.overall.games_played}}</li>
                  <li class="stl">{{sublist.overall.won}}</li>
                  <li class="stl">{{sublist.overall.draw}}</li>
                  <li class="stl">{{sublist.overall.lost}}</li>
                  <li class="stl">{{sublist.overall.goals_scored}}</li>
                  <li class="stl">{{sublist.overall.goals_against}}</li>
                  <li class="stl">{{sublist.total.goal_difference}}</li>
                  <li class="stand-p stl"><span class="pt-no">{{sublist.points}}</span></li>
                </ul>
            </div>
          </div>
        </details>
        <preloader v-if="loader" class="loader-con loader-flex"/>
        <div class="page-end"><span class="">Başka veri yoktur</span></div>
      </aside>
  </div>
</template>
<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import preloader from '@/components/preloader'
import standingsjson from '@/standings.json'
export default {
  name: 'Standings',
  mixins: [Vue2Filters.mixin],
  components:{
    preloader
  },
  data () {
    return {
      standingsJson: standingsjson,
      countries: {},
      standings: {},
      search:{},
      countryName: '',
      searchBox: '',
      loader: false
    }
  },
  mounted () {
   
  },
  methods: {
    async getStandings (id) {
      // this.loader = true
      console.log(id)
      // await axios.get("api/home/standings/id").then((result) => {
      //   // this.countries = result.data.data
      //   // this.loader = false
      //   // this.search = result.data.data
      // })
    },
    searchFilter () {
      let searchArray = []
      this.search.forEach(element => {
        if (element.name.toLowerCase().indexOf(this.searchBox.toLowerCase()) > -1) {
          searchArray.push(element)
        }
      })
      this.countries = searchArray
    },
    clearCountryName () {
      // this.countryName = ''
      // this.standings = ''
    }
  }
}
</script>
