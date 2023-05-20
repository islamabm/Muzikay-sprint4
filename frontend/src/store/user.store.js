import { userService } from '../services/user.service'
// import { socketService, SOCKET_EMIT_USER_WATCH, SOCKET_EVENT_USER_UPDATED } from '../services/socket.service'

// var localLoggedinUser = null
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null)

export const userStore = {
  state: {
    loggedinUser: null,
    users: [],
    watchedUser: null,
  },
  getters: {
    users({ users }) {
      return users
    },
    loggedinUser({ loggedinUser }) {
      return loggedinUser
    },
    watchedUser({ watchedUser }) {
      return watchedUser
    },
    userSongs({ loggedinUser }) {
      return loggedinUser.LikedSongs
    },
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      // Yaron: needed this workaround as for score not reactive from birth
      state.loggedinUser = user ? { ...user } : null
    },
    setWatchedUser(state, { user }) {
      state.watchedUser = user
    },
    setUsers(state, { users }) {
      state.users = users
    },
    removeUser(state, { userId }) {
      state.users = state.users.filter((user) => user._id !== userId)
    },
    setUserScore(state, { score }) {
      state.loggedinUser.score = score
    },
    updateUser(state, { song, updatedUser }) {
      state.loggedinUser.LikedSongs.push(song)
      // updatedUser.LikedSongs.push(song)
    },
  },
  actions: {
    async login({ commit }, { userCred }) {
      console.log('userCred', userCred)
      try {
        const user = await userService.login(userCred)
        commit({ type: 'setLoggedinUser', user })
<<<<<<< HEAD

=======
        // this.$router.push('/station/collection')
>>>>>>> 540abc9fb4657f68991569fb5edd0524de1ae437
        return user
      } catch (err) {
        console.error('userStore: Error in login', err)
        throw err
      }
    },
    async signup({ commit }, { userCred }) {
      try {
        const user = await userService.signup(userCred)

        commit({ type: 'setLoggedinUser', user })
        return user
      } catch (err) {
        console.error('userStore: Error in signup', err)
        throw err
      }
    },
    async logout({ commit }) {
      try {
        await userService.logout()
        commit({ type: 'setLoggedinUser', user: null })
      } catch (err) {
        console.error('userStore: Error in logout', err)
        throw err
      }
    },
    async loadUsers({ commit }) {
      try {
        const users = await userService.getUsers()
        commit({ type: 'setUsers', users })
      } catch (err) {
        console.error('userStore: Error in loadUsers', err)
        throw err
      }
    },
    async loadAndWatchUser({ commit }, { userId }) {
      try {
        const user = await userService.getById(userId)
        commit({ type: 'setWatchedUser', user })
      } catch (err) {
        console.error('userStore: Error in loadAndWatchUser', err)
        throw err
      }
    },
    async removeUser({ commit }, { userId }) {
      try {
        await userService.remove(userId)
        commit({ type: 'removeUser', userId })
      } catch (err) {
        console.error('userStore: Error in removeUser', err)
        throw err
      }
    },
    async updateUser({ commit }, { selectedSong, user }) {
      try {
        const updatedUser = await userService.update(selectedSong, user)

        commit({ type: 'updateUser', song, updatedUser })
      } catch (err) {
        throw err
      }
    },
    async increaseScore({ commit }) {
      try {
        const score = await userService.changeScore(100)
        commit({ type: 'setUserScore', score })
      } catch (err) {
        console.error('userStore: Error in increaseScore', err)
        throw err
      }
    },
    // Keep this action for compatability with a common user.service ReactJS/VueJS
    setWatchedUser({ commit }, payload) {
      commit(payload)
    },
  },
}
