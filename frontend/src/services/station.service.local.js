import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

import { userService } from './user.service.js'
import gStations from '../../data/station.json'
import gSearchStations from '../../data/search.json'
// import { userService } from './user.service.js'
const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBpcXHlaM0mzq7pKpRQzm_kMlUqZH8XohM&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
const SEARCH_STATIONS_KEY = 'searchDB'
// const USER_KEY = 'userStationDB'
let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}
_createStations()
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

async function query(filterBy = { name: '' }) {
  var stations = await storageService.query(STORAGE_KEY)
  if (filterBy.name) {
    const regex = new RegExp(filterBy.name, 'i')
    stations = stations.filter((station) => regex.test(station.name))
  }
  return stations
}

async function querySearch(filterBy = { name: '' }) {
  var stations = await storageService.query(SEARCH_STATIONS_KEY)
  if (filterBy.name) {
    const regex = new RegExp(filterBy.name, 'i')
    stations = stations.filter((station) => regex.test(station.name))
  }
  return stations
}

function getById(stationId) {
  return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  console.log('service', stationId)
  const station = await storageService.remove(STORAGE_KEY, stationId)
  console.log(station)
  return station
}

async function save(station) {
  var savedStation
  console.log('station', station)
  if (station._id) {
    savedStation = await storageService.put(STORAGE_KEY, station)
  } else {
    // Later, owner is set by the backend
    // station.owner = userService.getLoggedinUser()
    savedStation = await storageService.post(STORAGE_KEY, station)
  }
  return savedStation
}

function getEmptyStation() {
  return {
    //   _id: utilService.makeId(),
  }
}

function removeSong(songId, stationId) {
  const stations = utilService.loadFromStorage(STORAGE_KEY)
  const stationIdx = stations.findIndex((s) => s._id === stationId)
  const station = stations[stationIdx]
  const songIdx = station.songs.findIndex((so) => so._id === songId)
  station.songs.splice(songIdx, 1)
  stations[stationIdx] = station // Update the station in the stations array
  utilService.saveToStorage(STORAGE_KEY, stations)
}
function getVideos(keyword) {
  if (gSearchCache[keyword]) {
    return Promise.resolve(gSearchCache[keyword])
  }

  return axios.get(gUrl + keyword).then((res) => {
    const videos = res.data.items.map((item) => _prepareData(item))
    gSearchCache = videos
    utilService.saveToStorage(SEARCH_KEY, gSearchCache)
    return videos
  })
}

// function getUserStation() {
//   const likedSongsStation = {
//     _id: utilService.makeId(),
//     name: 'likedSongs',
//     tags: [],
//     createdBy: {
//       _id: '',
//       fullname: 'guest',
//       imgUrl: '',
//     },
//     likedByUsers: [],
//     songs: [],
//     msgs: [
//       {
//         id: '',
//         from: '',
//         txt: '',
//       },
//     ],
//     desc: '',
//   }
//   const stations = utilService.loadFromStorage(STORAGE_KEY)
//   stations.push(likedSongsStation)
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))

//   return likedSongsStation
// }

function _prepareData(item) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    url: item.snippet.thumbnails.default.url,
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
    _id: utilService.makeId(),
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

  const stations = utilService.loadFromStorage(STORAGE_KEY)
  console.log(stations)
  stations.push(newStation)
  localStorage.setItem('station', JSON.stringify(stations))

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))
  // loggedinUser.stations.push(newStation)
  const users = utilService.loadFromStorage('user')

  const currUserIdx = users.findIndex((u) => u._id === loggedinUser._id)

  users[currUserIdx].stations.push(newStation)
  // users.push(currUser)

  localStorage.setItem('user', JSON.stringify(users))

  return newStation
}

async function addUserToSong(song, station, loggedinUser) {
  if (!station) {
    throw new Error('Station parameter is undefined')
  }
  // console.log('service add user to song', user.fullname)
  // console.log(' before service add user to song', song.likedByUsers)
  song.likedByUsers.push(loggedinUser.fullname)

  // console.log(' after service add user to song', song.likedByUsers)
  // console.log('this is the station before update', station)
  const updatedStation = { ...station, songs: [...station.songs, song] }
  console.log('this is the updated station', updatedStation)
  const savedStation = await save(updatedStation)

  return savedStation
}

async function addSongToStation(video, station) {
  // console.log('video from addSongToStation', video)
  // console.log('station from addSongToStation', station)
  if (!station) {
    throw new Error('Station parameter is undefined')
  }
  const updatedStation = { ...station, songs: [...station.songs, video] }
  const savedStation = await save(updatedStation)
  return savedStation
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
