<template>
<div>
    <vue-youtube
      ref="youtubePlayer"
      video-id="RjrA-slMoZ4"
      :player-vars="playerVars"
      @ready="onPlayerReady"
      @state-change="onPlayerStateChange"
    />
    <button @click="playAudio">Play</button>
    <button @click="pauseAudio">Pause</button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      player: null,
      audio: new Audio(),
      playerVars: {
        autoplay: 0,
        mute: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        fs: 0,
      },
    }
  },
  methods: {
    onPlayerReady(event) {
      this.player = event.target
      this.audio.src = `https://www.youtube.com/watch?v=${this.player.getVideoData().video_id}`
      this.audio.load()
    },
    onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setInterval(() => {
          this.audio.currentTime = this.player.getCurrentTime()
        }, 1000)
      }
    },
    playAudio() {
      this.player.playVideo()
      this.audio.play()
    },
    pauseAudio() {
      this.player.pauseVideo()
      this.audio.pause()
    },
  },
}
</script>
<!-- 
<template>
    <div>
      <vue-youtube
        ref="youtubePlayer"
        video-id="VIDEO_ID"
        :player-vars="playerVars"
        @ready="onPlayerReady"
        @state-change="onPlayerStateChange"
      />
      <button @click="playAudio">Play</button>
      <button @click="pauseAudio">Pause</button>
    </div>
  </template>
  
  <script>

import { createApp } from 'vue'
import VueYoutube from 'vue3-youtube'
import App from './App.vue'

// const app = createApp(App)

// app.use(VueYoutube)

// app.mount('#app')

  export default {
    data() {
      return {
        player: null,
        audio: new Audio(),
        playerVars: {
          autoplay: 0,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          fs: 0,
        },
      }
    },
    methods: {
      onPlayerReady(event) {
        this.player = event.target
        this.audio.src = `https://www.youtube.com/watch?v=${this.player.getVideoData().video_id}`
        this.audio.load()
      },
      onPlayerStateChange(event) {
        if (event.data === window.YT.PlayerState.PLAYING) {
          setInterval(() => {
            this.audio.currentTime = this.player.getCurrentTime()
          }, 1000)
        }
      },
      playAudio() {
        this.player.playVideo()
        this.audio.play()
      },
      pauseAudio() {
        this.player.pauseVideo()
        this.audio.pause()
      },
    },
  }
  </script> -->