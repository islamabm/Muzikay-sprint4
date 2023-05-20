<template>
  <article class="gpt-banner-container">
    <img src="./../assets/img/111.png" class="gpt-banner-img" alt="banner" >
    <form @submit.prevent="createPlaylist">
        <input class="gpt-input" v-model="mood" type="text" placeholder="Enter your mood or activity..."/>
      <button class="btn-generate" type="submit">
         <span>Create</span>
      </button>
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
    }
  },
  methods: {
    async createPlaylist() {
  try {
    console.log('Starting createPlaylist')
    
    const response = await stationService.getEmotion(this.mood)
    console.log('Response from getEmotion:', response)
    
    const emotion = response.emotion
    console.log('Detected emotion:', emotion)

    const StationName = emotion
    console.log('Creating new station with name:', StationName)
    
    const newStation = await this.$store.dispatch({
      type: 'createStation',
      StationName,
    })
    console.log('New station created:', newStation)
    
    const SongsResponse = await stationService.generateSongs(emotion)
    console.log('Response from generateSongs:', SongsResponse)
    
    const songs = SongsResponse.songs
    console.log('Generated songs:', songs)
    
    for (let song of songs) {
      console.log('Adding song to station:', song)
      
      await this.$store.dispatch({
        type: 'addToStation',
        stationId: newStation._id,
        song,
      })
      
      console.log('Song added to station')
    }
    
    console.log('createPlaylist completed successfully')
  } catch (err) {
    console.error('Error in createPlaylist:', err)
  }
},

  },
}
</script>
