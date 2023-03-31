<template>
  <section class="main-layout">
    <AppHeader />
    <AppNav />
    <UserMsg />
    <div class="footer-container">
      <AppFooter />
      <MobileNav />
    </div>
    <RouterView class="router-view" />
  </section>
</template>

<script>
import AppHeader from '../cmps/AppHeader.vue'
import UserMsg from '../cmps/UserMsg.vue'
import AppNav from '../cmps/AppNav.vue'
import AppFooter from '../cmps/AppFooter.vue'
import MobileNav from '../cmps/MobileNav.vue'

export default {
  name: 'StationIndex',
  props: [],
  created() {
    this.$store.dispatch({ type: 'loadStations' })
    this.$store.dispatch({ type: 'loadSearchStations' })
  },
  data() {
    return {}
  },
  methods: {},
  computed: {},

  components: {
    AppNav,
    UserMsg,
    AppHeader,
    AppFooter,
    MobileNav,
  },
}
</script>
