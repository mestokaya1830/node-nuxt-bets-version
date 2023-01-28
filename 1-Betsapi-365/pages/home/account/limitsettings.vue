<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Limit Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getLimitSettings()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list"  v-if="userBox !== 'Üyeler'">
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Minimum Maç Sayısı</span>
        <input v-model="limitSettings.minms" type="number" min="0" max="100" class="inp set-inp" :input="limitSettings.minms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'minms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('minms', limitSettings.minms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Maç Sayısı</span>
        <input v-model="limitSettings.maxms" type="number" min="0" class="inp set-inp" :input="limitSettings.maxms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('maxms',limitSettings.maxms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Minimum Kupon Miktarı</span>
        <input v-model="limitSettings.minkm" type="number" min="0" class="inp set-inp" :input="limitSettings.minkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'minkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('minkm',limitSettings.minkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Kupon Miktarı</span>
        <input v-model="limitSettings.maxkm" type="number" min="0" class="inp set-inp" :input="limitSettings.maxkm" step="5000" max="100000">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('maxkm',limitSettings.maxkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Oran</span>
        <input v-model="limitSettings.maxrate" type="number" min="0" class="inp set-inp" :input="limitSettings.maxrate">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxrate'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('maxrate',limitSettings.maxrate)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Kupon İptal Sayısı</span>
        <input v-model="limitSettings.maxkis" type="number" min="0" class="inp set-inp" :input="limitSettings.maxkis">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxkis'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('maxkis',limitSettings.maxkis)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Minimum Maç Sayısı</span>
        <input v-model="limitSettings.cminms" type="number" min="0" class="inp set-inp" :input="limitSettings.cminms" step="500" max="5000">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cminms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('cminms',limitSettings.cminms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Maç Sayısı</span>
        <input v-model="limitSettings.cmaxms" type="number" min="0" class="inp set-inp" :input="limitSettings.cmaxms" step="500" max="5000">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('cmaxms',limitSettings.cminms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Minimum Kupon Miktarı</span>
        <input v-model="limitSettings.cminkm" type="number" min="0" class="inp set-inp" :input="limitSettings.cminkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cminkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('cminkm',limitSettings.cminkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Kupon Miktarı</span>
        <input v-model="limitSettings.cmaxkm" type="number" min="0" class="inp set-inp" :input="limitSettings.cmaxkm" step="500" max="5000">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLimitSettings('cmaxkm',limitSettings.cmaxkm)"/>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Limitsettings',
  data () {
    return {
      userList: {},
      limitSettings: {},
      userBox: 'Üyeler',
      done:'',
      scrollState: false
    }
  },
  mounted () {
    this.getUserList()
    this.goTop()
  },
  methods: {
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getLimitSettings () {
      await axios.post('/api/home/account/limitsettings', { userbox: this.userBox }).then((result) => {
        this.limitSettings = result.data.limitsettings
      })
    },
    async updateLimitSettings (column,value) {
      await axios.post('/api/home/account/updatelimitsettings', {column: column, value:value,userbox: this.userBox }).then((result) => {
        if (result.data.code === 200) {
          this.done = column
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1500)
        }
      })
    },
    checkDash () {
      if (this.$store.state.auth.role === 'U1' || this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    goTop () {
      this.$refs.scroll.scrollTop = 0
    },
    scrollVisible () {
      if (this.$refs.scroll.scrollTop > 20) {
        this.scrollState = true
      } else {
        this.scrollState = false
      }
    }
  }
}
</script>

