<template>
  <div>
    <div v-for="video in videos" :key="video.id.videoId">
      <h2>{{ video }}</h2>
      <!-- <h2>{{ video.snippet.title }}</h2> -->
      <!-- <img :src="video.snippet.thumbnails.default.url" /> -->
    </div>
  </div>
</template>
<script>
import { stationService } from '../services/station.service.local'
// import { google } from 'googleapis'

// const youtube = google.youtube({
//   version: 'v3',
//   auth: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=love&key=AIzaSyCscIfKwq9Of8nNDj5BpdSTPiMvVebphhg',
// })
export default {
  data() {
    return {
      videos: [],
    }
  },
  methods: {},

  // computed: {
  //   async getVideos() {
  //     const response = await youtube.search.list({
  //       part: 'snippet',
  //       q: 'love',
  //       type: 'video',
  //     })

  //     return response.data.items
  //   },
  // },
  created() {
    this.videos = stationService.getVideos()
  },
}
</script>
