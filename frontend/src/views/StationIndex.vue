<template>
    <section class="main-layout">
        <AppHeader />
        <AppNav />
        <UserMsg />
        <AppFooter />
        <RouterView />
  </section>
</template>

<script>

import AppHeader from '../cmps/AppHeader.vue'
import UserMsg from '../cmps/UserMsg.vue'
import AppNav from '../cmps/AppNav.vue'
import AppFooter from '../cmps/AppFooter.vue'

export default {
    name:'',
    props: [],
    created() {
    this.$store.dispatch({ type: 'loadStations' })
  },
  data() {
    return {}
  },
  methods: {},
  computed: {},
components:{
    AppNav,
    UserMsg,
    AppHeader,
    AppFooter,
},
}
    </script>