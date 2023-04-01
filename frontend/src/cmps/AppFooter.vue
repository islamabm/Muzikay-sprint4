<template>
  <footer class="main-footer">
    <div class="footer-media-player">
      <MediaPlayer />
    </div>
    <div v-if="station" class="footer-details">
      <img class="footer-details-img" :src="getImageUrl" />
      <h3 class="footer-details-title">
        {{ currSong.title || youtubeSong.title }}
      </h3>
      <button class="footer-like">
        <BubblingHeart
          :songIndex="currSongIdx"
          :liked="currSong ? currSong.liked : false"
          @toggleLike="toggleSongLike"
        />
      </button>
    </div>
    <div v-if="check" class="footer-details">
      <h1>kos ema shelkha</h1>
      -->
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
      console.log('song-details event received:', song)
      if (song.id || song.videoId) {
        this.song = song.id ? song : { id: song.videoId }
        var delay = song.delay || 2000
        this.alive = true
        setTimeout(() => {
          this.alive = false
        }, delay)
      }
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
      console.log('youtube-song event received:', video)
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
      if (!this.station) return null

      if (this.song) {
        const foundSong = this.station.songs.find((s) => s.id === this.song.id)
        if (foundSong) {
          console.log('currSong found:', foundSong)
          return foundSong
        }
      }

      if (this.youtubeSong && this.youtubeSong.url) {
        return this.youtubeSong
      }

      return null
    },

    currSongIdx() {
      if (!this.station) return
      const foundIdx = this.station.songs.findIndex(
        (s) => s.id === this.song.id
      )
      console.log('currSongIdx:', foundIdx)
      return foundIdx
    },
    //for youtube you need currSong.url
    //for ours, you need currSong.imgUrl
    async getImageUrl() {
      if (this.currSong && this.currSong.imgUrl) {
        console.log('helooooooooooooooooooo')
        console.log(this.currSong, "that's the current song")
        return this.currSong.imgUrl
      } else if (this.youtubeSong && this.youtubeSong.url) {
        console.log('helooooooooooooooooooo')
        console.log(this.youtubeSong, 'this is youtube song')
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
    // handelSearchSong(song) {
    //   this.song = song
    // },
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
    console.log(this.$store.getters.stations)
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
  watch: {
    song(newValue, oldValue) {
      console.log('song changed:', newValue)
    },
    youtubeSong(newValue, oldValue) {
      console.log('youtubeSong changed:', newValue)
    },
  },
}
</script>
