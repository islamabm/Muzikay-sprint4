<template>
    <div>
      <YouTube hidden
        :src="`https://www.youtube.com/watch?v=4x1ckzoywqY`" 
        @ready="onReady"
        @state-change="onStateChange"
        ref="youtube"/>
  
      <div class="control-buttons">
        <button >🔀</button>
        <button >👈</button>
        <button @click="playAudio('play')">Play</button>
        <button @click="playAudio('pause')">Pause</button>
        <button >👉</button>
        <button >🔁</button>
      </div>
  
      <div class="music-bar">
        <span>{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" :style="{ width: (currentTime / duration) * 100 + '%' }"></div>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
  </template>
  
  <script>
  import YouTube from 'vue3-youtube'
  
  export default {
    props: {
      station: Object, // supossed to get station._id to the youtube search
    },
    components: {
      YouTube,
    },
    data() {
      return {
        duration: 0,
        currentTime: 0,
        isPlaying: false,
        intervalId: null,
      }
    },
    methods: {
      // when the video is ready
      onReady() {
        this.duration = this.$refs.youtube.getDuration()
        this.$refs.youtube.playVideo()
        this.isPlaying = true
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
      },
      // when something happens- Video has ended/Video is playing/Video is paused
      // work but has alot of error msges 
      onStateChange(event) {
        if (event.data === 0) {
          clearInterval(this.intervalId)
          this.isPlaying = false
        } else if (event.data === 1) {
            this.isPlaying = true
        } else { 
            this.isPlaying = false
        }
      },
      // play/pause video
      playAudio(action) {
        if (action === 'play') {
          this.$refs.youtube.playVideo()
          this.isPlaying = true
        } else {
          this.$refs.youtube.pauseVideo()
          this.isPlaying = false
        }
      },
      // handel the time format by parameter - currentTime / duration
      formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
      },
    },
  }
  </script>