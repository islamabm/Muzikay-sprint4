<template>
  <section class="playlist-preview" @click="goToStationDetails">
    <div class="playlist-image">
      <img :src="station.songs[0].imgUrl" />
    </div>
    <div class="playlist-info">
      <h3 class="playlist-title">{{ station.name }}</h3>
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
    goToStationDetails() {
      this.$router.push(`/station/${this.station._id}`)
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