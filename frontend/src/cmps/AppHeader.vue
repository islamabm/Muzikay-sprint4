<template>
  <header
    class="header"
    v-bind:style="{ backgroundColor: `rgba(10,10,10, ${headerOpacity})` }"
  >
    <div class="page-navigation">
      <!-- <RouterLink to="/">&#60;</RouterLink>
      <RouterLink to="/go">&#62;</RouterLink> -->
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
  },
  mounted() {
    window.addEventListener('scroll', this.updateHeaderOpacity)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.updateHeaderOpacity)
  },
}
</script>
