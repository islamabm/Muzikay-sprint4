<template>
  <div>
    <div v-for="video in videos" :key="video.videoId">
      <h2>{{ video.title }}</h2>
      <img :src="video.url" />
    </div>
  </div>
</template>
<script>
import { stationService } from '../services/station.service.local'

export default {
  data() {
    return {
      videos: [],
    }
  },
  methods: {},
  async created() {
    this.videos = await stationService.getVideos()
    console.log('Assigned videos:', this.videos) 
  },
}
</script>
