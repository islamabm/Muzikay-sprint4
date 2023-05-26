import { userService } from '../services/user.service'

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
      console.log('the song from user store', song)
      state.loggedinUser.LikedSongs = [...state.loggedinUser.LikedSongs, song]
      updatedUser.LikedSongs = [...updatedUser.LikedSongs, song]
    },
    removeSongFromUser(state, { song, updatedUser }) {
      state.loggedinUser.LikedSongs = state.loggedinUser.LikedSongs.filter(
        (s) => s.title !== song.title
      )
      updatedUser.LikedSongs = updatedUser.LikedSongs.filter(
        (s) => s.title !== song.title
      )
    },
    // removeSongFromUser(state, { song, updatedUser }) {
    //   state.loggedinUser.LikedSongs = state.loggedinUser.LikedSongs.filter(
    //     (s) => s.id !== song.id
    //   )
    //   updatedUser.LikedSongs = updatedUser.LikedSongs.filter(
    //     (s) => s.id !== song.id
    //   )
    // },
  },
  actions: {
    async login({ commit }, { userCred }) {
      try {
        const user = await userService.login(userCred)
        commit({ type: 'setLoggedinUser', user })
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
    async signupGuest({ commit }, { userCred }) {
      try {
        await userService.signupGuest(userCred)
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
        commit({ type: 'updateUser', song: selectedSong, updatedUser })
      } catch (err) {
        throw err
      }
    },
    async removeSongFromUser({ commit }, { selectedSong, user }) {
      try {
        const updatedUser = await userService.removeSong(selectedSong, user)
        commit({ type: 'removeSongFromUser', song: selectedSong, updatedUser })
      } catch (err) {
        throw err
      }
    },
    // async removeSongFromUser({ commit }, { song, user }) {
    //   try {
    //     const updatedUser = await userService.removeSongFromUser(song, user)
    //     commit({ type: 'removeSongFromUser', song: selectedSong, updatedUser })
    //   } catch (err) {
    //     throw err
    //   }
    // },
    async loadLoggedinUser({ commit }) {
      try {
        const user = await userService.getLoggedinUser()
        commit({ type: 'setLoggedinUser', user })
      } catch (err) {
        console.error('userStore: Error in loadLoggedinUser', err)
        throw err
      }
    },
    async loadLoggedinUserDetails({ commit }) {
      try {
        const user = await userService.getLoggedinUserDetails()
        if (user) {
          commit({ type: 'setLoggedinUser', user })
        }
      } catch (err) {
        console.error('userStore: Error in loadLoggedinUserDetails', err)
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
    setWatchedUser({ commit }, payload) {
      commit(payload)
    },
  },
}
