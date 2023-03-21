<template>
  <section>
    <h1>Edit details</h1>
    <button @click="closeModal">x</button>
    <img src="" />
    <input
      type="text"
      placeholder="playList"
      @input="toyInput"
      v-model="station.title"
      :placeholder="toy.title"
    />
    <textarea id="w3review" name="w3review" rows="4" cols="50"></textarea>
    <button>save</button>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi amet
      temporibus sunt quisquam ullam, eum sint, recusandae debitis harum, minima
    </p>
  </section>
</template>
<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
export default {
  name: 'StationEdit',
  methods: {
    toyInput() {
      let editedStation = this.station
      this.$store
        .dispatch({ type: 'editStation', toy: editedStation })
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
      const toys = this.toys
      const toy = toys.find((t) => t._id === toyId)
      console.log(toy)
      return toy
    },

    toys() {
      return this.$store.getters.toysForDisplay
    },
  },
}
</script>
