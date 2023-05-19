<template>
  <div>
    <form @submit.prevent="createPlaylist">
      <label>
        Enter your mood:
        <input v-model="mood" type="text" />
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
        // create the station
        const StationName = this.mood
        const newStation = await this.$store.dispatch({
          type: 'createStation',
          StationName,
        })
        console.log('hi')
        console.log(newStation)
        console.log('hi')
        const songs = await stationService.generateSongs(this.mood)
        console.log('hi')
        console.log('songs', songs)
        for (let song of songs) {
          console.log('hi from add')
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
