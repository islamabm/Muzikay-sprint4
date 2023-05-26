<template>
  <section class="stations-app">
    <GptLoader v-if="isLoading"></GptLoader>
    <transition name="modal-transition">
      <div v-if="GptIsVisible" class="gpt-modal">
        <div class="gpt-modal-content">
          <span class="close" @click="hideModal">&times;</span>
          <GptStation
            @close-modal="hideModal"
            @isLoading="isLoading = $event"
          ></GptStation>
        </div>
      </div>
    </transition>
    <h3 class="gpt-modal-link neon-effect" @click="showModal">
      Click Here to Try Our New AI-Powered Feature!
    </h3>
    <StationsList :stations="stations" />
  </section>
</template>

<script>
import StationsList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import GptStation from '../cmps/GptStation.vue'
import GptLoader from '../cmps/GptLoader.vue'

export default {
  data() {
    return {
      GptIsVisible: false,
      isLoading: false,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.filteredStations(this.category)
    },
    category() {
      return this.$route.params.category
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
    showModal() {
      this.GptIsVisible = true
    },
    hideModal() {
      this.GptIsVisible = false
    },
  },
  components: {
    StationsList,
    GptStation,
    GptLoader,
  },
  created() {
    eventBus.on('filter-stations', (categoryName) => {
      const filteredStations = this.filterStations(categoryName)
      this.$store.commit('setAllStations', { stations: filteredStations })
    })
  },
}
</script>
