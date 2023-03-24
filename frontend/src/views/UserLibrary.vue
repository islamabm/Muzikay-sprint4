<template>
  <div v-if="userStations" class="station-list">
    <h1>PlayLists</h1>
    <article class="station" v-for="station in userStations" :key="station._id">
      <UserLibraryPreview :station="station" />
    </article>
  </div>
  <h1 v-else>alooo</h1>
</template>

<script>
import UserLibraryPreview from '../cmps/UserLibraryPreview.vue'
export default {
  name: 'UserLibrary',
  computed: {
    userStations() {
      return this.$store.getters.getUserStations
    },
  },
  components: {
    UserLibraryPreview,
  },
}
</script>
