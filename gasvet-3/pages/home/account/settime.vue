<template>
  <div class="pages"  v-if="$store.state.auth.role === 'A2'">
    <header class="title-2" id="content">
      <span class="set-title">SİSTEM ZAMAN AYARLARI</span>
      <button  class="btn-set bg-g cp" @click="saveAll()">Kaydet</button>
    </header>
    <ul class="main-set-list">
      <li class="fix-li-warning">
        <span class="sec-icon"><i class="fa fa-info fa-2x cl-f slbs"/></span>
        <span class="sec-text cl-g">
          Sayın üyeler bu alanda yapılacak degişikliklerden sonra sistemden Giriş/Çıkış yapılmalıdır!
        </span>
      </li>
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
    <li>
      <button  class="btn-set btn-set-fix cp bg-g" @click="saveAll()">Kaydet</button>
    </li>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'settime',
  data () {
    return {
      setTime: {},
      done: null,
      isLcrollState: false
    }
  },
  mounted () {
    if (this.$store.state.auth.role === 'A2') {
      this.getSetTime()
     this.goTop()
    }
  },
  methods: {
    async getSetTime () {
      await axios.get('/api/home/account/settime').then((result) => {
        if (result.data.data) {
          this.setTime = result.data.data
        }
      }).catch(err => {console.log(err)})
    },
    async updateSetTime (column, value) {
      await axios.put('/api/home/account/updatesettime', {column: column, value:value}).then((result) => {
        if (result.data.code === 200) {
          this.done = column
          setTimeout(() => {
            this.done = null
          }, 1500)
        }
      }).catch(err => {console.log(err)})
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    },
    saveAll(){
      this.$router.push('/welcome')
    }
  }
}
</script>
