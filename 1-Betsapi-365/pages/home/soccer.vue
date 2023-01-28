<template>
  <div class="pages main-page">
    <aside class="odd-center">
      <div class="title-2 soccer-title" id="content">
        <div class="filter-con">
          <i class="fas fa-futbol navbar-icons cl-f ml10"/>FUTBOL
          <input type="search" v-model="searchBox" class="searchbox-left searchbox-soccer" @keyup="searchFilter" placeholder="ara...">
          <select v-model="timeBox" class="selectbox1 sct ml20" @change="filterAsTime()">
            <option value="Saat" disabled>Saat</option>
            <option value="all">Hepsi</option>
            <option :value="$moment().add(1,'hours').format('YYYY-MM-DD HH:mm')">1 Saat Sonra</option>
            <option :value="$moment().add(3,'hours').format('YYYY-MM-DD HH:mm')">3 Saat Sonra</option>
            <option :value="$moment().add(6,'hours').format('YYYY-MM-DD HH:mm')">6 Saat Sonra</option>
          </select>
          <select v-model="dateBox" class="selectbox1 ml20" @change="filterAsDate()">
            <option value="Tarih" disabled>Tarih</option>
            <option value="all">Hepsi</option>
            <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
            <option :value="$moment().add(1,'days').format('YYYY-MM-DD')">Yarın</option>
          </select>
          <i class="fas fa-globe fa-lg ml10 cp cl-f" @click="resetFav()"/>
        </div>
        <i class="fas fa-adjust navbar-icons ml20 cp" @click="leagueOpen =! leagueOpen" title="Aç Kapa"/>
        <span class="badge bg-f mr10 ml10">{{leaguesLength}}</span>
      </div>
      <div class="left-con">
        <details :open="leagueOpen" class="odd-details cp" v-for="(list, index) in leagues" :key="index">
          <summary class="title-3 odd-title-3">
            <div class="odd-left-title">
              <span class="flag-con">
                <img :src="getFlags(list[0].league.name.replace(/ .*/,''))" class="mr5">
                <span class="leag ml10">{{list[0].league.name}}</span>
              </span>
            </div>
            <div class="odd-right-title">
              <span class="ottli-title">1</span>
              <span class="ottli-title">0</span>
              <span class="ottli-title">2</span>
              <span class="ottli-title">Alt</span>
              <span class="ottli-title">Üst</span>
              <span class="ottli-title ottli-last cl-y">{{list.length}}</span>
            </div>
          </summary>
          <div class="list list-soccer" v-for="(sublist, index) in list" :key="index">
            <div class="odd-left-list">
              <span class="blli code"><span class="badge bg-f">{{sublist.id | getCode}}</span></span>
              <span class="blli date">{{$moment.unix(sublist.time).format('MM-DD')}}</span>
              <span class="blli time">{{$moment.unix(sublist.time).format('HH:mm')}}</span>
              <span class="blli matches">{{ sublist.home.name }} - {{ sublist.away.name }}</span>
            </div>
           <div class="odd-right-list">

           </div>
          </div>
        </details>
        <notfound v-if="notfound" :message="notfound" class="not-found"/>
        <div class="page-end mt5"><span>Başka veri yoktur</span></div>
      </div>
    </aside>
    <!-- <div class="center">
      <div class="title-2">
        <span class="odds-title"><i class="fas fa-futbol cl-f navbar-icons"/>FUTBOL</span>
      </div>
      <div class="center-con">
        <div v-if="options" class="center-bet">
          <div class="options">
            <header class="options-header">
              <span class="mr10">{{homeTeam}}</span> - <span class="ml10">{{awayTeam}}</span>
            </header>
            <div class="suboptions-con">
              <ul class="tab-container">
                <li class="nav-item bg-f">
                  <a class="nav-link" @click.prevent="setActive('fulltime')" :class="{ active: isActive('fulltime') }" href="#fulltime">Maç Sonu</a>
                  <a class="nav-link" @click.prevent="setActive('firsthalf')" :class="{ active: isActive('firsthalf') }" href="#firsthalf">1.Yarı</a>
                  <a class="nav-link" @click.prevent="setActive('secondhalf')" :class="{ active: isActive('secondhalf') }" href="#secondhalf">2.Yarı</a>
                  <a class="nav-link" @click.prevent="setActive('goals')" :class="{ active: isActive('goals') }" href="#goals">Goller</a>
                  <a class="nav-link" @click.prevent="setActive('homeaway')" :class="{ active: isActive('homeaway') }" href="#homeaway">Ev/Dep</a>
                  <a class="nav-link" @click.prevent="setActive('corners')" :class="{ active: isActive('corners') }" href="#corners">Kornerler</a>
                  <i class="fas fa-adjust navbar-icons ml20 cp" @click="marketOpen = ! marketOpen" title="Aç Kapa"/>
                </li>
              </ul>
              <div class="tab-pane" :class="{ activeshow: isActive('fulltime') }" id="fulltime">
                <details :open="marketOpen" v-for="(oddlist, key, index) in fullTime[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'Maç Sonu'
                      || key === 'Çifte Şans'
                      || key === 'Handikap Sonucu'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" :class="{ activeshow: isActive('firsthalf') }" id="firsthalf">
                <details :open="marketOpen" v-for="(oddlist, key, index) in firstHalf[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'İlk Yarı Sonucu'
                      || key === 'İlk Yarı Çifte Şans'
                      || key === 'İlk Yarı Handikap'
                      || key === 'İlk Yarı Kornerler',
                      liveClassFull: key === 'İlk Yarı/Maç Sonu'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" :class="{ activeshow: isActive('secondhalf') }" id="secondhalf">
                <details :open="marketOpen" v-for="(oddlist, key, index) in secondHalf[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'İkinci Yarı Sonucu'
                      || key === 'Hangi Yarı Daha Çok Gol Olur'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" :class="{ activeshow: isActive('goals') }" id="goals">
                <details :open="marketOpen" v-for="(oddlist, key, index) in goals[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'Son Golü Hangi Takım Atar'
                      || key === 'İlk Golü Hangi Takım Atar'
                      || key === 'Hangi Yarı Daha Çok Gol Olur'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" :class="{ activeshow: isActive('homeaway') }" id="homeaway">
                <details :open="marketOpen" v-for="(oddlist, key, index) in homeAway[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'Evsahibi Hangi Devre Çok Gol Atar'
                      || key === 'Deplasman Hangi Devre Çok Gol Atar'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" :class="{ activeshow: isActive('corners') }" id="corners">
                <details :open="marketOpen" v-for="(oddlist, key, index) in corners[0]" :key="index" v-if="oddlist !== undefined">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-f mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{
                      liveClass3: key === 'Kornerler 3 lü'
                      || key === 'Handikap Kornerler'
                      || key === 'Maç Bahisi Kornerler'
                      || key === 'İlk Yarı Kornerler'
                      }">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds | convertOdd($store.state.auth)}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
            </div>
            <footer class="suboptions-footer"></footer>
          </div> 
          <preloader v-if="loader" class="loader-con"/>
        </div>
        <div v-else class="center-no-bet">
          <h3>Henüz Bir Karşılaşma Seçmediniz..</h3>
        </div>
      </div>
    </div> -->
    <preloader v-if="loader" class="loader-con"/>
    <aside class="right-side">
      <slipside class="slip-side" :branchimage="branchimage" :leaguesarray="leaguesArray"/>
      <div class="favorite-leags">
        <details class="left-details cp" v-for="(list, index) in favorites" :key="index">
          <summary class="title-3 fav-title" @click="getFav(list[0].league.id)">
            <div class="left-title">
              <span class="flag-con">
                <img :src="getFlags(list[0].league.name.replace(/ .*/,''))" class="fav-flags">
                <span class="leag ml10">{{list[0].league.name}}</span>
              </span>
            </div>
          </summary>
        </details>
      </div>
    </aside>
  </div>
