<template>
  <RouterView />
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'

export default {
  created() {
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })
  },
  components: {},
}
</script>
