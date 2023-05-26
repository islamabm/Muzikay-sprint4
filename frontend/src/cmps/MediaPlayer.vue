<template>
  <!-- class="youtube-player" -->
  <YouTube
    :src="`https://www.youtube.com/watch?q=${putSongName}`"
    @ready="onReady"
    @state-change="onStateChange"
    ref="youtube"
  />

  <div class="media-player">
    <div class="control-buttons">
      <button
        title="Enable shuffle"
        class="shuffle media-player-prev-song hiding"
        @click="ShuffleSong()"
      >
        <i
          :class="{ 'button-active': isShuffleOn }"
          v-html="getSvg('shuffleBtnIcon')"
        ></i>
      </button>
      <button
        title="Previous"
        class="prev media-player-prev-song hiding"
        @click="switchSong(-1)"
      >
        <i v-html="getSvg('prevSongBtnIcon')"></i>
      </button>

      <button title="Play" class="media-player-play" @click="playAudio()">
        <i
          class="pause"
          v-if="this.isPlaying"
          v-html="getSvg('pauseBtnIcon')"
        ></i>
        <i v-else v-html="getSvg('playBtnIcon')"></i>
      </button>

      <button
        title="Next"
        class="next media-player-prev-song hiding"
        @click="switchSong(1)"
      >
        <i v-html="getSvg('nextSongBtnIcon')"></i>
      </button>
      <button
        title="Enable repeat"
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
    <i
      @click="toggleMute()"
      class="speaker"
      v-html="getSvg(toggleSvgIcone)"
    ></i>
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
</template>
<script>
import YouTube from "vue3-youtube"
import SVGService from "../services/SVG.service"
import { eventBus } from "../services/event-bus.service"
import { stationService } from "../services/station.service.local.js"

export default {
  name: "MediaPlayer",
  props: {
    speakerLevel: {
      type: Number,
      default: 80,
    },
  },
  emits: ['songDetails'],
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
      speakerSvg: "",
      song: null,
      songIdx: 0,
    }
  },
  created() {
    eventBus.on("song-details", async (currSong) => {
      const { song, idx } = currSong
      this.song = song
      this.songIdx = idx + 1


      try {
        console.log(this.song)
        const searchStr = `${this.song.artist} ${this.song.title}`
        const videos = await stationService.getVideos(searchStr)
        this.song = videos[0]
      } catch (error) {
        console.error(error)
      }
    })
  },
  computed: {
    station() {
      return this.$store.getters.station
    },
    putSongName() {
      if (this.song) {
        if (this.song.id) return this.song[this.songIdx].id
        // situation when we have a song from YouTube on our list-considered as a song
        return this.song.videoId
      }
      if (this.station) {
        if (this.isShuffleOn) {
          return this.station.songs[this.shuffledSongs[this.songIdx]].id
        } else if (this.isRepeatOn) {
          return this.station.songs[this.songIdx].id
        } else {
          return this.station.songs[this.songIdx].id
        }
      } else return "IXdNnw99-Ic" // default value
    },
    toggleSvgIcone() {
      let icon
      if (this.volume > 80) icon = "speakerFullBtnIcon"
      else if (this.volume >= 10) icon = "speakerMediumBtnIcon"
      else icon = "speakerMuteBtnIcon"
      return icon
    },
    progressBarWidth() {
      if (!this.duration || !this.currentTime) return
      const progressBarWidth = (this.currentTime / this.duration) * 100
      return progressBarWidth
    },
  },
  methods: {
    toggleMute() {
      if (this.volume > 0) this.volume = 0
      else this.volume = 50
    },
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
    async switchSong(num) {
      
      const nextSong = this.station.songs[this.songIdx]
      this.songIdx += num
      try {
        const searchStr = `${nextSong.artist} ${nextSong.title}`
        const videos = await stationService.getVideos(searchStr)
        this.song = videos[0]

        const songDetails = {
          song: this.song,
          idx: this.songIdx
        }
        
        this.$emit('songDetails' , songDetails)
      } catch (error) {
        console.error(error)
      }
    },
    // when the video is ready
    onReady() {
      this.duration = this.$refs.youtube.getDuration()

      this.currentTime = this.$refs.youtube.getCurrentTime()
    },
    // when something happens- Video has ended/Video 1=> is playing 2=> pause 0=> finished 3=> when passing forward or switching a song
    // supposed to be a switch case
    onStateChange(event) {
      console.log('event', event.data)
      if (event.data === 1) {
      }
      if (event.data === 2)
        if (event.data === 0) {
          clearInterval(this.intervalId)
          this.isPlaying = true
          this.playAudio()
          // this.switchSong(1)
        }
      if (event.data === 3) {
        this.isPlaying = false
        this.currentTime = 0
        this.playAudio()
        // this.switchSong(1)
      }
    },
    // play/pause video
    playAudio() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.$refs.youtube.playVideo()
        this.intervalId = setInterval(() => {
          this.currentTime = this.$refs.youtube.getCurrentTime()
        }, 1000)
        this.$refs.youtube.setVolume(this.speakerLevel) // Set the volume when starting to play
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
      return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
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
      progressBarFill.style.width = progressPercentage * 100 + "%"
    },
    setSpeakerLevel(level) {
      this.$emit("update:speaker-level", level)
    },
  },
  watch: {
    volume(newVolume) {
      this.$refs.youtube.setVolume(newVolume)
    },
  },
}
</script>
