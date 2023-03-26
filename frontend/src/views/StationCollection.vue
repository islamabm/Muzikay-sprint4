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
      return this.$store.getters.stations
    },
  },

  methods: {
    // removeToy(toyId) {
    //   this.$store.dispatch({ type: 'removeToy', id: toyId })
    // },
  },
  components: {
    StationsList,
  },
}
</script>
