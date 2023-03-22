<template>
  <section>
    <form @submit.prevent="add">
      <input type="text" v-model="search" />
      <button type="submit">Add</button>
    </form>
    <div>
      <div v-for="video in videos" :key="video.videoId">
        <h2>{{ video.title }}</h2>
        <iframe
          :src="video.url"
          autoplay
          loop
          width="150"
          height="150"
          controls
          muted="false"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
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
