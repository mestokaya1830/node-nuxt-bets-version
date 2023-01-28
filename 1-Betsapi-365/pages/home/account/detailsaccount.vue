<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Hesap Detayı</span>
      <select v-if="!checkU1" v-model="userBox" class="selectbox box-account" @change="getDetailsInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con">
      <i class="fas fa-chart-bar fa-4x cl-g big-icon"/>
      <div class="deatails-account-inside">
        <div class="daii">
          <h3 class="daiit bg-y">AKTİFLER</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span>{{activeInfo.activecount}}</span>
            </li>
            <li class="daili">
              <span>Giriş</span>
              <span><span>{{activeInfo.activeamount | currency('₺',2)}}</span></span>
            </li>
            <li class="daili">
              <span>Kazanç</span>
              <span><span>{{activeInfo.activeearn | currency('₺',2)}}</span></span>
            </li>
          </ul>
        </div>
        <div class="daii">
          <h3 class="daiit bg-g">KAZANANLAR</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span><span>{{wonInfo.woncount}}</span></span>
            </li>
            <li class="daili">
              <span>Giriş</span>
              <span>{{wonInfo.wonamount | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span>Ödenen</span>
              <span>{{wonInfo.wonearn | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span>Zarar</span>
              <span>{{wonDiff | currency('₺',2)}}</span>
            </li>
          </ul>
        </div>
        <div class="daii">
          <h3 class="daiit bg-r">KAYBEDENLER</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span>{{lostInfo.woncount | currency('',0)}}</span>
            </li>
            <li class="daili">
              <span>Giriş</span>
              <span>{{lostInfo.wonamount | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span>Kazanılan</span>
              <span>{{lostInfo.wonamount | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span>Kutarılan</span>
              <span>{{lostInfo.wonearn | currency('₺',2)}}</span>
            </li>
          </ul>
        </div>
        <div class="daii">
          <h3 class="daiit bg-f">TOPLAM</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span>{{totalInfo.totalcount}}</span>
            </li>
            <li class="daili">
              <span>Giriş</span>
              <span>{{totalInfo.totalamount | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span>Sonuç</span>
              <span>{{totalResult | currency('₺',2)}}</span>
            </li>
            <li class="daili">
              <span class="cl-g">Aktifler hesap dışıdır!</span>
            </li>
          </ul>
        </div>
      </div>
      <preloader v-if="loader" class="loader-con loader-flex"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import preloader from '@/components/preloader.vue'
export default {
  name: 'Detailsaccount',
  components: {
   preloader
  },
  data () {
    return {
      userBox: 'Üyeler',
      userList: {},
      activeInfo: {},
      wonInfo: {},
      lostInfo: {},
      totalInfo: {},
      loader: false
    }
  },
  mounted() {
    this.getUserlist ()
    this.getDetailsInfo()
    this.goTop()
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    wonDiff () {
      return this.wonInfo.wonearn - this.wonInfo.wonamount
    },
    totalResult () {
      return  this.lostInfo.wonamount - this.wonDiff
    }
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getDetailsInfo() {
      this.loader = true
      await axios.post('/api/home/account/activeinfo', { userbox: this.userBox }).then((active) => {
        this.activeInfo = active.data.activeinfo
      })
      await axios.post('/api/home/account/woninfo', { userbox: this.userBox }).then((won) => {
        this.wonInfo = won.data.woninfo[0]
      })
      await axios.post('/api/home/account/lostinfo', { userbox: this.userBox }).then((lost) => {
        this.lostInfo = lost.data.lostinfo[0]
      })
      await axios.post('/api/home/account/totalinfo', { userbox: this.userBox }).then((total) => {
        this.totalInfo = total.data.totalinfo[0]
      })
      this.loader = false
    }
  }
}
</script>
