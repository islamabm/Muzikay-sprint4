<template>
  <section v-if="user" class="user-profile">
    <!-- <h1 class="greeting">Welcome, {{ user.fullname }}</h1> -->
    <div class="user-details-container">
      <img  class="user-profile-img" style="max-width: 200px;" :src="user.imgUrl" />
      <div class="user-info">
      <span class="profile-word">
    Profile
   </span>
    <h3 class="user-username">{{ user.username }}</h3>
    <span class="user-stations-count">24 Public Playlists</span>
    <span class="dot">•</span>
    <span class="following">7 following</span>
  </div>
  </div>
      <!-- <article class="review-list">
        <article v-for="review in user.givenReviews" :key="review._id">
          {{ review.txt }}
          <RouterLink :to="`/user/${review.aboutUser._id}`">
            About {{ review.aboutUser.fullname }}
          </RouterLink>
        </article>
      </article> -->
  </section>
</template>

<script>

export default {

  watch: {
    userId: {
      handler() {
        if(this.userId){
            this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId })
        }
      },
      immediate: true,
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