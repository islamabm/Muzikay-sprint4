<template>
  <section v-bind="$attrs" v-if="station" class="station-details">
    <section class="station-details-header">
      <div ref="stationDetailsHeader" class="header-content">
        <img
          v-if="
            station.songs &&
            station.songs.length > 0 &&
            station.name !== 'Liked songs'
          "
          :src="station.imgUrl ? station.imgUrl : station.songs[0].imgUrl"
          @click="toggleModal"
        />

        <img
          @click="toggleModal"
          v-else-if="station.name === 'Liked songs'"
          src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
        />
        <div class="icon-container" v-else>
          <i class="music-note" v-html="getSvg(currImgSvg)"></i>
          <img
            class="default-image"
            src="../assets/img/default.png"
            @click="toggleModal"
            v-show="station.name !== 'Liked songs'"
            @mouseover="toggleImgSvg('editImgIcon')"
            @mouseleave="toggleImgSvg('defaultImgIcon')"
          />
          <span v-if="currImgSvg === 'editImgIcon'">Choose photo</span>
        </div>

        <div class="station-info">
          <h1 class="playlist-word" @click="toggleModal">Playlist</h1>
          <h1 :class="stationNameClass" @click="toggleModal">
            {{ station.name }}
          </h1>

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

              <span class="dot">•</span>
              <span class="songs-count">{{ songsCount }},</span>

              <!-- <span v-if="station.songs[0].duration" class="posted-at">{{
                aboutCalc
              }}</span> -->
              <span class="posted-at">about 11 hr </span>

              <span v-if="station.songs[0].duration" class="posted-at">{{
                aboutCalc
              }}</span>
              <span v-else class="posted-at">about 11 hr </span>
            </div>
          </div>
          <div v-else>...</div>
        </div>
      </div>
    </section>

    <section v-if="station" ref="bottomHalf">
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

      <Container
        @drop="onDrop"
        v-if="station.songs && station.name !== 'Liked songs'"
        class="songs-list-details"
      >
        <Draggable
          @mouseover="currDraggableIdx = idx"
          @mouseleave="currDraggableIdx = null"
          class="song-item"
          v-for="(song, idx) in station.songs"
          :key="idx"
        >
          <div class="img-and-title" @click="songDetails(song,idx)">
            <!-- :class="{ 'active-song': song.active }" -->
            <img
              v-show="activeSongIndex === idx"
              class="song-animation-gif"
              src="../assets/gif/animation.gif"
            />
            <span v-if="activeSongIndex !== idx">{{ idx + 1 }}</span>
            <img
              @click="changeSetuations(idx)"
              v-if="song.videoId"
              class="song-img"
              :src="song.url"
            />
            <img
              @click="changeSetuations(idx)"
              v-else
              class="song-img"
              :src="song.imgUrl"
            />
            <p
              @click="toggleActiveTitle(idx), changeSetuations(idx)"
              class="song-title"
              :class="{ 'active-song': activeTitle === idx }"
            >
              <!-- v-bind:class="{ 'active-song': isActive }" -->
              {{ song.title }} - {{ song.artist }}
            </p>
          </div>

          <p class="song-album">
            {{ song.album }}
          </p>

          <p class="posted-at">{{ getTimeAgo(new Date(song.addedAt)) }}</p>
          <div class="flex-end list-end">
            <div class="like-song-icon">
              <BubblingHeart
                ref="heart"
                title="heart"
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addSongToUser(song), onHeartClick(idx)"
              />
            </div>
            <p v-if="song.duration" class="song-duration">
              {{ song.duration }}
            </p>
            <p v-else class="song-duration">1:40</p>
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

      <Container
        v-if="station.name === 'Liked songs'"
        class="songs-list-details"
      >
        <Draggable
          @mouseover="currDraggableIdx = idx"
          @mouseleave="currDraggableIdx = null"
          class="song-item"
          v-for="(song, idx) in likedSongsUser"
          :key="idx"
        >
          <div class="img-and-title" @click="songDetails(song,idx)">
            <!-- :class="{ 'active-song': song.active }" -->
            <img
              v-show="activeSongIndex === idx"
              class="song-animation-gif"
              src="../assets/gif/animation.gif"
            />
            <span v-if="activeSongIndex !== idx">{{ idx + 1 }}</span>
            <img
              @click="changeSetuations(idx)"
              v-if="song.videoId"
              class="song-img"
              :src="song.url"
            />
            <img
              @click="changeSetuations(idx)"
              v-else
              class="song-img"
              :src="song.imgUrl"
            />
            <p
              @click="toggleActiveTitle(idx), changeSetuations(idx)"
              class="song-title"
              :class="{ 'active-song': activeTitle === idx }"
            >
              <!-- v-bind:class="{ 'active-song': isActive }" -->
              {{ song.title }} - {{ song.artist }}
            </p>
          </div>

          <p class="song-album">
            {{ song.album }}
          </p>

          <p class="posted-at">{{ getTimeAgo(new Date(song.addedAt)) }}</p>
          <div class="flex-end list-end">
            <div class="like-song-icon">
              <BubblingHeart
                ref="heart"
                title="heart"
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addSongToUser(song), onHeartClick(idx)"
              />
            </div>
            <p v-if="song.duration" class="song-duration">
              {{ song.duration }}
            </p>
            <p v-else class="song-duration">1:40</p>
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
                  @click="addToSelectedStation(station._id, selectedSong)"
                >
                  {{ station.name }}
                </li>
              </ul>
            </div>
            <li
              v-if="station.createdBy.fullname !== 'system'"
              @click="removeSong(selectedSongId)"
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
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import { FastAverageColor } from 'fast-average-color'
import StationEdit from '../cmps/StationEdit.vue'
import Search from './Search.vue'
import svgService from '../services/SVG.service.js'
import { stationService } from '../services/station.service.local.js'
import {
  eventBus,
  showErrorMsg,
  showSuccessMsg,
} from '../services/event-bus.service'
import { socketService } from '../services/socket.service'
import MiniSearch from '../cmps/MiniSearch.vue'
import BubblingHeart from '../cmps/BubblingHeart.vue'

