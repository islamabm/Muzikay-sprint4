<template>
  <section v-if="station" class="station-details">
    <section class="station-details-header">
      <div ref="stationDetailsHeader" class="header-content">
        <img
          v-if="
            station.songs &&
            station.songs.length > 0 &&
            station._id !== 'likeduser123'
          "
          :src="
            station.imgUrl
              ? station.imgUrl
              : station.songs[0].imgUrl
              ? station.songs[0].imgUrl
              : station.songs[0].url
          "
          @click="toggleModal"
        />

        <img
          @click="toggleModal"
          v-else-if="station._id === 'likeduser123'"
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
        />
        <div class="icon-container" v-else>
          <i class="music-note" v-html="getSvg(currImgSvg)"></i>
          <img
            class="default-image"
            src="../assets/img/default.png"
            @click="toggleModal"
            v-show="station._id !== 'likeduser123'"
            @mouseover="toggleImgSvg('editImgIcon')"
            @mouseleave="toggleImgSvg('defaultImgIcon')"
          />
          <span v-if="currImgSvg === 'editImgIcon'">Choose photo</span>
        </div>

        <div class="station-info">
          <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
          <h1 class="station-name" @click="toggleModal">{{ station.name }}</h1>

          <p class="station-description" @click="toggleModal">
            {{ station.description }}
          </p>
          <div v-if="station.songs">
            <div class="likes-count-logo">
              <div class="logo-container-header">
                <i class="logo-green" v-html="getSvg('greenLogo')"></i>
                <!-- <h1 v-if="user">{{ user.fullname }}</h1> -->
                <span class="small-logo-word">Muzikay</span>
              </div>
              <!-- <span class="likes-count" @click="toggleModal"
                >6,950,331 likes</span
              > -->
              <span class="dot">•</span>
              <span class="songs-count">{{ songsCount }},</span>

              <span class="posted-at">about 11 hr </span>
            </div>
          </div>
          <div v-else>...</div>
        </div>
      </div>
    </section>

    <section ref="bottomHalf">
      <div class="station-controls">
        <div
          v-if="station.songs.length"
          class="btn-play-green"
          @click.stop="playStation"
        ></div>
        <BubblingHeart
          v-if="station.songs.length"
          @toggleLike="toggleHeaderLike"
        />

        <div class="btn-icons" @click="showDeleteModel">
          <i class="options-icon" v-html="getSvg('optionsIcon')"></i>
        </div>
      </div>
      <div class="table-header">
        <span class="title-container"><span>#</span>Title</span>
        <span class="album">Album</span>
        <div>
          <span>Date added</span>
        </div>
        <div>
          <i class="duration-icon" v-html="getSvg('durationIcon')"></i>
        </div>
      </div>

      <Container @drop="onDrop" v-if="station.songs" class="songs-list-details">
        <Draggable
          @mouseover="currDraggableIdx = idx"
          @mouseleave="currDraggableIdx = null"
          class="song-item"
          v-for="(song, idx) in station.songs"
          :key="idx"
        >
          <div class="img-and-title" @click="songDetails(song)">
            <span>{{ idx + 1 }}</span>
            <img v-if="song.videoId" class="song-img" :src="song.url" />
            <img v-else class="song-img" :src="song.imgUrl" />
            <p
              class="song-title"
              :class="{ active: activeTitle === idx }"
              @click="toggleActiveTitle(idx)"
            >
              {{ song.title }} - {{ song.artist }}
            </p>
          </div>

          <p class="song-album">
            {{ song.album }}
          </p>

          <p class="posted-at">1 day ago</p>
          <!-- @toggleLike="toggleSongLike" -->
          <div class="flex-end list-end">
            <div class="like-song-icon">
              <BubblingHeart
                title="heart"
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addUserToSong(song), onHeartClick(idx)"
              />
              <!-- @toggleLikgit ngLike" -->
            </div>
            <p class="song-duration">1:40</p>
            <div>
              <button
                class="btn-open-modal"
                ref="songButtons"
                @click="toggleSongModal($event, song, idx)"
              >
                <i
                  class="options-song-icon hover-effect"
                  v-html="getSvg('songOptionsIcon')"
                ></i>
              </button>
            </div>
          </div>
        </Draggable>
      </Container>
      <Container @drop="onDrop" v-if="station._id === 'likeduser123'">
        <Draggable
          class="song-item"
          v-for="(song, idx) in likedSongsUser"
          :key="idx"
        >
          <div class="img-and-title" @click="songDetails(song)">
            <span>{{ idx + 1 }}</span>
            <img v-if="song.videoId" class="song-img" :src="song.url" />
            <img v-else class="song-img" :src="song.imgUrl" />
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
                title="heart"
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addUserToSong(song), onHeartClick(idx)"
              />
            </div>
            <p class="song-duration">1:40</p>
            <div>
              <button
                class="btn-open-modal"
                ref="songButtons"
                @click="toggleSongModal($event, song, idx)"
              >
                <i
                  class="options-song-icon hover-effect"
                  v-html="getSvg('songOptionsIcon')"
                ></i>
              </button>
            </div>
          </div>
        </Draggable>
      </Container>

      <MiniSearch :handelYoutubeSong="handelYoutubeSong" />

      <div v-if="showSongModal" @click.self="toggleSongModal(null, null)">
        <div
          class="modal-content"
          :style="{ left: modalX + 'px', top: modalY + 'px' }"
        >
          <ul class="modal-options">
            <li @click="openStationSelection">Add to playlist</li>
            <div v-show="showStationsSubMenu">
              <ul class="stations-sub-menu">
                <li
                  v-for="station in userStations"
                  :key="station._id"
                  @click="addToSelectedStation(selectedSong, station)"
                >
                  {{ station.name }}
                </li>
              </ul>
            </div>
            <li
              v-if="station.createdBy.fullname !== 'system'"
              @click="removeSong(selectedSong)"
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

  <section v-if="showDeleteModal" class="delete-modal-backdrop">
    <div class="delete-modal">
      <h1>Delete from Library?</h1>
      <p>
        This will delete <span>{{ stationDeleteMsg }} </span> from Your Library.
      </p>
      <div class="delete-modla-btns">
        <button class="delete-modal-cancle-btn" @click="cancle">Cancel</button>
        <button class="delete-modal-delete-btn" @click="removeStation">
          Delete
        </button>
      </div>
    </div>
  </section>

  <section v-if="showAreYouSureModal" class="delete-modal-backdrop">
    <div class="delete-modal">
      <h1>Already added</h1>
      <p>This is already in your <span>playlist</span></p>
      <div class="delete-modla-btns">
        <button class="delete-modal-cancle-btn" @click="addSongAnyway">
          Add anyway
        </button>
        <button class="delete-modal-delete-btn" @click="dontAddSong">
          Don't add
        </button>
      </div>
    </div>
  </section>
  <!-- <section v-if="showAddSongModal" class="delete-modal-backdrop">
    <div class="delete-modal">
      <h1>Delete from Library?</h1>
      <p>
        This will delete <span>{{ stationDeleteMsg }} </span> from Your Library.
      </p>
      <div class="delete-modla-btns">
        <button
          class="delete-modal-cancle-btn"
          @click="addToSelectedStation(selectedSong, this.station)"
        >
          Add anyway
        </button>
        <button class="delete-modal-delete-btn" @click="cancle">
          Dont add
        </button>
      </div>
    </div>
  </section> -->