</template>
<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import slipside from '@/components/slipside'
import notfound from '@/components/notfound'
import preloader from '@/components/preloader'
import leaguesjson from '@/soccer.json'
import moment from 'moment'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Odd',
  components: {
    slipside,
    notfound,
    preloader
  },
  data () {
    return {
      leaguesJson:leaguesjson,
      leagues: {},
      favorites: {},
      leaguesArray: [],
      odds: {},
      search:{},
      fullTime: [],
      firstHalf: [],
      secondHalf: [],
      corners: [],
      goals: [],
      homeAway: [],
      homeTeam:'',
      awayTeam:'',
      leaguesLength: 0,
      slips: [],
      searchBox: '',
      sportBox: 1,
      timeBox: 'Saat',
      dateBox: 'Tarih',
      options: false,
      notfound: '',
      dateOdd: moment().format("YYYY-MM-DD"),
      loader: false,
      activeItem: 'all',
      index:'',
      transArray: {},
      subSlip: false,
      allDone: false,
      branchimage: 'futbol',
      branch: 'Futbol',
      slips: {},
      leagueOpen:false,
      marketOpen:false,
      sublistId: 0
    }
  },
  mounted () {
    this.getLeagues()
  },
  filters:{
    getCode(value){
      return value.toString().slice(-3)
    },
    convertOdd (value, store) {
      if (store.role === 'U1' && store.rate !== '0') {
        if (value !== undefined) {
          if (store.operate === 'minus') {
            return (value - store.rate).toFixed(2)
          } else if(store.operate === 'adding'){
            return (value + parseFloat(store.rate)).toFixed(2)
          }
        }
      }else{
        return value
      }
    }
  },
  methods: {
    getFlags (flags) {
      try {
        return require(`~/assets/img/${flags}.png`)
      } catch (error) {
        return require(`~/assets/img/Dünya.png`)
      }
    },
    async getLeagues () {
      let temp = []
      this.loader = true
      let start = moment().format('YYYY-MM-DD HH:mm')
      let end = moment().add(2, 'days').format('YYYY-MM-DD HH:mm')
      this.leaguesJson.forEach(item => {
        item.results.forEach(item2 => {
          if (moment.unix(item2.time).format('YYYY-MM-DD HH:mm') > start && moment.unix(item2.time).format('YYYY-MM-DD HH:mm') < end) {
            this.leaguesArray.push(item2)
          }
        })
      })
      var newleagues = {}
      setTimeout(() => {
        if (this.$store.state.auth.role === 'U1') {
          if (this.$store.state.leaguesid.length > 0) {
            newleagues = this.leaguesArray.filter(item1 => 
           !this.$store.state.leaguesid[0].some(item2 => (item2.id.toString() === item1.league.id)))
          }else{
            newleagues = this.leaguesArray
          }
        } else {
          newleagues = this.leaguesArray
        }
        this.leagues = _.groupBy(newleagues, 'league.id')
        this.search = newleagues
        this.leaguesLength = newleagues.length
        this.loader = false
        window.scrollTo(500, 0)
        this.transCountry (newleagues)
        this.leaguesArray.forEach(item => {
          if (item.league.id === "10041077" 
            || item.league.id === "10041282"
            || item.league.id === "10041315"
            || item.league.id === "10041095"
            || item.league.id === "10041110"
            || item.league.id === "10041100"
            || item.league.id === "10042035"
            || item.league.id === "10041391"
          ) {
            temp.push(item)
          }
        })
        this.favorites = _.groupBy(temp, 'league.name')
        this.loader = false
      }, 300)
    },
    async getOdds (sublist) {
      this.setActive ('fulltime')
      this.loader = true
      this.sublistId = sublist.id
      await axios.get(`/api/home/prematchodds/${sublist.id}`).then((result) =>{
        this.loader = false
        this.options = true
        this.homeTeam = sublist.home.name
        this.awayTeam = sublist.away.name
        let mainodds = []
        result.data.results.forEach(item => {
          if (item.corners) {
            mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp,...item.corners.sp})
          } else {
            mainodds.push({...item.main.sp, ...item.half.sp,...item.goals.sp})
          }
        })
        let newodds = ''
        let test = []
        if (this.$store.state.auth.role === 'U1') {
          if (this.$store.state.marketsname.length > 0) {
            this.transMarket(mainodds)
            let st = this.$store.state.marketsname[0]
            for (const key in mainodds[0]) {
              for (const key2 in st) {
                delete mainodds[0][st[key2].name]
              }
            }
            newodds = mainodds
         }else{
            newodds = mainodds
          }
        }else{
          newodds = mainodds
        }
        this.deleteMarket(newodds)
        this.transMarket(newodds)
        this.transHeader(newodds)
        this.getFullTime()
        this.getFirstHalf()
        this.getSecondHalf()
        this.getGoals()
        this.getHomeAway()
        this.getCorners()
        this.goTop()
      })
    },
    getFav (id) {
      let test = []
      this.leaguesArray.forEach(item => {
        if (item.league.id === id) {
          test.push(item)
        }
      })
      this.leagues = _.groupBy(test, 'league.id')
    },
    resetFav(){
      this.leagues = _.groupBy(this.leaguesArray, 'league.id')
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    getTotalRate () {
      this.totalRate *= this.slips[0].rate
      this.totalRate =  this.totalRate
    },
    closeSubOption() {
      this.subOptions = false
    },
    transCountry (value) {
       value.forEach(element => {
          let leaguenames = element.league.name
          .replace('South East Asyan Games','Asya Oyunları')
          .replace('Womens','Kadınlar')
          .replace('Women','Kadınlar')
          .replace('Algeria','Cezayir')
          .replace('Asia','Asya')
          .replace('Friendlies','Dostluk Maçları')
          .replace('Cuba','Küba')
          .replace('Cup','Kupası')
          .replace('Championship',' Şampiyonlar Ligi')
          .replace('League','Ligi')
          .replace('Armenia','Ermenistan')
          .replace('Argentina','Arjantin')
          .replace('Albania','Arnavutluk')
          .replace('Africa','Afrika')
          .replace('U23 Afrika','Afrika U23')
          .replace('Australia','Avusturalya')
          .replace('Avusturalya & Oceania','Avusturalya')
          .replace('Austria','Avusturya')
          .replace('Avrupapa','Avrupa')
          .replace('Azerbaijan','Azerbaycan')
          .replace('Belarus','Rusya Beyaz')
          .replace('Bolivia','Bolivya')
          .replace('Bosnia','Bosna Hersek')
          .replace('Brazil','Brezilya')
          .replace('Brezilyaian','Brezilya')
          .replace('Bulgaria','Bulgaristan')
          .replace('Canada','Kanada')
          .replace('Cameroon','Kamerun')
          .replace('Cape Verde','Fildişi Sahili')
          .replace("Côte d'Ivoire",'Fildişi Sahili')
          .replace('Colombia','Kolombiya')
          .replace('China','Çin')
          .replace('Cambodia','Kamboçya')
          .replace('Champions','Şampiyonlar')
          .replace('Chile','Şili')
          .replace('Costa Rica','Kosta Rika')
          .replace('Cyprus','Kıbrıs')
          .replace('Croatia','Hırvatistan')
          .replace('Czech Republic','Çek Cumhuriyeti')
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
          .replace('Gulf','Papua')
          .replace('Hungary','Macaristan')
          .replace('Italy','italya')
          .replace('Iceland','izlanda')
          .replace('India','Hindistan')
          .replace('Indonesia','Endenozya')
          .replace('International','Uluslararası')
          .replace('Republic of Ireland','irlanda Cum')
          .replace('Iraq','Irak')
          .replace('Iran','iran')
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
          .replace('Macedonia','Makedonya')
          .replace('Malaysia','Malezya')
          .replace('Mauritania','Marutanya')
          .replace('Mexico','Meksika')
          .replace('Moldova','Moldovya')
          .replace('Morocco','Fas')
          .replace('Maldives','Maldivler')
          .replace('Netherlands','Hollanda')
          .replace('Holland','Hollanda')
          .replace('Hollandaaa','Hollanda')
          .replace('Nigeria','Nijerya')
          .replace('New Caledonia','Yeni Kaledonya')
          .replace('New Zealand','Yeni Zellanda')
          .replace('Northern irlanda','irlanda Kuzey')
          .replace('North & Central America','Amerika')
          .replace('Norway','Norveç')
          .replace('Nicaragua','Nikaraguay')
          .replace('Oman','Umman')
          .replace('Qatar','Katar')
          .replace('Poland','Polonya')
          .replace('Palestine','Filistin')
          .replace('Philippines','Filipinler')
          .replace('Portugal','Portekiz')
          .replace('Republic of the Congo','Kongo Cumhuriyeti')
          .replace('Russia','Rusya')
          .replace('Romania','Romanya')
          .replace('Réunion','Reunion')
          .replace('Saudi Arabia','Sudi Arabistan')
          .replace('Turkey','Türkiye')
          .replace('Seychelles','Seyşeller')
          .replace('Switzerland','isviçre')
          .replace('Spain','ispanya')
          .replace('Spain Copa del Rey','ispanya Kral Kupası')
          .replace('Sweden','isveç')
          .replace('South Korea','Kore Güney')
          .replace('South Afrika','Afrika Güney')
          .replace('South America','Amerika Güney')
          .replace('Slovakia','Slovakya')
          .replace('Serbia','Sırbistan')
          .replace('Scotland','iskoçya')
          .replace('Syria','Suriye')
          .replace('Tanzania','Tanzanya')
          .replace('Tajikistan','Tacikistan')
          .replace('Thailand','Tayland')
          .replace('Taiwan','Tayvand')
          .replace('Tunisia','Tunus')
          .replace('Ukraine','Ukrayna')
          .replace('United Arab Emirates','Birleşik Arap Emirlikleri')
          .replace('UAE','Birleşik Arap Emirlikleri')
          .replace('Wales','Galler')
          .replace('World','Dünya')
          .replace('Womens','Kadınlar')
          .replace('Euro','Avrupa')
          .replace('Qualifying','Elemeleri')
          .replace('USA','Amerika')
          .replace('CONCACAF','Amerika Karayipler')
          .replace('Ermenistann','Ermenistan')
          .replace('Kupa Peru','Peru')
          .replace('Matches','Maçları')
          .replace('Lancashire','ingiltere')
          .replace('Kupa Sudamericana','Amerika Suda Kupasi')
          .replace('Basketball Champions Ligi Americas','Amerika Şampiyonlar Ligi')
          .replace('UEFA Şampiyonlar Ligi','UEFA Şampiyonlar Ligi')
          element.league.name = leaguenames
        })
    },
    deleteMarket(value){
      this.odds = value.map(function(item) {
        if (item['1st_half_scorecast']) {
          delete item['1st_half_scorecast']
        }
        if (item['multi_scorers']) {
          delete item['multi_scorers']
        }
        if (item['scorecast']) {
          delete item['scorecast']
        }
        if (item['timecast']) {
          delete item['timecast']
        }
        if (item['late_goal']) {
          delete item['late_goal']
        }
        if (item['wincast']) {
          delete item['wincast']
        }
        if (item['anytime_scorecast']) {
          delete item['anytime_scorecast']
        }
        if (item['goalscorers']) {
          delete item['goalscorers']
        }
        if (item['total_goal_minutes']) {
          delete item['total_goal_minutes']
        }
        if (item['early_goal']) {
          delete item['early_goal']
        }
        if (item['half_time_full_time_correct_score']) {
          delete item['half_time_full_time_correct_score']
        }
        if (item['clean_sheet']) {
          delete item['clean_sheet']
        }
        if (item['first_10_minutes_(00:00_09:59)']) {
          delete item['first_10_minutes_(00:00_09:59)']
        }
         if (item['asian_total_corners']) {
          delete item['asian_total_corners']
        }
        if (item['corner_handicap']) {
          delete item['corner_handicap']
        }
        if (item['corners_race']) {
          delete item['corners_race']
        }
        if (item['first_10_minutes_(00:00_09:59)']) {
          delete item['first_10_minutes_(00:00_09:59)']
        }
        if (item['1st_half_asian_corners']) {
          delete item['1st_half_asian_corners']
        }
        if (item['alternative_corners']) {
          delete item['alternative_corners']
        }
        if (item['asian_handicap_corners']) {
          delete item['asian_handicap_corners']
        }
        if (item['multicorners']) {
          delete item['multicorners']
        }
        if (item['team_corners']) {
          delete item['team_corners']
        }
        if (item['time_of_first_corner']) {
          delete item['time_of_first_corner']
        }
        if (item['corner_match_bet']) {
          delete item['corner_match_bet']
        }
         if (item['number_of_goals_in_match']) {
          delete item['number_of_goals_in_match']
        }
        if (item['exact_total_goals_(bands)']) {
          delete item['exact_total_goals_(bands)']
        }
        if (item['total_goals_both_teams_to_score']) {
          delete item['total_goals_both_teams_to_score']
        }
        if (item['team_total_goals']) {
          delete item['team_total_goals']
        }
        if (item['time_of_1st_team_goal']) {
          delete item['time_of_1st_team_goal']
        }
        return item
      })
    },
    transMarket(value){
      this.odds = value.map(function(item) {
        if (item['full_time_result']) {
          item['Maç Sonu'] = item['full_time_result']
          delete item['full_time_result']
        }
        if (item['result_total_goals']) {
          item['Maç Sonu ve Alt/Üst'] = item['result_total_goals']
          delete item['result_total_goals']
        }
        if (item['draw_no_bet']) {
          item['Beraberlikte İade'] = item['draw_no_bet']
          delete item['draw_no_bet']
        }
        if (item['double_chance']) {
          item['Çifte Şans'] = item['double_chance']
          delete item['double_chance']
        }
        if (item['result_both_teams_to_score']) {
          item['Karşılıklı Gol ve Maç Sonu'] = item['result_both_teams_to_score']
          delete item['result_both_teams_to_score']
        }
        if (item['handicap_result']) {
          item['Handikap Sonucu'] = item['handicap_result']
          delete item['handicap_result']
        }
        if (item['alternative_handicap_result']) {
          item['Alternatif Handikap Sonucu'] = item['alternative_handicap_result']
          delete item['alternative_handicap_result']
        }
        if (item['half_time_result']) {
          item['İlk Yarı Sonucu'] = item['half_time_result']
          delete item['half_time_result']
        }
        if (item['half_time_result_total_goals']) {
          item['İlk Yarı Sonucu ve Alt/Üst'] = item['half_time_result_total_goals']
          delete item['half_time_result_total_goals']
        }
        if (item['half_time_full_time']) {
          item['İlk Yarı/Maç Sonu'] = item['half_time_full_time']
          delete item['half_time_full_time']
        }
        if (item['half_time_double_chance']) {
          item['İlk Yarı Çifte Şans'] = item['half_time_double_chance']
          delete item['half_time_double_chance']
        }
        if (item['half_time_correct_score']) {
          item['İlk Yarı Kesin Skor'] = item['half_time_correct_score']
          delete item['half_time_correct_score']
        }
        if (item['1st_half_goals_odd_even']) {
          item['İlk Yarı Tek/Çift'] = item['1st_half_goals_odd_even']
          delete item['1st_half_goals_odd_even']
        }
        if (item['first_half_goals']) {
          item['İlk Yarı Toplam Alt/Üst'] = item['first_half_goals']
          delete item['first_half_goals']
        }
         if (item['exact_1st_half_goals']) {
          item['İlk Yarı Kesin Gol Sayısı'] = item['exact_1st_half_goals']
          delete item['exact_1st_half_goals']
        }
        if (item['half_time_result_both_teams_to_score']) {
          item['İlk Yarı Sonucu/Her İki Takım Gol'] = item['half_time_result_both_teams_to_score']
          delete item['half_time_result_both_teams_to_score']
        }
         if (item['both_teams_to_score_in_1st_half']) {
          item['İlk Yarı İki Takım da Gol Atarmı'] = item['both_teams_to_score_in_1st_half']
          delete item['both_teams_to_score_in_1st_half']
        }
        if (item['first_half_corners']) {
          item['İlk Yarı Kornerler'] = item['first_half_corners']
          delete item['first_half_corners']
        }
        if (item['1st_half_handicap']) {
          item['İlk Yarı Handikap'] = item['1st_half_handicap']
          delete item['1st_half_handicap']
        }
        if (item['alternative_1st_half_handicap_result']) {
          item['İlk Yarı Alternatif Handikap'] = item['alternative_1st_half_handicap_result']
          delete item['alternative_1st_half_handicap_result']
        }

        if (item['exact_2nd_half_goals']) {
          item['İkinci Yarı Kesin Gol Sayısı'] = item['exact_2nd_half_goals']
          delete item['exact_2nd_half_goals']
        }
        if (item['2nd_half_result']) {
          item['İkinci Yarı Sonucu'] = item['2nd_half_result']
          delete item['2nd_half_result']
        }
        if (item['2nd_half_goals']) {
          item['İkinci Yarı Toplam Alt/Üst'] = item['2nd_half_goals']
          delete item['2nd_half_goals']
        }
        if (item['2nd_half_goals']) {
          item['İkinci Yarı Alt/Üst'] = item['2nd_half_goals']
          delete item['2nd_half_goals']
        }
        if (item['2nd_half_goals_odd_even']) {
          item['İkinci Yarı Tek/Çift'] = item['2nd_half_goals_odd_even']
          delete item['2nd_half_goals_odd_even']
        }
        
        if (item['exact_2nd_half_goals']) {
          item['İkinci Yarı Gol Sayısı'] = item['exact_2nd_half_goals']
          delete item['exact_2nd_half_goals']
        }
      
        if (item['both_teams_to_score_in_2nd_half']) {
          item['İkinci Yarı İki Takım da Gol Atarmı'] = item['both_teams_to_score_in_2nd_half']
          delete item['both_teams_to_score_in_2nd_half']
        }
        if (item['goals_over_under']) {
          item['Toplam Alt/Üst 2.5'] = item['goals_over_under']
          delete item['goals_over_under']
        }
        if (item['alternative_total_goals']) {
          item['Toplam Gol Alt/Üst'] = item['alternative_total_goals']
          delete item['alternative_total_goals']
        }
        if (item['goals_odd_even']) {
          item['Tek/Çift'] = item['goals_odd_even']
          delete item['goals_odd_even']
        }
        if (item['both_teams_to_score']) {
          item['İki Takım da Gol Atarmı'] = item['both_teams_to_score']
          delete item['both_teams_to_score']
        }
        if (item['teams_to_score']) {
          item['Hangi Takım Gol Atar'] = item['teams_to_score']
          delete item['teams_to_score']
        }
        if (item['half_with_most_goals']) {
          item['Hangi Yarı Daha Çok Gol Olur'] = item['half_with_most_goals']
          delete item['half_with_most_goals']
        }
        if (item['correct_score']) {
          item['Kesin Skor'] = item['correct_score']
          delete item['correct_score']
        }
        if (item['winning_margin']) {
          item['Kazanma Aralığı'] = item['winning_margin']
          delete item['winning_margin']
        }
        if (item['first_team_to_score']) {
          item['İlk Golü Hangi Takım Atar'] = item['first_team_to_score']
          delete item['first_team_to_score']
        }
        if (item['last_team_to_score']) {
          item['Son Golü Hangi Takım Atar'] = item['last_team_to_score']
          delete item['last_team_to_score']
        }
        if (item['half_with_most_goals']) {
          item['Hangi Yarı Daha Çok Gol Olur'] = item['half_with_most_goals']
          delete item['half_with_most_goals']
        }
        if (item['both_teams_to_score_1st_half_2nd_half']) {
          item['İlk Yarı/İkinci Yarı Her İki Takım Gol'] = item['both_teams_to_score_1st_half_2nd_half']
          delete item['both_teams_to_score_1st_half_2nd_half']
        }
         if (item['home_team_odd_even_goals']) {
          item['Evsahibi Tek/Çift'] = item['home_team_odd_even_goals']
          delete item['home_team_odd_even_goals']
        }
        if (item['home_team_exact_goals']) {
          item['Evsahibi Kesin Gol Sayısı'] = item['home_team_exact_goals']
          delete item['home_team_exact_goals']
        }
        if (item['home_team_highest_scoring_half']) {
          item['Evsahibi Hangi Devre Çok Gol Atar'] = item['home_team_highest_scoring_half']
          delete item['home_team_highest_scoring_half']
        }
        if (item['away_team_odd_even_goals']) {
          item['Deplasman Tek/Çift'] = item['away_team_odd_even_goals']
          delete item['away_team_odd_even_goals']
        }
        if (item['away_team_exact_goals']) {
          item['Deplasman Kesin Gol Sayısı'] = item['away_team_exact_goals']
          delete item['away_team_exact_goals']
        }
        if (item['away_team_highest_scoring_half']) {
          item['Deplasman Hangi Devre Çok Gol Atar'] = item['away_team_highest_scoring_half']
          delete item['away_team_highest_scoring_half']
        }
        if (item['total_corners']) {
          item['Toplam Kornerler'] = item['total_corners']
          delete item['total_corners']
        }
        if (item['corners']) {
          item['Kornerler 3 lü'] = item['corners']
          delete item['corners']
        }
        if (item['corners_2_way']) {
          item['Kornerler 2 li'] = item['corners_2_way']
          delete item['corners_2_way']
        }
        if (item['first_match_corner']) {
          item['İlk Korner'] = item['first_match_corner']
          delete item['first_match_corner']
        }
        if (item['last_match_corner']) {
          item['Son Korner'] = item['last_match_corner']
          delete item['last_match_corner']
        }
        if (item['first_half_corners']) {
          item['İlk Yarı Kornerler'] = item['first_half_corners']
          delete item['first_half_corners']
        }
        return item
      })
    },
    transHeader(value){
      value.forEach(item => {
        if (item['Maç Sonu ve Alt/Üst']) {
          item['Maç Sonu ve Alt/Üst'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Draw - Draw','Beraberlik - Beraberlik')
            .replace('Draw','Beraberlik')
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.name = oddheader
          })
        }
        if (item['Toplam Alt/Üst 2.5']) {
          item['Toplam Alt/Üst 2.5'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.header = oddheader
          })
        }
        if (item['Toplam Gol Alt/Üst']) {
          item['Toplam Gol Alt/Üst'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.header = oddheader
          })
        }
        if (item['Karşılıklı Gol ve Maç Sonu']) {
          item['Karşılıklı Gol ve Maç Sonu'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Yes','Evet')
            .replace('No','Hayır')
            .replace('Draw','Beraberlik')
          item2.header = oddheader
          })
        }
        if (item['Karşılıklı Gol ve Maç Sonu']) {
          item['Karşılıklı Gol ve Maç Sonu'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Draw','Beraberlik')
          item2.name = oddheader
          })
        }
        if (item['Tek/Çift']) {
          item['Tek/Çift'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Odd','Tek')
            .replace('Even','Çift')
          item2.name = oddheader
          })
        }
        if (item['Handikap Sonucu']) {
          item['Handikap Sonucu'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Tie','Eşit')
          item2.name = oddheader
          })
        }
        if (item['İki Takım da Gol Atarmı']) {
          item['İki Takım da Gol Atarmı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Yes','Evet')
            .replace('No','Hayır')
          item2.name = oddheader
          })
        }
        if (item['Hangi Takım Gol Atar']) {
          item['Hangi Takım Gol Atar'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Both Teams','Her İkisi')
            .replace('Only','Atar')
            .replace('No Goal','Gol Olmaz')
          item2.name = oddheader
          })
        }
        if (item['Hangi Yarı Daha Çok Gol Olur']) {
          item['Hangi Yarı Daha Çok Gol Olur'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Tie','Eşit')
            .replace('1st Half','İlk Yarı')
            .replace('2nd Half','İkinci Yarı')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Sonucu ve Alt/Üst']) {
          item['İlk Yarı Sonucu ve Alt/Üst'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Draw - Draw','Beraberlik - Beraberlik')
            .replace('Draw','Beraberlik')
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı/Maç Sonu']) {
          item['İlk Yarı/Maç Sonu'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Draw - Draw','Beraberlik - Beraberlik')
            .replace('Draw','Beraberlik')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Tek/Çift']) {
          item['İlk Yarı Tek/Çift'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Odd','Tek')
            .replace('Even','Çift')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Toplam Alt/Üst']) {
          item['İlk Yarı Toplam Alt/Üst'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.header = oddheader
          })
        }
        if (item['İlk Yarı Kesin Gol Sayısı']) {
          item['İlk Yarı Kesin Gol Sayısı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Goals','Gol')
            .replace('Goal','Gol')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Sonucu/Her İki Takım Gol']) {
          item['İlk Yarı Sonucu/Her İki Takım Gol'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Draw','Beraberlik')
            .replace('Yes','Evet')
            .replace('No','Hayır')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı İki Takım da Gol Atarmı']) {
          item['İlk Yarı İki Takım da Gol Atarmı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Yes','Evet')
            .replace('No','Hayır')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Handikap']) {
          item['İlk Yarı Handikap'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Tie','Eşit')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Alternatif Handikap']) {
          item['İlk Yarı Alternatif Handikap'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Tie','Eşit')
          item2.header = oddheader
          })
        }
        if (item['İkinci Yarı Toplam Alt/Üst']) {
          item['İkinci Yarı Toplam Alt/Üst'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.header = oddheader
          })
        }
        if (item['İkinci Yarı Tek/Çift']) {
          item['İkinci Yarı Tek/Çift'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Odd','Tek')
            .replace('Even','Çift')
          item2.name = oddheader
          })
        }
        if (item['İkinci Yarı Kesin Gol Sayısı']) {
          item['İkinci Yarı Kesin Gol Sayısı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Goals','Gol')
            .replace('Goal','Gol')
          item2.name = oddheader
          })
        }
        if (item['İkinci Yarı İki Takım da Gol Atarmı']) {
          item['İkinci Yarı İki Takım da Gol Atarmı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Yes','Evet')
            .replace('No','Hayır')
          item2.name = oddheader
          })
        }
        if (item['Son Golü Hangi Takım Atar']) {
          item['Son Golü Hangi Takım Atar'].forEach(item2 => {
          let oddheader = item2.name
            .replace('No Goal','Gol Olmaz')
          item2.name = oddheader
          })
        }
        if (item['İlk Golü Hangi Takım Atar']) {
          item['İlk Golü Hangi Takım Atar'].forEach(item2 => {
          let oddheader = item2.name
            .replace('No Goals','Gol Olmaz')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı/İkinci Yarı Her İki Takım Gol']) {
          item['İlk Yarı/İkinci Yarı Her İki Takım Gol'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Yes','Evet')
            .replace('No','Hayır')
          item2.name = oddheader
          })
        }
        if (item['Evsahibi Kesin Gol Sayısı']) {
          item['Evsahibi Kesin Gol Sayısı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Goals','Gol')
            .replace('Goal','Gol')
          item2.name = oddheader
          })
        }
        if (item['Evsahibi Tek/Çift']) {
          item['Evsahibi Tek/Çift'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Odd','Tek')
            .replace('Even','Çift')
          item2.name = oddheader
          })
        }
        if (item['Evsahibi Hangi Devre Çok Gol Atar']) {
          item['Evsahibi Hangi Devre Çok Gol Atar'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Tie','Eşit')
            .replace(' - 1st Half','İlk Yarı')
            .replace('2nd Half','İkinci Yarı')
          item2.name = oddheader
          })
        }
        if (item['Deplasman Kesin Gol Sayısı']) {
          item['Deplasman Kesin Gol Sayısı'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Goals','Gol')
            .replace('Goal','Gol')
          item2.name = oddheader
          })
        }
        if (item['Deplasman Tek/Çift']) {
          item['Deplasman Tek/Çift'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Odd','Tek')
            .replace('Even','Çift')
          item2.name = oddheader
          })
        }
        if (item['Deplasman Hangi Devre Çok Gol Atar']) {
          item['Deplasman Hangi Devre Çok Gol Atar'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Tie','Eşit')
            .replace('1st Half','İlk Yarı')
            .replace('2nd Half','İkinci Yarı')
          item2.name = oddheader
          })
        }
        if (item['Toplam Kornerler']) {
          item['Toplam Kornerler'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.name = oddheader
          })
        }
        if (item['Kornerler 3 lü']) {
          item['Kornerler 3 lü'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Exactly','Kesin')
          item2.name = oddheader
          })
        }
        if (item['Kornerler 2 li']) {
          item['Kornerler 2 li'].forEach(item2 => {
          let oddheader = item2.name
            .replace('Over','Üst')
            .replace('Under','Alt')
          item2.name = oddheader
          })
        }
        if (item['İlk Yarı Kornerler']) {
          item['İlk Yarı Kornerler'].forEach(item2 => {
          let oddheader = item2.header
            .replace('Over','Üst')
            .replace('Under','Alt')
            .replace('Exactly','Kesin')
          item2.header = oddheader
          })
        }
      })
    },
    searchFilter () {
      let searchArray = []
      this.search.forEach(element => {
        if (element.league.name.toLowerCase().indexOf(this.searchBox.toLowerCase()) > -1) {
          searchArray.push(element)
          this.leaguesLength = searchArray.length
        }
      })
      this.leagues = _.groupBy(searchArray, 'league.id')
    },
    isActive (menuItem) {
      return this.activeItem === menuItem
    },
    setActive (menuItem) {
      this.activeItem = menuItem
    },
    filterAsTime() {
      let temp = []
      if (this.timeBox === 'all') {
        this.leaguesLength = this.search.length
        this.dateBox = 'all'
        return this.leagues = _.groupBy(this.search, 'league.id')
      } else {
        this.search.forEach(item => {
          var time = moment.unix(item.time).format('YYYY-MM-DD HH:mm')
          if (time <= this.timeBox) {
            temp.push(item)
          }
        })
        setTimeout(() => {
          this.leagues = _.groupBy(temp, 'league.id')
          this.leaguesLength = temp.length
        }, 0)
      }
    },
    filterAsDate() {
      let temp = []
      if (this.dateBox === 'all') {
        this.leaguesLength = this.search.length
        this.timeBox = 'all'
        return this.leagues = _.groupBy(this.search, 'league.id')
      } else {
        this.search.forEach(item => {
          var time = moment.unix(item.time).format('YYYY-MM-DD')
          if (this.dateBox === time) {
            temp.push(item)
          }
        })
        setTimeout(() => {
          this.leagues = _.groupBy(temp, 'league.id')
          this.leaguesLength = temp.length
        }, 0)
      }
    },
    getFullTime(){
      this.fullTime = this.odds.map(function(item){
        if (item['Maç Sonu'] 
        || item['Maç Sonu ve Alt/Üst']
        || item['Beraberlikte İade']
        || item['Çifte Şans']
        || item['Karşılıklı Gol ve Maç Sonu']
        || item['Handikap Sonucu']
        ) {
          return {
            "Maç Sonu":item['Maç Sonu'],
            "Maç Sonu ve Alt/Üst":item['Maç Sonu ve Alt/Üst'],
            "Beraberlikte İade":item['Beraberlikte İade'],
            "Çifte Şans":item['Çifte Şans'],
            "Karşılıklı Gol ve Maç Sonu":item['Karşılıklı Gol ve Maç Sonu'],
            "Handikap Sonucu":item['Handikap Sonucu']
          }
        }
      })
    },
    getFirstHalf(){
      this.firstHalf = this.odds.map(function(item){
        if (item['İlk Yarı Sonucu'] 
        || item['İlk Yarı Sonucu ve Alt/Üst']
        || item['İlk Yarı/Maç Sonu']
        || item['İlk Yarı Çifte Şans']
        || item['İlk Yarı Kesin Skor']
        || item['İlk Yarı Tek/Çift']
        || item['İlk Yarı Toplam Alt/Üst']
        || item['İlk Yarı Kesin Gol Sayısı']
        || item['İlk Yarı Sonucu/Her İki Takım Gol']
        || item['İlk Yarı İki Takım da Gol Atarmı']
        || item['İlk Yarı Kornerler']
        || item['İlk Yarı Handikap']
        || item['İlk Yarı Alternatif Handikap']
        ) {
          return {
            "İlk Yarı Sonucu":item['İlk Yarı Sonucu'],
            "İlk Yarı Sonucu ve Alt/Üst":item['İlk Yarı Sonucu ve Alt/Üst'],
            "İlk Yarı/Maç Sonu":item['İlk Yarı/Maç Sonu'],
            "İlk Yarı Çifte Şans":item['İlk Yarı Çifte Şans'],
            "İlk Yarı Kesin Skor":item['İlk Yarı Kesin Skor'],
            "İlk Yarı Tek/Çift":item['İlk Yarı Tek/Çift'],
            "İlk Yarı Toplam Alt/Üst":item['İlk Yarı Toplam Alt/Üst'],
            "İlk Yarı Kesin Gol Sayısı":item['İlk Yarı Kesin Gol Sayısı'],
            "İlk Yarı Sonucu/Her İki Takım Gol":item['İlk Yarı Sonucu/Her İki Takım Gol'],
            "İlk Yarı İki Takım da Gol Atarmı":item['İlk Yarı İki Takım da Gol Atarmı'],
            "İlk Yarı Kornerler":item['İlk Yarı Kornerler'],
            "İlk Yarı Handikap":item['İlk Yarı Handikap'],
            "İlk Yarı Alternatif Handikap":item['İlk Yarı Alternatif Handikap']
          }
        }
      })        
    },
    getSecondHalf(){
      this.secondHalf = this.odds.map(function(item){
        if (item['İkinci Yarı Sonucu'] 
        || item['İkinci Yarı Toplam Alt/Üst']
        || item['İkinci Yarı Tek/Çift']
        || item['İkinci Yarı Kesin Gol Sayısı']
        || item['İkinci Yarı İki Takım da Gol Atarmı']
        
        ) {
          return {
            "İkinci Yarı Sonucu":item['İkinci Yarı Sonucu'],
            "İkinci Yarı Toplam Alt/Üst":item['İkinci Yarı Toplam Alt/Üst'],
            "İkinci Yarı Tek/Çift":item['İkinci Yarı Tek/Çift'],
            "İkinci Yarı Kesin Gol Sayısı":item['İkinci Yarı Kesin Gol Sayısı'],
            "İkinci Yarı İki Takım da Gol Atarmı":item['İkinci Yarı İki Takım da Gol Atarmı'],
          }
        }
      })
    },
    getGoals(){
      this.goals = this.odds.map(function(item){
        if (item['Toplam Alt/Üst 2.5']
        || item['Toplam Gol Alt/Üst']
        || item['Kesin Skor']
        || item['Kazanma Aralığı']
        || item['İlk Golü Hangi Takım Atar']
        || item['Son Golü Hangi Takım Atar']
        || item['Hangi Takım Gol Atar']
        || item['Hangi Yarı Daha Çok Gol Olur']
        || item['İki Takım da Gol Atarmı']
        || item['Tek/Çift']
        || item['İlk Yarı/İkinci Yarı Her İki Takım Gol']
        
        ) {
          return {
            "Toplam Alt/Üst 2.5":item['Toplam Alt/Üst 2.5'],
            "Toplam Gol Alt/Üst":item['Toplam Gol Alt/Üst'],
            "Kesin Skor":item['Kesin Skor'],
            "Tek/Çift":item['Tek/Çift'],
            "Kazanma Aralığı":item['Kazanma Aralığı'],
            "İlk Golü Hangi Takım Atar":item['İlk Golü Hangi Takım Atar'],
            "Son Golü Hangi Takım Atar":item['Son Golü Hangi Takım Atar'],
            "İki Takım da Gol Atarmı":item['İki Takım da Gol Atarmı'],
            "İlk Yarı/İkinci Yarı Her İki Takım Gol":item['İlk Yarı/İkinci Yarı Her İki Takım Gol'],
            "Hangi Takım Gol Atar":item['Hangi Takım Gol Atar'],
            "Hangi Yarı Daha Çok Gol Olur":item['Hangi Yarı Daha Çok Gol Olur']
          }
        }
      }) 
    },
    getHomeAway(){
      this.homeAway = this.odds.map(function(item){
        if (item['Evsahibi Kesin Gol Sayısı']
        || item['Evsahibi Kesin Gol Sayısı']
        || item['Evsahibi Tek/Çift']
        || item['Evsahibi Hangi Devre Çok Gol Atar']
        || item['Deplasman Hangi Devre Çok Gol Atar']
        || item['Deplasman Kesin Gol Sayısı']
        || item['Deplasman Tek/Çift']
        ) {
          return {
            "Evsahibi Tek/Çift":item['Evsahibi Tek/Çift'],
            "Evsahibi Kesin Gol Sayısı":item['Evsahibi Kesin Gol Sayısı'],
            "Evsahibi Hangi Devre Çok Gol Atar":item['Deplasman Hangi Devre Çok Gol Atar'],
            "Deplasman Tek/Çift":item['Deplasman Tek/Çift'],
            "Deplasman Kesin Gol Sayısı":item['Deplasman Kesin Gol Sayısı'],
            "Deplasman Hangi Devre Çok Gol Atar":item['Deplasman Hangi Devre Çok Gol Atar'],
          }
        }
      }) 
    },
    getCorners(){
      this.corners = this.odds.map(function(item){
        if (item['Toplam Kornerler'] 
        || item['Kornerler 3 lü']
        || item['Kornerler 2 li']
        || item['İlk Korner']
        || item['Son Korner']
        || item['İlk Yarı Kornerler']
        ) {
          return {
            "Toplam Kornerler":item['Toplam Kornerler'],
            "Kornerler 3 lü":item['Kornerler 3 lü'],
            "Kornerler 2 li":item['Kornerler 2 li'],
            "İlk Korner":item['İlk Korner'],
            "Son Korner":item['Son Korner'],
            "İlk Yarı Kornerler":item['İlk Yarı Kornerler'],
          }
        }
      })
    },
    addSlip (market, option, marketname, rate) {
      let game = ''
      if (!marketname) {
        game = option
      }else {
        game = marketname +' '+ option
      }
      let matchTeams = this.homeTeam +' - '+ this.awayTeam
      this.slips = {
        code: this.sublistId.toString().slice(-3),
        user: this.$store.state.auth.user,
        admin: this.$store.state.auth.admin,
        superadmin: this.$store.state.auth.superadmin,
        match: this.homeTeam +' - '+ this.awayTeam,
        games: market,
        option: game,
        rate: rate,
        stream: 'Bülten',
        branch:'F',
        state: 'Aktif',
        scoreid: 0
      }
      if (!this.$store.state.betslip){
        this.$store.commit('setBetSlip', true)
      }
      setTimeout(() => {
         if (this.$store.state.slips.length > 0) {
          let test = this.$store.state.slips.find(o => o.match === matchTeams)
          if (test === undefined) {
            this.$store.commit('setSlips', this.slips)
          }
        } else {
          this.$store.commit('setSlips', this.slips)
        }
      }, 50)
    }
  }
}
</script>
