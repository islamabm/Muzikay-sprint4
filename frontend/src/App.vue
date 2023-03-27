<template>
  <RouterView />
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'

export default {
  created() {
    // console.log('Vue App created')
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })
  },
  components: {
  },
}
</script>
