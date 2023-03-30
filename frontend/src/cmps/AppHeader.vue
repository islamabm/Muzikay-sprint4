<template>
  <header
    class="header"
    v-bind:style="{ backgroundColor: `rgba(10,10,10, ${headerOpacity})` }"
  >
    <div class="page-navigation">
      <a
        class="left-arrow-icon"
        title="Go back"
        href="#"
        @click="goBack"
        :class="backLinkClass"
      ></a>
      <a
        class="right-arrow-icon"
        title="Go forward"
        href="#"
        @click="goForward"
        :class="forwardLinkClass"
      ></a>
      <div v-if="isSearchRoute" class="header-search-container">
        <form class="header-form" @submit.prevent="add">
          <input
            @input="goSearch"
            v-model="search"
            class="header-input"
            type="search"
            placeholder="What do you want to listen to?"
            autofocus
          />
        </form>
        <div class="svg-header-container">
          <span class="svg-header-span">
            <i class="header-search-icon" v-html="getSvg('searchIcon')"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="login-signup" v-if="loggedinUser">
      <button class="btn-logout" @click="logout">Log out</button>
      <span class="username-header">
        <div class="user-circle">
          <i class="user-icon" v-html="getSvg('userIcon')"></i>
        </div>
        {{ loggedinUser.fullname }}</span
      >
    </div>
    <div class="login-signup" v-else>
      <RouterLink class="btn-signup" to="/signup">Sign up</RouterLink>
      <RouterLink class="btn-login" to="/login">Log in</RouterLink>
    </div>
  </header>
</template>
<script>
import svgService from '../services/SVG.service.js'
import { eventBus } from '../services/event-bus.service'

export default {
  name: 'AppHeader',
  //Note: this header will take the color of the station's img.
  data() {
    return {
      headerOpacity: 0,
      search: '',
      alive: false,
    }
  },
  methods: {
    goSearch() {
      console.log(this.search)
      eventBus.emit('handle-search', this.search)
    },
    add() {
      eventBus.emit('get-videos')
    },
    updateHeaderOpacity() {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop
      const headerHeight = 64
      const opacityFactor = 3

      this.headerOpacity = Math.min(
        scrollPosition / (headerHeight * opacityFactor),
        1
      )
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    goForward() {
      this.$router.go(-1)
    },
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
    logout() {
      this.$store.dispatch({ type: 'logout' })
      this.$router.push('/')
    },
  },
  mounted() {
    window.addEventListener('scroll', this.updateHeaderOpacity)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateHeaderOpacity)
  },
  computed: {
    isSearchRoute() {
      return this.$route.path === '/station/search'
    },
    backLinkClass() {
      return window.history.length > 1 ? 'pointer-cursor' : 'default-cursor'
    },
    forwardLinkClass() {
      return this.$router.currentRoute.name === 'last-page'
        ? 'default-cursor'
        : 'pointer-cursor'
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  created() {
    eventBus.on('fetch-videos', (title) => {
      this.search = title
      console.log(this.search)
      console.log(title)
      var delay = title.delay || 2000
      this.alive = true
      setTimeout(() => {
        this.alive = false
      }, delay)
    })
  },
}
</script>
