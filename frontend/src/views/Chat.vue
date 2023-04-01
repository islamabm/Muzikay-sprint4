<template>
<<<<<<< HEAD
  <div class="container">
    <div class="header">
      <h1 class="title">Chatify</h1>
      <p class="subtitle">
        Discuss your favorite music genres with others in real-time, discover
        new artists and expand your musical horizons with Chatify.
      </p>
    </div>
    <h3 v-if="typingUser">{{ typingUser }} is typing...</h3>
    <h2 v-if="topic === 'General'">Let's Talk About Music</h2>
    <h2 v-else>Lets Talk About {{ topic }} Music</h2>
    <label for="topic-select">Choose a topic:</label>
    <select id="topic-select" v-model="topic" @change="changeTopic">
      <option v-for="t in topics" :value="t">{{ t }}</option>
    </select>
    <ul>
      <li v-for="(msg, idx) in msgs" :key="idx">
        <span>{{ msg.from }}:</span>{{ msg.txt }}
      </li>
    </ul>
    <hr />
    <form @submit.prevent="sendMsg">
      <input type="text" v-model="msg.txt" placeholder="Your msg" />
      <button>Send</button>
    </form>
=======
  <div class="chat-room-container">
    <h2>Chat</h2>
    <h3 v-if="typingUser">{{ typingUser }} is typing...</h3>
    <div class="chat-list">
      <p
        v-for="(msg, idx) in [...msgHistory, ...msgs]"
        :key="idx"
        class="chat-msg"
      >
        {{ msg.username }}: {{ msg.txt }}
      </p>
    </div>
    <div class="send-box flex">
      <input
        v-model="msgTxt"
        @input="onType"
        type="text"
        placeholder="Write your message"
      />
      <button @click="sendMsg" class="btn">Send</button>
    </div>
>>>>>>> 127ded61a8d51e3f980839caa293f49254391a41
  </div>
</template>
<script>
import {
  socketService,
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EVENT_USER_IS_TYPING,
  SOCKET_EMIT_USER_IS_TYPING,
} from '../services/socket.service.js'
import { utilService } from '../services/util.service.js'

export default {
  name: 'chat',
  props: {
    stationId: String,
    msgHistory: Array,
  },
  data() {
    return {
      msgTxt: '',
      msgs: [],
<<<<<<< HEAD
      topics: [
        'General',
        'Mood',
        'Rock',
        'Pop',
        'Hip-Hop',
        'Focus',
        'Alternative',
        'Indie',
        'Sleep',
        'Decades',
        'Workout',
        'At Home',
        'Travel',
        'Chill',
        'Party',
        'Dance/Electronics',
      ],
      topic: 'General',
=======
>>>>>>> 127ded61a8d51e3f980839caa293f49254391a41
      typingUser: '',
    }
  },
  created() {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, this.stationId)
    socketService.on(SOCKET_EVENT_ADD_MSG, this.addMsg)
    socketService.on(SOCKET_EVENT_USER_IS_TYPING, (username) => {
      this.typingUser = username
    })
  },
  computed: {
    user() {
      return this.$store.getters.loggedinUser
    },
  },
  methods: {
    addMsg(msg) {
      this.msgs.push(msg)
    },
    sendMsg() {
      const msg = {
        txt: this.msgTxt,
        username: this.user?.username || 'Guest',
      }
      this.addMsg(msg)
      socketService.emit(SOCKET_EMIT_SEND_MSG, msg)
      this.msgTxt = ''
    },
    onType() {
      this.setTyping()
      this.clearTyping()
    },
    setTyping() {
      socketService.emit(
        SOCKET_EMIT_USER_IS_TYPING,
        this.user?.username || 'Guest'
      )
    },
    clearTyping: utilService.debounce(() => {
      socketService.emit(SOCKET_EMIT_USER_IS_TYPING, '')
    }),
  },

  unmounted() {
    socketService.off(SOCKET_EVENT_ADD_MSG, this.addMsg)
    socketService.off(SOCKET_EVENT_USER_IS_TYPING)
    // socketService.terminate()
  },
  created() {},
}
</script>