<template>
  <section v-if="station" class="playlist-preview">
    <div class="playlist-image">
      <!-- <img
        v-if="station.songs && station.songs[0].imgUrl"
        :src="station.songs[0].imgUrl"
        alt="Playlist Image"
      /> -->
      <img src="../assets/img/empty-img.png" alt="Default Image" />
    </div>
    <div class="playlist-info">
      <h3 class="playlist-title">{{ station.name }}</h3>
      <p class="station-description-preview">{{ station.desc }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UserLibrary',
  props: {
    station: Object,
  },

  data() {
    return {}
  },
  methods: {},
  watch: {},
  computed: {},
}
</script>
