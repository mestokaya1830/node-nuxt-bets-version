<template>
  <div class="page">
    <ul ref="chatarea" class="chat-area">
      <li v-for="list in msgHistory" :key="list.id" class="chat-list">
        <div class="receiver-class" :class="{
          senderClass: list.sender === $store.state.auth.user, readstateClass: list.readed === 'yes' && list.sender === $store.state.auth.user, imageClass: list.type == 'image'
        }">
          <audio v-if="list.type == 'audio'" class="record" controls style="height:30px;width:180px;">
            <source :src="`/uploads/${list.msg}`" type="audio/webm">
          </audio>
          <img v-if="list.type == 'image'" :src="`/uploads/${list.msg}`" alt="" class="imgMsg">
          <span v-if="list.type == 'text'" class="chat-text">{{ list.msg }}</span>
          <span class="chat-date">{{ list.date | dateFormat }}</span>
        </div>
      </li>
      <li v-for="list in currentMessage" :key="list.id" class="chat-list">
        <div class="receiver-class"
        :class="{ senderClass: list.sender === $store.state.auth.user, imageClass: list.type == 'image' }">
          <audio v-if="list.type == 'audio'" class="record" controls style="height:30px;width:180px;">
            <source :src="`/uploads/${list.message}`" type="audio/webm">
          </audio>
          <img  v-if="list.type == 'image'" :src="`/uploads/${list.message}`" alt="" class="imgMsg" />
          <span v-if="list.type == 'text'" class="chat-text">{{ list.message }}</span>
          <span class="chat-date">{{ list.date | dateFormat }}</span>
          <span v-if="list.onlinestate" class="chatOnlinClass">&#10003;</span>
        </div>
      </li>
    </ul>
    <ul class="emoji-con" v-if="emojiHandle">
      <li v-for="emojilist in emoji" :key="emojilist.id" class="emoji-list">
        <span class="emoji" @click="addEmoji(emojilist.id)">{{
            emojilist.emoji
        }}</span>
      </li>
    </ul>
    <footer class="chat-footer">
      <i class="fas fa-smile btn-emoji cl-o" @click="emojiOpen()"></i>
      <input ref="message" v-model="message" type="text" class="inputChat" :placeholder="typing" @keyup="showTyping()"
        @keyup.enter="sendMsg()" @blur.native="clearTyping()" autofocus />
      <span class="dropdown">
        <form @submit.prevent="sendImage" enctype="multipart/form-data">
          <label class="chat-btn" for="img">🔗
            <input type="file" ref="img" id="img" accept="image/*" @change="selectImg" style="display: none" />
          </label>
        </form>
      </span>
      <span class="dropdown">
        <form @submit.prevent="sendAudio" enctype="multipart/form-data">
          <span class="chat-btn cl-r btn-upload" @mousedown="recordAudio" @mouseup="stopAudio">&#x1F3A4;</span>
        </form> 
      </span>

      <i class="fas fa-paper-plane chat-btn cl-g btn-msg" @click="sendMsg()"></i>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import socket from "~/plugins/socket.io.js";
