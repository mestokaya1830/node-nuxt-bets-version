<template>
  <div class="wel-page">
    <h1 class="wel-title">Gasvete Hoş Geldiniz</h1>
    <div class="wel-con">
      <nuxt-link to="/home/soccer" class="wel-links wls" exact-active-class="navbar-active">
        <i class="fas fa-futbol wel-icons cl-g"/>
        <span class="wel-text">FUTBOL</span>
      </nuxt-link>
      <nuxt-link to="/home/soccerinplay" class="wel-links wlsi" exact-active-class="navbar-active">
        <i class="fas fa-bolt wel-icons cl-g"/>
        <span class="wel-text">FUTBOL CANLI</span>
      </nuxt-link>
      <nuxt-link to="/home/scores" class="wel-links wlsr" exact-active-class="navbar-active">
        <i class="fas fa-adjust wel-icons cl-y"/>
        <span class="wel-text">SKORLAR</span>
      </nuxt-link>
      <nuxt-link to="/home/account" class="wel-links wla" exact-active-class="navbar-active">
        <i class="fas fa-user-secret wel-icons cl-f"/>
        <span class="wel-text">ADMİN</span>
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  middleware: 'auth',
  name: 'index',
  data (){
    return{
    }
  },
  mounted () {
    if (this.$store.state.auth.role === 'U1') {
      this.getSettings()
    }else if (this.$store.state.auth.role === 'A2'){
      this.getSettings ()
    }
  },
  methods:{
    async getSettings(){
      await axios.get('/api/home/account/settings').then((result)=>{
        localStorage.setItem('set', JSON.stringify(result.data))
      })
    }
  }
}
</script>
