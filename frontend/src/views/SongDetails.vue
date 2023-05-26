<template>
  <section class="song-details-section" :style="bgStyle">
    <div v-if="song" class="song-details-wrapper header-content">
      <img class="station-cover-img" :src="song.imgUrl" alt="Album cover" />
      <div class="song-details-header">
        <h1 :class="stationNameClass">{{ song.title }}</h1>
        <h2 class="song-details-artist">{{ song.artist }}</h2>
        <small>Album - {{ song.album }}</small>
      </div>
    </div>
    <article class="song-details-lyrics">
      <div v-if="lyrics">
        <div v-for="line in lyrics" :key="line.time">
          {{ line.text }}
        </div>
      </div>
      <div v-else>Loading lyrics...</div>
    </article>
  </section>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
import { FastAverageColor } from 'fast-average-color'

export default {
  data() {
    return {
      colorCache: {},
      bgStyle: {},
    }
  },

  created() {
    console.log('hi')
    eventBus.on('view-song-details', this.changeSong)
    if (this.song) {
      this.updateImgUrlAndColor(this.song)
    }
  },
  methods: {
    async changeSong(song) {
      console.log('song', song)
      try {
        await this.$store.dispatch('fetchSongDetails', song)
        await this.$store.dispatch('fetchSongLyrics', song)
        this.updateImgUrlAndColor(song)
      } catch (error) {
        console.error(error)
      }
    },

    updateImgUrlAndColor(song) {
      if (!song) return
      const imgUrl = song.imgUrl
      if (imgUrl !== '') {
        this.getDominantColor(imgUrl)
      }
    },
    async getDominantColor(imageSrc) {
      const cachedColor = this.colorCache[imageSrc]
      if (cachedColor) {
        const gradient = `background: linear-gradient(to bottom, ${cachedColor} 0%, black 30%, ${cachedColor} 70%, black 100%)`
        this.bgStyle = gradient
        document.body.style.backgroundImage = gradient
        return
      }

      const fac = new FastAverageColor()
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest='
      img.src = corsProxyUrl + encodeURIComponent(imageSrc)
      img.onload = async () => {
        try {
          const color = await fac.getColorAsync(img)
          this.colorCache[imageSrc] = color
          this.bgStyle = {
            background: `linear-gradient(to bottom, ${color.rgb} 0%, black 30%, black 70%, black 100%)`,
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
  },
  computed: {
    stationNameClass() {
      const words = this.song.title.split(' ').length
      if (words <= 3) {
        return 'short-station-name'
      } else if (words <= 5) {
        return 'long-station-name'
      } else {
        return 'huge-station-name'
      }
    },

    song() {
      return this.$store.getters.currentSong
    },
    lyrics() {
      return this.$store.getters.currentLyrics
    },
  },
  watch: {
    song(newSong) {
      this.updateImgUrlAndColor(newSong)
    },
  },
}
</script>
