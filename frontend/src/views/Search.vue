<template>
  <div>
    <div v-for="video in videos" :key="video.id.videoId">
      <h2>{{ video }}</h2>
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

  created() {
    this.videos = stationService.getVideos()
  },
}
</script>
