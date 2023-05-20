<template>
  <article class="gpt-banner-container">
    <img src="./../assets/img/111.png" class="gpt-banner-img" alt="banner" />
    <form @submit.prevent="createPlaylist">
      <input
        class="gpt-input"
        v-model="mood"
        type="text"
        placeholder="Enter your mood or activity..."
      />
      <button class="btn-generate" type="submit">
        <span>Create</span>
      </button>
      <span class="gpt-loader" v-if="isLoading"></span>
    </form>
  </article>
</template>

<script>
import { stationService } from '../services/station.service.local.js'
export default {
  data() {
    return {
      mood: '',
      playlist: null,
      isLoading: false,
    }
  },
  methods: {
    async createPlaylist() {
      try {
        this.isLoading = true
        const response = await stationService.getEmotion(this.mood)
        const emotion = response.emotion

        // const StationNameResponse = await stationService.generateStationName(
        //   emotion
        // )
        // let names = StationNameResponse.name.match(/(?<=\d\. ).*?(?=\n|$)/g)
        // let randomIndex = Math.floor(Math.random() * names.length)
        // const StationName = names[randomIndex]

        const StationName = emotion
        // const StationName = emotion
        const newStation = await this.$store.dispatch({
          type: 'createStation',
          StationName,
        })

        const SongsResponse = await stationService.generateSongs(emotion)
        const songs = SongsResponse.songs
        console.log('songs', songs)

        for (let song of songs) {
          console.log('in songs loop')
          await this.$store.dispatch({
            type: 'addToStation',
            stationId: newStation._id,
            song,
          })
          if (this.isLoading) {
            this.isLoading = false
          }
        }
      } catch (err) {
        console.error(err)
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