export default {
  middleware: "clientAuth",
  name: "Msg",
  props: ["username"],
  data() {
    return {
      message: "",
      currentMessage: [],
      msgHistory: null,
      typing: "",
      selectedUser: this.username,
      emojiHandle: false,
      selectedImage: null,
      recordedAudio: null,
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
      type: 'text',
      timeout: '',
      recorder: ''
    };
  },
  mounted() {
    socket.emit("openedusers", this.$store.state.auth.user);
    this.getMsg();
    socket.on("new message", (data) => {
      this.typing = "";
      this.currentMessage.push({
        message: data.data.message,
        date: data.data.date,
        sender: data.data.sender,
        onlinestate: data.onlinestate,
        type: data.data.type
      });
      this.scrollToBottom();
    });
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  },
  filters: {
    dateFormat: function (value) {
      return moment
        .utc(value, "YYYY-MM-DD H:mm:ss")
        .tz("Europe/Istanbul")
        .format("MM-DD HH:mm:ss");
    },
    timeFormat: function (value) {
      return moment
        .utc(value, "YYYY-MM-DD H:mm:ss")
        .tz("Europe/Istanbul")
        .format("HH:mm:ss");
    },
  },

  methods: {
    async getMsg() {
      await axios.post("/api/home/getmsg", {
        sender: this.$store.state.auth.user,
        receiver: this.selectedUser,
      })
        .then((result) => {
          this.msgHistory = result.data.getmsg;
        });
    },
    async deleteMsg() {
      if (this.currentMessage != "" || this.msgHistory != "") {
        const cfm = confirm('Mesajlar kalıcı olarak silinecektir!')
        if(cfm){
          await axios.post("/api/home/deletemsgall", {
            sender: this.$store.state.auth.user,
            receiver: this.selectedUser,
          }).then((result) => {
            this.currentMessage = [];
            this.msgHistory = "";
            document.querySelector('.chat-area').innerText = ''
          })
        }
      } else {
        alert('Silinicek mesaj yoktur!')
      }
    },
    sendMsg() {
      if (this.message) {
        socket.emit("send message", {
          user: this.$store.state.auth.user,
          sender: this.$store.state.auth.user,
          receiver: this.selectedUser,
          message: this.message,
          type: this.type,
          date: new Date()
        })
        this.message = ""
        this.scrollToBottom()

        if(this.recordedAudio){
          this.sendAudio()
        }
        if(this.selectedImage){
          this.sendImage()
        }
        this.type = 'text'
      }
    },
    showTyping() {
      socket.emit("settyping", "yaziyor...");
      socket.on("gettyping", (result) => {
        this.typing = result.data;
      });
      this.uploadBox = false;
    },
    scrollToBottom() {
      if (typeof this.$refs.chatarea !== "undefined") {
        setTimeout(() => {
          this.$refs.chatarea.scrollTop = this.$refs.chatarea.scrollHeight;
        }, 10);
      }
    },
    clearTyping() {
      this.typing = "";
    },
    emojiOpen: function () {
      this.emojiHandle = !this.emojiHandle;
    },
    addEmoji: function (id) {
      this.message += this.emoji[id].emoji;
      this.emojiHandle = false;
      this.$refs.message.focus();
    },
    async selectImg(e) {
      let file = e.target.files[0];
      if (!file.type.match("image.*")) {
        alert("Resim formata uygun degil!");
      } else if (file.size > 200000) {
        alert("Resim boyutu çok yüksek!");
      } else {
        this.message = this.$store.state.auth.user + '-' + this.selectedUser + '-' + file.size + '.' + file.name.split('.').pop()
        this.selectedImage = file
        this.type = 'image'
      }
    },
    async sendImage() {
      let fileName = this.$store.state.auth.user + '-' + this.selectedUser + '-' + this.selectedImage.size + '.' + this.selectedImage.name.split('.').pop()
      const form = new FormData()
      form.append('file', this.selectedImage, fileName)
      await axios.post('/api/home/addimage', form)
    },
    async recordAudio() {
      let device = navigator.mediaDevices.getUserMedia({ audio: true })
      let chunks = []
      device.then(stream => {
        this.recorder = new MediaRecorder(stream)
        this.recorder.ondataavailable = (e) => {
          chunks.push(e.data)
          if (this.recorder.state === 'inactive') {
            this.recordedAudio = new Blob(chunks, { type: 'audio/webm' })
            this.message = this.$store.state.auth.user + '-' + this.selectedUser +'-'+ this.recordedAudio.size +'.mp3'
            this.type = 'audio'
          }
        }
      })
      this.timeout = setTimeout(() => {
        this.recorder.start()
      }, 100)
    },
    stopAudio() {
      this.recorder.stop()
      clearInterval(this.timeout)
    },
    async sendAudio(){
      let fileName = this.$store.state.auth.user + '-' + this.selectedUser +'-'+ this.recordedAudio.size +'.mp3'
      const form = new FormData()
      form.append('file', this.recordedAudio, fileName)
      await axios.post('/api/home/addaudio', form)
    }
  }
}
</script>

