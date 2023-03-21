<template>
  <section v-if="station" class="station-details">
    <section class="stetion">
      <h1>Playlist</h1>
      <p>Playlist Relax and indulge with beautiful piano pieces</p>
      <h1>{{ station.name }}</h1>
      <img :src="station.songs[0].imgUrl" />
      <img
        class="spotify-img"
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Black.png"
      />
      <span>6,950,331 likes</span>, <span>{{ songsCount }}</span
      >,
      <span>about 11 hr </span>
    </section>
    <hr />
    <ul class="clean-list">
      <li class="station" v-for="(song, idx) in station.songs" :key="idx">
        <span>{{ idx + 1 }}</span>
        <img :src="song.imgUrl" />
        <!-- <div class="song-info"> -->
        <p>{{ song.title }}</p>

        <p>1 day ago</p>
        <p>1:40</p>
        <!-- </div> -->
      </li>
    </ul>
  </section>
</template>

<script>
import { stationService } from '../services/station.service.local.js'

export default {
  name: 'station-details',
  data() {
    return {
      station: null,
    }
  },
  watch: {
    '$route.params': {
      handler() {
        const { stationId } = this.$route.params

        stationService
          .getById(stationId)
          .then((station) => (this.station = station))
      },
      immediate: true,
    },
  },
  computed: {
    songsCount() {
      const count = this.station.songs.length
      return `${count} Songs`
    },
  },
}
</script>
