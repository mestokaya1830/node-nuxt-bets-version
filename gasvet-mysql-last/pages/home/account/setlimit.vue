<template>
  <div class="pages" v-if="$store.state.auth.role === 'Admin'">
    <header class="title-2" id="content">
      <span class="set-title">SİSTEM LİMİT AYARLARI</span>
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
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Minimum Maç Sayısı</span>
        <input v-model="setLimit.minms" type="number" min="0" class="inp set-inp" :input="setLimit.minms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'minms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('minms', setLimit.minms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Maç Sayısı</span>
        <input v-model="setLimit.maxms" type="number" min="0" class="inp set-inp" :input="setLimit.maxms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('maxms',setLimit.maxms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Minimum Kupon Miktarı</span>
        <input v-model="setLimit.minkm" type="number" min="0" class="inp set-inp" :input="setLimit.minkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'minkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('minkm',setLimit.minkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Kupon Miktarı</span>
        <input v-model="setLimit.maxkm" type="number" min="0" class="inp set-inp" :input="setLimit.maxkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('maxkm',setLimit.maxkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Oran</span>
        <input v-model="setLimit.maxrate" type="number" min="0" class="inp set-inp" :input="setLimit.maxrate">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxrate'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('maxrate',setLimit.maxrate)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Kazanç</span>
        <input v-model="setLimit.maxearn" type="number" min="0" class="inp set-inp" :input="setLimit.maxearn">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxearn'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('maxearn',setLimit.maxearn)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Maximum Kupon İptal Sayısı</span>
        <input v-model="setLimit.maxkis" type="number" min="0" class="inp set-inp" :input="setLimit.maxkis">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'maxkis'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('maxkis',setLimit.maxkis)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Oran</span>
        <input v-model="setLimit.cmaxrate" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxrate">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxrate'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cmaxrate',setLimit.cmaxrate)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Minimum Maç Sayısı</span>
        <input v-model="setLimit.cminms" type="number" min="0" class="inp set-inp" :input="setLimit.cminms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cminms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cminms',setLimit.cminms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Maç Sayısı</span>
        <input v-model="setLimit.cmaxms" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxms">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxms'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cmaxms',setLimit.cminms)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Minimum Kupon Miktarı</span>
        <input v-model="setLimit.cminkm" type="number" min="0" class="inp set-inp" :input="setLimit.cminkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cminkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cminkm',setLimit.cminkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Kupon Miktarı</span>
        <input v-model="setLimit.cmaxkm" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxkm">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxkm'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cmaxkm',setLimit.cmaxkm)"/>
      </li>
      <li class="set-li">
        <i class="fa fa-key set-li-icon fa-lg"/>
        <span class="set-li-text">Canlı Maximum Kazanç</span>
        <input v-model="setLimit.cmaxearn" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxearn">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'cmaxearn'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateSetLimit('cmaxearn',setLimit.cmaxearn)"/>
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
  name: 'Setlimit',
  data () {
    return {
      setLimit: {},
      done:null,
      isScrollState: false
    }
  },
  mounted () {
    if (this.$store.state.auth.role === 'Admin') {
      this.getSetLimit()
    }
    this.goTop()
  },
  methods: {
    async getSetLimit () {
      await axios.get('/api/home/account/setlimit').then((result) => {
        if (result.data.data) {
          this.setLimit = result.data.data
        }
      }).catch(err => {console.log(err)})
    },
    async updateSetLimit (column,value) {
      await axios.put('/api/home/account/updatesetlimit', {column: column, value:value}).then((result) => {
        if (result.data.code === 200) {
          this.done = column
          setTimeout(() => {
            this.done = null
          }, 1500)
        }
      }).catch(err => {console.log(err)})
    },
    goTop(){
      const el = document.getElementById('content')
      el.scrollIntoView()
    },
    saveAll(){
      this.$router.push('/welcome')
    }
  }
}
</script>

