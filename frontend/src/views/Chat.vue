<template>
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
  </div>
</template>
<script>
import {
  socketService,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EMIT_SET_TOPIC,
} from '../services/socket.service'
export default {
  data() {
    return {
      msg: { from: 'Guest', txt: '' },
      msgs: [],
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
      typingUser: '',
    }
  },
  created() {
    // socketService.setup()
    socketService.emit(SOCKET_EMIT_SET_TOPIC, this.topic)
    socketService.on(SOCKET_EVENT_ADD_MSG, this.addMsg)
  },
  unmounted() {
    socketService.off(SOCKET_EVENT_ADD_MSG, this.addMsg)
    // socketService.terminate()
  },
  methods: {
    addMsg(msg) {
      this.msgs.push(msg)
    },
    sendMsg() {
      console.log('Sending', this.msg)
      // setTimeout(()=>this.addMsg({from: 'Dummy', txt: 'Yey'}), 2000)
      const user = userService.getLoggedinUser()
      const from = (user && user.fullname) || 'Guest'
      this.msg.from = from
      socketService.emit(SOCKET_EMIT_SEND_MSG, this.msg)
      this.msg = { from, txt: '' }
    },
    changeTopic() {
      socketService.emit(SOCKET_EMIT_SET_TOPIC, this.topic)
    },
  },
}
</script>