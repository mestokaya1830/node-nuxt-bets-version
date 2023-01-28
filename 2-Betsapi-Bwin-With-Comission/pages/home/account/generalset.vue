<template>
  <div class="pages po-r" v-if="$store.state.auth.role === 'A1'">
    <header class="title-2" id="content">
      <span class="set-title">SİSTEM GENEL AYARLARI</span>
    </header>
    <ul class="main-set-list">
      <li class="fix-li-warning">
        <span class="sec-icon"><i class="fa fa-info fa-2x cl-f slbs"/></span>
        <span class="sec-text cl-g">
          Sayın üyeler bu alanda yapılacak degişikliklerden sonra sistemden Giriş/Çıkış yapılmalıdır!
        </span>
      </li>
      <li class="fix-li">
        <div class="fix-1">
          <input type="checkbox" class="set-cb" :id="users.autopay" v-model="users.autopay" @change="updateAutoPay()" />
          <label class="set-lb" :for="users.autopay"></label>
          <span class="list-mn">Kazanan Kuponları Otomatik Öde?</span>
        </div>
      </li>
      <li class="fix-li-2">
        <i class="fas fa-key title-list-icon cl-g"/>
        <span class="fix-li-items">Hatalı Giris Sayısı</span>
        <input v-model="users.logincount" type="number" min="0" max="100" class="inp set-inp" :input="users.logincount">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'logincount'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateLoginCount()"/>
        <span class="cl-g">Dikkat! Verdiginiz deger sınırı dolarsa sisteme giriş yapılamaz...</span>
      </li>
      <li class="fix-li-2">
        <i class="fas fa-key title-list-icon cl-g"/>
        <span class="fix-li-items">Bayi Komisyon</span>
        <input v-model="users.usercomission" type="number" min="0" max="50" class="inp set-inp" :input="users.usercomission">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'usercomission'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateUserComission()"/>
        <span class="cl-g">{{usererror}}</span>
      </li>
      <li class="fix-li-2">
        <i class="fas fa-key title-list-icon cl-g"/>
        <span class="fix-li-items">Müşteri Komisyon</span>
        <input v-model="users.personcomission" type="number" min="0" max="10" class="inp set-inp" :input="users.personcomission">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'personcomission'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updatePersonComission()"/>
        <span class="cl-g">{{personerror}}</span>
      </li>
      <li>
      <li class="fix-li-2">
        <i class="fas fa-key title-list-icon cl-g"/>
        <span class="fix-li-items">Bayi Kupon İptal Süresi</span>
        <input v-model="users.usercancelbet" type="number" min="0" step="5" class="inp set-inp" :input="users.usercancelbet">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'usercancelbet'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updateUserCancelbet()"/>
        <span class="cl-g">0 iptal edemez demektir!</span>
      </li>
      <li class="fix-li-2">
        <i class="fas fa-key title-list-icon cl-g"/>
        <span class="fix-li-items">Bireysel Kupon İptal Süresi</span>
        <input v-model="users.personcancelbet" type="number" min="0" step="5" class="inp set-inp" :input="users.personcancelbet">
        <i class="fa fa-thumbs-up fa-2x cl-g slbs" v-if="done === 'personcancelbet'"/>
        <i class="fa fa-save fa-2x cl-f slbs" v-else @click="updatePersonCancelbet()"/>
        <span class="cl-g">0 iptal edemez demektir!</span>
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
  name: 'security',
  data () {
    return {
      users: {},
      isLoader:false,
      done:'',
      usererror:'',
      personerror:''
    }
  },
  mounted () {
    this.getUsers()
     this.goTop()
  },
  methods: {
    async getUsers () {
      this.isLoader = true
      await axios.get('/api/home/account/usersset').then((result) => {
        this.users = result.data.users[0]
        this.isLoader = false
      }).catch(err => {console.log(err)})
    },
    async updateAutoPay () {
      await axios.put('/api/home/account/updateautopay', {autopay:this.users.autopay}).then((result) => {
      }).catch(err => {console.log(err)})
    },
    async updateLoginCount () {
      await axios.put('/api/home/account/updatelogincount', {logincount:this.users.logincount}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'logincount'
          setTimeout(() => {
            this.done = ''
          }, 1500)
        }
      }).catch(err => {console.log(err)})
    },
    async updateUserComission () {
      if (this.users.usercomission > 50) {
        this.usererror = 'Komisyon 50 den fazla olamaz!'
      } else {
        this.usererror = ''
        await axios.put('/api/home/account/updateusercomission', {userbox:'Üyeler', usercomission:this.users.usercomission}).then((result) => {
          if (result.data.code === 200) {
            this.done = 'usercomission'
            setTimeout(() => {
              this.done = ''
            }, 1500)
          }
        }).catch(err => {console.log(err)})
      }
    },
    async updatePersonComission () {
      if (this.users.personcomission > 10) {
        this.personerror = 'Komisyon 10 den fazla olamaz!'
      } else {
        this.personerror = ''
        await axios.put('/api/home/account/updatepersoncomission', {userbox:'Üyeler', personcomission:this.users.personcomission}).then((result) => {
          if (result.data.code === 200) {
            this.done = 'personcomission'
            setTimeout(() => {
              this.done = ''
            }, 1500)
          }
        }).catch(err => {console.log(err)})
      }
    },
    async updateUserCancelbet () {
      await axios.put('/api/home/account/updateusercancelbet', {userbox:'Üyeler', usercancelbet:this.users.usercancelbet}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'usercancelbet'
          setTimeout(() => {
            this.done = ''
          }, 1500)
        }
      }).catch(err => {console.log(err)})
    },
    async updatePersonCancelbet () {
      await axios.put('/api/home/account/updatepersoncancelbet', {userbox:'Üyeler', personcancelbet:this.users.personcancelbet}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'personcancelbet'
          setTimeout(() => {
            this.done = ''
          }, 1500)
        }
      }).catch(err => {console.log(err)})
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
