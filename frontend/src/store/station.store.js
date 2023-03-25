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
      // if (userStations) {
      //   console.log(userStations)
      return userStations
      // }
    },
    stationById: (state) => (id) => {
      // console.log('Searching for station with id:', id)
      const foundStation = state.stations.find((station) => {
        // console.log(
        //   'Comparing with station:',
        //   station,
        //   'with _id:',
        //   station._id
        // )
        return station._id === id
      })
      // console.log('Found station:', foundStation)
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
      console.log(state.stations)
      console.log(station)
      const idx = state.stations.findIndex((c) => c._id === station._id)
      state.stations.splice(idx, 1, station)
      console.log(station)
    },
    removeStation(state, { id }) {
      const idx = state.stations.findIndex((s) => s._id === id)
      state.stations.splice(idx, 1)
    },
    //   removeToy(state, { id }) {
    //     const idx = state.toys.findIndex(toy => toy._id === id)
    //     state.toys.splice(idx, 1)
    // },
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
    async removeStation(commit, { id }) {
      try {
        const res = await stationService.remove(id)
        commit({ type: 'removeStation', id })
        return res
      } catch (err) {
        console.log('stationStore: Error in removeStation', err)
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
    // async removeSong({ commit }, { songId, stationId }) {
    //   try {
    //     console.log('store', songId)
    //     console.log('store', stationId)
    //     commit({ type: 'removeSong', songId, stationId })
    //     await storageService.remove(songId, stationId)
    //   } catch (err) {
    //     // console.log(err)
    //     console.log('Could Not delete song')
    //     throw err
    //   }
    // },
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
