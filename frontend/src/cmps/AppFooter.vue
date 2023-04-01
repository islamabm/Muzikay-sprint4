<template>
  <footer class="main-footer">
    <div class="footer-media-player">
      <MediaPlayer />
    </div>

    <div v-if="station" class="footer-details">
      <div v-if="!check">
        <img class="footer-details-img" :src="youtubeSong.url" />
        <h1>{{ youtubeSong.title }}</h1>
        <!-- <button class="footer-like">
          <BubblingHeart
            :songIndex="currSongIdx"
            :liked="station.songs[currSongIdx].liked"
            @toggleLike="toggleSongLike"
          />
        </button> -->
      </div>
      <div v-else v-if="youtubeSong">
        <img :src="youtubeSong.url" alt="shit bakod" />
        <h3 class="footer-details-title">
          {{ youtubeSong.title }}
        </h3>
      </div>
      <!-- <div v-else>
        <img class="footer-details-img" :src="song.imgUrl" />
        <h1>{{ song.title }}</h1> -->
      <!-- <button class="footer-like">
          <BubblingHeart
            :songIndex="currSongIdx"
            :liked="station.songs[currSongIdx].liked"
            @toggleLike="toggleSongLike"
          />
        </button> -->
      <!-- </div> -->
      <!-- <h3 class="footer-details-title">
        {{ song.title }}
      </h3>
      <button class="footer-like">
        <BubblingHeart
          :songIndex="currSongIdx"
          :liked="station.songs[currSongIdx].liked"
          @toggleLike="toggleSongLike"
        />
      </button>
    </div>
    <div v-if="check" class="footer-details">
      <h1>kos ema shelkha</h1> -->
      <!-- <img
        class="footer-details-img"
        src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
      /> -->
    </div>
  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { eventBus } from '../services/event-bus.service.js'
import { stationService } from '../services/station.service.local'
import { faL } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'AppFooter',
  emits: ['songFromYoutube'],
  data() {
    return {
      // songIdx: 0,
      hover: false,
      showModal: false,
      song: null,
      alive: false,
      youtubeSong: null,
      check: false,
    }
  },
  created() {
    eventBus.on('song-details', (song) => {
      if (song.id) {
        return (this.song = song)
      }
      this.check = true
      console.log('there is no id')
      console.log(this.$store.getters.stations)
      this.youtubeSong = song
      console.log(this.youtubeSong)

      var delay = song.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
    // eventBus.on('song-details', (song) => {
    //   console.log(song)
    //   if (song.id || song.videoId) return (this.song = song)
    //   // if (song.videoId) return (this.song = song)
    //   var delay = song.delay || 2000
    //   setTimeout(async () => {
    //     try {
    //       const videos = await stationService.getVideos(song.title)

    //       console.log('videos', videos)
    //       console.log
    //       this.youtubeSong = videos[0]
    //       this.url = this.youtubeSong.url
    //       this.alive = true
    //     } catch (err) {
    //       console.error(err)
    //     }
    //     this.alive = false
    //   }, delay)
    // })

    eventBus.on('youtube-song', (video) => {
      this.youtubeSong = video
      console.log(this.youtubeSong)
      var delay = video.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
  },
  computed: {
    station() {
      return this.$store.getters.station
    },
    stations() {
      return this.$store.getters.stations
    },
    url() {
      console.log('in the url')
      if (!this.station) return
      console.log('imgUrl', this.song.imgUrl)
      if (this.song.imgUrl) return this.song.imgUrl
      console.log('url', this.youtubeSong.url)
      if (this.youtubeSong.url) return this.youtubeSong.url
    },
    currSong() {
      if (!this.station) return
      if (!this.song.id && this.song.videoId) return this.song.videoId
      if (!this.song.id && !this.song.videoId) return
      return this.station.songs.find((s) => s.id === this.song.id)
    },
    currSongIdx() {
      if (!this.station) return
      return this.station.songs.findIndex((s) => s.id === this.song.id)
    },
  },
  methods: {
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    // Add functionality
    toggleSongLike(idx) {
      // const song = this.station.songs[idx]

      console.log('liked')
      // song.liked = !song.liked
      // console.log(
      //   `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
      // )
    },
  },
  mounted() {
    console.log(this.$store.getters.stations)
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
