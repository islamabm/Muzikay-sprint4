<template>
  <YouTube class="youtube-player"
  :src="`https://www.youtube.com/watch?v=${putSongId}`" 
  @ready="onReady"
  @state-change="onStateChange"
  ref="youtube"/>
  
  <div class="media-player">
      <div class="control-buttons">
        
        <button class="media-player-prev-song hiding" @click="ShuffleSong()">
          <i class="shuffle" :class="{ 'button-active': isShuffleOn }" v-html="getSvg('shuffleBtnIcon')"></i>
        </button>
        <button class="media-player-prev-song hiding" @click="switchSong(-1)">
          <i  v-html="getSvg('prevSongBtnIcon')"></i>
        </button>
        
        <button class="media-player-play" @click="playAudio()">
          <i class="pause" v-if="this.isPlaying" v-html="getSvg('pauseBtnIcon')"></i>
          <i  v-else v-html="getSvg('playBtnIcon')"></i>
        </button>

        <button class="media-player-prev-song hiding" @click="switchSong(1)">
          <i  v-html="getSvg('nextSongBtnIcon')"></i>
        </button>
          
        <button class="media-player-repeat-song hiding" @click="repeatSong(songIdx)">
          <i  :class="{ 'button-active': isRepeatOn }" v-html="getSvg('repeatBtnIcone')"></i>
        </button>

      </div>
  
      <div class="music-bar">
        <span class="current-time hiding">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="findProgress($event)" ref="progressBar">
          <div class="progress-bar-fill" :style="{ width: progressBarWidth + '%' }" ref="progressBarFill"></div>
        </div>
        <span class="current-time hiding">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <div class="footer-media-adjusments">
      <i class="speaker" v-html="getSvg(toggleSvgIcone)"></i>
      <input type="range" class="speaker-bar prog" min="0" max="100" step="10" id="volume-bar" v-model="volume">
    </div>

    <!-- 
    <div class="progress-container">
      <i class="speaker" v-html="getSvg(toggleSvgIcone)"></i>
    <progress class="prog progress-bar" :value="volume" max="100"></progress>
    </div>
    
    <div class="progress-container">
    <progress class="prog progress-bar" type="progress" :value="currTime" min="0"
    :max="duration"></progress>
    <input class="prog input-bar timestamp" id="fontController" type="range"
    @input="setTimestamp" :value="currTime" min="0" :max="duration" />
    </div> -->


</template>
  <script>

  import YouTube from 'vue3-youtube'
  import SVGService from '../services/SVG.service'
  import { eventBus } from '../services/event-bus.service'

  export default {
    name: ['MediaPlayer'],
    props: {
      station: Object,
      speakerLevel: {
        type: Number,
        default: 80,
      } 
    },
    emits: ['songIdx'],
    components: {
      YouTube,
    },
    data() {
      return {
        volume: 50,
        songIdx: 0,
        duration: 0,
        currentTime: 0,
        intervalId: null,
        isPlaying: false,
        isRepeatOn: false,
        shuffledSongs: [],
        isShuffleOn: false,
        speakerSvg: '',
        song: null,
        youtubeSong: null,
      }
    },
    created() {
      eventBus.on('song-details', (song) => {
          this.song = song
          console.log(this.song);
        var delay = song.delay || 2000
        this.alive = true
        setTimeout(() => {
          this.alive = false
        },delay)
      } )
      eventBus.on('youtube-song-details', (song) => {
          this.youtubeSong = song
          console.log(this.song);
        var delay = song.delay || 2000
        this.alive = true
        setTimeout(() => {
          this.alive = false
        },delay)
      } )
    },
    computed: {
      putSongId() {
        if(this.song) {
          return this.song.id
        }
        if(this.youtubeSong) {
          return this.youtubeSong.videoId
        }
        if (this.isShuffleOn) {
          return this.station.songs[this.shuffledSongs[this.songIdx]].id
        } else if (this.station) {
          return this.station.songs[this.songIdx].id
        } else {
          if (this.isRepeatOn) { 
            return this.station.songs[this.songIdx].id
          } else { // if repeat is off, play the default song
          return 'IXdNnw99-Ic' 
        }
      }
      },
      toggleSvgIcone() {
        let icon  
        if(this.volume > 80) icon = 'speakerFullBtnIcon'
        else if (this.volume >= 10) icon = 'speakerMediumBtnIcon'
        else icon = 'speakerMuteBtnIcon'
        return icon 
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
      repeatSong(idx) {
        this.isRepeatOn = !this.isRepeatOn
        if(this.isRepeatOn){
          this.songIdx = idx
        }
        else this.songIdx++ 
      },
      //  does algorithem to do a new array with random songs 
      ShuffleSong() {
        this.isShuffleOn = !this.isShuffleOn
        console.log(this.isShuffleOn);
        if (this.isShuffleOn) {
        // shuffle the array of song indexes
        let currentIndex = this.station.songs.length
        let randomIndex
        let temporaryValue
        let shuffledIndexes = [...Array(currentIndex).keys()]

        while (0 !== currentIndex) {
        // pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        // swap with current element
        temporaryValue = shuffledIndexes[currentIndex]
        shuffledIndexes[currentIndex] = shuffledIndexes[randomIndex]
        shuffledIndexes[randomIndex] = temporaryValue
      }
      // update the shuffledSongs array with the shuffled indexes
      this.shuffledSongs = shuffledIndexes
      } else {
      this.shuffledSongs = []
      }
    },
      // the function gets direction 1/-1 and switches the song by it
      switchSong(num) {
        // if(this.songIdx > 0 && this.songIdx < this.station.length){
          this.songIdx += num
        // }
        this.$emit('songIdx' , this.songIdx)
        this.putSongId()
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
        this.duration = this.$refs.youtube.getDuration()
        this.formatTime(this.duration)
      },
      // when the video is ready
      onReady() {
        // console.log('im ready');
        this.duration = this.$refs.youtube.getDuration()
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
      },
      // when something happens- Video has ended/Video
      // work but has alot of error msges 
      onStateChange(event) {
        if (event.data === 1) this.isPlaying = true
        if (event.data === 0){
          clearInterval(this.intervalId)
          this.currentTime = 0
          this.songIdx++
        } 
      },
      // play/pause video 
      playAudio() {
        this.isPlaying = !this.isPlaying
        if (this.isPlaying) {
          this.$refs.youtube.playVideo()
          player.setVolume(this.speakerLevel) // Set the volume when starting to play
        } else {
          this.$refs.youtube.pauseVideo()
        }
      },
      changeSound(songIdx) {
        this.station.songs[songIdx]
      },
      // handel the time format by parameter - currentTime / duration
      formatTime(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
      },
      // find and navigate by click to any part of the song
      findProgress(ev) {
        const progressBar = this.$refs.progressBar
        const progressBarFill = this.$refs.progressBarFill

        // calculate the position of the click on the progress bar
        const progressBarWidth = progressBar.offsetWidth
        const clickedPosition = ev.pageX - progressBar.offsetLeft
        const progressPercentage = clickedPosition / progressBarWidth

        // calculate the time to seek to
        const newTime = this.duration * progressPercentage

        // update the current time and seek to the new time
        this.currentTime = newTime
        this.$refs.youtube.seekTo(newTime)

        // update the width of the progress bar fill
        progressBarFill.style.width = progressPercentage * 100 + '%'
      },
      setSpeakerLevel(level) {
      this.$emit('update:speaker-level', level)
      },
    },
    watch : {
      volume(newVolume) {
            this.$refs.youtube.setVolume(newVolume);
      },
    },
}
  </script>