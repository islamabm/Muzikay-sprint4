<template>
  <div class="backdrop">
    <section class="edit-details-section">
      <div class="edit-details-header">
        <h3>Edit details</h3>
        <button class="btn-close-modal" @click="closeModal">x</button>
      </div>
      <div class="edit-details-img">
        <label class="cover-img" @drop.prevent="handleFile" @dragover.prevent>
          <div v-if="loading" class="loader"></div>
          <img class="img-edit" :src="img" alt="Station cover" />
          <input type="file" @change="handleFile" hidden />
        </label>
        <div class="edit-details-inputs">
          <input
            class="edit-name"
            @blur="stationInput"
            id="name"
            type="text"
            v-model="station.name"
            :placeholder="station.name"
          />
          <textarea
            class="edit-description"
            @blur="stationInput"
            id="description"
            rows="4"
            v-model="station.description"
            :placeholder="station.description"
          ></textarea>
          <button class="btn-save-changes" @click="stationInput">Save</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { uploadImg } from '../services/upload.service.js'
export default {
  name: 'StationEdit',
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async stationInput() {
      let editedStation = { ...this.station }
      await this.$store.dispatch({ type: 'editstation', station: editedStation })
      try {
        showSuccessMsg('station edited')
      } catch (err) {
        showErrorMsg('Cannot edit station', err)
      }
      this.$emit('close')
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
    closeModal() {
      this.$emit('update:showModal', false)
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
    img() {
      return this.station.songs[0].imgUrl
        ? this.station.songs[0].imgUrl
        : 'src/assets/icons/drag-image.ico'
    },

    stations() {
      return this.$store.getters.stations
    },
  },
}
</script>
