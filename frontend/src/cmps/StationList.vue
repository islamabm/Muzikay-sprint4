<template>
  <section class="station-list stations-container">
    <ul class="clean-list">
      <li class="toy" v-for="station in stations" :key="station.id">
        <StationPreview
          :station="station"
          @removed="$emit('removed', station._id)"
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
}
</script>
