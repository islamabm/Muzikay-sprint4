import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

import gStations from '../../data/station.json'
// import { userService } from './user.service.js'
const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBpcXHlaM0mzq7pKpRQzm_kMlUqZH8XohM&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
// const USER_KEY = 'userStationDB'
let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}
_createStations()
// createUserStations()
export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  getVideos,
  createNewStation,
  addSongToStation,
  removeSong,
  addSongToStation: addSongToUserStation,
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

function getById(stationId) {
  return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
  await storageService.remove(STORAGE_KEY, stationId)
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

function getUserStation() {
  const likedSongsStation = {
    _id: utilService.makeId(),
    name: 'likedSongs',
    tags: [],
    createdBy: {
      _id: '',
      fullname: 'guest',
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
  stations.push(likedSongsStation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))

  return likedSongsStation
}

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

function createNewStation(name) {
  const newStation = {
    _id: utilService.makeId(),
    name: name,
    tags: [],
    createdBy: {
      _id: '',
      fullname: 'guest',
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
  stations.push(newStation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stations))

  return newStation
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
