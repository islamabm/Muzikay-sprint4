<template>
  <section v-if="station" class="station-preview">
    <div class="station-image">
      <img
          @click="toggleModal"
          v-if="station.songs && station.songs.length > 0"
          :src="
            station.songs[0].imgUrl
              ? station.songs[0].imgUrl
              : station.songs[0].url
          "
        />
        <img
          class="deafult-image"
          @click="toggleModal"
          v-else
          src="../assets/img/empty-img.png"
        />
        
      <div class="play-button" @click.stop="playStation"></div>
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
