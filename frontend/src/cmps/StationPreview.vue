<template>
  <section @click="goToStationDetails">
    {{ station.name }}
    <img :src="station.songs[0].imgUrl" />
    <button @click="removeStation(station._id)">x</button>
  </section>
</template>

<script>
export default {
  name: 'StationPreview',
  props: {
    station: Object,
  },
  methods: {
    goToStationDetails() {
      this.$router.push(`/station/${this.station._id}`)
    },
  },
}
</script>
