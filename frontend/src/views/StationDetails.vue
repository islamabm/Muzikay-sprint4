<template>
  <section v-if="station" class="station-details">
    <section ref="stationDetailsHeader" class="station-details-header">
      <img
        v-if="station.songs && station.songs.length > 0"
        :src="station.songs[0].imgUrl"
      />
      <img class="deafult-image" v-else src="../assets/img/empty-img.png" />

      <div class="station-info">
        <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
        <h1 class="station-name">{{ station.name }}</h1>

        <p class="station-description" @click="toggleModal">
          Playlist Relax and indulge with beautiful piano pieces
        </p>
        <div v-if="station.songs">
          <div class="likes-count-logo">
            <i class="logo-green" v-html="getSvg('greenLogo')"></i>
            <span class="small-logo-word">Muzikay</span>
            <span @click="toggleModal">6,950,331 likes</span>•<span
              >{{ songsCount }},</span
            >

            <span>about 11 hr </span>
          </div>
        </div>
        <div v-else>...</div>
      </div>
    </section>

    <div class="station-controls">

      <div class="btn-play-green" @click.stop="playStation"></div>
      <BubblingHeart @toggleLike="toggleHeaderLike" />
      <div class="btn-icons">
        <i class="options-icon" v-html="getSvg('optionsIcon')"></i>
      </div>
    </div>

    <div class="table-header">
      <span>#Title</span>
      <span>Album</span>
      <span>Date added</span>
      <span><i class="duration-icon" v-html="getSvg('durationIcon')"></i></span>
    </div>

    <Container @drop="onDrop" v-if="station.songs" class="songs-list-details">
      <Draggable
        class="song-item"
        v-for="(song, idx) in station.songs"
        :key="idx"
      >
        <div class="img-and-title">
          <span>{{ idx + 1 }}</span>
          <img class="song-img" :src="song.imgUrl" />
          <p
            class="song-title"
            :class="{ active: activeTitle === idx }"
            @click="toggleActiveTitle(idx)"
          >
            {{ song.title }}
          </p>
        </div>
        <p class="posted-at">1 day ago</p>

        <div class="flex-end list-end">
          
          <div class="like-song-icon">
          <BubblingHeart :songIndex="idx" :liked="song.liked" @toggleLike="toggleSongLike" />
        </div>
          <p class="song-duration">1:40</p>

          <button
            class="btn-remove-song"
            @click="removeSong(song.videoId, station._id)"
            v-if="(station.createdBy.fullname = 'guest')"
          >
            <i class="options-song-icon" v-html="getSvg('songOptionsIcon')"></i>
          </button>
        </div>
      </Draggable>
      <MiniSearch />
    </Container>
  </section>

  <section v-if="showModal">
    <StationEdit :showModal="showModal" @close="showModal = false" />
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import MiniSearch from '../cmps/MiniSearch.vue'
import BubblingHeart from '../cmps/BubblingHeart.vue'

export default {
  name: 'station-details',
  data() {
    return {
      station: null,
      showModal: '',
      activeTitle: null,
      counter: 0,
      dominantColor: null,
      likeIconFill: '#FFF',
      liked: false,

      likeIconFillCls1: 'none',
      likeIconFillCls2: '$clr11',
    }
  },
  methods: {
    updateBodyBackgroundColor(color) {
      const gradient = `linear-gradient(to bottom, ${color.rgba}, #000)`
      document.body.style.backgroundImage = gradient
      this.$refs.stationDetailsHeader.style.backgroundColor = color.rgb
    },
    toggleHeaderLike() {
    this.liked = !this.liked
    this.likeIconFillCls1 = this.liked ? 'green' : 'none'
    this.likeIconFillCls2 = this.liked ? 'green' : '$clr11'
  },
  toggleSongLike(idx) {
    const song = this.station.songs[idx]
    song.liked = !song.liked
    console.log(`Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`)
    
    // Add functionality
  },
    toggleActiveTitle(idx) {
      if (this.activeTitle === idx) {
        this.activeTitle = null
      } else {
        this.activeTitle = idx
      }
    },
    async getDominantColor(imageSrc) {
      const fac = new FastAverageColor()
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest='
      img.src = corsProxyUrl + encodeURIComponent(imageSrc)

      img.onload = async () => {
        console.log('Image loaded')
        try {
          const color = await fac.getColorAsync(img)
          console.log('inside try', color)
          this.updateBodyBackgroundColor(color)
        } catch (e) {
          console.error(e)
        }
      }
    },
    onDrop(dropResult) {
      console.log(this.station)
      this.station.songs = this.applyDrag(this.station.songs, dropResult)
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult

      if (removedIndex === null && addedIndex === null) return arr
      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      return result
    },

    async removeSong(songId, stationId) {
      console.log('atationDetails', songId)
      console.log('stationDetails', stationId)
      try {
        // const station = this.stations.find((s) => s._id === stationId)
        await this.$store.dispatch({ type: 'removeSong', songId, stationId })
        showSuccessMsg('song removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove song')
      }
    },
    toggleModal() {
      if (this.station.createdBy.fullname === 'guest') {
        this.showModal = !this.showModal
      } else {
        console.log('not user data')
      }
    },

    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
  },
  watch: {
    '$route.params': {
      async handler() {
        const { stationId } = this.$route.params
        try {
          this.station = await stationService.getById(stationId)
          // this.station = await this.$store.getters.stationById(stationId)
          // console.log(this.station)
          if (this.station.songs && this.station.songs.length > 0) {
            // maybe remove after && after 11pm we dont delete anything
            this.getDominantColor(this.station.songs[0].imgUrl)
          }
        } catch (err) {
          console.log(err)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    songsCount() {
      //this 'songs' word should be dynamic, in case we might wanna translate it
      const count = this.station.songs.length
      return `${count} Songs`
    },
    stations() {
      return this.$store.getters.stations
    },

    stationCount() {
      //computed can't do this
      this.counter++

      return `My Playlist #${this.counter}`
    },
  },
  components: {
    StationEdit,
    Search,
    MiniSearch,
    Container,
    Draggable,
    BubblingHeart,
  },
  beforeUnmount() {
    document.body.style.background = '#181818'
  },
}
</script>



      <!-- <i
          class="like-icon"
          @click="toggleHeaderLike"
          :class="{ liked }"
          v-html="getSvg('likeBtnOutline')"
        ></i> -->
