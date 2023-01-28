<template>
  <div class="pages">
    <header v-if="$store.state.auth.role === 'Admin'" class="title-2">
      <span>{{title}}</span>
    </header>
    <ul>
      <div class="main-set-list">
        <section class="user-id-section">
          <h3 class="mt20">Tüm Bayiler İçin Oran Ayarları</h3>
            <li v-if="newRate === '0'" class="set-li">
              <h3 class="cl-g">Oranlar orjinal durumdadır.</h3>
            </li>
            <li v-else class="set-li">
              <h3 class="cl-g">Ayarlı oran {{newRateText}}</h3>
            </li>
            <li class="set-li">
              <div class="mt5">Örnek Kullanım 0.10 Burda 10 yerine istedigniz oranı yazınız.</div>
            </li>
            <li class="set-li">
              <div class="mt5">0 yazıp Dişli simgesine tıklarsanız oranlar orjinale sıfırlanır.</div>
            </li>
            <li class="set-li">
              <input v-model="newRate" type="number" class="rate-inp" id="newrate">
              <i class="fas fa-minus-square  fa-2x cl-r slbs" @click="updateRate('Eksi')" title="Eksilt"/>
              <i class="fas fa-cog  fa-2x cl-f slbs" @click="updateRate('Orjinal')" title="Sıfırla"/>
              <img v-if="loader" src="~/static/img/loader.gif" alt="">
              <i v-if="done" class="fas fa-thumbs-up fa-2x cl-g mb10"/>
            </li>
            <button  class="btn-set cp bg-g" @click="saveAll()">Yenile</button>
        </section>
      </div>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name:'Ratesettings',
  props:{
    rate: { type: String, default: '' },
    title: { type: String, default: '' },
    type: { type: String, default: '' },
    color: { type: String, default: '' }
  },
  data () {
    return {
      done: false,
      loader: false,
      newRate: '',
      newRateText:''
    }
  },
  mounted () {
    this.getRate()
  },
  methods: {
    getRate (){
      if (localStorage.getItem('set')) {
        const ls = localStorage.getItem('set')
        const r = JSON.parse(ls).find(item => {return item.type === this.type})
        if (r) {
          this.newRateText = r.operate +' '+ r.rate.toFixed(2)
        }
      }
    },
    async updateRate (id) {
      if (this.newRate && String(this.newRate).match(/[0-9]/)) {
        this.loader = true
        await axios.put('/api/home/account/updaterates', {type:this.type, operate:id, newrate: this.newRate}).then((result) => {
          this.loader = false
          this.done = true
          setTimeout(function () {
            this.done = false
            this.newRateText = id +' '+ this.newRate
            this.newRate = ''
          }.bind(this), 1500)
        })
      }  else {
        alert('Bu alan sadece pozitif sayı olabilir')
      }
    },
    saveAll(){
      this.$router.push('/welcome')
    }
  }
}
</script>