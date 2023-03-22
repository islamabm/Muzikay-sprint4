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
  },
  mutations: {
    setStations(state, { stations }) {
      state.stations = stations
    },

    editStation(state, { station }) {
      console.log(station)
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
    // async removeStation(context, { stationId }) {
    //   try {
    //     await stationService.remove(stationId)
    //     context.commit(getActionRemoveStation(stationId))
    //   } catch (err) {
    //     console.log('stationStore: Error in removeStation', err)
    //     throw err
    //   }
    // },
    async editstation({ commit }, { station }) {
      try {
        const savedStation = await stationService.save(station)
        commit({ type: 'editStation', station: savedStation })
      } catch (err) {
        console.error('Cannot edit toy', err)
        throw err
      }
    },
    async updateStationSong(context, { stationId, newSong }) {
      try {
        const stationIdx = context.state.stations.findIndex(
          (station) => station._id === stationId
        )
        if (stationIdx === -1) return // station not found
        const station = context.state.stations[stationIdx]
        const updatedStation = {
          ...station,
          songs: [newSong, ...station.songs.slice(1)],
        }
        const savedStation = await stationService.save(updatedStation)
        context.commit({
          type: 'setStations',
          stations: [
            ...context.state.stations.slice(0, stationIdx),
            savedStation,
            ...context.state.stations.slice(stationIdx + 1),
          ],
        })
      } catch (err) {
        console.error('Cannot update station song', err)
        throw err
      }
    },
  },
}
