<template>
  <section class="user-preview-section">
    <h1 class="user-library-header">Playlists</h1>
    <Container @drop="onDrop" class="user-library-grid">
      <Draggable
        class="station"
        v-for="station in userStationsData"
        :key="station._id"
      >
        <UserLibraryPreview :station="station" />
      </Draggable>
    </Container>
  </section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import UserLibraryPreview from '../cmps/UserLibraryPreview.vue'

export default {
  name: 'UserLibrary',
  computed: {
    userStations() {
      return this.$store.getters.getUserStations
    },
  },
  data() {
    return {
      userStationsData: [],
    }
  },
  created() {
    this.userStationsData = this.userStations
  },
  methods: {
    onDrop(dropResult) {
      this.userStationsData = this.applyDrag(this.userStationsData, dropResult)
      this.$store.commit('setUserStations', this.userStationsData)
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult

      if (removedIndex === null && addedIndex === null) return arr
      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }
      return result
    },
  },
  components: {
    UserLibraryPreview,
    Container,
    Draggable,
  },
}
</script>
