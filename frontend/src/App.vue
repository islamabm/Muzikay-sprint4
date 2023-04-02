<template>
  <RouterView />
</template>

<script>
import { socketService } from './services/socket.service.js'
import { userService } from './services/user.service'
import { store } from './store/store'

export default {
  async created() {
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })

    socketService.on('station-created', (savedStation) => {
      this.$store.commit({ type: 'addUserStation', station: savedStation })
    })
  },
  components: {},
}
</script>
