<template>
  <div>
     <header class="chat-header">
      <i class="fas fa-user-circle chat-title-icon fa-2x"/>
        <span class="chat-header-text" @click="setUserList()">
          {{chatName | capitalize}}
          <i v-if="chatName" class="fas fa-arrow-left ml20" />
        </span>
        <div class="chat-header-control">
          <i class="fas fa-trash-alt chat-trash" v-if="chatName" @click="deleteMsg" />
          <span class="chat-close" title="Kapat"  @click="closeChat()">X</span>
        </div>
    </header>
    <div class="chat-user-side">
      <ul v-if="userList" class="chat-user-scroll">
        <li v-for="(list, index) in chatUsers" :key="index" class="chat-user-list" @click="updateMsg(list.user, list.count)">
          <i v-if="list.logincheck === 'active'" class="fas fa-user-circle cul-icon cl-g"/>
          <i v-else class="fas fa-user-circle cul-icon cl-o" />
          <span class="chat-user-list-text">{{ list.user | capitalize}}</span>
          <span v-for="(chatcounter, index) in list.count" :key="index">
            <span v-if="chatcounter.count" class="badge bg-g chat-count">{{ chatcounter.count }}</span>
          </span>
        </li>
      </ul>
      <chatside v-else :username="chatName" ref="deleteMsg" :deleteMsg="deleteMsg" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Vue2Filters from 'vue2-filters'
import socket from '~/plugins/socket.io.js'
export default {
  middleware: 'clientAuth',
  name: 'Chat',
  mixins: [Vue2Filters.mixin],
  props: {
    openChat: Boolean
  },
  data () {
    return {
      chatUsers: {},
      userList: true,
      selectedUser: false,
      chatName: '',
      checkFullscreen: false,
    }
  },
  mounted () {
    this.getChatUser()
    if (screen.width < 480 || navigator.userAgent.indexOf('iPhone') != -1) {
      this.openFullscreen()
    }
  },
  methods: {
    deleteMsg(){
      this.$refs.deleteMsg.deleteMsg()
    },
    openFullscreen () {
      this.checkFullscreen = true
      let el = document.body
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      }
    },
    closeFullscreen () {
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
    async updateMsg (sender, msgcount) {
      this.chatName = sender
      this.userList = false
      this.selectedUser = true
      socket.emit('selectedusers', this.chatName)
      if (msgcount) {
        this.chatUsers.forEach(element => {
          if (element.user === sender) {
            element.count = ''
            this.$store.commit('setMsgCount', this.$store.state.msgcount-msgcount)
          }
        })
        await axios.put('/api/home/updatemsg', { sender })
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