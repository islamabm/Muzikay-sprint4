<template>
  <section v-if="station" class="station-preview">
    <div class="station-image">
      <!-- <img
        v-if="station.songs && station.songs[0].imgUrl"
        :src="station.songs[0].imgUrl"
        alt="Playlist Image"
      /> -->
      <div class="play-button" @click.stop="playStation"></div>
      <img src="../assets/img/empty-img.png" alt="Default Image" />
    </div>
    <div class="station-info">
      <h3 class="station-title">{{ station.name }}</h3>
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
