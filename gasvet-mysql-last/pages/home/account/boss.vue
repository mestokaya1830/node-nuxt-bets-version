<template>
  <div class="pages">
    <header class="title-2">
      <span class="set-title">PANEL</span>
    </header>
    <div class="boss-con">
      <ul class="main-list">
        <li class="set-li">
          <input type="textarea" v-model="anons" placeholder="message...">
          <button @click="setAnons()" class="ml20">Publish</button>
          <button @click="removeAnons()" class="ml20">Remove</button>
        </li>
      </ul>
    </div>
    <preloader v-if="loader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Boss',
  data () {
    return {
      anons:null,
      loader: null
    }
  },
  computed: {
    checkBoss () {
      if (this.$store.state.auth.role === 'Boss') {
        return true
      }
    }
  },
  mounted () {
  },
  methods: {
    async setAnons(){
      console.log(this.anons)
      await axios.post('/api/home/account/setanons',{anons:this.anons}).then().catch(err => {console.log(err)})
    },
    async removeAnons(){
      console.log(this.anons)
      await axios.post('/api/home/account/removeanons').then().catch(err => {console.log(err)})
    }
  }
}
</script>