export default {
  props: {
    stationId: {
      type: String,
    },
  },
  name: 'station-details',
  inheritAttrs: false,
  emits: ['toggleHeaderLike'],
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
      colorCache: {},
      selectedSongId: null,
      activeClass: 'active-song',
      inactiveClass: 'inactive-song',
      currSongSelected: null,
      activeSongIndex: null,
      // running: true,
    }
  },
  methods: {
    toggleHeaderLike() {},
    handelYoutubeSong(video) {
      eventBus.emit('youtube-song', video)
    },
    changeSetuations(idx) {
      this.activeSongIndex = idx
      // this.running = true
    },
    formatDuration(duration) {
      if (isNaN(duration)) {
        return 'Loading...'
      }
      let minutes = Math.floor(duration / 60)
      let seconds = Math.floor(duration % 60)
      return `${minutes}:${seconds}`
    },
    songDetails(song,idx) {
      const currSong = {
        song,
        idx
      }
      eventBus.emit('song-details', currSong)
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
      const darkShade = this.getShade(color, 0.07)
      const headerShade = this.getShade(color, 0.4)

      const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
      const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`

      document.body.style.backgroundImage = gradient
      this.$refs.stationDetailsHeader.style.backgroundImage = gradient
      this.$refs.bottomHalf.style.backgroundImage = darkGradient
    },
    getShade(color, shadeLevel) {
      return {
        ...color,
        rgba: `rgba(${Math.round(color.value[0] * shadeLevel)}, ${Math.round(
          color.value[1] * shadeLevel
        )}, ${Math.round(color.value[2] * shadeLevel)}, 0.7)`,
      }
    },
    getTimeAgo(idx) {
      const date = new Date(idx)
      const timeDiff = Date.now() - date.getTime()
      // the consts are defind according to milliseconds
      const second = 1000
      const minute = second * 60
      const hour = minute * 60
      const day = hour * 24
      const month = day * 30
      const year = day * 365
      if (timeDiff < second) {
        return 'just now'
      } else if (timeDiff < minute) {
        const seconds = Math.floor(timeDiff / second)
        return seconds + (seconds === 1 ? ' second ago' : ' seconds ago')
      } else if (timeDiff < hour) {
        const minutes = Math.floor(timeDiff / minute)
        return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago')
      } else if (timeDiff < day) {
        const hours = Math.floor(timeDiff / hour)
        return hours + (hours === 1 ? ' hour ago' : ' hours ago')
      } else if (timeDiff < month) {
        const days = Math.floor(timeDiff / day)
        return days + (days === 1 ? ' day ago' : ' days ago')
      } else if (timeDiff < year) {
        const months = Math.floor(timeDiff / month)
        return months + (months === 1 ? ' month ago' : ' months ago')
      } else {
        const years = Math.floor(timeDiff / year)
        return years + (years === 1 ? ' year ago' : ' years ago')
      }
    },
    async addSongToUser(song) {
      console.log(this.$store.getters.userSongs)
      console.log('add user to song in the details', song)
      try {
        await this.$store.dispatch({
          type: 'updateUser',
          song,
          user: this.user,
        })
        showSuccessMsg('Song liked')
      } catch (err) {
        console.log(err)
      }
    },
    openStationSelection() {
      this.showStationsSubMenu = !this.showStationsSubMenu
    },
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
      const cachedColor = this.colorCache[imageSrc]
      if (cachedColor) {
        this.updateBodyBackgroundColor(cachedColor)
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
          this.updateBodyBackgroundColor(color)
        } catch (e) {
          console.error(e)
        }
      }
    },
    async onDrop(dropResult) {
      const { removedIndex, addedIndex } = dropResult
      console.log('removedIndex', removedIndex)
      console.log('addedIndex', addedIndex)
      if (removedIndex !== null || addedIndex !== null) {
        const songs = this.applyDrag(this.station.songs, dropResult)
        const obj = {
          stationId: this.station._id,
          songs,
        }

        this.$store.commit({ type: 'setStationSongs', obj })
        socketService.emit('station-updated', obj)

        // this.station.songs = songs
      }
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
    //Step 1
    async removeSong(songId) {
      console.log('station details function remove song', songId)
      console.log('station details function remove song', this.station._id)
      try {
        await this.$store.dispatch({
          type: 'removeSong',
          stationId: this.station._id,
          songId,
        })
        // socketService.emit('update-station', id)
        showSuccessMsg('Song removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove song')
      } finally {
        this.showSongModal = false
      }
    },

    async addToSelectedStation(stationId, song) {
      console.log('we are in the details in the add song', song)
      console.log('we are in the details in the add song station', stationId)

      // Check if song is already in the station's playlist
      const station = this.stations.find((s) => s._id === stationId)
      const songExists = station.songs.some((item) => item._id === song._id)
      if (songExists) {
        console.log('Song already exists in station playlist')
        return
      }

      try {
        await this.$store.dispatch({
          type: 'addToStation',
          stationId,
          song,
        })
        showSuccessMsg('Added to playlist')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add to playlist')
      } finally {
        this.showSongModal = false
        this.showStationsSubMenu = false
      }
    },
    async removeStation() {
      this.showDeleteModal = false
      this.$router.push(`/station/collection`)
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
      this.showModal = true
    },
    toggleSongModal(ev, song, idx) {
      const btn = ev.target
      // Get the x and y coordinates of the button in the screen
      const { left, top, height } = btn.getBoundingClientRect()
      this.modalX = left - 200
      this.modalY = top + height - 60
      this.selectedSong = song
      this.selectedSongId = song.id
      this.selectedIndex = idx
      this.showSongModal = !this.showSongModal
    },
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
  },
  watch: {
    station: {
      handler(newStation) {
        if (!newStation) return

        this.$nextTick(() => {
          this.getDominantColor(
            newStation.imgUrl ? newStation.imgUrl : newStation.songs[0].imgUrl
          )
        })
      },
      deep: true,
    },
  },

  computed: {
    songClass() {
      return this.isActive ? this.activeClass : this.inactiveClass
    },
    // aboutCalc() {
    //   const about = this.station.songs.map((s) => s.duration.split(':'))
    //   const minutes = about.reduce((acc, val) => {
    //     const [mins, secs] = val.split(':').map(Number)
    //     return acc + mins * 60 + secs
    //   }, 0)

    //   const totalHours = Math.floor(totalMinutes / 60)
    //   console.log(`The total duration is ${totalHours} hours`)
    // },

    user() {
      return this.$store.getters.loggedinUser
    },
    stationDeleteMsg() {
      return this.station.name
    },
    likedSongsUser() {
      if (this.$store.getters.userSongs) return this.$store.getters.userSongs
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
    hover() {
      return this.currDraggableIdx !== null
    },
    stations() {
      return this.$store.getters.stations
    },
    station() {
      const station = this.$store.getters.stationById(this.stationId)
      return station ? station : this.$store.getters.station
    },
    stationNameClass() {
      const words = this.station.name.split(' ').length
      if (words <= 3) {
        return 'short-station-name'
      } else if (words <= 5) {
        return 'long-station-name'
      } else {
        return 'huge-station-name'
      }
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
  mounted() {
    window.scrollTo(0, 0)
    const { stationId } = this.$route.params

    if (stationId) {
      stationService
        .getById(stationId)
        .then((station) => {
          if (!station) return
          this.station = station
          this.getDominantColor(this.station.imgUrl)
        })
        .catch((error) => {
          console.error('Error getting station:', error)
        })
    }

    this.$nextTick(() => {
      this.getDominantColor(
        this.station.imgUrl ? this.station.imgUrl : this.station.songs[0].imgUrl
      )
    })
  },

  beforeUnmount() {
    document.body.style.background = '#181818'
  },
  created() {
    const { stationId } = this.$route.params
    if (!stationId) return
    stationService
      .getById(stationId)
      .then((station) => {
        if (!station) return
        this.station = station
        this.getDominantColor(
          this.station.imgUrl
            ? this.station.imgUrl
            : this.station.songs[0].imgUrl
        )
      })
      .catch((error) => {
        console.error('Error getting station:', error)
      })
  },
}
</script>
