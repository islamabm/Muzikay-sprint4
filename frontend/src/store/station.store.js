// import { stationService } from '../services/station.service.local'
import { stationService } from '../services/station.service.local.js'
import { storageService } from '../services/async-storage.service.js'
// export function getActionRemoveStation(stationId) {
//   return {
//     type: 'removeStation',
//     stationId,
//   }
// }

export const stationStore = {
  state: {
    stations: [],
    currStationId: null,
    userStations: [],
  },
  getters: {
    stations({ stations }) {
      return stations
    },
    songs({ stations }) {
      return stations.songs
    },

    station({ stations, currStationId }) {
      const station = stations.find((s) => s._id === currStationId)
      console.log('store getters', station)
      return station
    },
    getUserStations({ stations }) {
      const userStations = stations.filter(
        (s) => s.createdBy.fullname === 'guest'
      )

      return userStations
      // }
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
    setCurrStation(state, { stationId }) {
      state.currStationId = stationId
    },
    setCurrStation(state, { stationId }) {
      state.currStationId = stationId
    },
    setCurrUserStation(state, { stationId }) {
      state.currUserStationId = stationId
    },
    removeSong(state, { songId, stationId }) {
      console.log('mutation', songId)
      console.log('mutation', stationId)
      const stationIdx = state.stations.findIndex((s) => s._id === stationId)
      // console.log(station)
      const station = state.stations[stationIdx]
      const songIdx = station.songs.findIndex((so) => so.id === songId)
      console.log(songIdx)
      station.songs.splice(songIdx, 1)
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
      const idx = state.userStations.findIndex((c) => c._id === station._id)
      state.userStations.splice(idx, 1, station)
    },

    removeStation(state, { stationId }) {
      state.stations = state.stations.filter((st) => st._id !== stationId)
    },
    createStation(state, { station }) {
      state.userStations.push(station)
      state.stations.push(station)
      this.$router.push(`/station/${station._id}`)
      console.log(StationName)
    },
  },
  actions: {
    async loadStations(context) {
      try {
        const stations = await stationService.query()
        context.commit({ type: 'setStations', stations })
      } catch (err) {
        console.log('stationStore: Error in loadStations', err)
        throw err
      }
    },
    async removeStation({ commit }, { stationId }) {
      console.log('stationId', stationId)
      try {
        console.log('stationId', stationId)
        await stationService.remove(stationId)
        commit({ type: 'removeStation', stationId })
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
    async createStation({ commit }, { StationName }) {
      try {
        const station = await stationService.createNewStation(StationName)
        commit({ type: 'createStation', station })
      } catch (err) {
        // console.log(err)
        console.log('Could Not delete song')
        throw err
      }
    },
    async removeSong({ commit }, { songId, stationId }) {
      try {
        console.log('store', songId)
        console.log('store', stationId)
        await stationService.removeSong(songId, stationId)
        commit({ type: 'removeSong', songId, stationId })
      } catch (err) {
        // console.log(err)
        console.log('Could Not delete song')
        throw err
      }
    },
    async addSong({ commit }, { video, station }) {
      console.log('video from store', video)
      console.log('station from store', station)
      try {
        console.log('video inside try store', video)
        console.log('station inside try store', station)
        const updatedStation = await stationService.addSongToStation(
          video,
          station
        )
        console.log('This is the updated station: ', updatedStation)
        commit({ type: 'editStation', station: updatedStation })
      } catch (err) {
        console.error('Cannot add song', err)
        throw err
      }
    },
    async addToStation({ commit }, { song, station }) {
      console.log('actions', song)
      console.log('actions', station)
      try {
        const updatedStation = await stationService.addSongToStation(
          song,
          station
        )
        commit({ type: 'editStation', station: updatedStation })
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
