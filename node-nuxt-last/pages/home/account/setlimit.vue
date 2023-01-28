<template>
  <div v-if="$store.state.auth.role === 'Admin'" class="pages">
    <header class="title-2">
      <span class="set-title">Sistem Limit Ayarlar</span>
    </header>
    <ul>
      <li class="fix-li-warning">
        <span class="sec-icon"><i class="fa fa-info fa-2x cl-f slbs"/></span>
        <span class="sec-text cl-g">
          Sayın üyeler bu alanda yapılacak degişikliklerden sonra sistemden Giriş/Çıkış yapılmalıdır!
        </span>
      </li>
      <div class="main-set-list">
        <section class="user-id-section">
          <li class="set-li"><h3>Tüm Bayiler İçin Varsayılan Ayarlar</h3></li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Minimum Maç Sayısı</span>
            <input v-model="setLimit.minms" type="number" min="0" class="inp set-inp" :input="setLimit.minms">
            <i v-if="done === 'minms'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('minms', setLimit.minms)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Maximum Maç Sayısı</span>
            <input v-model="setLimit.maxms" type="number" min="0" class="inp set-inp" :input="setLimit.maxms">
            <i v-if="done === 'maxms'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('maxms',setLimit.maxms)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Minimum Kupon Miktarı</span>
            <input v-model="setLimit.minkm" type="number" min="0" class="inp set-inp" :input="setLimit.minkm">
            <i v-if="done === 'minkm'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('minkm',setLimit.minkm)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Maximum Kupon Miktarı</span>
            <input v-model="setLimit.maxkm" type="number" min="0" class="inp set-inp" :input="setLimit.maxkm">
            <i v-if="done === 'maxkm'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('maxkm',setLimit.maxkm)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Maximum Oran</span>
            <input v-model="setLimit.maxrate" type="number" min="0" class="inp set-inp" :input="setLimit.maxrate">
            <i v-if="done === 'maxrate'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('maxrate',setLimit.maxrate)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Maximum Kazanç</span>
            <input v-model="setLimit.maxearn" type="number" min="0" class="inp set-inp" :input="setLimit.maxearn">
            <i v-if="done === 'maxearn'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('maxearn',setLimit.maxearn)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Maximum Kupon İptal Sayısı</span>
            <input v-model="setLimit.maxkis" type="number" min="0" class="inp set-inp" :input="setLimit.maxkis">
            <i v-if="done === 'maxkis'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('maxkis',setLimit.maxkis)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Maximum Oran</span>
            <input v-model="setLimit.cmaxrate" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxrate">
            <i v-if="done === 'cmaxrate'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cmaxrate',setLimit.cmaxrate)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Minimum Maç Sayısı</span>
            <input v-model="setLimit.cminms" type="number" min="0" class="inp set-inp" :input="setLimit.cminms">
            <i v-if="done === 'cminms'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cminms',setLimit.cminms)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Maximum Maç Sayısı</span>
            <input v-model="setLimit.cmaxms" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxms">
            <i v-if="done === 'cmaxms'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cmaxms',setLimit.cmaxms)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Minimum Kupon Miktarı</span>
            <input v-model="setLimit.cminkm" type="number" min="0" class="inp set-inp" :input="setLimit.cminkm">
            <i v-if="done === 'cminkm'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cminkm',setLimit.cminkm)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Maximum Kupon Miktarı</span>
            <input v-model="setLimit.cmaxkm" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxkm">
            <i v-if="done === 'cmaxkm'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cmaxkm',setLimit.cmaxkm)"/>
          </li>
          <li class="set-li">
            <i class="fa fa-key set-li-icon fa-lg"/>
            <span class="set-li-text">Canlı Maximum Kazanç</span>
            <input v-model="setLimit.cmaxearn" type="number" min="0" class="inp set-inp" :input="setLimit.cmaxearn">
            <i v-if="done === 'cmaxearn'" class="fa fa-thumbs-up fa-2x cl-g slbs"/>
            <i v-else class="fa fa-save fa-2x cl-f slbs" @click="updateSetLimit('cmaxearn',setLimit.cmaxearn)"/>
          </li>
          <li> <button  class="btn-set bg-g cp" @click="saveAll()">Yenile</button></li>
        </section>
      </div>
    </ul>
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
  },
  methods: {
    async getSetLimit () {
      await axios.get('/api/home/account/setlimit').then((result) => {
        if (result.data.data) {
          this.setLimit = result.data.data
        }
      })
    },
    async updateSetLimit (column,value) {
      if(value && value > -1){
        await axios.put('/api/home/account/updatesetlimit', {column: column, value:value}).then((result) => {
          if (result.data.code === 200) {
            this.done = column
            setTimeout(() => {
              this.done = null
            }, 1500)
          }
        })
      } else {
        alert('Bu alan sadece pozitif sayı olabilir')
      }
    },
    saveAll () {
      this.$router.push('/welcome')
    }
  }
}
</script>

