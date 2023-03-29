<template>
  <section v-if="!search">
    <h2 class="search-header">Browse all</h2>
    <div class="categories-container">
      <article
        class="category-container"
        :style="{ backgroundColor: category.color }"
        v-for="(category, idx) in categories"
        :key="idx"
      >
        <article>
          <img :src="category.img" />
          <h2>{{ category.title }}</h2>
        </article>
      </article>
    </div>
  </section>
  <section v-else class="search-results">
    <article
      class="add-songs-container song-item"
      v-for="(video, idx) in videos"
      :key="idx"
    >
      <div class="mini-search-preview">
        <img class="song-img" :src="video.url" />

        <p class="search-song-title">{{ video.title }}</p>
      </div>
      <!-- <button class="add-btn-song" @click="addToStation(video)">Add</button> -->
    </article>
  </section>
</template>
<script>
import { eventBus } from '../services/event-bus.service'
export default {
  data() {
    return {
      videos: [],
      search: '',
      alive: false,
    }
  },
  methods: {
    async add() {
      // this function makes a mess Tal help!
      this.videos = await stationService.getVideos(this.search)
      console.log(this.videos[0])
    },
  },
  computed: {
    categories() {
      return this.$store.getters.searchStations
    },
  },
  created() {
    eventBus.on('handle-search', (search) => {
      // if(this.station){
      //   this.station = song
      // }else{
      this.search = search
      console.log(this.search)
      // }
      var delay = search.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
    // eventBus.on('get-videos', (search) => {
    //   // if(this.station){
    //   //   this.station = song
    //   // }else{
    //   this.videos = stationService.getVideos(this.search)
    //   this.search = search
    //   console.log(this.search)
    //   // }
    //   var delay = search.delay || 2000
    //   this.alive = true
    //   setTimeout(() => {
    //     this.alive = false
    //   }, delay)
    // })
  },
}
</script>
