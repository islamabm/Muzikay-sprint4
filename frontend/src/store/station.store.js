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
    // addMsg(state, { toyId, newMsg }) {
    //   const toy = state.toys.find((toy) => toy._id === toyId)
    //   if (!toy.msgs) toy.msgs = []
    //   toy.msgs.push(newMsg)
    // },
    // addSong(state, { newStation }) {
    //   state.stations.push(newStation)
    //   console.log(newStation)
    // },

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
        // console.error('Cannot add song', err)
        throw err
      }
    },

    // async addMsg({ commit }, { toyId, txt }) {
    //   try {
    //     const newMsg = await toyService.addMsg(toyId, txt)
    //     commit({ type: 'addMsg', toyId, newMsg })
    //   } catch (err) {
    //     console.log(err)
    //     console.log('Could Not add msg')
    //   }
    // },

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
