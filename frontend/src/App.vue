<template>
  <RouterView />
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'

export default {
  created() {
    console.log(userService.getLoggedinUser().fullname)
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })
  },
  components: {},
}
</script>
