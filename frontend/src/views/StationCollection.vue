<template>
  <section class="stations-app">
    <StationsList :stations="stations" @removed="removeStation" />
  </section>
</template>

<script>
import StationsList from '../cmps/StationList.vue'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {getActionRemoveStation} from '../store/station.store'
export default {

  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.stations
    },
  },

  methods: {
    async removeStation(stationId) {
      try {
        await this.$store.dispatch(getActionRemoveStation(stationId))
        showSuccessMsg('Station removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },
  },
  components: {
    StationsList,
  },
}
</script>
