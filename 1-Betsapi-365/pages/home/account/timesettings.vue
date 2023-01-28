<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>Zaman Ayarları</span>
      <select v-model="userBox" class="box-account" @change="getTimeSettings()">
        <option value="Üyeler">Üyeler</option>
        <option v-for="list in userList" :value="list.user" :key="list.id">{{ list.user }}</option>
      </select>
    </header>
    <ul class="main-set-list" v-if="userBox !== 'Üyeler'">
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">1.Devre Canlı Bahis Açılış</span>
        <input v-model="timeSettings.ilkcba" type="number" min="0"  max="45" class="inp set-inp" :input="timeSettings.ilkcba">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ilkcba'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('ilkcba', timeSettings.ilkcba)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">1.Devre Canlı Bahis Kapanış</span>
        <input v-model="timeSettings.ilkcbk" type="number" min="0" max="45" class="inp set-inp" :input="timeSettings.ilkcbk">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ilkcbk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('ilkcbk', timeSettings.ilkcbk)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text ">2.Devre Canlı Bahis Açılış</span>
        <input v-model="timeSettings.ikicba" type="number" min="45" max="100" class="inp set-inp" :input="timeSettings.ikicba">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ikicba'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('ikicba', timeSettings.ikicba)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text ">2.Devre Canlı Bahis Kapanış</span>
        <input v-model="timeSettings.ikicbk" type="number" min="45" max="100" class="inp set-inp" :input="timeSettings.ikicbk">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ikicbk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('ikicbk', timeSettings.ikicbk)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">Site Kapanış</span>
        <input v-model="timeSettings.sk" type="datetime-local"  class="inp set-inp sk">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'sk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('sk', timeSettings.sk)"/>
        <span>Saat Dilimi 24</span>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">Site Açılış</span>
        <input v-model="timeSettings.sa" type="datetime-local"  class="inp set-inp sa">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'sa'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateTimeSettings('sa', timeSettings.sa)"/>
        <span>Saat Dilimi 24</span>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Timesettings',
  data () {
    return {
      userList: {},
      timeSettings: {},
      userBox: 'Üyeler',
      done: '',
      scrollState: false
    }
  },
  mounted () {
    this.getUserList()
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
  },
  methods: {
    async getUserList () {
      await axios.get('/api/home/account/userlist').then((result) => {
        this.userList = result.data.userlist
      })
    },
    async getTimeSettings () {
      await axios.post('/api/home/account/timesettings', {userbox: this.userBox }).then((result) => {
        this.timeSettings = result.data.timesettings
      })
    },
    async updateTimeSettings (column, value) {
      await axios.post('/api/home/account/updatetimesettings', {column: column, value:value, userbox: this.userBox }).then((result) => {
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