</template>

<script>
import { utilService } from '../services/util.service'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import { userService } from '../services/user.service.js'
import {
  eventBus,
  showErrorMsg,
  showSuccessMsg,
} from '../services/event-bus.service'
import MiniSearch from '../cmps/MiniSearch.vue'
import BubblingHeart from '../cmps/BubblingHeart.vue'

export default {
  name: 'station-details',
  data() {
    return {
      modalX: 0,
      modalY: 0,
      showAddSongModal: false,
      showSongModal: false,
      showModal: '',
      activeTitle: null,
      counter: 0,
      dominantColor: null,
      likeIconFill: '#FFF',
      showDeleteModal: false,
      liked: false,
      currDraggableIdx: null,
      selectedSong: null,
      selectedIndex: null,
      showStationsSubMenu: false,
      showAreYouSureModal: false,
      wantAnyWay: false,
      clickedHeartIndex: null,
      currImgSvg: 'defaultImgIcon',
    }
  },
  methods: {
    handelYoutubeSong(video) {
      eventBus.emit('youtube-song', video)
    },
    songDetails(song) {
      eventBus.emit('song-details', song)
    },
    dontAddSong() {
      this.showAreYouSureModal = false
    },
    showDeleteModel() {
      this.showDeleteModal = true
    },

    cancle() {
      this.showDeleteModal = false
    },
    updateBodyBackgroundColor(color) {
      // console.log(color)

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

      // console.log('shade', darkShade)

      const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
      const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`

      document.body.style.backgroundImage = gradient
      this.$refs.stationDetailsHeader.style.backgroundImage = gradient
      this.$refs.bottomHalf.style.backgroundImage = darkGradient
    },

    async addUserToSong(song) {
      const station = this.station
      try {
        const updatedStation = await this.$store.dispatch({
          type: 'addUserToSong',
          song,
          userStation: station,
          user: this.user,
        })
        this.$store.commit({ type: 'editStation', station: updatedStation })
        showSuccessMsg('Song liked')
      } catch (err) {
        console.log(err)
        showErrorMsg('Remove from liked songs')
      }
    },

    openStationSelection() {
      console.log('opened')
      this.showStationsSubMenu = !this.showStationsSubMenu
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
    toggleImgSvg(svg) {
      this.currImgSvg = svg
    },
    onHeartClick(index) {
      if (this.clickedHeartIndex === index) {
        this.clickedHeartIndex = null
      } else {
        this.clickedHeartIndex = index
      }
    },
    async getDominantColor(imageSrc) {
      const fac = new FastAverageColor()
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest='
      img.src = corsProxyUrl + encodeURIComponent(imageSrc)

      img.onload = async () => {
        // console.log('Image loaded')
        try {
          const color = await fac.getColorAsync(img)
          // console.log('inside try', color)
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

    async removeSong(songId) {
      this.showSongModal = false
      console.log('station details function remove song', songId)
      console.log('station details function remove song', this.station._id)
      try {
        await this.$store.dispatch({
          type: 'removeSong',
          songId,
          stationId: this.station._id,
        })
        showSuccessMsg('Song removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove song')
      }
    },
    // removeSong(songId) {
    //   console.log('station details function remove song', songId)
    //   console.log('station details function remove song', this.station._id)

    //   this.$store.dispatch({
    //     type: 'removeSong',
    //     songId,
    //     stationId: this.station._id,
    //   })
    // },
    // async addToStation(song) {
    //   const stationName = prompt('station?')
    //   try {
    //     const station = this.stations.find((s) => s.name === stationName)
    //     console.log('stationDetails', song)
    //     console.log('stationDetails', stationName)
    //     await this.$store.dispatch({
    //       type: 'addToStation',
    //       song,
    //       station,
    //     })
    //     showSuccessMsg('added to playlist')
    //   } catch (err) {
    //     console.log(err)
    //     showErrorMsg('Cannot added to playlist')
    //   } finally {
    //     this.showSongModal = false
    //   }
    // },

    async addToSelectedStation(song, station) {
      console.log('we are in the details in the add song', song)
      console.log('we are in the details in the add song station', station)
      try {
        await this.$store.dispatch({
          type: 'addToStation',
          song,
          station,
        })
        showSuccessMsg('Added to playlist')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add to playlist')
      } finally {
        this.showSongModal = false
        this.showStationsSubMenu = false
        // this.show = false
      }
    },

    async removeStation() {
      this.showDeleteModal = false
      try {
        await this.$store.dispatch({
          type: 'removeStation',
          stationId: this.station._id,
        })
        showSuccessMsg('Station removed')
      } catch (err) {
        showErrorMsg('Cannot remove station')
      }
    },
    toggleModal() {
      // if (this.station.createdBy.fullname === 'guest') {
      this.showModal = true
      // } else {
      // console.log('not user data')
      // }
    },
    toggleSongModal(ev, song, idx) {
      const btn = ev.target
      const buttonEl = this.$refs.songButtons[idx]
      // Get the x and y coordinates of the button in the screen
      const { left, top, height } = btn.getBoundingClientRect()
      this.modalX = left - 200
      this.modalY = top + height - 60

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
            this.getDominantColor(
              this.station.imgUrl
                ? this.station.imgUrl
                : this.station.songs[0].imgUrl
            )
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
    user() {
      return this.$store.getters.loggedinUser
    },
    stationDeleteMsg() {
      return this.station.name
    },
    likedSongsUser() {
      return []
      // console.log(this.$store.getters.getSongsLikedByUser)
      // return this.$store.getters.getSongsLikedByUser
    },
    isLikedPageWanted() {
      return this.$route.path === `/station/likeduser123`
    },
    userStations() {
      return this.$store.getters.getUserStations
    },
    songsCount() {
      //this 'songs' word should be dynamic, in case we might wanna translate it
      const count = this.station.songs.length
      return `${count} Songs`
    },
    getTimeAgo(idx) {
      const seconds = Math.floor((Date.now() - idx * 1000) / 1000)
      if (seconds < 60) {
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`
      }
      const minutes = Math.floor(seconds / 60)
      if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
      }
      const hours = Math.floor(minutes / 60)
      if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`
      }
      const days = Math.floor(hours / 24)
      return `${days} day${days === 1 ? '' : 's'} ago`
    },
    hover() {
      return this.currDraggableIdx !== null
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
    // handelLongText() {
    //   let longSongs = this.station.songs.filter(s => s.title.length > 25)
    //   const song = longSongs.map(s => s.title.slice(0,25) + '...')
    //   console.log(song);
    //   // this.station.push(song)

    //   return song
    // }
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
