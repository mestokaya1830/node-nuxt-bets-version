<template>
  <div class="pages">
    <header v-if="$store.state.auth.role === 'Admin'" class="title-2">
      <span>{{title}}</span>
    </header>
    <ul v-if="$route.name === 'home-account-soccerratelimit' || $route.name === 'home-account-basketratelimit'">
      <div class="main-set-list">
        <section class="user-id-section">
          <h3>Tüm Bayiler İçin Oran Kısıtlama</h3>
          <li v-if="rateLimit === '0'" class="set-li">
            <h3 class="cl-g">Oranlar orjinal durumdadır.</h3>
          </li>
          <li v-else class="set-li">
            <h3 class="cl-g">Ayarlı Limit {{newLimitText}}</h3>
          </li>
          <li class="set-li">
              <div class="mt5">Örnek 50,100,200</div>
            </li>
            <li class="set-li">
              <div class="mt5">0 yazıp Dişli simgesine tıklarsanız oranlar orjinale sıfırlanır.</div>
            </li>
          <li class="set-li">
            <input v-model="rateLimit" type="number" class="rate-inp" id="rateLimit">
            <i class="fas fa-save  fa-2x cl-g slbs" @click="updateLimit('limit')" title="Kaydet"/>
            <i class="fas fa-cog  fa-2x cl-f slbs" @click="updateLimit('reset')" title="Sıfırla"/>
            <img v-if="loader" src="~/static/img/loader.gif" alt="">
            <i v-if="done " class="fas fa-thumbs-up fa-2x cl-g mb10"/>
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
  name:'Limitsettings',
  props:{
    limit: { type: String, default: '' },
    title: { type: String, default: '' },
    typelimit: { type: String, default: '' },
    color: { type: String, default: '' }
  },
  data () {
    return {
      done: false,
      loader: false,
      rateLimit: '',
      newLimitText:''
    }
  },
  mounted () {
    this.getRate()
  },
  methods: {
    getRate () {
      if (localStorage.getItem('set')) {
        const ls = localStorage.getItem('set')
        const rl = JSON.parse(ls).find(item => {return item.type === this.typelimit})
        if(rl) {
          this.newLimitText = rl.limit
        }
      }
    },
    async updateLimit (id) {
      if (this.rateLimit && this.rateLimit > -1) {
        this.loader = true
        await axios.put('/api/home/account/updatelimits', {typelimit:this.typelimit, operate:id,ratelimit:this.rateLimit}).then((result) => {
          this.loader = false
          this.done = true
          setTimeout(function () {
            this.done = false
            this.newLimitText = this.rateLimit
            this.rateLimit = null
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