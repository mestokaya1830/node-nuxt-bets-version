<template>
  <div class="page">
      <ul ref="chatarea" class="chat-area" @dblclick="deleteMsg()">
        <li v-for="list in msgHistory" :key="list.id" class="chat-list">
          <div class="receiver-class" :class="{senderClass: list.sender === $store.state.auth.user, readstateClass: list.readed === 'yes' && list.sender === $store.state.auth.user}">
            <span class="chat-text">
              {{ list.msg }}
              <span class="chat-date">{{ $moment(list.date, 'YYYY-MM-DD h:mm:ss').format('h:mm:ss') }}</span>
            </span>
          </div>
        </li>
        <li v-for="list in messageList" :key="list.id" class="chat-list">
          <div class="receiver-class" :class="{senderClass: list.sender === $store.state.auth.user}">
            <span class="chat-text">
              {{ list.message }}
              <span class="chat-date">{{  $moment(list.date, 'YYYY-MM-DD h:mm:ss').format('h:mm:ss') }}</span>
            </span>
            <span class="chatOnlinClass" v-if="list.onlinestate">&#10003;</span>
          </div>
        </li>
      </ul>
      <ul class="emoji-con" v-if="emojiHandle">
      <li v-for="emojilist in emoji" :key="emojilist.id" class="emoji-list">
        <span class="emoji" @click="addEmoji(emojilist.id)">{{ emojilist.emoji }}</span>
      </li>
    </ul>
    <i class="fas fa-trash-alt fa-4x chat-trash" v-if="trash"/>
    <footer class="chat-footer">
      <i class="fas fa-smile btn-emoji cl-y" @click="emojiOpen()"></i>
      <input ref="message" v-model="message" class="inputChat" type="text" :placeholder="typing" @keyup.enter="sendMsg()" @keydown="showTyping()" @blur.native="clearTyping()" autofocus>
      <i class="fas fa-paper-plane chat-btn cl-g btn-msg" @click="sendMsg()"></i>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import socket from '~/plugins/socket.io.js'
export default {
  middleware: 'auth',
  name: 'Msg',
  props: ['username'],
  data() {
    return {
      message: '',
      messageList: [],
      msgHistory: {},
      typing: '',
      selectedUser: this.username,
      emojiHandle: false,
      emoji: [
        { id: 0, emoji: "😃" }, 
        { id: 1, emoji: "😉" },
        { id: 2, emoji: "😊" },
        { id: 3, emoji: "🤑" },
        { id: 4, emoji: "😂" },
        { id: 5, emoji: "😪" },
        { id: 6, emoji: "😕" },
        { id: 7, emoji: "😟" },
        { id: 8, emoji: "😮" },
        { id: 9, emoji: "😲" },
        { id: 10, emoji: "😛" },
        { id: 11, emoji: "😜" },
        { id: 12, emoji: "😍" },
        { id: 13, emoji: "😘" },
        { id: 14, emoji: "💘" },
        { id: 15, emoji: "💋" },
        { id: 16, emoji: "💣" },
        { id: 17, emoji: "👍" },
        { id: 18, emoji: "👎" },
        { id: 19, emoji: "💪" },
        { id: 20, emoji: "✌️" },
        { id: 21, emoji: "🖐️" },
        { id: 22, emoji: "👀" },
        { id: 23, emoji: "⚽" },
        { id: 24, emoji: "🏀" },
        { id: 25, emoji: "⚾" },
        { id: 26, emoji: "🏐" },
      ],
      trash: ''
    }
  },
  mounted () {
    socket.emit('activeusers', this.$store.state.auth.user)
    this.getMsg()
    socket.on('new message', (data) => {
      this.typing = ''
      this.messageList.push({
        message: data.data.message,
        date: data.data.date,
        sender: data.data.sender,
        onlinestate: data.onlinestate
      })
      this.scrollToBottom()
    })
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
  },
  methods: {
    async getMsg () {
      await axios.post('/api/getmsg', {sender: this.$store.state.auth.user, receiver: this.selectedUser}).then((result)=> {
        this.msgHistory = result.data.getmsg
      })
    },
    async deleteMsg () {
      if (this.messageList == '' && this.msgHistory == '') {
        this.trash = true
        setTimeout(function () {
          this.trash = false
        }.bind(this), 1000)
      } else {
        await axios.post('/api/deletemsg', {sender: this.$store.state.auth.user, receiver: this.selectedUser}).then((result)=> {
          this.trash = true
          setTimeout(function () {
            this.trash = false
            this.messageList = []
            this.msgHistory = ''
          }.bind(this), 1000)
        })
      }
    },
    sendMsg () {
      if (this.message) {
        socket.emit('send message', {
        user: this.$store.state.auth.user,
        sender: this.$store.state.auth.user,
        receiver: this.selectedUser,
        message: this.message,
        date: new Date()
      })
      this.message = ''
      this.scrollToBottom()
      }
    },
    showTyping () {
      socket.emit('typing', 'yaziyor...')
      socket.on('typing', (data) => {
        this.typing = data
      })
    },
    scrollToBottom() {
      if(typeof this.$refs.chatarea !== 'undefined'){
        setTimeout(() => {
          this.$refs.chatarea.scrollTop = this.$refs.chatarea.scrollHeight
        }, 10)
      }
    },
    clearTyping () {
      this.typing = ''
    },
    emojiOpen: function () {
      this.emojiHandle =! this.emojiHandle
    },
    addEmoji: function (id) {
      this.message  += this.emoji[id].emoji
      this.emojiHandle = false
      this.$refs.message.focus()
    }
  }
}
</script>
