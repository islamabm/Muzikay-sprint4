// import { stationService } from '../services/station.service.local'
import { stationService } from '../services/station.service.local.js'

export function getActionRemoveStation(stationId) {
  return {
    type: 'removeStation',
    stationId,
  }
}

export const stationStore = {
  state: {
    stations: [],
  },
  getters: {
    stations({ stations }) {
      return stations
    },
    songs({ stations }) {
      return stations.songs
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
    // stationById({ stations }, stationId) {
    // console.log('before find', stations)
    // const station = stations.find((s) => {
    // s._id === stationId
    // console.log('id', s._id)
    // })
    // console.log('after find', station)
    // return station
    stationById: (state) => (id) => {
      return state.stations.find((station) => station._id === id)
    },
    // },
  },
  mutations: {
    setStations(state, { stations }) {
      state.stations = stations
    },
    removeSong(state, { songId, stationId }) {
      console.log('mutataion', songId)
      console.log('MUTATION', stationId)
      const station = state.stations.find((s) => s._id === stationId)
      const idx = station.songs.findIndex((so) => so.id === songId)
      station.songs.splice(idx, 1)
    },

    editStation(state, { station }) {
      const idx = state.stations.findIndex((c) => c._id === station._id)
      state.stations.splice(idx, 1, station)
      console.log(state.stations)
    },
    removeStation(state, { stationId }) {
      state.stations = state.stations.filter(
        (station) => station._id !== stationId
      )
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
    async removeStation(context, { stationId }) {
      try {
        await stationService.remove(stationId)
        context.commit(getActionRemoveStation(stationId))
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
