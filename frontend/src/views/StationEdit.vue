<template>
  <section class="modal">
    <input
      @input="stationInput"
      id="name"
      type="text"
      v-model="station.name"
      :placeholder="station.name"
    />
    <button @click="stationInput">save</button>
    <button @click="showModal = false">x</button>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  name: 'StationEdit',
  props: {
    showModal: Boolean,
  },
  methods: {
    stationInput() {
      let editedStation = this.station
      this.$store
        .dispatch({ type: 'editstation', station: editedStation })
        .then(() => {
          showSuccessMsg('station edited')
        })
        .catch((err) => {
          showErrorMsg('Cannot edit station', err)
        })
    },
  },

  computed: {
    station() {
      const { stationId } = this.$route.params
      console.log(stationId)
      const stations = this.stations
      const station = stations.find((t) => t._id === stationId)

      return station
    },

    stations() {
      return this.$store.getters.stations
    },
  },
}
</script>
