<template>
  <div  v-if="$store.state.auth.role === 'Admin'" class="pages">
    <header class="title-2">
      <span class="set-title">Sistem Zaman Ayarlar</span>
    </header>
    <ul>
      <li class="fix-li-warning">
        <span class="sec-icon"><i class="fa fa-info fa-2x cl-f slbs"/></span>
        <span class="sec-text cl-g">
          Sayın üyeler bu alandaki degişikliklerden sonra sisteme yeniden Giriş yapılmalıdır!
        </span>
      </li>
      <div class="main-set-list">
        <section class="user-id-section">
          <li class="set-li"><h3>Tüm Bayiler İçin Varsayılan Ayarlar</h3></li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text">1.Devre Canlı Bahis Açılış</span>
            <input v-model="setTime.ilkcba" type="number" min="0"  max="45" class="inp set-inp" :input="setTime.ilkcba">
            <i v-if="done === 'ilkcba'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('ilkcba', setTime.ilkcba)"/>
            <span id="ilkcba" ref="ilkcba">Min 0 Max 45</span>
          </li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text">1.Devre Canlı Bahis Kapanış</span>
            <input v-model="setTime.ilkcbk" type="number" min="0" max="50" class="inp set-inp" :input="setTime.ilkcbk">
            <i v-if="done === 'ilkcbk'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('ilkcbk', setTime.ilkcbk)"/>
            <span id="ilkcbk">Min 0 Max 50</span>
          </li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text ">2.Devre Canlı Bahis Açılış</span>
            <input v-model="setTime.ikicba" type="number" min="45" max="100" class="inp set-inp" :input="setTime.ikicba">
            <i v-if="done === 'ikicba'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('ikicba', setTime.ikicba)"/>
            <span id="ikicba">Min 45 Max 100</span>
          </li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text ">2.Devre Canlı Bahis Kapanış</span>
            <input v-model="setTime.ikicbk" type="number" min="45" max="100" class="inp set-inp" :input="setTime.ikicbk">
            <i v-if="done === 'ikicbk'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('ikicbk', setTime.ikicbk)"/>
            <span id="ikicbk">Min 45 Max 100</span></li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text">Site Kapanış</span>
            <input v-model="setTime.sk" type="text" min="0" max="24" class="inp set-inp" :input="setTime.sk" required>
            <i v-if="done === 'sk'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('sk', setTime.sk)"/>
            <span id="sk">Format 00:00</span>
          </li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text">Site Açılış</span>
            <input v-model="setTime.sa" type="text" min="0" max="24" class="inp set-inp" :input="setTime.sa">
            <i v-if="done === 'sa'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('sa', setTime.sa)"/>
            <span id="sa">Format 00:00</span>
          </li>
          <li class="set-li">
            <i class="fa fa-clock set-li-icon fa-lg"/>
            <span class="set-li-text">Kupon Bekletme Suresi</span>
            <input v-model="setTime.kbs" type="number" min="0" max="60" class="inp set-inp" :input="setTime.kbs">
            <i v-if="done === 'kbs'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetTime('kbs', setTime.kbs)"/>
            <span id="kbs">Maximum Saniye 60</span>
          </li>
          <li><button  class="btn-set bg-g cp" @click="saveAll()">Yenile</button></li>
        </section>
      </div>
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
      done: null,
      isLcrollState: false
    }
  },
  mounted () {
    if (this.$store.state.auth.role === 'Admin') {
      this.getSetTime()
    }
  },
  methods: {
    async getSetTime () {
      await axios.get('/api/home/account/settime').then((result) => {
        if (result.data.data) {
          this.setTime = result.data.data
        }
      })
    },
    async updateSetTime (column, value) {
      const $ = (par) => document.querySelector(par)
      if(this.setTime.ilkcba > 45){
        $('#ilkcba').innerText = 'Bu alan 45\'ten büyük olamaz'
      } else if(this.setTime.ilkcbk > 50){
        $('#ilkcbk').innerText = 'Bu alan 50\'den büyük olamaz'
      } else if(this.setTime.ikicba < 45 || this.setTime.ikicba > 100){
        $('#ikicba').innerText = 'Bu alan 50\'küçük ve 100\'den büyük olamaz'
      } else if(this.setTime.ikicbk < 45 || this.setTime.ikicbk > 100){
        $('#ikicbk').innerText = 'Bu alan 50\'küçük ve 100\'den büyük olamaz'
      } else if(this.setTime.kbs > 60){
        $('#kbs').innerText = 'Bu alan 60\'dan büyük olamaz'
      } else if(!String(value).match(/[0-9]/) || value < -0) {
        alert('Bu alan sadece pozitif sayı olabilir')
      } else {
        await axios.put('/api/home/account/updatesettime', {column: column, value:value}).then((result) => {
          if (result.data.code === 200) {
            this.done = column
            setTimeout(() => {
              this.done = null
            }, 1500)
          }
        })
      }
    },
    saveAll(){
      this.$router.push('/welcome')
    },
  }
}
</script>
