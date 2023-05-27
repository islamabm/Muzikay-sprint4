<template>
  <div class="mini-search-container">
    <p class="deafult-sentance-search">
      Let's find something for your playlist
    </p>

    <div class="header-search-container">
      <form class="header-form" @submit.prevent="add">
        <div class="svg-header-container">
          <span class="svg-header-span">
            <i class="header-search-icon" v-html="getSvg('searchIcon')"></i>
          </span>
        </div>
        <input
          class="header-input"
          v-model="search"
          type="search"
          placeholder="Search for songs or episodes"
          autofocus
        />
      </form>
    </div>
  </div>
  <Container @drop="onDrop" v-if="search" class="search-results">
    <Draggable
      class="add-songs-container song-item"
      v-for="(song, idx) in songs"
      :key="idx"
    >
      <div class="mini-search-preview" @click="songDetails(song)">
        <img class="song-img" :src="song.url" />

        <p class="search-song-title">{{ song.title }}</p>
        <p class="posted-at">{{ getTimeAgo(song.createdAt) }}</p>
      </div>
      <button class="add-btn-song" @click="addVideo(station._id, song)">
        Add
      </button>
    </Draggable>
  </Container>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import SVGService from '../services/SVG.service'
import { stationService } from '../services/station.service.local'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  name: 'MiniSearch',
  props: [],
  emits: ['handelYoutubeSong'],
  created() {},
  data() {
    return {
      songs: [],
      search: 'love',
    }
  },
  methods: {
    songDetails(song) {
      this.$emit('handelYoutubeSong', song)
    },

    onDrop(dropResult) {
      this.songs = this.applyDrag(this.songs, dropResult)
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
    getSvg(iconName) {
      return SVGService.getSpotifySvg(iconName)
    },
    async add() {
      this.songs = await stationService.getVideos(this.search)
    },
    async addVideo(stationId, song) {
      try {
        await this.$store.dispatch({
          type: 'addToStation',
          stationId,
          song,
        })
        showSuccessMsg('Song added')
      } catch (err) {
        showErrorMsg('Cannot add song', err)
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
        return Math.floor(timeDiff / second) + ' seconds ago'
      } else if (timeDiff < hour) {
        return Math.floor(timeDiff / minute) + ' minutes ago'
      } else if (timeDiff < day) {
        return Math.floor(timeDiff / hour) + ' hours ago'
      } else if (timeDiff < month) {
        return Math.floor(timeDiff / day) + ' days ago'
      } else if (timeDiff < year) {
        return Math.floor(timeDiff / month) + ' months ago'
      } else {
        return Math.floor(timeDiff / year) + ' years ago'
      }
    },
  },
  computed: {
    stations() {
      return this.$store.getters.stations
    },
    station() {
      return this.$store.getters.station
    },
  },

  components: {
    SVGService,
    Container,
    Draggable,
  },
}
</script>
