<template>
  <section
    v-for="(stationTag, tag) in categorizedStations"
    :key="tag"
    class="station-list-container"
  >
    <h1 class="category-tag">{{ tag }}</h1>
    <div class="station-list">
      <article class="station" v-for="(station, idx) in stationTag" :key="idx">
        <StationPreview :station="station" />
      </article>
    </div>
  </section>
</template>

<script>
import StationPreview from './StationPreview.vue'
export default {
  name: 'StationList',
  props: {
    stations: {
      type: Array,
    },
  },
  computed: {
    categorizedStations() {
      return this.stations.reduce((acc, station) => {
        station.tags.forEach((tag) => {
          if (!acc[tag]) {
            acc[tag] = []
          }
          acc[tag].push(station)
        })
        return acc
      }, {})
    },
  },
  components: {
    StationPreview,
  },
}
</script>
