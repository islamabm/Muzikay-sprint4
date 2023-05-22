<template>
  <RouterView />
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'
import { utilService } from './services/util.service'
export default {
  async created() {
    const user = await userService.getLoggedinUser()

    if (user) {
      this.$store.commit({ type: 'setLoggedinUser', user })
    }
  },
  components: {},
}
</script>
