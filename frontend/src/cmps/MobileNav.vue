<template>
  <article class="mobile-nav">
    <RouterLink class="router-link" to="/station/collection">
      <i class="home-icon icons" :class="{ activeLink: $route.path === '/station/collection' }" v-html="getSvg('homeIcon')"></i>
    </RouterLink>

    <RouterLink class="router-link" to="/station/search">
      <i class="search-icon icons" :class="{ activeLink: $route.path === '/station/search' }" v-html="getSvg('searchIcon')"></i>
    </RouterLink>

    <RouterLink class="router-link" to="/station/library">
      <i class="library-icon icons" :class="{ activeLink: $route.path === '/station/library' }" v-html="getSvg('libraryIcon')"></i>
    </RouterLink>
  </article>
</template>


<script>
import svgService from '../services/SVG.service.js'

export default {
  methods: {
    getSvg(iconName) {
      return svgService.getSpotifySvg(iconName)
    },
  },
}
</script>
