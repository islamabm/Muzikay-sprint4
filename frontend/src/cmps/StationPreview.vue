<template>
  <section
    v-if="station.createdBy.fullname === 'system'"
    class="station-preview"
    @click="setStation(station._id)"
  >
    <div class="station-image">
      <img :src="station.songs[0].imgUrl" />
      <div class="play-button" @click.stop="playStation"></div>
    </div>
    <div class="station-info">
      <h3 class="station-title">{{ station.name }}</h3>
      <p class="station-description-preview">{{ station.description }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StationPreview',

  props: {
    station: Object,
  },
  methods: {
    setStation(stationId) {
      this.$store.commit({ type: 'setCurrStation', stationId })
      this.$router.push(`/station/${stationId}`)
      const alo = this.$store.stations.songs.filter((song) =>
        song.likedByUsers.includes(userService.getLoggedinUser().fullname)
      )
    },
  },
}
</script>
