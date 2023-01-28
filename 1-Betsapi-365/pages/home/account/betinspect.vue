<template>
  <div class="pages">
     <header class="title-2" id="content">
       <span>Kupon Analizleri</span>
       <select v-model="userBox" v-if="$store.state.auth.role === 'A2'" class="box-account box-inspect" @change="clearInputs()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
       <span class="badge bg-g">{{bets.length}}</span>
    </header>
    <div class="bet-con">
      <ul>
        <div>
          <div class="bet-con">
            <ul>
              <li class="title-ligth title-inspect">
                <span class="inspect-title ict">
                  <input v-model="code" type="text" class="bet-inp" @keyup.enter="getBets($event, 'code')" placeholder="Kod">
                </span>
                <span class="inspect-title ict">
                  <span>Kupon</span>
                </span>
                <span class="inspect-title idt">Tarih</span>
                <span class="inspect-title imt">
                  <input v-model="matchesSearch" type="text" class="bet-inp" @keyup.enter="getBetsMatches()" placeholder="Maç Ara">
                </span>
                <span class="inspect-title igt">
                  <select v-model="gamesBox" class="selectbox bet-inp" @change="getBets($event, 'games')">
                    <option value="Oyunlar" disabled>Oyunlar</option>
                    <option v-for="(list, index) in games" :value="list.name" :key="index">{{ list.name }}</option>
                  </select>
                </span>
                <span class="inspect-title iot">
                  <select v-model="optionsBox" class="selectbox bet-inp" @change="getBets($event, 'options')">
                    <option value="Seçimler" disabled>Seçimler</option>
                    <option v-for="(list, index) in options" :value="list.options" :key="index">{{ list.options }}</option>
                  </select>
                </span>
                <span class="inspect-title its">
                  <select v-model="stream" class="selectbox bet-inp" @change="getBets($event, 'stream')">
                    <option value="Tarz" disabled>Tarz</option>
                    <option value="Bülten">Bülten</option>
                    <option value="Canlı">Canlı</option>
                  </select>
                </span>
                <span class="inspect-title ibt">
                  <select v-model="branch" class="selectbox bet-inp" @change="getBets($event,'branch')">
                    <option value="Branş" disabled>Branş</option>
                    <option value="F">Futbol</option>
                    <option value="B">Basketbol</option>
                    <option value="V">Voleybol</option>
                    <option value="T">Tenis</option>
                  </select>
                </span>
                <span class="inspect-title ist">
                  <select v-model="state" class="selectbox bet-inp" @change="getBets($event,'state')">
                    <option value="Durum" disabled>Durum</option>
                    <option value="Kazandi">Kazananlar</option>
                    <option value="Kaybetti">Kaybedenler</option>
                    <option value="iptal">iptaller</option>
                  </select>
                </span>
              </li>
            </ul>
            <ul>
              <li class="list list-inspect" v-for="list in bets" :key="list.id">
                <span class="inspect-list icl">{{ list.code }}</span>
                <span class="inspect-list icl">{{ list.betref }}</span>
                <span class="inspect-list idt">{{ list.date | dateFormat }}</span>
                <span class="inspect-list imt">{{ list.matches }}</span>
                <span class="inspect-list igt">{{ list.games }}</span>
                <span class="inspect-list iot">{{ list.options }}</span>
                <span class="inspect-list isl">{{ list.stream }}</span>
                <span class="inspect-list ibl">{{ list.branch }}</span>
                <span class="inspect-list ist">
                  <span class="bno-inside" :class="list.state">{{ list.state }}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </ul>
    </div>
      <notfound v-if="notfound" :message="notfound" class="not-found"/>
      <span class="page-end">Başka veri yoktur</span>
    <preloader v-if="loader" class="loader-con loader-flex"/>
  </div>
</template>

<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import moment from 'moment'
import notfound from '@/components/notfound.vue'
import preloader from '@/components/preloader.vue'
export default {
  mixins: [Vue2Filters.mixin],
  name: 'Betinspect',
  components: {
   notfound,
   preloader
  },
  data () {
    return {
      userList: {},
      bets: {},
      games: {},
      options: {},
      userBox: 'Üyeler',
      code: '',
      matchesSearch: '',
      gamesBox: 'Oyunlar',
      optionsBox: 'Seçimler',
      stream: 'Tarz',
      branch: 'Branş',
      state: 'Durum',
      notfound: '',
      loader: false,
      sort: false,
      sortName: ''
    }
  },
  mounted () {
    this.getUserlist()
    this.getGames()
    setTimeout(() => {
      this.getOptions()
    }, 500)
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value).tz('Europe/Istanbul').format("MM-DD")
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getGames () {
      await axios.get('/api/home/account/games/').then((result) => {
        this.games = result.data.result
      })
    },
    async getOptions () {
      await axios.post('/api/home/account/options/',{userbox: this.userBox}).then((result) => {
        this.options = result.data.result
      })
    },
    async getBets (event, id) {
      this.bets = {}
      this.preloader = true
      await axios.post('/api/home/account/betinspect/',{userbox:this.userBox, value:event.target.value, column:id}).then((result) => {
        if (result.data.result.length >  0) {
          this.notfound = ''
          this.preloader = false
          this.bets = result.data.result
        } else {
          this.preloader = false
          this.notfound = 'Aranan deger bulunamadı! Aktifler Hesap Dışıdır!'
        }
      })
    },
    async getBetsMatches () {
      if (this.matchesSearch) {
        this.bets = {}
        this.preloader = true
        await axios.post('/api/home/account/betinspectmatches/',{userbox:this.userBox, value:this.matchesSearch}).then((result) => {
          if (result.data.result.length >  0) {
            this.notfound = ''
            this.preloader = false
            this.bets = result.data.result
          } else {
            this.preloader = false
            this.notfound = 'Aranan deger bulunamadı!'
          }
        })
      }
    },
    clearInputs(){
      this.bets = {}
      this.code = '',
      this.matchesSearch = ''
      this.gamesBox = 'Oyunlar'
      this.optionsBox = 'Seçimler'
      this.stream = 'Tarz'
      this.branch = 'Branş'
      this.state = 'Durum'
    }
  }
}
</script>
