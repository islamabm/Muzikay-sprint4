import { userService } from '../services/user.service.js'
import { stationService } from '../services/station.service.local.js'

export const stationStore = {
  state: {
    stations: [],
    searchStations: [],
    currStationId: null,
    userStations: [],
    likedSongsData: [],
  },
  getters: {
    // getSongsLikedByUser(state) {
    //   return state.stations.songs.filter((song) =>
    //     song.likedByUsers.includes(userService.getLoggedinUser().fullname)
    //   )
    // },
    filteredStations: (state) => (category) => {
      console.log('Category in Vuex getter:', category)
      if (!category) return state.stations
      return state.stations.filter((station) => station.tags.includes(category))
    },
    filteredStations: (state) => (category) => {
      // console.log('Category in Vuex getter:', category);
      if (!category) return state.stations
      return state.stations.filter((station) => station.tags.includes(category))
    },
    stations({ stations }) {
      return stations
    },
    searchStations({ searchStations }) {
      return searchStations
    },
    songs({ stations }) {
      return stations.songs
    },

    station({ stations, currStationId }) {
      const station = stations.find((s) => s._id === currStationId)
      return station
    },

    getUserStations(state) {
      const loggedinUser = userService.getLoggedinUser()

      if (loggedinUser) {
        const userStations = state.stations.filter(
          (s) => s.createdBy.fullname === loggedinUser.fullname
        )

        return userStations
      }
      return state.userStations
    },
    stationById: (state) => (id) => {
      const foundStation = state.stations.find((station) => {
        return station._id === id
      })

      return foundStation
    },

    // },
  },
  mutations: {
    setStations(state, { stations }) {
      state.stations = stations
    },
    updateSongOrder(state, { stationIndex, songs }) {
      state.stations[stationIndex].songs = songs
    },
    setAllStations(state, { stations }) {
      state.allStations = stations
    },
    setSearchStations(state, { stations }) {
      state.searchStations = stations
    },
    setCurrStation(state, { stationId }) {
      state.currStationId = stationId
    },
    setCurrUserStation(state, { stationId }) {
      state.currUserStationId = stationId
    },
    removeSong(state, { stationId, removedId }) {
      console.log('remove song from mutation', stationId)
      const station = state.stations.find((s) => s._id === stationId)
      // station.songs = station.songs.filter((st) => st.id !== removedId)
      const songIdx = station.songs.findIndex((s) => s.id === removedId)
      station.songs.splice(songIdx, 1)

      // state.stations = state.stations.filter((st) => st._id !== stationId)
      // const stationIdx = state.stations.findIndex((s) => s._id === stationId)
      // const station = state.stations[stationIdx]
      // const songIdx = station.songs.findIndex((so) => so.id === songId)
      // station.songs.splice(songIdx, 1)
      // state.stations[stationIdx] = station
    },
    // new
    updateSong(state, { song }) {
      const st = state.stations.find((s) => s._id === 'likeduser123')
      st.songs.push(song)
      console.log(st)
      const stationIdx = state.stations.findIndex(
        (s) => s._id === song.stationId
      )

      const station = state.stations[stationIdx]
      const songIdx = station.songs.findIndex((so) => so.id === song.id)

      station.songs.splice(songIdx, 1, song)
      state.stations[stationIdx] = station
    },

    setUserStations(state, stations) {
      state.userStations = stations
    },
    editStation(state, { station }) {
      const idx = state.stations.findIndex((c) => c._id === station._id)
      state.stations.splice(idx, 1, station)
    },

    editUserStation(state, { station }) {
      console.log('station in the store mutation', station)
      const idx = state.userStations.findIndex((c) => c._id === station._id)
      state.userStations.splice(idx, 1, station)
    },
    removeStation(state, { id }) {
      console.log('mutation', id)
      state.stations = state.stations.filter((st) => st._id !== id)
    },
    createStation(state, { station }) {
      state.userStations.push(station)
      state.stations.push(station)
    },
    addSong(state, { stationId, newSong }) {
      const station = state.stations.find(
        (station) => station._id === stationId
      )
      if (!station.songs) station.songs = []
      station.songs.push(newSong)
    },
  },
  actions: {
    async addUserToSong({ commit, rootGetters }, { song, userStation }) {
      const loggedinUser = rootGetters.loggedinUser
      console.log(loggedinUser)
      try {
        const { updatedSong, savedStation } =
          await stationService.addUserToSong(song, userStation, loggedinUser)

        updatedSong.stationId = userStation._id

        commit({ type: 'updateSong', song: updatedSong })

        return savedStation
      } catch (err) {
        console.error('Cannot add song', err)
        throw err
      }
    },

    async loadStations(context) {
      try {
        const stations = await stationService.query()
        context.commit({ type: 'setStations', stations })
      } catch (err) {
        console.log('stationStore: Error in loadStations', err)
        throw err
      }
    },

    async loadSearchStations(context) {
      try {
        const stations = await stationService.querySearch()
        context.commit({ type: 'setSearchStations', stations })
      } catch (err) {
        console.log('stationStore: Error in loadStations', err)
        throw err
      }
    },

    async removeStation({ commit }, { stationId }) {
      console.log('stationId', stationId)
      try {
        console.log('stationId', stationId)
        const id = await stationService.remove(stationId)
        commit({ type: 'removeStation', id })
      } catch (err) {
        console.log('stationStore: Error in ', err)
        throw err
      }
    },

    async editstation({ commit }, { station }) {
      try {
        const savedStation = await stationService.save(station)
        commit({ type: 'editStation', station: savedStation })
      } catch (err) {
        console.error('Cannot edit station', err)
        throw err
      }
    },
    async setcurrStation({ commit }, { stationId }) {
      try {
        await stationService.getById(stationId)
        commit({ type: 'setCurrStation', stationId })
      } catch (err) {
        console.log('Could Not create station')
        throw err
      }
    },
    async createStation({ commit }, { StationName }) {
      console.log('from the store', StationName)
      try {
        const station = await stationService.createNewStation(StationName)
        commit({ type: 'createStation', station })
        return station
      } catch (err) {
        console.log('Could Not create station')
        throw err
      }
    },
    async removeSong({ commit }, { stationId, songId }) {
      console.log('songid', songId)
      console.log('stationid', stationId)
      try {
        const removedId = await stationService.removeSong(stationId, songId)
        commit({ type: 'removeSong', stationId, removedId })
      } catch (err) {
        console.log('Could Not delete song')
        throw err
      }
    },
    async addSong({ commit }, { video, station }) {
      try {
        const updatedStation = await stationService.addSongToStation(
          video,
          station
        )

        commit({ type: 'editStation', station: updatedStation })
        return updatedStation
      } catch (err) {
        console.error('Cannot add song', err)
        throw err
      }
    },

    async addToStation({ commit }, { song, stationId }) {
      try {
        const newSong = await stationService.addSongToStation(stationId, song)
        commit({ type: 'addSong', stationId, newSong })
      } catch (err) {
        console.error('Cannot add song', err)
        throw err
      }
    },
    async updateStationSong(context, { stationId, newSong }) {
      try {
        const idx = context.state.stations.findIndex(
          (station) => station._id === stationId
        )
        if (idx === -1) return // station not found
        const station = context.state.stations[idx]
        const updatedStation = {
          ...station,
          songs: [newSong, ...station.songs.slice(1)],
        }
        const savedStation = await stationService.save(updatedStation)
        context.commit({
          type: 'setStations',
          stations: [
            ...context.state.stations.slice(0, idx),
            savedStation,
            ...context.state.stations.slice(idx + 1),
          ],
        })
      } catch (err) {
        console.error('Cannot update station song', err)
        throw err
      }
    },
  },
}
