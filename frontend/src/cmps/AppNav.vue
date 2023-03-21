<template>
  <nav>
    <div class="sticky-nav">
      <div class="logo-container">
        <i class="logo" v-html="getSvg('whiteLogo')"></i>
        <span>Muzikay<span class="trademark">®</span></span>
      </div>
      <div class="main-nav">
        <RouterLink to="/station">Home</RouterLink>
        <RouterLink to="/search">Search</RouterLink>
        <RouterLink to="/library">Your Library</RouterLink>
      </div>

      <div class="liked-create-nav">
        <RouterLink to="/create">Create playlist</RouterLink>
        <RouterLink to="/like">Liked songs</RouterLink>
      </div>
    </div>
  </nav>
</template>
<script>
import svgService from '../services/SVG.service.js'
export default {
methods: {
  getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
}
}
</script>
