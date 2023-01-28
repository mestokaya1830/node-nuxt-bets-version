<template>
  <div>
     <header class="chat-header">
      <i class="fas fa-user-circle chat-title-icon fa-2x"/>
      <div class="chat-user-title cp">
        <span class="chat-header-text" @click="setUserList()">{{chatName | capitalize}} <i class="fas fa-arrow-left ml20" v-if="chatName" /></span>
        <i class="fas fa-window-close chat-close" @click="closeChat()"/>
      </div>
    </header>
    <div class="chat-user-side">
      <ul v-if="userList" class="chat-user-scroll">
        <li v-for="(list, index) in chatUsers" :key="index" class="chat-user-list" @click="updateMsg(list.user, list.count)">
          <i class="fas fa-user-circle cul-icon cl-g" v-if="list.logincheck === 'active'"/>
          <i class="fas fa-user-circle cul-icon cl-o" v-else />
          <span class="chat-user-list-text">{{ list.user | capitalize}}</span>
          <span class="badge bg-g chat-count" v-if="list.count > 0">{{ list.count }}</span>
        </li>
      </ul>
      <chatside v-else :username="chatName"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import chatside from '@/components/chatside'
import Vue2Filters from 'vue2-filters'
import socket from '~/plugins/socket.io.js'
export default {
  middleware: 'auth',
  name: 'Chat',
  mixins: [Vue2Filters.mixin],
  components: {
   chatside
  },
  props: {
    openChat: Boolean
  },
  data() {
    return {
      chatUsers: {},
      userList: true,
      selectedUser: false,
      chatName: '',
      checkFullscreen: false
    }
  },
  mounted () {
    this.getChatUser()
    if (screen.width < 480 || navigator.userAgent.indexOf('iPhone') != -1) {
      this.openFullscreen()
    }
  },
  methods: {
    openFullscreen() {
      this.checkFullscreen = true
      const el = document.body
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      }
    },
    closeFullscreen() {
      this.checkFullscreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    async getChatUser () {
      await axios.get('/api/home/chat').then((result) => {
        this.chatUsers = result.data.chatuser
      })
    },
    async updateMsg (user, msgcount) {
      this.chatName = user
      this.userList = false
      this.selectedUser = true
      socket.emit('selectedusers', this.chatName)
      if (msgcount > 0) {
        this.chatUsers.forEach(element => {
          if (element.user === user) {
            element.count = ''
            this.$store.commit('setMsgCount', this.$store.state.msgcount-msgcount)
          }
        })
        await axios.post('/api/home/updatemsg', {sender: user})
      }
    },
    setUserList (){
      this.userList = true
      this.chatName = ''
    },
    closeChat () {
      this.$store.commit('setOpenChat', false)
      this.setUserList ()
      socket.emit('closedusers', this.$store.state.auth.user)
      if(this.checkFullscreen === true){
        this.closeFullscreen()
      }
    }
  }
}
</script>
