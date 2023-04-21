<template>
  <section
    v-if="station"
    class="station-preview"
    @click="showUserStationDetails(station._id)"
  >
    <div class="station-image">
      <img
        v-if="station.songs && station.songs.length > 0"
        :src="station.imgUrl ? station.imgUrl : station.songs[0].imgUrl"
        @click="toggleModal"
      />
      <img
        class="deafult-image"
        @click="toggleModal"
        v-else
        src="../assets/img/empty-img.png"
      />

      <div class="play-button" @click.stop="playStation"></div>
    </div>
    <div class="station-info">
      <h3 class="station-title">{{ station.name }}</h3>
      <p class="station-description-preview">{{ station.desc }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserLibrary',
  props: {
    station: Object,
  },

  data() {
    return {}
  },
  methods: {
    async showUserStationDetails(stationId) {
      await this.$store.dispatch({ type: 'setcurrStation', stationId })

      this.$router.push(`/station/${stationId}`)
      // this.$store.commit({ type: 'setCurrStation', stationId })
    },
  },
  watch: {},
  computed: {},
}
</script>
