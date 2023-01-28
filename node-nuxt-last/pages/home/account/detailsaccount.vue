<template>
  <div class="pages">
    <header class="title-2">
      <span class="set-title">Kupon Raporu</span>
      <select v-if="checkAdmin || checkSubadmin" v-model="userBox" class="selectbox box-account" @change="getDetailsInfo()">
        <option value="Üyeler" selected>Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <div class="account-con">
      <i class="fas fa-chart-bar fa-4x cl-g big-icon"/>
      <div class="details-account-inside user-id-section">
        <div class="daii">
          <h3 class="daiit bg-y">AKTİFLER</h3>
          <ul class="daiul">
            <li class="daili">
              <span>Adet</span>
              <span>{{activeInfo.activecount}}</span>
            </li>
            <li class="daili">
              <span>Miktar</span>
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
              <span>Miktar</span>
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
              <span>Miktar</span>
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
              <span>Miktar</span>
              <span>{{totalInfo.totalamount | currency('',2)}}</span>
            </li>
            <li class="daili">
              <span>Ödenen</span>
              <span>{{wonInfo.wonearn | currency('',2)}}</span>
            </li>
            <li class="daili" v-if="checkSubmember">
              <span>Sonuç</span>
              <span>{{(wonInfo.wonearn - totalInfo.totalamount) | currency('',2)}}</span>
            </li>
            <li class="daili" v-else>
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
  name: 'Detailsaccount',
  data () {
    return {
      userBox: 'Üyeler',
      userList: {},
      activeInfo: {},
      wonInfo: {},
      lostInfo: {},
      totalInfo: {},
      credit: {},
      subcredit: {},
      isLoader: false
    }
  },
  mounted () {
    this.getUserlist ()
    this.getDetailsInfo()
  },
  computed: {
    checkMember () {
      if (this.$store.state.auth.role === 'Member') {
        return true
      }
    },
    checkAdmin () {
      if (this.$store.state.auth.role === 'Admin') {
        return true
      }
    },
    checkSubadmin () {
      if (this.$store.state.auth.role === 'Subadmin') {
        return true
      }
    },
    checkSubmember () {
      if (this.$store.state.auth.role === 'Submember') {
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
      })
    },
    async getDetailsInfo() {
      this.isLoader = true
      const activeinfo = await axios.post('/api/home/account/activeinfo', { userbox: this.userBox })
      const woninfo = await axios.post('/api/home/account/woninfo', { userbox: this.userBox })
      const lostinfo = await axios.post('/api/home/account/lostinfo', { userbox: this.userBox })
      const totalinfo = await axios.post('/api/home/account/totalinfo', { userbox: this.userBox })
      const credit = await axios.post('/api/home/account/creditinfo',{userbox:'Üyeler'})
      const subcredit = await axios.post('/api/home/account/subcredit',{userbox:'Üyeler'})
      // Promise.all([activeinfo, woninfo, lostinfo, totalinfo, credit, subcredit]).then(result => {
        if (activeinfo.data.activeinfo) {
          this.activeInfo = activeinfo.data.activeinfo
        } else {
          this.activeInfo = {}
        }
        if (woninfo.data.woninfo) {
          this.wonInfo = woninfo.data.woninfo
        } else {
          this.wonInfo = {}
        }
        if (lostinfo.data.lostinfo) {
          this.lostInfo = lostinfo.data.lostinfo
        } else {
          this.lostInfo = {}
        }
        if (totalinfo.data.totalinfo) {
          this.totalInfo = totalinfo.data.totalinfo
        } else {
          this.totalInfo = {}
        }
        this.credit = credit.data.credit
        this.subcredit = subcredit.data.subcredit
      // })
      this.isLoader = false
    }
  }
}
</script>
