<template>
  <section>
    <form @submit.prevent="add">
      <input type="text" v-model="search" />
      <button type="submit">search</button>
    </form>
    <div>
      <ul class="clean-list" v-for="video in videos" :key="video.videoId">
        <li>
          <h2>{{ video.title }}</h2>
          <img :src="video.url" />
          <button @click="addToPlaylist(video)">Add</button>
        </li>

        <!-- <iframe autoplay loop width="150" height="150" controls muted="false">
          <source :src="video.url" type="video/mp4" />
        </iframe> -->
      </ul>
    </div>
  </section>
</template>
<script>
import { stationService } from '../services/station.service.local'

export default {
  data() {
    return {
      videos: [],
      search: 'love',
    }
  },
  methods: {
    async add() {
      this.videos = await stationService.getVideos(this.search)
      console.log('Assigned videos:', this.videos)
    },
    async addToPlaylist(video) {
      try {
        console.log(video)
        const { stationId } = this.$route.params
        console.log(stationId)
        console.log(this.stations)
        const station = this.stations.find((s) => s._id === stationId)
        await this.$store.dispatch({
          type: 'addSong',
          video: video,
          station: station,
        })
        console.log('Added song to playlist')
        // showSuccessMsg('song added')
      } catch (err) {
        console.log('failed to add', err)
        // showErrorMsg('Cannot add song', err)
      }
    },
    // addToPlaylist(video) {
    //   console.log(video)
    //   const { stationId } = this.$route.params
    //   console.log(stationId)
    //   console.log(this.stations)
    //   const station = this.stations.find((s) => s._id === stationId)

    //   this.$store
    //     .dispatch({ type: 'addSong', video: video, station: station })
    //     .then(() => {
    //       console.log('Added song to playlist')
    //       // showSuccessMsg('song added')
    //     })
    //     .catch((err) => {
    //       console.log('failed to add', err)
    //       // showErrorMsg('Cannot add song', err)
    //     })
    // },
  },
  computed: {
    stations() {
      return this.$store.getters.stations
    },
  },
}
</script>
