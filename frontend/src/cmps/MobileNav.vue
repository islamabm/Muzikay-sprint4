<template>
  <article class="mobile-nav">
    <RouterLink
      to="/station/collection"
      class="router-link"
      exact
      :class="{ activeHome: $route.path === '/station/collection' }"
      @click="toggleHomeIcon"
    >
      <i
        class="home-icon icons"
        v-if="$route.path === '/station/collection'"
        v-html="getSvg('homeIconActive')"
      ></i>
      <i class="home-icon icons" v-else v-html="getSvg('homeIcon')"></i>
      <span class="home-word">Home</span>
    </RouterLink>

    <RouterLink
      class="router-link"
      to="/station/search"
      exact
      :class="{ activeSearch: $route.path === '/station/search' }"
      @click="toggleSearchIcon"
    >
      <i
        class="search-icon icons"
        v-if="$route.path === '/station/search'"
        v-html="getSvg('searchIconActive')"
      ></i>
      <i class="search-icon icons" v-else v-html="getSvg('searchIcon')"></i>
      Search
    </RouterLink>

    <RouterLink
    class="router-link"
            to="/station/library"
            exact
            :class="{ activeLibrary: $route.path === '/station/library' }"
            @click="toggleLibraryIcon"
          >
            <i
              class="library-icon icons"
              v-if="$route.path === '/station/library'"
              v-html="getSvg('libraryIconActive')"
            ></i>
            <i
              class="library-icon icons"
              v-else
              v-html="getSvg('libraryIcon')"
            ></i>
            Library
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
    toggleHomeIcon() {
      this.homeIcon =
        this.homeIcon === 'homeIcon' ? 'homeIconActive' : 'homeIcon'
    },
    toggleSearchIcon() {
      this.searchIcon =
        this.searchIcon === 'searchIcon' ? 'searchIconActive' : 'searchIcon'
    },
    toggleLibraryIcon() {
      this.libraryIcon =
        this.libraryIcon === 'libraryIcon' ? 'libraryIconActive' : 'libraryIcon'
    },
  },
}
</script>
