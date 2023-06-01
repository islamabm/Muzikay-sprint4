<template>
  <div>
    <div class="modal-content" :style="{ left: 470 + 'px', top: 370 + 'px' }">
      <ul class="modal-options">
        <li @click="openDeleteStationModal">Delete</li>
        <li @click.stop="toggleRecommendationModal">Recommendation</li>
        <li @click.stop="copyLink">Copy link to playlist</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  methods: {
    openDeleteStationModal() {
      this.$emit('openDeleteStationModal')
    },

    toggleRecommendationModal() {
      this.$emit('toggleRecommendationModal')
    },

    copyLink() {
      this.$emit('copyLink')
    },
  },
  computed: {},
}
</script>
