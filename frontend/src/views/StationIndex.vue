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
import AppFooter from '../../src/cmps/AppFooter.vue'
import MobileNav from '../cmps/MobileNav.vue'

export default {
  name: 'StationIndex',
  props: [],
  created() {
    console.log('hy')
    this.$store.dispatch({ type: 'loadStations' })
    console.log('hy')
    this.$store.dispatch({ type: 'loadSearchStations' })
    console.log('hy')
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
