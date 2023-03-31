import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import axios from 'axios'

import gStations from '../../data/station.json'
import gSearchStations from '../../data/search.json'
import { userService } from './user.service.js'

const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAqzQlySCi__l0i-rt87fZOfbCN85Xj-CE&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
const SEARCH_STATIONS_KEY = 'searchDB'
// const USER_KEY = 'userStationDB'
let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}
// _createStations()
_createSearchStations()
// createUserStations()
export const stationService = {
  query,
  getById,
  save,
  querySearch,
  remove,
  getEmptyStation,
  getVideos,
  createNewStation,
  addSongToStation,
  removeSong,
  addSongToUserStation,
  addUserToSong,
  // addStationMsg,
}
window.cs = stationService

async function query() {
  return httpService.get('station')
  // var stations = await storageService.query(STORAGE_KEY)
  // if (filterBy.name) {
  //   const regex = new RegExp(filterBy.name, 'i')
  //   stations = stations.filter((station) => regex.test(station.name))
  // }
  // return stations
}

async function querySearch() {
  var stations = await storageService.query(SEARCH_STATIONS_KEY)
  // if (filterBy.name) {
  //   const regex = new RegExp(filterBy.name, 'i')
  //   stations = stations.filter((station) => regex.test(station.name))
  // }
  return stations
}

function getById(stationId) {
  return httpService.get(`station/${stationId}`)
  // return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  // console.log('service', stationId)
  // const station = await storageService.remove(STORAGE_KEY, stationId)
  // console.log(station)
  // return station
  return httpService.delete(`station/${stationId}`)
}

async function save(station) {
  // var savedStation
  // console.log('station', station)
  // if (station._id) {
  //   savedStation = await storageService.put(STORAGE_KEY, station)
  // } else {
  //   // Later, owner is set by the backend
  //   // station.owner = userService.getLoggedinUser()
  //   savedStation = await storageService.post(STORAGE_KEY, station)
  // }
  // return savedStation
  // var savedstation
  // if (station._id) {
  // savedstation = await storageService.put(STORAGE_KEY, station)
  return httpService.put(`station/${station._id}`, station)
  // } else {
  // Later, owner is set by the backend
  // station.owner = userService.getLoggedinUser()
  // savedstation = await storageService.post(STORAGE_KEY, station)
  // savedstation = await httpService.post('station', station)
  // }
  // return savedstation
}

function getEmptyStation() {
  return {
    //   _id: utilService.makeId(),
  }
}

function removeSong(stationId, songId) {
  return httpService.delete(`station/${stationId}/song/${songId}`)
  // const stations = utilService.loadFromStorage(STORAGE_KEY)
  // const stationIdx = stations.findIndex((s) => s._id === stationId)
  // const station = stations[stationIdx]
  // const songIdx = station.songs.findIndex((so) => so.id === songId)
  // station.songs.splice(songIdx, 1)
  // stations[stationIdx] = station
  // utilService.saveToStorage(STORAGE_KEY, stations)
}

function getVideos(keyword) {
  if (gSearchCache[keyword]) {
    return Promise.resolve(gSearchCache[keyword])
  }

  return axios.get(gUrl + keyword).then((res) => {
    console.log(res.data.items)
    const videos = res.data.items.map((item) => _prepareData(item))
    gSearchCache = videos
    utilService.saveToStorage(SEARCH_KEY, gSearchCache)
    return videos
  })
}

function _prepareData(item) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    url: item.snippet.thumbnails.default.url,
    // duration: item.contentDetails.duration,
    createdAt: item.snippet.publishedAt,
  }
}

function _createStations() {
  let stations = gStations
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))
  }
}

function _createSearchStations() {
  let stations = gSearchStations
  if (!localStorage.getItem(SEARCH_STATIONS_KEY)) {
    localStorage.setItem(SEARCH_STATIONS_KEY, JSON.stringify(stations))
  }
}

function createNewStation(name) {
  const loggedinUser = userService.getLoggedinUser()
  const newStation = {
    imgUrl: '',
    name: name,
    tags: [],
    createdBy: {
      _id: loggedinUser._id,
      fullname: loggedinUser.fullname,
      imgUrl: '',
    },
    likedByUsers: [],
    songs: [],
    msgs: [
      {
        id: '',
        from: '',
        txt: '',
      },
    ],
    desc: '',
  }

  // if (toy._id) {
  //   return httpService.put(`toy/${toy._id}`, toy)
  // }
  return httpService.post('station', newStation)

  // const stations = utilService.loadFromStorage(STORAGE_KEY)
  // console.log(stations)
  // stations.push(newStation)
  // localStorage.setItem('station', JSON.stringify(stations))

  // localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))

  // const users = utilService.loadFromStorage('user')

  // const currUserIdx = users.findIndex((u) => u._id === loggedinUser._id)

  // users[currUserIdx].stations.push(newStation)

  // localStorage.setItem('user', JSON.stringify(users))

  // return newStation
}

async function addUserToSong(song, station, loggedinUser) {
  console.log('service station', station)
  console.log('service song', song)
  console.log('service user', loggedinUser)

  if (!station) {
    throw new Error('Station parameter is undefined')
  }

  // Create a new song object with the updated likedByUsers array
  const updatedSong = {
    ...song,
    likedByUsers: [...song.likedByUsers, loggedinUser.fullname],
  }

  const updatedStation = {
    ...station,
    songs: station.songs.map((s) => (s.id === song.id ? updatedSong : s)),
  }
  console.log('this is the updated station', updatedStation)

  const savedStation = await save(updatedStation)

  return { updatedSong, savedStation }
}

async function addSongToStation(stationId, song) {
  return httpService.post(`station/${stationId}/song`, { song })
  // if (!station) {
  //   throw new Error('Station parameter is undefined')
  // }
  // const updatedStation = { ...station, songs: [...station.songs, video] }
  // const savedStation = await save(updatedStation)
  // return savedStation
}

async function addSongToUserStation(song, station) {
  if (!station) {
    throw new Error('Station parameter is undefined')
  }
  const updatedSongs = [...station.songs, song]
  const updatedStation = { ...station, songs: updatedSongs }
  const savedStation = await save(updatedStation)
  console.log(savedStation)
  return savedStation
}
