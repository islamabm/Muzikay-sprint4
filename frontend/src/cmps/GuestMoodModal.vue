<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Welcome to Guest Mode</p>
        <button class="delete" aria-label="close" @click="closeModal">x</button>
      </header>
      <section class="modal-card-body">
        <p>
          Enjoy browsing our application. You can create playlists, but remember
          to sign up or log in if you want to save them.
        </p>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="startGuestMode">
          Start Guest Mode
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GuestMoodModal',

  data() {
    return {}
  },
  methods: {
    startGuestMode() {
      this.$emit('startGuestMode')
    },
    closeModal() {
      this.$emit('closeModal')
    },
  },
}
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 555;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-card {
  max-width: 500px;
  margin: auto;
  overflow: auto;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.modal-card-head,
.modal-card-foot {
  padding: 10px;
  background-color: #f5f5f5;
}

.modal-card-title {
  color: #363636;
}

.modal-card-body {
  color: black;
  padding: 20px;
}
</style>
