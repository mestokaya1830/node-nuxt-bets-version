<template>
  <div class="pages">
    <header class="title-2">
      <span>Üye Detay</span>
      <i class="fas fa-angle-double-up back-icons" @click="$router.back()"/>
    </header>
    <ul class="account-con">
      <h1 class="userdetails-title">
        <i class="fas fa-user fa-3x cl-g"/>
        <span class="userdetails-title-text">{{ users.user | capitalize}}</span>
      </h1>
      <li class="userdetails-items">
        <span class="userdetails-text">Yetki</span>
        <span class="edit-value">{{ users.role }}</span>
      </li>
      <li v-if="checkS3 || checkB4" class="userdetails-items">
        <span class="userdetails-text">Limit</span>
        <span class="edit-value">{{ users.userlimit }}</span>
      </li>
      <li v-if="checkS3 || checkB4" class="userdetails-items">
        <span class="userdetails-text">Kalan Limit</span>
        <span class="edit-value">{{ users.remain }}</span>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Tarih</span>
        <span class="edit-value">{{ users.date | fullFormat }}</span>
      </li>
      <li v-if="checkA2" class="userdetails-items">
        <span class="userdetails-text">Sıfırlama</span>
        <span class="edit-value">{{ users.resetaccount | fullFormat }}</span>
      </li>
      <li v-if="checkS3 || checkB4" class="userdetails-items">
        <span class="userdetails-text">Ödendi</span>
        <div class="form-rows nick-input">
          <span class="edit-value">{{ users.payment | fullFormat }}</span>
        </div>
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'payment'"/>
        <i class="fa fa-save fa-2x edit-save cl-f" v-else @click="updatePayment()"/>
      </li>
      <li v-if="checkA2" class="userdetails-items">
        <span class="userdetails-text">Kredi</span>
        <div  class="form-rows nick-input">
          <input v-model="users.credit" type="text" class="set-inp" required>
        </div>
          <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'credit'"/>
          <i class="fa fa-save fa-2x edit-save cl-f" v-if="!done && !error" @click="updateCredit(users.user)"/>
          <span v-if="error" class="ml10">{{error}}</span>
      </li>
      <li v-if="checkU1 || checkA2" class="userdetails-items">
        <span class="userdetails-text">Kalan Kredi</span>
        <div  class="form-rows nick-input">
          <input v-model="users.creditremain" type="text" class="set-inp" required>
        </div>
      </li>
      <li class="userdetails-items">
        <span class="userdetails-text">Durum</span>
        <select v-if="!checkU1" v-model="users.state" class="selectbox box-set">
          <option value="aktif" selected>Aktif</option>
          <option value="pasif">Pasif</option>
        </select>
        <span v-else class="userdetails-text">{{ users.state }}</span>
        <i class="fa fa-thumbs-up fa-2x cl-g slbs mb15" v-if="done === 'state'"/>
        <i class="fa fa-save fa-2x edit-save cl-f" v-else @click="updateState()"/>
      </li>
      <li class="userdetails-trash">
        <i class="fa fa-trash fa-2x cl-r" v-if="!loader" @click="warningOpen = true"/>
        <img src="~/assets/img/loader.gif" alt="" v-if="loader">
      </li>
    </ul>
    <div v-if="warningOpen" class="dialog warning">
      <header class="title-2">
        <h3 class="cl-w">Uyarı</h3>
      </header>
      <div class="dialog-content">
        <p class="warning-text">Bu kullanıcıyı silmekle ona ait olan bilgilerin hepsi silinmiş olur!</p>
      </div> 
      <footer class="dialog-footer">
        <input type="button" value="Vazgeç" class="btn-dialog bg-r" @click="warningOpen = false">
        <input type="button" value="Sil" class="btn-dialog bg-f" @click="deleteUser($route.params.id)">
      </footer>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'Userdeails',
  data () {
    return {
      users: {},
      loader: false,
      warningOpen: false,
      done:'',
      error:''
    }
  },
  computed: {
    checkU1 () {
      if (this.$store.state.auth.role === 'U1') {
        return true
      }
    },
    checkA2 () {
      if (this.$store.state.auth.role === 'A2') {
        return true
      }
    },
    checkS3 () {
      if (this.$store.state.auth.role === 'S3') {
        return true
      }
    },
    checkB4 () {
      if (this.$store.state.auth.role === 'B4') {
        return true
      }
    }
  },
  filters: {
    fullFormat: function (value) {
      return moment.utc(value, "YYYY-MM-DD H:mm:ss").tz('Europe/Istanbul').format("YYYY-MM-DD H:mm:ss")
    }
  },
  mounted () {
    this.userdetails()
  },
  methods: {
    async userdetails () {
      await axios.get('/api/home/account/users/' + this.$route.params.id).then((result) => {
        this.users = result.data.users
      })
    },
    async updateCredit () {
      await axios.post('/api/home/account/users/updatecredit/' + this.$route.params.id, {credit: this.users.credit}).then((result) => {
        if (result.data.code === 200) {
          this.done = 'credit'
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1000)
        }else{
          this.error = result.data.message
          setTimeout(function () {
            this.error = ''
          }.bind(this), 4000)
        }
      })
    },
    async updatePayment () {
      await axios.post('/api/home/account/users/payment/' + this.$route.params.id, this.users).then((result) => {
        if (result.data.code === 200) {
          this.done = 'payment'
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1000)
        }
      })
    },
    async updateState () {
      await axios.post('/api/home/account/users/state/' + this.$route.params.id, this.users).then((result) => {
        if (result.data.code === 200) {
          this.done = 'state'
          setTimeout(function () {
            this.done = ''
          }.bind(this), 1000)
        }
      })
    },
    async deleteUser (id) {
      this.warningOpen = false
      this.loader = true
      await axios.delete('/api/home/account/usersdelete/' + id).then((result) => {
        this.alert = result.data.message
        this.loader = false
        setTimeout(function () {
          this.$router.push('/home/account/users')
        }.bind(this), 1000)
      })
    }
  }
}
</script>
