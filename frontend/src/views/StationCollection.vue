<template>
  <section class="stations-app">
    <StationsList :stations="stations" />
  </section>
</template>

<script>
import StationsList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service.local.js'
// import { getActionRemoveStation } from '../store/station.store'
export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.filteredStations(this.category)
    },
    category() {
    // console.log('Current category:', this.$route.params.category);
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
  // mounted() {
  //   // console.log("Stations in parent component:", this.stations);
  // },
}
</script>
