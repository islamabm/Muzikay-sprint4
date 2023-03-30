<template>
  <!-- v-if="station.createdBy.fullname === 'system'" -->
  <section v-if="station.name !== 'Liked songs' " class="station-preview" @click="setStation(station._id)">
    <div class="station-image">
      <img :src="station.imgUrl ? station.imgUrl : station.songs[0].imgUrl" />
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
    },
  },
}
</script>
