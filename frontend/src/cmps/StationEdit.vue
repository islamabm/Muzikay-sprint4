<template>
  <div class="backdrop">
    <section class="edit-details-section">
      <form class="edit-details-form" @submit.prevent="stationInput">
        <div class="edit-details-header">
          <h3>Edit details</h3>
          <button class="btn-close-modal" @click="$emit('close')">x</button>
        </div>
        <div class="edit-details-img">
          <label class="cover-img" @drop.prevent="handleFile" @dragover.prevent>
            <div v-if="loading" class="loader"></div>
            <img :src="imgSrc" alt="Station cover" class="img-edit" />
            <input type="file" @change="handleFile" hidden />
          </label>
          <div class="edit-details-inputs">
            <input
              class="edit-name"
              id="name"
              type="text"
              v-model="station.name"
            />
            <!-- <Record :name="station.name" @transcript="station.name = $event" /> -->
            <textarea
              class="edit-text-area"
              id="description"
              rows="4"
              v-model="station.description"
              placeholder="Add an optional description"
            ></textarea>
            <button class="btn-save-changes">Save</button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>
<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { uploadImg } from '../services/upload.service.js'
import Record from './Record.vue'
export default {
  name: 'StationEdit',
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      // station: null,
      loading: false,
    }
  },
  methods: {
    async stationInput() {
      let editedStation = { ...this.station }
      console.log('editedStation', editedStation)
      try {
        await this.$store.dispatch({
          type: 'editstation',
          station: editedStation,
        })
        showSuccessMsg('Station edited')
        // this.$emit('close') // add this line to close the modal
      } catch (err) {
        showErrorMsg('Cannot edit station', err)
      }
    },

    async handleFile(ev) {
      this.loading = true // set the loading flag to true

      const file =
        ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]

      try {
        const { url } = await uploadImg(file)
        const newSong = { ...this.station.songs[0], imgUrl: url }
        await this.$store.dispatch({
          type: 'updateStationSong',
          stationId: this.station._id,
          newSong,
        })
        showSuccessMsg('Song updated')
      } catch (err) {
        showErrorMsg('Cannot update song', err)
      } finally {
        this.loading = false // clear the loading flag once the upload is complete
      }
    },
  },

  computed: {
    station() {
      const station = this.$store.getters.stationById(this.stationId)
      return station ? station : this.$store.getters.station
    },
    imgSrc() {
      if (this.station && this.station.songs) {
        return this.station.songs[0].imgUrl || 'src/assets/img/empty-img.png'
      }
      return 'src/assets/img/empty-img.png'
    },

    stations() {
      return this.$store.getters.stations
    },
  },
  components: {
    Record,
  },
}
</script>
