<template>
  <section class="station-list-container stations-container">
    <h1 class="category-tag">Happy</h1>
    <ul class="clean-list station-list">
      <li class="station" v-for="station in happyStations" :key="station._id">
        <StationPreview
          :station="station"
          @removed="$emit('removed', station._id)"
        />
      </li>
    </ul>
  </section>
  <hr />
  <section class="station-list-container stations-container">
    <h1 class="category-tag">Funk</h1>
    <ul class="clean-list station-list">
      <li class="station" v-for="station in funkStations" :key="station.id">
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
    happyStations() {
      return this.stations.filter((station) => station.tags.includes('Happy'))
    },
    funkStations() {
      return this.stations.filter((station) => station.tags.includes('Funk'))
    },
  },
}
</script>
