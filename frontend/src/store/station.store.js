// import { stationService } from '../services/station.service.local'
import { stationService } from '../services/station.service.local.js'
import { storageService } from '../services/async-storage.service.js'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'
// import { userStore } from './user.store.js'

// export function getActionRemoveStation(stationId) {
//   return {
//     type: 'removeStation',
//     stationId,
//   }
// }

export const stationStore = {
  state: {
    stations: [],
    searchStations: [],
    currStationId: null,
    userStations: [],
  },
  getters: {
    stations({ stations }) {
      return stations
    },
    searchStations({ searchStations }) {
      return searchStations
    },
    songs({ stations }) {
      return stations.songs
    },
    // suerSongs({stations}){
    //   // const LikedSongs = stations.songs.filter(())
    // }

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
    setSearchStations(state, { stations }) {
      state.searchStations = stations
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
      const stationIdx = state.stations.findIndex((s) => s._id === stationId)
      const station = state.stations[stationIdx]
      const songIdx = station.songs.findIndex((so) => so.id === songId)
      station.songs.splice(songIdx, 1)
      state.stations[stationIdx] = station
    },
    // new
    updateSong(state, { song }) {
      console.log("State stations:", state.stations);
      console.log("Received song:", song);
      
      const stationIdx = state.stations.findIndex((s) => s._id === song.stationId);
      console.log("Station index:", stationIdx);
      
      const station = state.stations[stationIdx];
      console.log("Found station:", station);
      
      const songIdx = station.songs.findIndex((so) => so.id === song.id);
      console.log("Song index:", songIdx);
      
      station.songs.splice(songIdx, 1, song);
      state.stations[stationIdx] = station;
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
      if (station.name === 'Liked songs') {
        if (station.songs) station.songs = likedSongs
      } else station.songs = []
      state.userStations.push(station)
      state.stations.push(station)
    },
  },
  actions: {
    async addUserToSong({ commit, rootGetters }, { song, userStation }) {
      const loggedinUser = rootGetters.loggedinUser;
      console.log(loggedinUser);
      try {
        const { updatedSong, savedStation } = await stationService.addUserToSong(
          song,
          userStation,
          loggedinUser
        );
    
        
        updatedSong.stationId = userStation._id;
        
      
        commit({ type: 'updateSong', song: updatedSong });
    
       
        return savedStation;
      } catch (err) {
        console.error('Cannot add song', err);
        throw err;
      }
    },
    
    
    
    

    async loadStations(context) {
      if (userService.getLoggedinUser())
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
        await stationService.remove(stationId)
        commit({ type: 'removeStation', stationId })
        // this.$router.push(`/station/${state.station[stationId - 1]}`)
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
        console.log('Could Not create station')
        throw err
      }
    },
    async removeSong({ commit }, { songId, stationId }) {
      try {
        await stationService.removeSong(songId, stationId)
        commit({ type: 'removeSong', songId, stationId })
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
      } catch (err) {
        console.error('Cannot add song', err)
        throw err
      }
    },
    async addToStation({ commit }, { song, station }) {
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
