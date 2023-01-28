<template>
  <div class="pages po-r">
    <header class="title-2" id="content">
      <span class="set-title">SPOR DÜZENLE</span>
      <span class="badge bg-g">{{branchLength}}</span>
    </header>
    <ul class="main-set-list">
      <li v-for="(list, index) in branch" :key="index" class="fix-li">
        <div class="fix-1">
          <input type="checkbox" class="set-cb" v-model="list[$store.state.auth.user]" :id="list.bid"  @change="updateBranch(list[$store.state.auth.user], list.bid)" />
          <label class="set-lb" :for="list.bid"></label>
          <span class="list-mn">{{list.bn}}</span>
        </div>
      </li>
      <li>
        <button  class="btn-set btn-set-fix cp bg-g" @click="saveAll()">Kaydet</button>
      </li>
    </ul>
    <preloader v-if="isLoader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'branchsettings',
  data () {
    return {
      branch: {},
      isLoader: false,
      branchLength:0,
    }
  },
  mounted () {
    this.getBranch()
     this.goTop()
  },
  methods: {
    async getBranch () {
      this.isLoader = true
      await axios.get('/api/home/account/branch').then((result) => {
        if (result.data.data) {
          this.branch = result.data.data
          this.branchLength = result.data.data.length
        }
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async updateBranch (state, bid) {
      this.setloader = bid
      await axios.put('/api/home/account/updatebranch', {type:'br', state:state, bid: bid}).then().catch(err => {console.log(err)})
    },
    saveAll(){
       this.$router.push('/welcome')
    },
    goTop(){
      var el = document.getElementById('content')
      el.scrollIntoView()
    }
  }
}
</script>
