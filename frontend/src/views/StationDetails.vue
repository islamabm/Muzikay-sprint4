<template>
  <section v-if="station" class="station-details">
    <section class="station-details-header">
      <div ref="stationDetailsHeader" class="header-content">
        <img
          v-if="station.songs && station.songs.length > 0"
          :src="station.songs[0].imgUrl"
        />
        <img
          v-else-if="station.name === 'Liked songs'"
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
        />
        <img
          class="deafult-image"
          @click="toggleModal"
          v-else
          src="../assets/img/empty-img.png"
        />

        <div class="station-info">
          <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
          <h1 class="station-name" @click="toggleModal">{{ station.name }}</h1>

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
      </div>
    </section>

    <section ref="bottomHalf">
      <div class="station-controls">
        <div class="btn-play-green" @click.stop="playStation"></div>
        <BubblingHeart @toggleLike="toggleHeaderLike" />
        <div class="btn-icons">
          <i class="options-icon" v-html="getSvg('optionsIcon')"></i>
        </div>
      </div>
      <div class="table-header">
        <span class="title-container"><span>#</span>Title</span>
        <span>Album</span>
        <div>
          <span>Date added</span>
        </div>
        <div>
          <i class="duration-icon" v-html="getSvg('durationIcon')"></i>
        </div>
      </div>

      <Container @drop="onDrop" v-if="station.songs" class="songs-list-details">
        <Draggable
          @mouseleave="hover = false"
          @mouseover="hover = true"
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
              <BubblingHeart
                v-if="hover"
                :songIndex="idx"
                :liked="song.liked"
                @toggleLike="toggleSongLike"
                @addLikeToSong="addSongToLikedSongs(song)"
              />
            </div>
            <p class="song-duration">1:40</p>
            <div>
              <button
                class="btn-open-modal"
                @click="toggleSongModal(song, idx)"
              >
                <i
                  class="options-song-icon"
                  v-html="getSvg('songOptionsIcon')"
                ></i>
              </button>
            </div>
          </div>
        </Draggable>
        <MiniSearch />
      </Container>

      <div v-if="showSongModal" @click.self="toggleSongModal(null, null)">
        <div class="modal-content">
          <ul class="modal-options">
            <li @click="addToPlaylist(selectedSong)">Add to playlist</li>
            <li
              v-if="station.createdBy.fullname === 'guest'"
              @click="removeSong(selectedSong, selectedIndex)"
            >
              Remove
            </li>
          </ul>
        </div>
      </div>
    </section>
  </section>

  <section v-if="showModal">
    <StationEdit :showModal="showModal" @close="showModal = false" />
    <button @click="toggleModal">x</button>
  </section>
</template>

<script>
import { utilService } from '../services/util.service'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { userService } from '../services/user.service.local.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import MiniSearch from '../cmps/MiniSearch.vue'
import BubblingHeart from '../cmps/BubblingHeart.vue'

export default {
  name: 'station-details',
  data() {
    return {
      hover: false,
      // station: null,
      showSongModal: false,
      showModal: '',
      activeTitle: null,
      counter: 0,
      dominantColor: null,
      likeIconFill: '#FFF',
      liked: false,
      selectedSong: null,
      selectedIndex: null,
    }
  },
  methods: {
    updateBodyBackgroundColor(color) {
      console.log(color)

      const darkShade = {
        ...color,
        rgba: `rgba(${Math.round(color.value[0] * 0.07)}, ${Math.round(
          color.value[1] * 0.07
        )}, ${Math.round(color.value[2] * 0.07)}, 0.7)`,
      }

      const headerShade = {
        ...color,
        rgba: `rgba(${Math.round(color.value[0] * 0.4)}, ${Math.round(
          color.value[1] * 0.4
        )}, ${Math.round(color.value[2] * 0.4)}, 0.7)`,
      }

      console.log('shade', darkShade)

      const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
      const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba}, #000)`

      document.body.style.backgroundImage = gradient
      this.$refs.stationDetailsHeader.style.backgroundImage = gradient
      this.$refs.bottomHalf.style.backgroundImage = darkGradient
    },
    addSongToLikedSongs(song) {
      const station = userService.getLoggedinUser()
      console.log('stationDetails', station)
      console.log(song)

      console.log('hi')

      station.songs.push(song)
      utilService.saveToStorage('loggedinUser', station)
    },

    // toggleSongLike(idx) {
    //   const song = this.station.songs[idx]
    //   song.liked = !song.liked
    //   console.log(
    //     `Song at index ${idx} has been ${song.liked ? 'liked' : 'unliked'}.`
    //   )

    //   //   // Add functionality
    // },
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
      const station = JSON.parse(JSON.stringify(this.station))
      station.songs = this.applyDrag(station.songs, dropResult)
      this.$store.commit({ type: 'editStation', station })
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
    // async removeMsg(msgId) {
    //   try {
    //    await this.$store.dispatch({ type: 'removeMsg' , toyId: this.toy._id, msgId})
    //    this.$emit('loadToy')
    //   } catch {
    //     console.log('Could Not delete msg');
    //   }
    // },

    async removeSong(songId, stationId) {
      console.log('atationDetails', songId)
      console.log('stationDetails', stationId)
      try {
        await this.$store.dispatch({
          type: 'removeSong',
          songId,
          stationId: this.station._id,
        })
        showSuccessMsg('song removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove song')
      } finally {
        this.showSongModal = false
      }
    },
    async addToPlaylist(song) {
      const stationName = prompt('station?')
      try {
        const station = this.stations.find((s) => s.name === stationName)
        console.log('stationDetails', song)
        console.log('stationDetails', stationName)
        await this.$store.dispatch({
          type: 'addToPlaylist',
          song,
          station,
        })
        showSuccessMsg('added to playlist')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot added to playlist')
      } finally {
        this.showSongModal = false
      }
    },
    toggleModal() {
      if (this.station.createdBy.fullname === 'guest') {
        this.showModal = !this.showModal
      } else {
        console.log('not user data')
      }
    },
    toggleSongModal(song, idx) {
      console.log('toggled song modal')
      this.selectedSong = song
      this.selectedIndex = idx
      this.showSongModal = !this.showSongModal
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
    station() {
      return this.$store.getters.station
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
