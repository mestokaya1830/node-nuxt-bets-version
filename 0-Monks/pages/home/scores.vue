<template>
  <div class="pages">
    <div class="title-2">
      <div class="mr20">
        <i class="fas fa-certificate navbar-icons cl-o" />
        <span>SKORLAR</span>
        <span class="scores-switch" @click="getScores()" :class="{scoresClass: selected == 1}">Canlı</span>
        <span class="scores-switch" @click="getScoresAll()" :class="{scoresClass: selected == 2}">Bitenler</span>
        <i class="fas fa-adjust navbar-icons ml20 cp" @click="leagueOpen =! leagueOpen" title="Aç Kapa"/>
      </div>
      <span class="badge bg-g">{{scoresLength}}</span>
    </div>
    <div class="scores-con po-r">
      <details :open="leagueOpen" class="odd-details" v-for="(list, index) in scores" :key="index">
        <summary class="title-3">
          <span class="flag-con">
            <img :src="getFlags(list[0].league_country_name)" class="mr5">
            <span class="left-menu-links-text">{{list[0].league_country_name}} {{list[0].league_name}}</span>
          </span>
            <span class="badge cl-y">{{list.length}}</span> 
        </summary>
        <div class="scores-list-con">
          <div class="list" v-for="(sublist, index) in list" :key="index" @click="getStatistics($event,sublist)">
            <span class="sci sts">{{ $moment.utc(sublist.time.starting_at.date_time,'YYYY-MM-DD HH:mm').format('HH:mm')}}</span>
             <span class="sci hs">{{sublist.scores.ht_score}}</span>
            <span class="sci lt">{{sublist.localTeam}}</span>
           <div class="scsc">
              <span class="sci sc">{{sublist.scores.localteam_score}}</span>
              <span class="sci em">-</span>
              <span class="sci sc">{{sublist.scores.visitorteam_score}}</span>
            </div>
            <span class="sci at">{{sublist.visitorTeam}}</span>
            <span class="sci cl-g">{{sublist.time.minute}}</span>
            <span class="sci cl-r status">{{sublist.time.status}}</span> 
          </div>
        </div>
      </details>
        <div v-if="statistics" class="stats" :style="{top:top}" :class="{opacityClass: statistics}">
          <header class="suboptions-header ssoh">
            <i class="fas fas fa-window-close sub-close cp" @click="closeStatistics()"></i>
          </header>
          <div class="stats-con">
            <div class="stats-header">
              <span class="scdt">{{statisticsInfo.localTeam}}</span>
              <span class="lchi lchi-flags">{{statisticsInfo.scores.localteam_score}} - {{statisticsInfo.scores.visitorteam_score}}</span>
              <span class="scdt">{{statisticsInfo.visitorTeam}}</span>
            </div>
            <div v-if="statisticsInfo.goals.data.length > 0" class="live-statistic scors-statistic">
              <div class="statistic-title">GOLLER</div>
              <div v-for="(sublistgoals, index) in statisticsInfo.goals.data" :key="index"  class="statistic-list">
                <span class="sep">{{sublistgoals.player_name}}</span>
                <span>{{sublistgoals.minute}} dk</span>
                <span>{{sublistgoals.result}}</span>
              </div>
            </div>
          </div>
          <footer class="stats-footer"></footer>
        </div>
         <span class="page-end">Başka veri yoktur</span>
    </div>
    <preloader v-if="loader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import preloader from '@/components/preloader.vue'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Scores',
  components: {
    preloader
  },
  data () {
    return {
      scores: {},
      statisticsInfo: {},
      statistics: false,
      scoresLength: 0,
      searchBox: '',
      dateStart: '',
      loader: false,
      leagueOpen:true,
      selected: false,
      top: 0
    }
  },
  mounted () {
    this.getScores()
  },
  methods: {
    searchBoxClear () {
      this.searchBox = ''
    },
    async getScores() {
      this.loader = true
      await axios.get("https://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&tz=Europe/Istanbul&include=league.country,localTeam,visitorTeam,goals&prevent_pagination=1").then((result) => {
        let newresult = result.data.data.filter(item => item.time.status === 'LIVE')
        let storearray = newresult.map(item => {
          return{
            id:item['id'],
            league_id:item['league_id'],
            scores:item['scores'],
            time:item['time'],
            localTeam:item['localTeam'].data.name,
            visitorTeam:item['visitorTeam'].data.name,
            localTeam_logo:item['localTeam'].data.logo_path,
            visitorTeam_logo:item['visitorTeam'].data.logo_path,
            goals:item['goals'],
            league_name:item['league'].data.name,
            league_country_id:item['league'].data.country.data.id,
            league_country_name:item['league'].data.country.data.name
          }
        })
        this.scores = _.groupBy(storearray, 'league_id')
        this.scoresLength = storearray.length
        this.transCountry(storearray)
        this.loader = false
        this.selected = 1
      })
    },
    async getScoresAll() {
      this.loader = true
      await axios.get("/api/home/scores").then((result) => {
        this.scores = _.groupBy(result.data, 'league_id')
        this.scoresLength = result.data.length
        this.transCountry(result.data)
        this.loader = false
        this.selected = 2
      })
    },
    transCountry (value) {
      value.forEach(item => {
          let countryname = item.league_country_name
            .replace('Algeria','Cezayir')
            .replace('N/C America','Amerika')
            .replace('Armenia','Ermenistan')
            .replace('Argentina','Arjantin')
            .replace('Albania','Arnavutluk')
            .replace('Africa','Afrika')
            .replace('Australia','Avusturalya')
            .replace('Avusturalya & Oceania','Avusturalya')
            .replace('Austria','Avusturya')
            .replace('Azerbaijan','Azerbaycan')
            .replace('Belarus','Beyaz Rusya')
            .replace('Bolivia','Bolivya')
            .replace('Bosnia and Herzegovina','Bosna Hersek')
            .replace('Brazil','Brezilya')
            .replace('Bulgaria','Bulgaristan')
            .replace('Canada','Kanada')
            .replace('Cameroon','Kamerun')
            .replace('Cape Verde','Fildişi Sahili')
            .replace("Côte d'Ivoire",'Fildişi Sahili')
            .replace('Colombia','Kolombiya')
            .replace('China','Çin')
            .replace('Cambodia','Kamboçya')
            .replace('Chile','Şili')
            .replace('Costa Rica','Kosta Rika')
            .replace('Cyprus','Kıbrıs')
            .replace('Croatia','Hırvatistan')
            .replace('Czech Republic','Cek Cumhuriyeti')
            .replace('Belgium','Belçika')
            .replace('Denmark','Danimarka')
            .replace('Dominican Republic','Dominik Cumhuriyeti')
            .replace('DR Congo','Kongo')
            .replace('Ecuador','Ekvator')
            .replace('Egypt','Mısır')
            .replace('England','ingiltere')
            .replace('Estonia','Estonya')
            .replace('Ethiopia','Etyopya')
            .replace('Europe','Avrupa')
            .replace('France','Fransa')
            .replace('Faroe Islands','Faroe Adaları')
            .replace('FYR of Macedonia','Makedonya')
            .replace('Georgia','Gürcistan')
            .replace('Germany','Almanya')
            .replace('Ghana','Gana')
            .replace('Greece','Yunanistan')
            .replace('Hungary','Macaristan')
            .replace('Italy','italya')
            .replace('Iceland','Izlanda')
            .replace('India','Hindistan')
            .replace('Indonesia','Endenozya')
            .replace('International','Uluslararası')
            .replace('Iraq','Irak')
            .replace('Iran','Iran')
            .replace('Ireland','irlanda')
            .replace('Israel','israil')
            .replace('Ivory Coast','Fildişi Sahili')
            .replace('Japan','Japonya')
            .replace('Jordan','Urdün')
            .replace('Kazakhstan','Kazakistan')
            .replace('Korea Republic','Kore Cumhuriyeti')
            .replace('Kosovo','Kosova')
            .replace('Kongo','Kongo Cumhuriyeti')
            .replace('Kyrgyzstan','Kırgızistan')
            .replace('Latvia','Letonya')
            .replace('Lebanon','Lübnan')
            .replace('Lithuania','Litvanya')
            .replace('Malaysia','Malezya')
            .replace('Mauritania','Marutanya')
            .replace('Mexico','Meksika')
            .replace('Moldova','Moldovya')
            .replace('Morocco','Fas')
            .replace('Maldives','Maldivler')
            .replace('Netherlands','Hollanda')
            .replace('New Caledonia','Yeni Kaledonya')
            .replace('New Zealand','Yeni Zellanda')
            .replace('Northern irlanda','Kuzey irlanda')
            .replace('North & Central America','Amerika')
            .replace('Nigeria','Nijerya')
            .replace('Norway','Norveç')
            .replace('Nicaragua','Nikaraguay')
            .replace('Oman','Umman')
            .replace('Qatar','Katar')
            .replace('Poland','Polonya')
            .replace('Portugal','Portekiz')
            .replace('Republic of Irlanda','irlanda')
            .replace('Republic of the Congo','Kongo Cumhuriyeti')
            .replace('Russia','Rusya')
            .replace('Romania','Romanya')
            .replace('Réunion','Reunion')
            .replace('Saudi Arabia','Sudi Arabistan')
            .replace('Turkey','Türkiye')
            .replace('Seychelles','Seyşeller')
            .replace('Switzerland','isviçre')
            .replace('Spain','ispanya')
            .replace('Sweden','isveç')
            .replace('South Korea','Güney Kore')
            .replace('South Afrika','Güney Afrika')
            .replace('South America','Güney Amerika')
            .replace('Slovakia','Slovakya')
            .replace('Serbia','Sırbistan')
            .replace('Scotland','iskoçya')
            .replace('Syria','Suriye')
            .replace('Tanzania','Tanzanya')
            .replace('Tajikistan','Tacikistan')
            .replace('Thailand','Tayland')
            .replace('Tunisia','Tunus')
            .replace('Ukraine','Ukrayna')
            .replace('United Arab Emirates','Birleşik Arap Emirlikleri')
            .replace('Wales','Galler')
            .replace('World','Dünya')
          item.league_country_name = countryname
            
          setTimeout(() => {
            let status = item.time.status
            .replace('FT','Bitti')
            .replace('HT','Devre')
            .replace('POSTP','Ert')
            .replace('LIVE','Canlı')
            .replace('PEN_LİVE','PEN')
            .replace('BREAK','Ara')
            .replace('NS','Başlamadı')
            .replace('ET','Uzatma')
            .replace('Enf','İptal')
            .replace('CANCL','İptal')
            .replace('INT','Kesildi')
            .replace('TBA','Yenileme')
            item.time.status = status
          }, 500)
        })
    },
    getStatistics (event,value) {
      this.statistics = true
      this.statisticsInfo = value
      this.top = 0
      this.top = (event.pageY - 420)+ 'px'
    },
    closeStatistics () {
      this.statistics = false
    },
    getFlags (flags) {
      try {
        return require(`~/assets/img/${flags}.png`)
      } catch (error) {
        return require(`~/assets/img/Dünya.png`)
      }
    }
  }
}
</script>
