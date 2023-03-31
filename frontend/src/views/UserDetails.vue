<template>
  <section v-if="user" class="user-profile">
    <div class="user-details-container">
      <label class="cover-img" @drop.prevent="handleFile" @dragover.prevent>
        <div v-if="loading" class="loader"></div>
        <img
          class="user-profile-img"
          style="max-width: 200px"
          :src="user.imgUrl"
        />
        <input type="file" @change="handleFile" hidden />
      </label>
      <div class="user-info">
        <span class="profile-word"> Profile </span>
        <h3 class="user-username">{{ user.username }}</h3>
        <span class="user-stations-count">24 Public Playlists</span>
        <span class="dot">•</span>
        <span class="following">7 following</span>
      </div>
    </div>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { uploadImg } from '../services/upload.service.js'
export default {
  data() {
    return { loading: false }
  },
  watch: {
    userId: {
      handler() {
        if (this.userId) {
          this.$store.dispatch({
            type: 'loadAndWatchUser',
            userId: this.userId,
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    async handleFile(ev) {
      this.loading = true // set the loading flag to true

      const file =
        ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]

      try {
        const { url } = await uploadImg(file)
        const newUser = { ...this.user, imgUrl: url }
        await this.$store.dispatch({
          type: 'updateUser',
          user: newUser,
        })
        showSuccessMsg('Profile image updated')
      } catch (err) {
        showErrorMsg('Cannot update profile image', err)
      } finally {
        this.loading = false // clear the loading flag once the upload is complete
      }
    },
  },

  computed: {
    user() {
      return this.$store.getters.watchedUser
    },
    userId() {
      return this.$route.params.id
    },
    isMe() {
      return this.userId === this.$store.getters.loggedinUser._id
    },
  },
}
</script>
