<template>
  <RouterView />
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'

export default {
  async created() {
    const user = await userService.getLoggedinUser()
    console.log('user', user)
    if (user) {
      this.$store.commit({ type: 'setLoggedinUser', user })
      // await this.$store.dispatch({ type: 'loadLoggedinUserDetails' })
      // loadLoggedinUserDetails
    }
  },
  components: {},
}
</script>
