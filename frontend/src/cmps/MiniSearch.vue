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
        <!-- <button type="submit">search</button> -->
      </form>
    </div>
  </div>
  <Container @drop="onDrop" v-if="search" class="songs-list-details">
    <Draggable
      class="add-songs-container song-item"
      v-for="(video, idx) in videos"
      :key="idx"
    >
    <div class="mini-search-preview">
      <span>{{ idx + 1 }}</span>
      <img class="song-img" :src="video.url" />
      <p class="song-title">{{ video.title }}</p>
    </div>
      <button class="add-btn-song" @click="addToPlaylist(video)">Add</button>
    </Draggable>
  </Container>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import SVGService from '../services/SVG.service'
import { stationService } from '../services/station.service.local'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  name: '',
  props: [],
  created() {},
  data() {
    return {
      videos: [],
      search: 'love',
    }
  },
  methods: {
    onDrop(dropResult) {
      this.videos = this.applyDrag(this.videos, dropResult)
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
      // this function makes a mess Tal help!
      this.videos = await stationService.getVideos(this.search)
      console.log(this.videos[0])
    },
    async addToPlaylist(video) {
      console.log('video', video)
      const { stationId } = this.$route.params
      try {
        const station = this.stations.find((s) => s._id === stationId)
        console.log(station)
        await this.$store.dispatch({ type: 'addSong', video, station })

        //   type: 'addSong',
        //   video: video,
        //   station: station,
        // })
        showSuccessMsg('song added')
      } catch (err) {
        showErrorMsg('Cannot add song', err)
      }
    },
  },
  computed: {
    stations() {
      return this.$store.getters.stations
    },
  },
  components: {
    SVGService,
    Container,
    Draggable,
  },
}
</script>
