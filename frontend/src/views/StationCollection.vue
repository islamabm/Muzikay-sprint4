<template>
  <section class="stations-app">
    <StationsList :stations="stations" />
  </section>
</template>

<script>
import StationsList from '../cmps/StationList.vue'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service.local.js'
// import { getActionRemoveStation } from '../store/station.store'
export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      console.log(this.$store.getters.stations)
      return this.$store.getters.stations
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
    // removeToy(toyId) {
    //   this.$store.dispatch({ type: 'removeToy', id: toyId })
    // },
  },
  components: {
    StationsList,
  },
}
</script>
