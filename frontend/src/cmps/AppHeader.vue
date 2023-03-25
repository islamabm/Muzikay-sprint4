<template>
  <header
    class="header"
    v-bind:style="{ backgroundColor: `rgba(10,10,10, ${headerOpacity})` }"
  >
    <div class="page-navigation">
      <a title="Go back" href="#" @click="goBack" :class="backLinkClass"
        >&#60;</a
      >
      <a
        title="Go forward"
        href="#"
        @click="goForward"
        :class="forwardLinkClass"
        >&#62;</a
      >
      <div v-if="isSearchRoute" class="header-search-container">
        <form class="header-form">
          <input
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

    <div class="login-signup">
      <RouterLink class="btn-signup" to="/signup">Sign up</RouterLink>
      <RouterLink class="btn-login" to="/login">Log in</RouterLink>
    </div>
  </header>
</template>
<script>
import svgService from '../services/SVG.service.js'
export default {
  //Note: this header will take the color of the station's img.
  data() {
    return {
      headerOpacity: 0,
    }
  },
  methods: {
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
  },
}
</script>
