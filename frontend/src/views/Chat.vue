<template>
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
