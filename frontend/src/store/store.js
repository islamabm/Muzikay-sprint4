import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { stationStore } from './station.store.js'
import { MediaPlayerStore } from './mediaPlayer.store.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    userStore,
    stationStore,
    MediaPlayerStore,
  },
  state: {},
  mutations: {},
  actions: {},
})
