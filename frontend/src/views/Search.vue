<template>
  <section>
    <form @submit.prevent="add">
      <input type="text" v-model="search" />
      <button type="submit">Add</button>
    </form>
    <div>
      <div v-for="video in videos" :key="video.videoId">
        <h2>{{ video.title }}</h2>
        <iframe autoplay loop width="150" height="150" controls muted="false">
          <source :src="video.url" type="video/mp4" />
        </iframe>
      </div>
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
  },
}
</script>
