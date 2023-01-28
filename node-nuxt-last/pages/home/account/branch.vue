<template>
  <div class="pages po-r">
    <header class="title-2">
      <span class="set-title">Branş Düzenle</span>
      <span class="badge bg-g">{{branchLength}}</span>
    </header>
    <ul>
      <div class="main-set-list">
        <section class="user-id-section">
          <li v-for="(list, index) in branch" :key="index" class="fix-li">
            <div class="fix-1">
              <input 
                v-model="list[$store.state.auth.user]" :id="list.bid" 
                type="checkbox" 
                class="set-cb" 
                @change="updateBranch(list[$store.state.auth.user], list.bid)" />
              <label class="set-lb" :for="list.bid"></label>
              <span class="list-mn">{{list.bn}}</span>
            </div>
          </li>
          <li>
            <button  class="btn-set btn-set-fix cp bg-g" @click="saveAll()">Kaydet</button>
          </li>
        </section>
      </div>
    </ul>
    <preloader v-if="isLoader" class="loader-con"/>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Branch',
  data () {
    return {
      branch: {},
      isLoader: false,
      branchLength:0,
    }
  },
  mounted () {
    this.getBranch()
  },
  methods: {
    async getBranch () {
      this.isLoader = true
      await axios.get('/api/home/account/branch').then((result) => {
        if (result.data.branch) {
          this.branch = result.data.branch
          this.branchLength = result.data.branch.length
        }
        this.isLoader = false
      })
    },
    async updateBranch (state, bid) {
      this.setloader = bid
      await axios.put('/api/home/account/updatebranch', {type:'br', state:state, bid: bid})
    },
    saveAll(){
       this.$router.push('/welcome')
    }
  }
}
</script>
