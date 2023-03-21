<template>
  <section class="station-list stations-container">
    <h1>happy</h1>
    <ul class="clean-list">
      <li class="toy" v-for="station in huppyStations" :key="station._id">
        <StationPreview
          :station="station"
          @removed="$emit('removed', station._id)"
        />
      </li>
    </ul>
  </section>
  <hr />
  <section class="station-list stations-container">
    <h1>funk</h1>
    <ul class="clean-list">
      <li class="toy" v-for="station in funkStations" :key="station.id">
        <StationPreview
          :station="station"
          @removed="$emit('removed', station.id)"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import StationPreview from './StationPreview.vue'
export default {
  name: 'StationsList',
  props: {
    stations: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  components: {
    StationPreview,
  },
  computed: {
    huppyStations() {
      return this.stations.filter((station) => station.tags.includes('Happy'))
    },
    funkStations() {
      return this.stations.filter((station) => station.tags.includes('Funk'))
    },
  },
}
</script>
