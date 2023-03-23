<template>
    <div>
      <YouTube hidden
        :src="`https://www.youtube.com/watch?v=${stationId}`" 
        @ready="onReady"
        @state-change="onStateChange"
        ref="youtube"/>
  
      <div class="control-buttons">
        <button >🔀</button>
        <button @click="switchSong(-1)">👈</button>
        <button @click="playAudio('play')">Play</button>
        <button @click="playAudio('pause')">Pause</button>
        <button @click="switchSong(1)">👉</button>
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
  // import {stationService} from '../services/station.service.local'

  export default {
    name: ['MediaPlayer'],
    components: {
      YouTube,
    },
    data() {
      return {
        duration: 0,
        currentTime: 0,
        isPlaying: false,
        intervalId: null,
        station: null,
        currStation: null,
        songIdx: 0,
      }
    },
    computed: {
      stationId() {
        if(this.currStation) return this.currStation.songs[this.songIdx].id
        else return 'Oqtnee5Nqxw' 
      }
    },
    methods: {
      // the function gets direction 1/-1 and switches the song by it.
      switchSong(num) {
        this.songIdx += num
        this.$emit('songIdx' , this.songIdx)
      },
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
        } 
        this.isPlaying = (event.data === 1) ? true : false 
      },
      // play/pause video >> will be with one button and do toggle
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
    watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params
        try {
          this.station = await this.$store.getters.stationById(stationId)
          this.currStation = this.station

          console.log(this.station);
        }
        catch (err) {
          console.log(err,'cannot get id from route params');
          throw err
        }
      },
      immediate: true,
    },
  },
}
  </script>