<template>
  <div class="backdrop">
    <Record @update-name="updateName" />
    <section class="edit-details-section">
      <form class="edit-details-form" @submit.prevent="stationInput">
        <div class="edit-details-header">
          <h3>Edit details</h3>
          <button class="btn-close-modal" @click="$emit('close')">x</button>
        </div>
        <div class="edit-details-img">
          <label class="cover-img" @drop.prevent="handleFile" @dragover.prevent>
            <div v-if="loading" class="loader"></div>
            <img
  :src="editedStation.imgUrl || 'src/assets/img/empty-img.png'"
  alt="Station cover"
  class="img-edit"
/>

            <input type="file" @change="handleFile" hidden />
          </label>
          <div class="edit-details-inputs">
            <input
              class="edit-name"
              id="name"
              type="text"
              v-model="editedStation.name"
            />
            <textarea
              class="edit-text-area"
              id="description"
              rows="4"
              v-model="editedStation.description"
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
      editedStation: null,
      imgUrl: null,
    }
  },
  methods: {
async stationInput() {
  let editedStation = { ...this.editedStation }
  editedStation.imgUrl = this.imgUrl  // Add this line
  try {
    await this.$store.dispatch({
      type: 'editstation',
      station: editedStation,
    })
    showSuccessMsg('Station edited')
    this.$emit('close')
  } catch (err) {
    showErrorMsg('Cannot edit station', err)
  }
},

    updateName(newName) {
      this.station.name = newName
    },

    async handleFile(ev) {
  this.loading = true
  const file =
    ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]

  try {
    const { url } = await uploadImg(file)
    this.imgUrl = url
    this.editedStation.imgUrl = url  // Add this line
    this.loading = false
  } catch (err) {
    showErrorMsg('Cannot update song', err)
    this.loading = false
  }
}


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
  
  created() {
  this.editedStation = JSON.parse(JSON.stringify(this.station))
  this.imgUrl =
    this.station.imgUrl ||
    (this.station.songs && this.station.songs.length > 0 ? this.station.songs[0].imgUrl : 'src/assets/img/empty-img.png')
},
  components: {
    Record,
  },
  watch: {
  station: {
    immediate: true,
    handler(newValue) {
      if(newValue) {
        this.editedStation = JSON.parse(JSON.stringify(newValue))
        this.imgUrl =
          newValue.imgUrl ||
          (newValue.songs && newValue.songs[0]?.imgUrl) ||
          'src/assets/img/empty-img.png'
      }
    }
  }
},
}
</script>
