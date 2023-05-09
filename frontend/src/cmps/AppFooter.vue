<template>
  <footer class="main-footer">
    <div class="footer-media-player">
      <MediaPlayer @songDetails="getSongDetails" />
    </div>
    <div v-if="station" class="footer-details">
      <div class="img-and-title-player" v-if="currSong">
        <img class="footer-details-img" :src="url" />
        <h3 class="footer-details-title">
          {{ currSong.title }}
        </h3>
      </div>
      <div class="img-and-title-player" v-else>
        <img class="footer-details-img" :src="station.songs[0].imgUrl" alt="" />
        <h3 class="footer-details-title">{{ station.songs[0].title }}</h3>
      </div>

      <button class="footer-like">
        <BubblingHeart />
        <!-- :songIndex="currSongIdx" -->
        <!-- :liked="currSong ? currSong.liked : false" -->
        <!-- @toggleLike="toggleSongLike" -->
      </button>
    </div>
  </footer>
</template>

<script>
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { eventBus } from '../services/event-bus.service.js'

export default {
  name: 'AppFooter',
  emits: ['songFromYoutube','songDetails'],
  data() {
    return {
      hover: false,
      showModal: false,
      song: null,
      alive: false,
      currSong: null,
      songIdx: 0,
    }
  },
  // created() {
  //   eventBus.on('song-details', (songDetails) => {
  //     const {song,idx} = songDetails
  //     console.log('song', song)
  //     this.currSong = song
  //     this.songIdx = idx
  //     var delay = songDetails.delay || 2000
  //     this.alive = true
  //     setTimeout(() => {
  //       this.alive = false
  //     }, delay)
  //   })
  // },
  computed: {
    station() {
      return this.$store.getters.station
    },
    stations() {
      return this.$store.getters.stations
    },
    url() {
      return this.currSong.imgUrl
    },
    async getImageUrl() {
      if (this.currSong && this.currSong.imgUrl) {
        return this.currSong.imgUrl
      } else if (this.youtubeSong && this.youtubeSong.url) {
        try {
          const response = await fetch(this.youtubeSong.url)
          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const ogImageUrl = doc
            .querySelector('meta[property="og:image"]')
            .getAttribute('content')
          console.log(ogImageUrl, 'this is ogImageUrl')
          return ogImageUrl
        } catch (err) {
          console.error(err)
          return 'https://howtodrawforkids.com/wp-content/uploads/2021/10/How-to-draw-a-Pig-Face-for-kindergarten.jpg'
        }
      } else {
        return 'https://howtodrawforkids.com/wp-content/uploads/2021/10/How-to-draw-a-Pig-Face-for-kindergarten.jpg'
      }
    },
  },
  methods: {
    getSongDetails(songDetails) {
      const {idx,song} = songDetails
      this.songIdx = idx
      this.currSong = song
    },
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    // Add functionality
    toggleSongLike(idx) {
      // const song = this.station.songs[idx]
      // song.liked = !song.liked
      // console.log(
      //   `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
      // )
    },
  },
  mounted() {
    eventBus.on('song-detailss', (song) => {
      this.currSong = song
      var delay = song.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })

  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },

}
</script>
