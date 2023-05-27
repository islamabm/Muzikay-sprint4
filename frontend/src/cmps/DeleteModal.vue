<template>
  <section v-if="showDeleteModal" class="delete-modal-backdrop">
    <div class="delete-modal">
      <h1>Delete from Library?</h1>
      <p>
        This will delete <span>{{ stationDeleteMsg }} </span> from Your Library.
      </p>
      <div class="delete-modla-btns">
        <button class="delete-modal-cancle-btn" @click="cancle">Cancel</button>
        <button class="delete-modal-delete-btn" @click="removeStation">
          Delete
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['showDeleteModal', 'station'],
  methods: {
    cancle() {
      this.$emit('closeDeleteModal', false)
    },
    async removeStation() {
      this.$emit('removeStation')
    },
  },
  computed: {
    stationDeleteMsg() {
      return this.station.name
    },
  },
}
</script>
