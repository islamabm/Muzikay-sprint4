<template>
  <footer class="main-footer">
    <p class="lyrics" v-if="currentLyrics" :key="currentLyricsKey">
      {{ currentLyrics }}
    </p>
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

      <button class="footer-like"></button>
    </div>
  </footer>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import MediaPlayer from './MediaPlayer.vue'
import BubblingHeart from './BubblingHeart.vue'
import { stationService } from '../services/station.service.local.js'
export default {
  name: 'AppFooter',
  emits: ['songFromYoutube', 'songDetails'],
  data() {
    return {
      hover: false,
      showModal: false,
      song: null,
      alive: false,
      currSong: null,
      songIdx: 0,
      lyrics: '',
      currentLyrics: '',
      currentLyricsIdx: 0,
      currentLyricsKey: 0,
    }
  },
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
      const { idx } = songDetails
      this.songIdx = idx - 1

      this.currSong = this.station.songs[this.songIdx]
    },
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    fetchLyrics(song) {
      stationService
        .getSongLyrics(song.artist, song.title)
        .then((lyrics) => {
          this.lyrics = lyrics
        })
        .catch((error) => {
          console.error(error)
        })
    },
    updateLyrics(currentTime) {
      let currentLine = this.lyrics.reduce((lastValidLyric, lyric) => {
        return lyric.time <= currentTime ? lyric : lastValidLyric
      }, this.lyrics[0])

      this.currentLyrics = currentLine ? currentLine.text : ''
      this.currentLyricsKey += 1
    },
  },
  created() {
    eventBus.on('song-lyrics', this.fetchLyrics)
    eventBus.on('song-progress', this.updateLyrics)
  },

  components: {
    MediaPlayer,
    BubblingHeart,
  },
}
</script>
