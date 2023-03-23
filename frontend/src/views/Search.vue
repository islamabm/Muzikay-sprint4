<template>
  <section>
    <form @submit.prevent="add">
      <input type="text" v-model="search" />
      <button type="submit">search</button>
    </form>
    <article class="station" v-for="video in videos" :key="video.videoId">
      <section class="playlist-preview" @click="goToStationDetails">
        <div class="playlist-image">
          <img src="../assets/img/empty-img.png" />
        </div>
        <div class="playlist-info">
          <h2>{{ video.title }}</h2>
          <button @click="addToPlaylist(video)">Add</button>
        </div>
      </section>
      <!-- <h2>{{ video.title }}</h2>
      <img :src="video.url" />
      <button @click="addToPlaylist(video)">Add</button> -->
      <!-- <StationPreview
          :station="station"
          @removed="$emit('removed', station._id)"
        /> -->
    </article>
    <!-- <div>
      <ul class="clean-list" v-for="video in videos" :key="video.videoId">
        <li>
          <h2>{{ video.title }}</h2>
          <img :src="video.url" />
          <button @click="addToPlaylist(video)">Add</button>
        </li>
      </ul>
    </div> -->
  </section>
</template>
<script>
import { stationService } from '../services/station.service.local'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  data() {
    return {
      videos: [],
      search: 'love',
    }
  },
  methods: {
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
}
</script>
