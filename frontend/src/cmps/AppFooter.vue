<template>
  <footer class="main-footer">
    <div class="footer-media-player">
      <MediaPlayer />
    </div>
    <div v-if="station" class="footer-details">
      <img class="footer-details-img" :src="url" />

      <h3 class="footer-details-title">
        {{ song.title ? song.title : youtubeSong.title }}
      </h3>
      <button class="footer-like">
        <BubblingHeart
          :songIndex="currSongIdx"
          :liked="station.songs[currSongIdx].liked"
          @toggleLike="toggleSongLike"
        />
      </button>
    </div>
  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { eventBus } from '../services/event-bus.service.js'
import { stationService } from '../services/station.service.local'

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
    }
  },
  created() {
    eventBus.on('song-details', (song) => {
      if (song.id) return (this.song = song)
      if (song.videoId) return (this.song = song)
      var delay = song.delay || 2000
      setTimeout(async () => {
        try {
          const videos = await stationService.getVideos(song.title)
          // console.log('itay maniak gadol', this.youtubeSong.url)
          console.log('videos', videos)
          this.youtubeSong = videos[0]
          this.url = this.youtubeSong.url
          this.alive = true
        } catch (err) {
          console.error(err)
        }
        this.alive = false
      }, delay)
    })

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

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
