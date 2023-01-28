<template>
  <div class="pages">
     <header class="title-2" id="content">
       <span>GEÇMİŞ RAPOR</span>
       <select v-model="userBox" v-if="$store.state.auth.role === 'A2'" class="box-account box-inspect" @change="getBetInfo()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="bet-con">
      <ul>
        <div>
          <div class="bet-con">
            <ul>
              <li class="set-li set-li-ins"><h3>Son Hesap Kesim Öncesi Aylık Genel Rapor</h3></li>
              <li class="set-li set-li-ins">
                <i class="fas fa-briefcase cl-f"/>
                <span class="set-li-item">
                  <span class="stlt">Toplam Kuponlar :</span>
                  <span>{{total.count}}</span>
                </span>
                <span class="set-li-item">
                  <span class="stlt">Toplam Miktar : </span>
                  <span>{{total.amount | currency('₺', 2)}}</span>
                </span>
              </li>
               <li class="set-li set-li-ins">
                <i class="fas fa-thumbs-up cl-g"/>
                <span class="set-li-item">
                  <span class="stlt">Kazanan Kuponlar : </span>
                  <span>{{won.count}}</span>
                </span>
                <span class="set-li-item">
                  <span class="stlt">Kazanan Girdi : </span>
                  <span>{{won.amount | currency('₺', 2)}}</span>
                </span>
                <span class="set-li-item">
                  <span class="stlt">Kazanan Miktar : </span>
                  <span>{{won.earn | currency('₺', 2)}}</span>
                </span>
              </li>
              <li class="set-li set-li-ins">
                <i class="fas fa-thumbs-down cl-r"/>
                <span class="set-li-item">
                  <span class="stlt">Kaybeden Kuponlar : </span>
                  <span>{{lost.count}}</span>
                </span>
                <span class="set-li-item">
                  <span class="stlt">Kaybeden Miktar : </span>
                  <span>{{lost.amount | currency('₺', 2)}}</span>
                </span>
              </li>
              <li class="set-li set-li-ins bg-b">
                <span class="set-li-item">
                  <span class="stlt">Sonuç : </span>
                  <span>{{total.amount - won.earn | currency('₺', 2)}} </span>
                  <span class="ml20 cl-y">İadeler ve İptaller Rapor Dışıdır!</span>
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
  name: 'Historyreport',
  components: {
   notfound,
   preloader
  },
  data () {
    return {
      userList: {},
      total: {},
      won: {},
      lost: {},
      cancel: {},
      userBox: 'Üyeler',
      codeSearch: null,
      matcSearch: null,
      gameBox: 'Oyunlar',
      marketBox: 'Seçimler',
      streamBox: 'Tarz',
      branchBox: 'Branş',
      stateBox: 'Durum',
      notfound: '',
      loader: false,
      sort: false,
      sortName: '',
      start: moment().subtract(1, 'months').format('YYYY-MM-DD H:mm:ss'),
      end: moment().format('YYYY-MM-DD H:mm:ss')
    }
  },
  mounted () {
    this.getUserlist()
    this.getBetInfo()
  },
  filters: {
    dateFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("MM-DD")
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getBetInfo () {
      this.loader = true
      await axios.post('/api/home/account/bettotalinfo/',{userbox:this.userBox}).then((result) => {
        this.total = result.data.totalinfo
        this.won = result.data.woninfo
        this.lost = result.data.lostinfo
        this.loader = false
      })
    }
  }
}
</script>
