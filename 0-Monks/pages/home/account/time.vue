<template>
  <div class="pages">
    <header class="title-2" id="content">
      <span>SİSTEM ZAMAN AYARLARI</span>
      <button  class="btn-set bg-g cp" @click="saveAll()">Kaydet</button>
    </header>
    <ul class="main-set-list">
      <li class="set-li"><h3>Tüm Bayiler İçin Varsayılan Ayarlar</h3></li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">1.Devre Canlı Bahis Açılış</span>
        <input v-model="setTime.ilkcba" type="number" min="0"  max="45" class="inp set-inp" :input="setTime.ilkcba">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ilkcba'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('ilkcba', setTime.ilkcba)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">1.Devre Canlı Bahis Kapanış</span>
        <input v-model="setTime.ilkcbk" type="number" min="0" max="45" class="inp set-inp" :input="setTime.ilkcbk">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ilkcbk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('ilkcbk', setTime.ilkcbk)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text ">2.Devre Canlı Bahis Açılış</span>
        <input v-model="setTime.ikicba" type="number" min="45" max="100" class="inp set-inp" :input="setTime.ikicba">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ikicba'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('ikicba', setTime.ikicba)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text ">2.Devre Canlı Bahis Kapanış</span>
        <input v-model="setTime.ikicbk" type="number" min="45" max="100" class="inp set-inp" :input="setTime.ikicbk">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'ikicbk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('ikicbk', setTime.ikicbk)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">Site Kapanış</span>
        <input v-model="setTime.sk" type="text" min="0" max="24" class="inp set-inp" :input="setTime.sk" required>
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'sk'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('sk', setTime.sk)"/>
        <span>Saat Dilimi 24</span>
      </li>
      <li class="set-li">
        <i class="fa fa-clock set-li-icon fa-lg"/>
        <span class="set-li-text">Site Açılış</span>
        <input v-model="setTime.sa" type="text" min="0" max="24" class="inp set-inp" :input="setTime.sa">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'sa'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetTime('sa', setTime.sa)"/>
        <span>Saat Dilimi 24</span>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Settime',
  data () {
    return {
      setTime: {},
      done: '',
      scrollState: false
    }
  },
  mounted () {
    this.getsettime()
    window.scroll({top: 0, left: 0, behavior: 'smooth'})
  },
  methods: {
    async getsettime () {
      await axios.get('/api/home/account/settime').then((result) => {
        this.setTime = result.data.data
      })
    },
    async updateSetTime (column, value) {
      await axios.post('/api/home/account/updatesettime', {column: column, value:value}).then((result) => {
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
