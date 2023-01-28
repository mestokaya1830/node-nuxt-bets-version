<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span class="set-title">HESAP DETAYI</span>
      <select v-if="checkA1 || checkG1" v-model="userBox" class="selectbox box-account" @change="getDetailsInfo()">
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
              <span><span>{{activeInfo.activeamount | currency('',2)}}</span></span>
            </li>
            <li class="daili">
              <span>Kazanç</span>
              <span><span>{{activeInfo.activeearn | currency('',2)}}</span></span>
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
              <span>{{wonInfo.wonamount | currency('',2)}}</span>
            </li>
            <li class="daili">
              <span>Ödenen</span>
              <span>{{wonInfo.wonearn | currency('',2)}}</span>
            </li>
          </ul>
        </div>
        <div class="daii">
          <h3 class="daiit bg-r">KAYBEDENLER</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span>{{lostInfo.lostcount}}</span>
            </li>
            <li class="daili">
              <span>Giriş</span>
              <span>{{lostInfo.lostamount | currency('',2)}}</span>
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
              <span>{{totalInfo.totalamount | currency('',2)}}</span>
            </li>
            <li class="daili">
              <span>Ödenen</span>
              <span>{{wonInfo.wonearn | currency('',2)}}</span>
            </li>
            <li class="daili">
              <span>Sonuç</span>
              <span>{{(totalInfo.totalamount - wonInfo.wonearn) | currency('',2)}}</span>
            </li>
          </ul>
        </div>
      </div>
      <preloader v-if="isLoader" class="loader-con loader-flex"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'detailsaccount',
  data () {
    return {
      userBox: 'Üyeler',
      userList: {},
      activeInfo: {},
      wonInfo: {},
      lostInfo: {},
      totalInfo: {},
      isLoader: false
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
    checkA1 () {
      if (this.$store.state.auth.role === 'A1') {
        return true
      }
    },
    checkG1 () {
      if (this.$store.state.auth.role === 'G1') {
        return true
      }
    },
    totalResult () {
      return  this.lostInfo.lostamount - this.wonDiff
    }
  },
  methods: {
    async getUserlist () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      }).catch(err => {console.log(err)})
    },
    async getDetailsInfo() {
      try {
        this.isLoader = true
        const activeinfo = await axios.post('/api/home/account/activeinfo', { userbox: this.userBox })
        const woninfo = await axios.post('/api/home/account/woninfo', { userbox: this.userBox })
        const lostinfo = await axios.post('/api/home/account/lostinfo', { userbox: this.userBox })
        const totalinfo = await axios.post('/api/home/account/totalinfo', { userbox: this.userBox })
        Promise.all([activeinfo, woninfo, lostinfo, totalinfo]).then(result => {
          this.activeInfo = result[0].data.activeinfo
          this.wonInfo = result[1].data.woninfo
          this.lostInfo = result[2].data.lostinfo
          this.totalInfo = result[3].data.totalinfo
        })
        this.isLoader = false
      } catch (error) {console.log(error)}
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
