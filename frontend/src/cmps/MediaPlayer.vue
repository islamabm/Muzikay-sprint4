<template>
  <div>
    <YouTube
      class="youtube-player"
      :src="`https://www.youtube.com/watch?v=${putStationId}`"
      @ready="onReady"
      @state-change="onStateChange"
      ref="youtube"
    />

    <div class="control-buttons">
      <button class="media-player-prev-song">
        <i class="shuffle" v-html="getSvg('shuffleBtnIcon')"></i>
      </button>

      <button class="media-player-prev-song" @click="switchSong(-1)">
        <i class="home-icon icons" v-html="getSvg('prevSongBtnIcon')"></i>
      </button>

      <button class="media-player-play" @click="playAudio()">
        <i
          class="pause"
          v-if="this.isPlaying"
          v-html="getSvg('pauseBtnIcon')"
        ></i>
        <i class="home-icon icons" v-else v-html="getSvg('playBtnIcon')"></i>
      </button>

      <button class="media-player-prev-song" @click="switchSong(1)">
        <i class="home-icon icons" v-html="getSvg('nextSongBtnIcon')"></i>
      </button>

      <button class="media-player-repeat-song">
        <i class="home-icon icons" v-html="getSvg('repeatBtnIcone')"></i>
      </button>
    </div>

    <div class="music-bar">
      <span>{{ formatTime(currentTime) }}</span>
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: progressBarWidth + '%' }"
        ></div>
      </div>
      <span>{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>
<script>
import YouTube from 'vue3-youtube'
import SVGService from '../services/SVG.service'
export default {
  name: ['MediaPlayer'],
  props: {
    station: Object,
  },
  emits: ['songIdx'],
  components: {
    YouTube,
  },
  data() {
    return {
      duration: 0,
      currentTime: 0,
      isPlaying: false,
      intervalId: null,
      songIdx: 0,
    }
  },
  computed: {
    putStationId() {
      console.log('no station')
      if (this.station) {
        return this.station.songs[this.songIdx].id
      } else return 'z0jwCUr42Qw'
    },
    progressBarWidth() {
      if (!this.duration || !this.currentTime) return

      const progressBarWidth = (this.currentTime / this.duration) * 100
      return progressBarWidth
    },
  },
  methods: {
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    // the function gets direction 1/-1 and switches the song by it
    switchSong(num) {
      this.songIdx += num
      this.$emit('songIdx', this.songIdx)
      this.putStationId()
      this.duration = this.$refs.youtube.getDuration()
      this.formatTime(this.duration)
    },
    // when the video is ready
    onReady() {
      console.log('im ready')
      this.duration = this.$refs.youtube.getDuration()
      this.intervalId = setInterval(() => {
        this.currentTime = this.$refs.youtube.getCurrentTime()
      }, 1000)
    },
    // when something happens- Video has ended/Video
    // work but has alot of error msges
    onStateChange(event) {
      if (event.data === 1) this.isPlaying = true
      // if(!this.station) clearInterval(this.intervalId) // why doent it gets ready?
      if (event.data === 0) {
        this.songIdx++
        clearInterval(this.intervalId)
        this.formatTime(this.duration)
      }
    },
    // play/pause video
    playAudio() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) this.$refs.youtube.playVideo()
      else this.$refs.youtube.pauseVideo()
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
