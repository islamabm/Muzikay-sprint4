<template>
    <div>
      <YouTube hidden
        :src="`https://www.youtube.com/watch?v=${stationId}`" 
        @ready="onReady"
        @state-change="onStateChange"
        ref="youtube"/>
  
      <div class="control-buttons">
        
        <button class="media-player-prev-song">
          <i class="home-icon icons" v-html="getSvg('shuffleBtnIcon')"></i>
        </button>

        <button class="media-player-prev-song" @click="switchSong(-1)">
          <i class="home-icon icons" v-html="getSvg('prevSongBtnIcon')"></i>
        </button>

        <button class="media-player-play" @click="playAudio()">
          <i class="home-icon icons" v-html="getSvg(selectBtn)"></i>
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
        <div class="progress-bar"></div>
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
</template>
  <script>
  import YouTube from 'vue3-youtube'
  // import {stationService} from '../services/station.service.local'
  import SVGService from '../services/SVG.service'
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
        if(this.currStation){
          playAudio()
          return this.currStation.songs[this.songIdx].id
        } 
        else return '' 
      },
      selectBtn() {
        const btn = this.isPlaying ? 'pauseBtnIcon' : 'playBtnIcon'
        return btn
      }
    },
    methods: {
      getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
      // the function gets direction 1/-1 and switches the song by it.
      switchSong(num) {
        this.songIdx += num
        this.$emit('songIdx' , this.songIdx)
      },
      // when the video is ready
      onReady() {
        this.duration = this.$refs.youtube.getDuration()
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
      },
      // when something happens- Video has ended/Video
      // work but has alot of error msges 
      onStateChange(event) {
        if (event.data === 0) clearInterval(this.intervalId)
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
    watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params
        try {
          this.station = await this.$store.getters.stationById(stationId)
          this.currStation = this.station
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