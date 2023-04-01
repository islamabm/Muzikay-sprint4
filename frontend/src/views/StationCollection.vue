<template>
  <section class="stations-app">
    <StationsList :stations="stations" />
  </section>
</template>

<script>
import StationsList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.filteredStations(this.category)
    },
    category() {
    return this.$route.params.category;
  },
  },

  methods: {
    async removeStation(stationId) {
      try {
        await this.$store.dispatch({ type: 'removeStation', id: stationId })
        showSuccessMsg('Station removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },
    filterStations(categoryName) {
      return this.stations.filter((station) =>
        station.tags.includes(categoryName)
      )
    },
  },
  components: {
    StationsList,
  },
  created() {
    eventBus.on('filter-stations', (categoryName) => {
      const filteredStations = this.filterStations(categoryName)
      this.$store.commit('setAllStations', { stations: filteredStations })
    })
  },
}
</script>
