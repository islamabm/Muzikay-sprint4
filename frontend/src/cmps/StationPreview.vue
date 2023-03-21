<template>
  {{ station.name }}
  <img :src="station.songs[0].imgUrl" />
  <button @click="removeStation(station._id)">x</button>
  <router-link :to="{ path: 'station/' + station._id }">details</router-link>|
</template>

<script>
export default {
  name: 'StationPreview',
  props: {
    station: Object,
  },
  methods: {
    // goToStationDetails() {
    //   this.$router.push(`/station/${this.station._id}`)
    // },
  },
}
</script>
