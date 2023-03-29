<template>
  <YouTube
    class="youtube-player"
    :src="`https://www.youtube.com/watch?v=${putSongId}`"
    @ready="onReady"
    @state-change="onStateChange"
    ref="youtube"
  />

  <div class="media-player">
    <div class="control-buttons">
      <button class="media-player-prev-song hiding" @click="ShuffleSong()">
        <i
          class="shuffle"
          :class="{ 'button-active': isShuffleOn }"
          v-html="getSvg('shuffleBtnIcon')"
        ></i>
      </button>
      <button class="media-player-prev-song hiding" @click="switchSong(-1)">
        <i v-html="getSvg('prevSongBtnIcon')"></i>
      </button>

      <button class="media-player-play" @click="playAudio()">
        <i
          class="pause"
          v-if="this.isPlaying"
          v-html="getSvg('pauseBtnIcon')"
        ></i>
        <i v-else v-html="getSvg('playBtnIcon')"></i>
      </button>

      <button class="media-player-prev-song hiding" @click="switchSong(1)">
        <i v-html="getSvg('nextSongBtnIcon')"></i>
      </button>

      <button
        class="media-player-repeat-song hiding"
        @click="repeatSong(songIdx)"
      >
        <i
          :class="{ 'button-active': isRepeatOn }"
          v-html="getSvg('repeatBtnIcone')"
        ></i>
      </button>
    </div>

    <div class="music-bar">
      <span class="current-time hiding">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar" @click="findProgress($event)" ref="progressBar">
        <div
          class="progress-bar-fill"
          :style="{ width: progressBarWidth + '%' }"
          ref="progressBarFill"
        ></div>
      </div>
      <span class="current-time hiding">{{ formatTime(duration) }}</span>
    </div>
  </div>

  <div class="footer-media-adjusments">
    <i class="speaker" v-html="getSvg(toggleSvgIcone)"></i>
    <input
      type="range"
      class="speaker-bar"
      min="0"
      max="100"
      step="10"
      id="volume-bar"
      v-model="volume"
    />
  </div>

  <!-- dvir's stuff for the styling -->

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
    // station: Object,
    speakerLevel: {
      type: Number,
      default: 80,
    },
    currSongIdx: Number,
  },
  components: {
    YouTube,
  },
  data() {
    return {
      volume: 50,
      duration: 0,
      currentTime: 0,
      intervalId: null,
      isPlaying: false,
      isRepeatOn: false,
      shuffledSongs: [],
      isShuffleOn: false,
      speakerSvg: '',
      songId: null,
      youtubeSong: null,
      songIdx: 0,
    }
  },
  created() {
    eventBus.on('song-id', (songId) => {
      this.songId = songId
      var delay = songId.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
    eventBus.on('youtube-song', (video) => {
      this.youtubeSong = video
      var delay = video.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
  },
  computed: {
    station(){
      return this.$store.getters.station
    },
    copyOfCurrIdx() {
      this.songIdx = this.currSongIdx
    },
  putSongId() {
    console.log('this.station', this.station)
  if (this.songId) {
    console.log('this.songId if 1', this.songId)
    return this.songId
  }
  if (this.youtubeSong) {
    console.log('this.youtubeSongId if 2', this.youtubeSongId)
    return this.youtubeSong.videoId
  }
  if (this.station) {
    console.log('this.station else 5', this.station )
    if (this.isShuffleOn) {
      console.log('this.isShuffleOn if 3', this.isShuffleOn)
      return this.station.songs[this.shuffledSongs[this.songIdx]].id
    } else if (this.isRepeatOn) {
      console.log('this.repeatOn if 4', this.isRepeatOn)
      return this.station.songs[this.songIdx].id
    } else {
      return this.station.songs[this.songIdx].id
    }
  } else {
    console.log('mamash else')
    // if repeat is off, play the default song
    return 'IXdNnw99-Ic'
  }
},
    toggleSvgIcone() {
      let icon
      if (this.volume > 80) icon = 'speakerFullBtnIcon'
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
      if (this.isRepeatOn) {
        this.songIdx = idx
      }
    },
    //  does algorithem to do a new array with random songs
    ShuffleSong() {
      this.isShuffleOn = !this.isShuffleOn
      console.log(this.isShuffleOn)
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
      console.log('this.songIdx', this.songIdx)
      this.songIdx += num
      console.log('this.songIdx', this.songIdx)
      // if (this.songIdx > this.station.songs.length) {
        //   console.log(songIdx)
      //   this.songIdx = 0
      //   console.log('this.songIdx expected 0', this.songIdx) // not works good
      // } else if (this.songIdx < 0) {
      //   this.songIdx = this.station.songs.length - 1
      //   console.log('this.songIdx expected length', this.songIdx) // workes good
      // } else 
      // console.log('this.songIdx expected 1', this.songIdx)

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
    // when something happens- Video has ended/Video 1=> is playing 2=> pause 0=> finished 3=> when passing forward or switching a song
    // supposed to be a switch case
    onStateChange(event) {
      if (event.data === 1) {
        this.isPlaying = true
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
      } 
      if(event.data === 2) clearInterval(this.intervalId)
      if(event.data === 0) {
        this.isPlaying = true
        this.songIdx++
        clearInterval(this.intervalId)
      }
      if(event.data === 3) {
        this.isPlaying = true
        this.currentTime = 0
        this.duration = this.$refs.youtube.getDuration()
        this.formatTime(this.duration)
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
  watch: {
    volume(newVolume) {
      this.$refs.youtube.setVolume(newVolume)
    },
  },
}
</script>