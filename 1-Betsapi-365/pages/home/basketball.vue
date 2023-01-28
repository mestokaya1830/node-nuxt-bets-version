<template>
  <div class="pages main-page">
    <aside class="left">
      <div class="title-2 soccer-title" id="content">
        <div class="filter-con">
          <select v-model="timeBox" class="selectbox1 selectbox1-left" @change="filterAsDate()">
            <option value="Hepsi" disabled>Hepsi</option>
            <option value="all">Hepsi</option>
            <option :value="$moment().format('YYYY-MM-DD')">Bugün</option>
            <option :value="$moment().add(1,'days').format('YYYY-MM-DD')">Yarın</option>
          </select>
          <i class="fas fa-adjust navbar-icons ml20 cp" @click="leagueOpen =! leagueOpen" title="Aç Kapa"/>
        </div>
        <span class="badge bg-o mr10 ml10">{{leaguesLength}}</span>
      </div>
      <div class="left-con">
        <div class="sblc"><input type="search" v-model="searchBox" class="searchbox-left" @keyup="searchFilter" placeholder="ara..."></div>
        <details :open="leagueOpen" class="left-details cp" v-for="(list, index) in leagues" :key="index">
          <summary class="title-3">
            <div class="left-title">
              <span class="flag-con">
                <img :src="getFlags(list[0].league.name.replace(/ .*/,''))" class="mr5">
                <span class="leag ml10">{{list[0].league.name}}</span>
              </span>
            </div>
          </summary>
          <div class="left-list" v-for="(sublist, index) in list" :key="index">
            <div class="left-list-con bg-o" @click="getOdds(sublist)">
              <div class="left-list-items fdc aifs">
                <span>{{ sublist.home.name }}</span>
                <span>{{ sublist.away.name }}</span>
              </div>
              <div class="left-list-items">
                <span class="left-code">{{sublist.id.toString().slice(-3)}}</span>
                <span class="cl-y">{{$moment.unix(sublist.time,'MM-DD').format('MM-DD')}}</span>
                <span class="cl-y">{{$moment.unix(sublist.time,'H:m').format('H:m')}}</span>
              </div>
            </div>
          </div>
        </details>
        <div class="page-end mt5"><span>Başka veri yoktur</span></div>
      </div>
    </aside>
    <div class="center">
      <div class="title-2">
        <span class="odds-title"><i class="fas fa-basketball-ball cl-o navbar-icons"/>BASKETBOL</span>
      </div>
      <div class="center-con">
        <div v-if="options" class="center-bet">
          <div class="options">
            <header class="options-header">
              <span class="mr10">{{homeTeam}}</span> - <span class="ml10">{{awayTeam}}</span>
            </header>
            <div class="suboptions-con">
              <ul class="tab-container">
                <li class="nav-item bg-o">
                  <a class="nav-link" @click.prevent="setActive('all')" :class="{ active: isActive('all') }" href="#all">Genel</a>
                  <a class="nav-link" @click.prevent="setActive('mainprops')" :class="{ active: isActive('mainprops') }" href="#mainprops">Genel Detay</a>
                  <a class="nav-link" @click.prevent="setActive('half_props')" :class="{ active: isActive('half_props') }" href="#half_props">İlk Yarı</a>
                  <a class="nav-link" @click.prevent="setActive('quarter')" :class="{ active: isActive('quarter') }" href="#quarter">1.Çeyrek</a>
                  <i class="fas fa-adjust navbar-icons ml20 cl-w cp" @click="marketOpen = ! marketOpen" title="Aç Kapa"/>
                </li>
              </ul>
              <div class="tab-pane" v-if="odds[0].main" :class="{ activeshow: isActive('all') }" id="all">
                <details :open="marketOpen" v-for="(oddlist, key, index) in odds[0].main.sp" :key="index">
                  <summary class="title-3">
                    <div>
                      <span class="badge bg-o mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{liveClass3: key === 'Handikap'}">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" v-if="odds[0].main_props" :class="{ activeshow: isActive('mainprops') }" id="mainprops">
                <details :open="marketOpen" v-for="(oddlist, key, index) in odds[0].main_props.sp" :key="index">
                    <summary class="title-3">
                    <div>
                      <span class="badge bg-o mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{liveClass3: key === 'Hangi Yarıda Daha Çok Basket Olur' || key === 'Kazanma Aralığı (3 lü)' || key === 'Alt/Üst TakımlarToplam (3 li)'}">
                      <span class="oddsrate" v-if="oddlist2.header">{{oddlist2.header}}</span>
                      <span class="oddsrate">{{oddlist2.name}}</span>
                      <span class="oddsrate cl-r">{{oddlist2.odds}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" v-if="odds[0].half_props" :class="{ activeshow: isActive('half_props') }" id="half_props">
                <details :open="marketOpen"  v-for="(oddlist, key, index) in odds[0].half_props.sp" :key="index">
                    <summary class="title-3">
                    <div>
                      <span class="badge bg-o mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{liveClass3: key === 'İlk Yarı Sonucu (3 lü)' || key === 'İlk Yarı Toplam Alt/Üst' || key === 'İlk Yarı Farkı (3 lü)', liveClass:key === 'İlk Yarı Çifte Şans'}">
                      <div>
                        <span class="oddsrate mr10" v-if="oddlist2.header">{{oddlist2.header}}</span>
                        <span class="oddsrate">{{oddlist2.name}}</span>
                      </div>
                      <span class="oddsrate cl-r">{{oddlist2.odds}}</span>
                    </div>
                  </div>
                </details>
                <span class="page-end">Başka veri yoktur!</span>
              </div>
              <div class="tab-pane" v-if="odds[0].quarter_prop" :class="{ activeshow: isActive('quarter') }" id="quarter">
                <details :open="marketOpen" v-for="(oddlist, key, index) in odds[0].quarter_prop.sp" :key="index">
                    <summary class="title-3">
                    <div>
                      <span class="badge bg-o mr10">{{index}}</span>
                      <span>{{key}}</span>
                    </div>
                  </summary>
                  <div class="subodds-list-pre">
                    <div class="subodds-wrapper-pre" v-for="(oddlist2, index) in oddlist" :key="index" @click="addSlip (key, oddlist2.name, oddlist2.header, oddlist2.odds)" :class="{liveClass3:key === '1.Çeyrek Çifte Şans' || key === '1.Çeyrek Kazanma Sınırı' || key === '1.Çeyrek Kazanma Aralığı (3 lü)' || key === '1.Çeyrek Toplam Alt/Üst' || key === '1.Çeyrek Sonucu (3 lü)' || key === '1.Çeyrek Basket Yarışı'}">
                      <span class="oddsrate" v-if="oddlist2.header">{{oddlist2.header}}</span>
                      <span class="oddsrate">{{oddlist2.name}}</span>
                      <span class="oddsrate cl-r">{{oddlist2.odds}}</span>
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
    </div>
    <preloader v-if="loader" class="loader-con"/>
    <aside class="right-side">
      <slipside class="slip-side" :branchimage="branchimage" :leaguesarray="leaguesArray"/>
      <div class="favorite-leags">
        <details class="left-details cp" v-for="(list, index) in favorites" :key="index">
          <summary class="title-3 fav-title">
            <div class="left-title">
              <span class="flag-con">
                <img :src="require('~/assets/img/'+ list[0].league.name.replace(/ .*/,'') + '.png')" class="fav-flags mr5">
                <span class="leag ml10">{{list[0].league.name}}</span>
              </span>
            </div>
          </summary>
          <div class="left-list" v-for="(sublist, index) in list" :key="index">
            <div class="left-list-con bg-o" @click="getOdds(sublist)">
              <div class="left-list-items fdc aifs">
                <span>{{ sublist.home.name }}</span>
                <span>{{ sublist.away.name }}</span>
              </div>
              <div class="left-list-items">
                <span class="left-code">{{sublist.id.toString().slice(-3)}}</span>
                <span class="cl-y">{{$moment.unix(sublist.time).format('MM-DD')}}</span>
                <span class="cl-y">{{$moment.unix(sublist.time).format('H:m')}}</span>
              </div>
            </div>
          </div>
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
import leaguesjson from '@/basket.json'
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
      homeTeam:'',
      awayTeam:'',
      leaguesLength: 0,
      slips: [],
      searchBox: '',
      sportBox: 1,
      timeBox: 'Hepsi',
      options: false,
      notfound: '',
      dateOdd: moment().format("YYYY-MM-DD"),
      loader: false,
      activeItem: 'all',
      index:'',
      transArray: {},
      subSlip: false,
      allDone: false,
      branchimage: 'basketbol',
      branch: 'Basketbol',
      slips: {},
      leagueOpen:false,
      marketOpen:false,
      sublistId: 0
    }
  },
  mounted () {
    this.getLeagues()
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
      let test = []
      this.loader = true
        this.leaguesJson.forEach(item => {
          item.results.forEach(item2 => {
            this.leaguesArray.push(item2)
          })
        })
        this.leaguesJson.forEach(item => {
          item.results.forEach(item2 => {
            if (item2.league.id === "10042997"
            || item2.league.id === "10040330"
            || item2.league.id === "10041432"
            || item2.league.id === "10041013"
            || item2.league.id === "10036608"
            || item2.league.id === "10037165"
            || item2.league.id === "10037251"
            || item2.league.id === "10040407"
            || item2.league.id === "10036625"
            || item2.league.id === "10041830"
            ) {
              test.push(item2)
            }
          })
        })
        setTimeout(() => {
          this.leagues = _.groupBy(this.leaguesArray, 'league.id')
          this.favorites = _.groupBy(test, 'league.id')
          this.search = this.leaguesArray
          this.leaguesLength = this.leaguesArray.length
          this.transCountry (this.leaguesArray)
          this.loader = false
        }, 300)
    },
    async getOdds (sublist) {
      this.setActive ('all')
      this.loader = true
      await axios.get(`/api/home/prematchodds/${sublist.id}`).then((result) =>{
        this.odds = result.data.results
        this.loader = false
        this.options = true
        this.homeTeam = sublist.home.name
        this.awayTeam = sublist.away.name
        this.transHeader(result.data.results)
        this.transMarket(result.data.results)
        this.goTop()
      })
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
            .replace('Algeria','Cezayir')
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
            .replace('BIH','Bosna')
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
            .replace('Coupe','Fransa Kupası')
            .replace('Croatia','Hırvatistan')
            .replace('Czech Republic','Çek Cumhuriyeti')
            .replace('Belgium','Belçika')
            .replace('Denmark','Danimarka')
            .replace('Dominican Republic','Dominik Cumhuriyeti')
            .replace('DR Congo','Kongo')
            .replace('Ecuador','Ekvator')
            .replace('Egypt','Mısır')
            .replace('British','ingiltere')
            .replace('England','ingiltere')
            .replace('Estonia','Estonya')
            .replace('Ethiopia','Etyopya')
            .replace('Europe','Avrupa')
            .replace('Euro','Avrupa')
            .replace('France','Fransa')
            .replace('Faroe Islands','Faroe Adaları')
            .replace('FYR of Macedonia','Makedonya')
            .replace('Georgia','Gürcistan')
            .replace('Germany','Almanya')
            .replace('Ghana','Gana')
            .replace('Greece','Yunanistan')
            .replace('Hungary','Macaristan')
            .replace('Italy','italya')
            .replace('Iceland','izlanda')
            .replace('India','Hindistan')
            .replace('Indonesia','Endenozya')
            .replace('International','Uluslararası')
            .replace('Iraq','Irak')
            .replace('Iran','iran')
            .replace('Ireland','irlanda')
            .replace('Israel','israil')
            .replace('Ivory Coast','Fildişi Sahili')
            .replace('Japan','Japonya')
            .replace('Jordan','Urdün')
            .replace('Kazakhstan','Kazakistan')
            .replace('Kosovo','Kosova')
            .replace('Kongo','Kongo Cumhuriyeti')
            .replace('Korea','Kore')
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
            .replace('Holland','Hollanda')
            .replace('New Caledonia','Yeni Kaledonya')
            .replace('New Zealand','Yeni Zellanda')
            .replace('Northern irlanda','Kuzey irlanda')
            .replace('North & Central America','Amerika')
            .replace('North','Amerika')
            .replace('Norway','Norveç')
            .replace('Nicaragua','Nikaraguay')
            .replace('Oman','Umman')
            .replace('Qatar','Katar')
            .replace('Poland','Polonya')
            .replace('Philippines','Filipinler')
            .replace('Portugal','Portekiz')
            .replace('Republic of irlanda','irlanda Cumhuriyeti')
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
            .replace('Matches','Maçları')
          element.league.name = leaguenames
        })
    },
    transHeader(value){
      this.transArray = value.map(function(item){
        if (item.main) {
          if(item.main.sp['1st_half_totals']){
            item.main.sp['firsthalftotals'] = item.main.sp['1st_half_totals']
            delete item.main.sp['1st_half_totals']
          }
          if(item.main.sp['1st_quarter_totals']){
            item.main.sp['firstquartertotals'] = item.main.sp['1st_quarter_totals']
            delete item.main.sp['1st_quarter_totals']
          }
        }
        if (item.main_props) {
          if(item.main_props.sp["result_and_both_teams_to_score_'x'_points"]){
            item.main_props.sp['resultandbothteamstoscorexpoints'] = item.main_props.sp["result_and_both_teams_to_score_'x'_points"]
            delete item.main_props.sp["result_and_both_teams_to_score_'x'_points"]
          }
          if(item.main_props.sp["tied_at_end_of_regulation?"]){
            item.main_props.sp['tiedatendofregulation'] = item.main_props.sp["tied_at_end_of_regulation?"]
            delete item.main_props.sp["tied_at_end_of_regulation?"]
          }
          if(item.main_props.sp["game_total_(bands)_3_way"]){
            item.main_props.sp['gametotalbands3way'] = item.main_props.sp["game_total_(bands)_3_way"]
            delete item.main_props.sp["game_total_(bands)_3_way"]
          }
        }
        if (item.half_props) {
          if(item.half_props.sp['1st_half_race_to_(points)']){
            item.half_props.sp['firsthalfracetopoints'] = item.half_props.sp['1st_half_race_to_(points)']
            delete item.half_props.sp['1st_half_race_to_(points)']
          }
          if(item.half_props.sp['1st_half_spread_3_way']){
            item.half_props.sp['firsthalfspread3way'] = item.half_props.sp['1st_half_spread_3_way']
            delete item.half_props.sp['1st_half_spread_3_way']
          }
          if(item.half_props.sp['1st_half_team_totals']){
            item.half_props.sp['firsthalfteamtotals'] = item.half_props.sp['1st_half_team_totals']
            delete item.half_props.sp['1st_half_team_totals']
          }
          if(item.half_props.sp['1st_half_totals_3_way']){
            item.half_props.sp['firsthalftotals3way'] = item.half_props.sp['1st_half_totals_3_way']
            delete item.half_props.sp['1st_half_totals_3_way']
          }
          if(item.half_props.sp['1st_half_total_odd_even']){
            item.half_props.sp['firsthalftotaloddeven'] = item.half_props.sp['1st_half_total_odd_even']
            delete item.half_props.sp['1st_half_total_odd_even']
          }
          if(item.half_props.sp['1st_half_money_line_3_way']){
            item.half_props.sp['firsthalfmoneyline3way'] = item.half_props.sp['1st_half_money_line_3_way']
            delete item.half_props.sp['1st_half_money_line_3_way']
          }
          if(item.half_props.sp['1st_half_double_chance']){
            item.half_props.sp['firsthalfdoublechance'] = item.half_props.sp['1st_half_double_chance']
            delete item.half_props.sp['1st_half_double_chance']
          }
        }
        if (item.quarter_prop) {
          if(item.quarter_prop.sp['1st_quarter_double_chance_1']){
            item.quarter_prop.sp['firstquarterdoublechance1'] = item.quarter_prop.sp['1st_quarter_double_chance_1']
            delete item.quarter_prop.sp['1st_quarter_double_chance_1']
          }
          if(item.quarter_prop.sp['1st_quarter_race_to_(points)']){
            item.quarter_prop.sp['firstquarterracetopoints'] = item.quarter_prop.sp['1st_quarter_race_to_(points)']
            delete item.quarter_prop.sp['1st_quarter_race_to_(points)']
          }
          if(item.quarter_prop.sp['firstquarterpointspread3way']){
            item.quarter_prop.sp['firstquarterpointspread3way'] = item.quarter_prop.sp['firstquarterpointspread3way']
            delete item.quarter_prop.sp['firstquarterpointspread3way']
          }
          if(item.quarter_prop.sp['1st_quarter_total_odd_even']){
            item.quarter_prop.sp['firstquartertotaloddeven'] = item.quarter_prop.sp['1st_quarter_total_odd_even']
            delete item.quarter_prop.sp['1st_quarter_total_odd_even']
          }
          if(item.quarter_prop.sp['1st_quarter_money_line_3_way']){
            item.quarter_prop.sp['firstquartermoneyline3way'] = item.quarter_prop.sp['1st_quarter_money_line_3_way']
            delete item.quarter_prop.sp['1st_quarter_money_line_3_way']
          }
          if(item.quarter_prop.sp['1st_quarter_total_3_way']){
            item.quarter_prop.sp['firstquartertotal3way'] = item.quarter_prop.sp['1st_quarter_total_3_way']
            delete item.quarter_prop.sp['1st_quarter_total_3_way']
          }
          if(item.quarter_prop.sp['1st_quarter_margin_of_victory']){
            item.quarter_prop.sp['firstquartermarginofvictory'] = item.quarter_prop.sp['1st_quarter_margin_of_victory']
            delete item.quarter_prop.sp['1st_quarter_margin_of_victory']
          }
          if(item.quarter_prop.sp['1st_quarter_point_spread_3_way']){
            item.quarter_prop.sp['firstquarterpointspread3way'] = item.quarter_prop.sp['1st_quarter_point_spread_3_way']
            delete item.quarter_prop.sp['1st_quarter_point_spread_3_way']
          }
          if(item.quarter_prop.sp['1st_quarter_team_totals']){
            item.quarter_prop.sp['firstquarterteamtotals'] = item.quarter_prop.sp['1st_quarter_team_totals']
            delete item.quarter_prop.sp['1st_quarter_team_totals']
          }
        }
        return item
      })
      //main
      this.transArray.forEach(element => {
        if (element.hasOwnProperty('main')) {
          if ( element.main.sp.game_totals) {
            element.main.sp.game_totals.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.header = oddheader
            })
          }
          if ( element.main.sp.firsthalftotals) {
            element.main.sp.firsthalftotals.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.header = oddheader
            })
          }
          if (element.main.sp.firstquartertotals) {
            element.main.sp.firstquartertotals.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.header = oddheader
            })
          }
        }
      })
      //mainprops
      this.transArray.forEach(element => {
        if (element.hasOwnProperty('main_props')){
          if (element.main_props.sp.highest_scoring_half) {
            element.main_props.sp.highest_scoring_half.forEach(element2 => {
              let oddheader = element2.name
              .replace('1st Half','ilk Yarı')
              .replace('2nd Half','İkinci Yarı')
              .replace('Tie','Eşitlik')
              element2.name = oddheader
            })
          }
          if (element.main_props.sp.game_total_odd_even) {
            element.main_props.sp.game_total_odd_even.forEach(element2 => {
              let oddheader = element2.name
              .replace('Odd','Tek')
              .replace('Even','Çift')
              element2.name = oddheader
            })
          }
          if (element.main_props.sp.highest_scoring_quarter) {
            element.main_props.sp.highest_scoring_quarter.forEach(element2 => {
              let oddheader = element2.name
              .replace('1st Quarter','1. Çeyrek')
              .replace('2nd Quarter','2. Çeyrek')
              .replace('3rd Quarter','3.Çeyrek')
              .replace('4th Quarter','4.Çeyrek')
              .replace('Tie','Eşitlik')
              element2.name = oddheader
            })
          }
          if (element.main_props.sp.alternative_game_total) {
            element.main_props.sp.alternative_game_total.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.header = oddheader
            })
          }
          if (element.main_props.sp.resultandbothteamstoscorexpoints) {
            element.main_props.sp.resultandbothteamstoscorexpoints.forEach(element2 => {
              let oddheader = element2.name
              .replace('and Yes','ve Evet')
              .replace('and No','ve Hayır')
              element2.name = oddheader
            })
          }
          if (element.main_props.sp.winning_margin_3_way) {
            element.main_props.sp.winning_margin_3_way.forEach(element2 => {
              if(element2.name){
                let oddheader = element2.name
                .replace('or more','veya Fazlasi')
                element2.name = oddheader
              }
            })
          }
          if (element.main_props.sp.tiedatendofregulation) {
            element.main_props.sp.tiedatendofregulation.forEach(element2 => {
              if(element2.name){
                let oddheader = element2.name
                .replace('Yes','Evet')
                .replace('No','Hayır')
                element2.name = oddheader
              }
            })
          }
          if (element.main_props.sp.gametotalbands3way) {
            element.main_props.sp.gametotalbands3way.forEach(element2 => {
              if(element2.name){
                let oddheader = element2.name
                .replace('and Over','ve Üst')
                .replace('and Under','ve Alt')
                element2.name = oddheader
              }
            })
          }
          if (element.main_props.sp.double_result) {
            element.main_props.sp.double_result.forEach(element2 => {
              if(element2.name){
                let oddheader = element2.name
                .replace('Tie','Eşitlik')
                element2.name = oddheader
              }
            })
          }
        }
      })
      //half
      this.transArray.forEach(element => {
        if (element.hasOwnProperty('half_props')) {
          if (element.half_props.sp.firsthalfracetopoints) {
            element.half_props.sp.firsthalfracetopoints.forEach(element2 => {
              let oddheader = element2.header
              .replace('Neither','Hiçbiri')
              element2.header = oddheader
            })
          }
          if (element.half_props.sp.firsthalfspread3way) {
            element.half_props.sp.firsthalfspread3way.forEach(element2 => {
              let oddheader = element2.header
              .replace('Tie','Eşitlik')
              element2.header = oddheader
            })
          }
          if (element.half_props.sp.firsthalfteamtotals) {
            element.half_props.sp.firsthalfteamtotals.forEach(element2 => {
              let oddheader = element2.name
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.name = oddheader
            })
          }
          if (element.half_props.sp.firsthalftotals3way) {
            element.half_props.sp.firsthalftotals3way.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              .replace('Exactly','Kesin')
              element2.header = oddheader
            })
          }
          if (element.half_props.sp.firsthalftotaloddeven) {
            element.half_props.sp.firsthalftotaloddeven.forEach(element2 => {
              let oddheader = element2.name
              .replace('Odd','Tek')
              .replace('Even','Çift')
              element2.name = oddheader
            })
          }
          if (element.half_props.sp.firsthalfmoneyline3way) {
            element.half_props.sp.firsthalfmoneyline3way.forEach(element2 => {
              let oddheader = element2.name
              .replace('Tie','Eşitlik')
              element2.name = oddheader
            })
          }
          if (element.half_props.sp.firsthalfdoublechance) {
            element.half_props.sp.firsthalfdoublechance.forEach(element2 => {
              let oddheader = element2.name
              .replace('or',' veya ')
              .replace('Draw','Beraberlik')
              element2.name = oddheader
            })
          }
        }
      })
      //quarter prop
      this.transArray.forEach(element => {
        if (element.hasOwnProperty('quarter_prop')) {
          if (element.quarter_prop.sp.firstquarterdoublechance1) {
            element.quarter_prop.sp.firstquarterdoublechance1.forEach(element2 => {
              let oddheader = element2.name
              .replace('or Draw','veya Beraberlik')
              .replace('Draw or','Beraberlik veya')
              element2.name = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquarterracetopoints) {
            element.quarter_prop.sp.firstquarterracetopoints.forEach(element2 => {
              let oddheader = element2.header
              .replace('Neither','Hiçbiri')
              element2.header = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquartermarginofvictory) {
            element.quarter_prop.sp.firstquartermarginofvictory.forEach(element2 => {
              if(element2.name){
                let oddheader = element2.name
                .replace('or more','ve Fazlası')
                element2.name = oddheader
              }
            })
          }
          if (element.quarter_prop.sp.firstquarterpointspread3way) {
            element.quarter_prop.sp.firstquarterpointspread3way.forEach(element2 => {
              let oddheader = element2.header
              .replace('Tie','Eşitlik')
              element2.header = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquartertotaloddeven) {
            element.quarter_prop.sp.firstquartertotaloddeven.forEach(element2 => {
              let oddheader = element2.name
              .replace('Odd','Tek')
              .replace('Even','Çift')
              element2.name = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquartermoneyline3way) {
            element.quarter_prop.sp.firstquartermoneyline3way.forEach(element2 => {
              let oddheader = element2.name
              .replace('Tie','Eşitlik')
              element2.name = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquartertotal3way) {
            element.quarter_prop.sp.firstquartertotal3way.forEach(element2 => {
              let oddheader = element2.header
              .replace('Over','Üst')
              .replace('Under','Alt')
              .replace('Exactly','Kesin')
              element2.header = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquarterpointspread3way) {
            element.quarter_prop.sp.firstquarterpointspread3way.forEach(element2 => {
              let oddheader = element2.header
              .replace('Tie','Eşitlik')
              element2.header = oddheader
            })
          }
          if (element.quarter_prop.sp.firstquarterteamtotals) {
            element.quarter_prop.sp.firstquarterteamtotals.forEach(element2 => {
              let oddheader = element2.name
              .replace('Over','Üst')
              .replace('Under','Alt')
              element2.name = oddheader
            })
          }
        }
      })
    },
    transMarket(value){
      this.odds = value.map(function(item) {
        if (item.main) {
          if (item.main.sp['game_totals']) {
            item.main.sp['Toplam Alt/Üst'] = item.main.sp['game_totals']
            delete item.main.sp['game_totals']
          }
          if (item.main.sp['firsthalftotals']) {
            item.main.sp['İlk Yarı Alt/Üst'] = item.main.sp['firsthalftotals']
            delete item.main.sp['firsthalftotals'] 
          }
          if (item.main.sp['firstquartertotals']) {
            item.main.sp['1.Çeyrek Alt/Üst'] = item.main.sp['firstquartertotals']
            delete item.main.sp['firstquartertotals'] 
          }
          if (item.main.sp['handicap_betting']) {
            item.main.sp['Handikap'] = item.main.sp['handicap_betting']
            delete item.main.sp['handicap_betting'] 
          }
          if (item.main.sp['money_line']) {
            item.main.sp['Maç Sonucu'] = item.main.sp['money_line']
            delete item.main.sp['money_line'] 
          }
          if (item.main.sp['1st_half_money_line']) {
            item.main.sp['İlk Yarı Sonucu'] = item.main.sp['1st_half_money_line']
            delete item.main.sp['1st_half_money_line'] 
          }
          if (item.main.sp['1st_quarter_money_line']) {
            item.main.sp['1.Çeyrek Sonucu'] = item.main.sp['1st_quarter_money_line']
            delete item.main.sp['1st_quarter_money_line'] 
          }
          if (item.main.sp['point_spread']) {
            item.main.sp['Maç Sonu Farkı'] = item.main.sp['point_spread']
            delete item.main.sp['point_spread'] 
          }
          if (item.main.sp['1st_half_spread']) {
            item.main.sp['İlk Yarı Farkı'] = item.main.sp['1st_half_spread']
            delete item.main.sp['1st_half_spread'] 
          }
          if (item.main.sp['1st_quarter_spread']) {
            item.main.sp['1.Çeyrek Farkı'] = item.main.sp['1st_quarter_spread']
            delete item.main.sp['1st_quarter_spread'] 
          }
        }
        if(item.main_props){
          if(item.main_props.sp['double_result']){
            item.main_props.sp['Çifte Sonuç'] = item.main_props.sp['double_result']
            delete item.main_props.sp['double_result']
          }
          if(item.main_props.sp['game_total_odd_even']){
            item.main_props.sp['Toplam Tek/Çift'] = item.main_props.sp['game_total_odd_even']
            delete item.main_props.sp['game_total_odd_even']
          }
          if(item.main_props.sp['highest_scoring_quarter']){
            item.main_props.sp['Hangi Çeyrekte Daha Çok Basket Olur'] = item.main_props.sp['highest_scoring_quarter']
            delete item.main_props.sp['highest_scoring_quarter'] 
          }
          if(item.main_props.sp['highest_scoring_half']){
            item.main_props.sp['Hangi Yarıda Daha Çok Basket Olur'] = item.main_props.sp['highest_scoring_half']
            delete item.main_props.sp['highest_scoring_half'] 
          }
          if(item.main_props.sp['quarter_correct_score']){
            item.main_props.sp['İlk Çeyrek Kesin Basket Sayısı'] = item.main_props.sp['quarter_correct_score']
            delete item.main_props.sp['quarter_correct_score'] 
          }
          if(item.main_props.sp["resultandbothteamstoscorexpoints"]){
            item.main_props.sp['Maç Sonu ve İki Takım Basket Zamanı'] = item.main_props.sp["resultandbothteamstoscorexpoints"]
            delete item.main_props.sp["resultandbothteamstoscorexpoints"] 
          }
          if(item.main_props.sp['winning_margin']){
            item.main_props.sp['Kazanma Aralığı'] = item.main_props.sp['winning_margin']
            delete item.main_props.sp['winning_margin']
          }
          if(item.main_props.sp['race_to_20_points']){
            item.main_props.sp['20 Basket Yarışı'] = item.main_props.sp['race_to_20_points']
            delete item.main_props.sp['race_to_20_points']
          }
          if(item.main_props.sp['winning_margin_3_way']){
            item.main_props.sp['Kazanma Aralığı (3 lü)'] = item.main_props.sp['winning_margin_3_way']
            delete item.main_props.sp['winning_margin_3_way']
          }
          if(item.main_props.sp['winning_margin_7_way']){
            item.main_props.sp['Kazanma Aralığı (7 li)'] = item.main_props.sp['winning_margin_7_way']
            delete item.main_props.sp['winning_margin_7_way']
          }
          if(item.main_props.sp['winning_margin_12_way']){
            item.main_props.sp['Kazanma Aralığı (12 li)'] = item.main_props.sp['winning_margin_12_way']
            delete item.main_props.sp['winning_margin_12_way']
          }
          if(item.main_props.sp['alternative_game_total']){
            item.main_props.sp['Alt/Üst (Alternatif)'] = item.main_props.sp['alternative_game_total']
            delete item.main_props.sp['alternative_game_total']
          }
          if(item.main_props.sp['alternative_game_total_2']){
            item.main_props.sp['Alt/Üst 2 li (Alternatif)'] = item.main_props.sp['alternative_game_total_2']
            delete item.main_props.sp['alternative_game_total_2']
          }
          if(item.main_props.sp['alternative_point_spread']){
            item.main_props.sp['Maç Sonu Farkı (Alternatif)'] = item.main_props.sp['alternative_point_spread']
            delete item.main_props.sp['alternative_point_spread']
          }
          if(item.main_props.sp['tiedatendofregulation']){
            item.main_props.sp['Uzatma Olurmu'] = item.main_props.sp['tiedatendofregulation']
            delete item.main_props.sp['tiedatendofregulation']
          }
          if(item.main_props.sp['alternative_point_spread_2']){
            item.main_props.sp['Maç Sonu Farkı 2 li (Alternatif)'] = item.main_props.sp['alternative_point_spread_2']
            delete item.main_props.sp['alternative_point_spread_2']
          }
          if(item.main_props.sp['gametotalbands3way']){
            item.main_props.sp['Alt/Üst Takımlar Toplam (3 li)'] = item.main_props.sp['gametotalbands3way']
            delete item.main_props.sp['gametotalbands3way']
          }
          if(item.main_props.sp['game_total_(bands)_8_way']){
            item.main_props.sp['Alt/Üst Takımlar Toplam (8 li)'] = item.main_props.sp['game_total_(bands)_8_way']
            delete item.main_props.sp['game_total_(bands)_8_way']
          }
        }
        if(item.half_props){
          if(item.half_props.sp['firsthalfteamtotals']){
            item.half_props.sp['İlk Yarı Alt/Üst'] = item.half_props.sp['firsthalfteamtotals']
            delete item.half_props.sp['firsthalfteamtotals']
          }
          if(item.half_props.sp['firsthalfracetopoints']){
            item.half_props.sp['İlk Yarı Basket Yarışı'] = item.half_props.sp['firsthalfracetopoints']
            delete item.half_props.sp['firsthalfracetopoints']
          }
          if(item.half_props.sp['1st_half_winning_margin']){
            item.half_props.sp['İlk Yarı Kazanma Aralığı'] = item.half_props.sp['1st_half_winning_margin']
            delete item.half_props.sp['1st_half_winning_margin'] 
          }
          if(item.half_props.sp['firsthalfspread3way']){
            item.half_props.sp['İlk Yarı Farkı (3 lü)'] = item.half_props.sp['firsthalfspread3way']
            delete item.half_props.sp['firsthalfspread3way'] 
          }
          if(item.half_props.sp['alternative_1st_half_point_spread']){
            item.half_props.sp['İlk Yarı Farkı Alternatif'] = item.half_props.sp['alternative_1st_half_point_spread']
            delete item.half_props.sp['alternative_1st_half_point_spread'] 
          }
          if(item.half_props.sp['firsthalftotals3way']){
            item.half_props.sp['İlk Yarı Toplam Alt/Üst'] = item.half_props.sp['firsthalftotals3way']
            delete item.half_props.sp['firsthalftotals3way'] 
          }
          if(item.half_props.sp['alternative_1st_half_totals']){
            item.half_props.sp['İlk Yarı Toplam Alt/Üst Alternatif'] = item.half_props.sp['alternative_1st_half_totals']
            delete item.half_props.sp['alternative_1st_half_totals'] 
          }
          if(item.half_props.sp['alternative_1st_half_team_totals']){
            item.half_props.sp['İlk Yarı Takımlar Alt/Üst Alternatif'] = item.half_props.sp['alternative_1st_half_team_totals']
            delete item.half_props.sp['alternative_1st_half_team_totals'] 
          }
          if(item.half_props.sp['firsthalfmoneyline3way']){
            item.half_props.sp['İlk Yarı Sonucu (3 lü)'] = item.half_props.sp['firsthalfmoneyline3way']
            delete item.half_props.sp['firsthalfmoneyline3way'] 
          }
          if(item.half_props.sp['firsthalfdoublechance']){
            item.half_props.sp['İlk Yarı Çifte Şans'] = item.half_props.sp['firsthalfdoublechance']
            delete item.half_props.sp['firsthalfdoublechance'] 
          }
          if(item.half_props.sp['firsthalftotaloddeven']){
            item.half_props.sp['İlk Yarı Tek/Çift'] = item.half_props.sp['firsthalftotaloddeven']
            delete item.half_props.sp['firsthalftotaloddeven'] 
          }
        }
        if(item.quarter_prop){
          if(item.quarter_prop.sp['1st_quarter_winning_margin']){
            item.quarter_prop.sp['1.Çeyrek Kazanma Aralığı'] = item.quarter_prop.sp['1st_quarter_winning_margin']
            delete item.quarter_prop.sp['1st_quarter_winning_margin'] 
          }
          if(item.quarter_prop.sp['firstquarterdoublechance1']){
            item.quarter_prop.sp['1.Çeyrek Çifte Şans'] = item.quarter_prop.sp['firstquarterdoublechance1']
            delete item.quarter_prop.sp['firstquarterdoublechance1'] 
          }
          if(item.quarter_prop.sp['alternative_1st_quarter_totals']){
            item.quarter_prop.sp['1.Çeyrek Toplam Alt/Üst Alternatif'] = item.quarter_prop.sp['alternative_1st_quarter_totals']
            delete item.quarter_prop.sp['alternative_1st_quarter_totals'] 
          }
          if(item.quarter_prop.sp['firstquarterteamtotals']){
            item.quarter_prop.sp['1.Çeyrek Takımlar Toplamı'] = item.quarter_prop.sp['firstquarterteamtotals']
            delete item.quarter_prop.sp['firstquarterteamtotals'] 
          }
          if(item.quarter_prop.sp['alternative_1st_quarter_team_totals']){
            item.quarter_prop.sp['1.Çeyrek Takımlar Toplamı Alternatif'] = item.quarter_prop.sp['alternative_1st_quarter_team_totals']
            delete item.quarter_prop.sp['alternative_1st_quarter_team_totals'] 
          }
          if(item.quarter_prop.sp['firstquarterracetopoints']){
            item.quarter_prop.sp['1.Çeyrek Basket Yarışı'] = item.quarter_prop.sp['firstquarterracetopoints']
            delete item.quarter_prop.sp['firstquarterracetopoints'] 
          }
          if(item.quarter_prop.sp['firstquartermarginofvictory']){
            item.quarter_prop.sp['1.Çeyrek Kazanma Sınırı'] = item.quarter_prop.sp['firstquartermarginofvictory']
            delete item.quarter_prop.sp['firstquartermarginofvictory'] 
          }
          if(item.quarter_prop.sp['firstquarterpointspread3way']){
            item.quarter_prop.sp['1.Çeyrek Kazanma Aralığı (3 lü)'] = item.quarter_prop.sp['firstquarterpointspread3way']
            delete item.quarter_prop.sp['firstquarterpointspread3way'] 
          }
          if(item.quarter_prop.sp['alternative_1st_quarter_point_spread']){
            item.quarter_prop.sp['1.Çeyrek Maç Sonu Farkı Alternatif'] = item.quarter_prop.sp['alternative_1st_quarter_point_spread']
            delete item.quarter_prop.sp['alternative_1st_quarter_point_spread'] 
          }
          if(item.quarter_prop.sp['firstquartertotal3way']){
            item.quarter_prop.sp['1.Çeyrek Toplam Alt/Üst'] = item.quarter_prop.sp['firstquartertotal3way']
            delete item.quarter_prop.sp['firstquartertotal3way']
          }
          if(item.quarter_prop.sp['firstquartermoneyline3way']){
            item.quarter_prop.sp['1.Çeyrek Sonucu (3 lü)'] = item.quarter_prop.sp['firstquartermoneyline3way']
            delete item.quarter_prop.sp['firstquartermoneyline3way'] 
          }
          if(item.quarter_prop.sp['firstquartertotaloddeven']){
            item.quarter_prop.sp['1.Çeyrek Toplam Tek/Çift'] = item.quarter_prop.sp['firstquartertotaloddeven']
            delete item.quarter_prop.sp['firstquartertotaloddeven']
          }
        }
        return item
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
    filterAsDate() {
      let test = []
      if (this.timeBox === 'all') {
        this.leaguesLength = this.search.length
        return this.leagues = _.groupBy(this.search, 'league.id')
      } else {
        this.search.forEach(element => {
          var time = moment.unix(element.time).format('YYYY-MM-DD')
          if (this.timeBox === time) {
            test.push(element)
          }
        })
        setTimeout(() => {
          this.leagues = _.groupBy(test, 'league.id')
          this.leaguesLength = test.length
        }, 0)
      }
    },
    addSlip (market, option, marketname, rate) {
      let game = ''
      if (!marketname) {
        game = option
      }else {
        game = marketname +' '+ option
      }
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
        branch:'B',
        state: 'Aktif',
        scoreid: 0
      }
      if (!this.$store.state.betslip){
        this.$store.commit('setBetSlip', true)
      }
      setTimeout(() => {
        this.$store.commit('setSlips', this.slips)
      }, 50)
    }
  }
}
</script>