<template>
  <section class="station-preview" @click="setStation(station._id)">
    <div class="station-image">
      <img :src="station.songs[0].imgUrl" />
      <div class="play-button" @click.stop="playStation"></div>
    </div>
    <div class="station-info">
      <h3 class="station-title">{{ station.name }}</h3>
      <p class="station-description-preview">{{ station.description }}</p>
    </div>
    <button hidden @click="$emit('removeStation', station._id)">x</button>
  </section>
</template>

<script>
export default {
  name: 'StationPreview',
  emits: ['removeStation'],
  props: {
    station: Object,
  },
  methods: {
    // goToStationDetails() {
    //   this.$router.push(`/station/${this.station._id}`)
    // },
    setStation(stationId) {
      this.$store.commit({ type: 'setCurrStation', stationId })
      this.$router.push(`/station/${stationId}`)
    },
  },
}
</script>

<!-- <button
        v-if="station.new"
        class="remove-button"
        @click="$emit('removed')"
      >
        X
      </button> -->
<!-- <button class="remove-button" @click="removeStation('remove')">x</button> -->
