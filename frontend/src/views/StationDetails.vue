<template>
  <section v-if="station" class="station-details">
    <section class="station-details-header">
      <div ref="stationDetailsHeader" class="header-content">
        <img
          @click="toggleModal"
          v-if="
            station.songs &&
            station.songs.length > 0 &&
            station.name !== 'Liked songs'
          "
          :src="
            station.songs[0].imgUrl
              ? station.songs[0].imgUrl
              : station.songs[0].url
          "
        />

        <img
          @click="toggleModal"
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
            {{ station.description }}
          </p>
          <div v-if="station.songs">
            <div class="likes-count-logo">
              <div class="logo-container-header">
                <i class="logo-green" v-html="getSvg('greenLogo')"></i>
                <!-- <h1 v-if="user">{{ user.fullname }}</h1> -->
                <span class="small-logo-word">Muzikay</span>
              </div>
              <span class="likes-count" @click="toggleModal"
                >6,950,331 likes</span
              >
              <span class="dot">•</span>
              <span>{{ songsCount }},</span>

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
              {{ song.title }}
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
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="
                  addUserToSong(song)
                  onHeartClick(idx)
                "
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

      <Container
        @drop="onDrop"
        v-if="station.songs && station.name === 'Liked songs'"
        class="songs-list-details"
      >
        <Draggable
          @mouseover="currDraggableIdx = idx"
          @mouseleave="currDraggableIdx = null"
          class="song-item"
          v-for="(song, idx) in likedUserSongs"
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
          <!-- @toggleLike="toggleSongLike" -->
          <div class="flex-end list-end">
            <div class="like-song-icon">
              <BubblingHeart
                class="heart-song station-details-heart"
                :class="{ 'hover-effect': clickedHeartIndex !== idx }"
                :songIndex="idx"
                :liked="song.liked"
                @click="addUserToSong(song)"
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

      <MiniSearch
        :handelYoutubeSong="handelYoutubeSong"
        v-if="station.createdBy.fullname === 'system'"
      />

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
} from '../services/event-bus.service.js'
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
    }
  },
  methods: {
    handelYoutubeSong(video) {
      eventBus.emit('youtube-song-details', video)
    },
    songDetails(song) {
      if (!song.id) this.handelYoutubeSong(song)
      else eventBus.emit('song-details', song)
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
        showSuccessMsg('song liked')
      } catch (err) {
        console.log(err)
        showErrorMsg('remove from liked songs')
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
      console.log('atationDetails', songId)

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
    // async check(song, station) {
    //   try {
    //     await this.$store.dispatch({
    //       type: 'checkIfIn',
    //       song,
    //       station,
    //     })
    //     showSuccessMsg('added to playlist')
    //   } catch (err) {
    //     console.log(err)
    //     showErrorMsg('Cannot add to playlist')
    //   }
    // },

    // async check(song, station) {
    //   try {
    //     await this.$store.dispatch({
    //       type: 'checkSong',
    //       song,
    //       station,
    //     })
    //     showSuccessMsg('added to playlist')
    //   } catch (err) {
    //     console.log(err)
    //     showErrorMsg('Cannot add to playlist')
    //   }
    async addToSelectedStation(song, station) {
      // const songAlreadyExist = station.songs.find((s) => s.id === song.id)

      // if (songAlreadyExist) {
      //   this.showAreYouSureModal = true
      //   console.log('yesssssssssssss')
      // } else {
      console.log('station details song click', song)
      console.log('station details playlist clicked', station)
      try {
        await this.$store.dispatch({
          type: 'addToStation',
          song,
          station,
        })
        showSuccessMsg('added to playlist')
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
    // onSongDrop(columnId, dropResult) {
    //   // check if element where ADDED or REMOVED in current collumn
    //   if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    //     const scene = Object.assign({}, this.scene)
    //     const column = scene.children.filter((p) => p.id === columnId)[0]
    //     const itemIndex = scene.children.indexOf(column)
    //     const newColumn = Object.assign({}, column)

    //     // check if element was ADDED in current column
    //     if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
    //       // your action / api call
    //       dropResult.payload.loading = true
    //       // simulate api call
    //       setTimeout(function () {
    //         dropResult.payload.loading = false
    //       }, Math.random() * 5000 + 1000)
    //     }

    //     newColumn.children = applyDrag(newColumn.children, dropResult)
    //     scene.children.splice(itemIndex, 1, newColumn)
    //     this.scene = scene
    //   }
    // },
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
    user() {
      return this.$store.getters.loggedinUser
    },
    stationDeleteMsg() {
      return this.station.name
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
      return this.$store.getters.station
    },
    likedUserSongs() {
      return this.$store.getters.getSongsLikedByUser
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
