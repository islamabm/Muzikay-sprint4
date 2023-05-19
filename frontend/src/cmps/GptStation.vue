<template>
  <div>
    <form @submit.prevent="createPlaylist">
      <label>
        Enter your mood:
        <input class="gpt-input" v-model="mood" type="text" />
      </label>
      <button type="submit">Create Playlist</button>
    </form>
  </div>
</template>

<script>
import { stationService } from '../services/station.service.local.js'
export default {
  data() {
    return {
      mood: '',
      playlist: null,
    }
  },
  methods: {
    async createPlaylist() {
      console.log('hi')
      try {
        // Detect emotion from the input text
        const response = await stationService.getEmotion(this.mood)
        const emotion = response.emotion
        console.log('emption', emotion)

        // create the station
        const StationName = emotion
        const newStation = await this.$store.dispatch({
          type: 'createStation',
          StationName,
        })
        console.log('after creating station')

        // Generate songs based on the detected emotion
        const SongsResponse = await stationService.generateSongs(emotion)
        const songs = SongsResponse.songs
        console.log('after get songs from generateSongs ', songs)
        for (let song of songs) {
          await this.$store.dispatch({
            type: 'addToStation',
            stationId: newStation._id,
            song,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>
