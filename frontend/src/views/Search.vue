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
      // this function makes a mess Tal help!
      this.videos = await stationService.getVideos(this.search)
    },
    async addToPlaylist(video) {
      console.log('video',video);
      const { stationId } = this.$route.params
      try {
        const station = this.stations.find((s) => s._id === stationId)
        console.log(station)
        await this.$store.dispatch({ type: 'addSong', video, station })

        //   type: 'addSong',
        //   video: video,
        //   station: station,
        // })
        // showSuccessMsg('song added')
      } catch (err) {
        // showErrorMsg('Cannot add song', err)
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
