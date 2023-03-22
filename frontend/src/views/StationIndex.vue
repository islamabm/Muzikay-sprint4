<template>
    <section class="main-layout">
        <AppHeader />
        <AppNav />
        <UserMsg />
        <RouterView />
  </section>
</template>

<script>
import AppHeader from '../cmps/AppHeader.vue'
import UserMsg from '../cmps/UserMsg.vue'
import AppNav from '../cmps/AppNav.vue'
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
},
}
    </script>