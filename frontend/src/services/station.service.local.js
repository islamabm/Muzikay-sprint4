import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import axios from 'axios'

import gStations from '../../data/station.json'
import gSearchStations from '../../data/search.json'
import { userService } from './user.service.js'

const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAJdWiwO8iXvEo3OLxyQonqC9NpQldX-tM&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
const VIDEOS_KEY = 'videosIdDB'
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

function _getUrl(id = '') {
  const BASE_URL =
    process.env.NODE_ENV !== 'development'
      ? '/station/collection'
      : '//localhost:3030/station/collection'

  return `${BASE_URL}/${id}`
}

async function query() {
  console.log('query')
  return httpService.get('station')
  // var stations = await storageService.query(STORAGE_KEY)
  // if (filterBy.name) {
  //   const regex = new RegExp(filterBy.name, 'i')
  //   stations = stations.filter((station) => regex.test(station.name))
  // }
  // return stations
}

async function querySearch() {
  // return httpService.get('search')
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
  return httpService.put(`station/${station._id}`, station)
}

function getEmptyStation() {
  return {
    //   _id: utilService.makeId(),
  }
}

function removeSong(stationId, songId) {
  return httpService.delete(`station/${stationId}/song/${songId}`)
}

function getVideos(keyword) {
  if (gSearchCache[keyword]) {
    return Promise.resolve(gSearchCache[keyword])
  }
  let videosIds = utilService.loadFromStorage(VIDEOS_KEY) || []
  console.log('keyword', keyword)
  const existTitle = videosIds.find((video) =>
    video.title.toLowerCase().includes(keyword.toLowerCase())
  )
  console.log(existTitle)

  return axios.get(gUrl + keyword).then((res) => {
    const videos = res.data.items.map((item) => _prepareData(item))
    console.log(videos)
    gSearchCache = videos
    // console.log('gSearchCache', gSearchCache)
    videosIds.push(videos[0])
    utilService.saveToStorage(SEARCH_KEY, gSearchCache)
    utilService.saveToStorage(VIDEOS_KEY, videosIds)
    return videos
  })
}

function _prepareData(item) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    url: item.snippet.thumbnails.default.url,
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
  // working with backend
  return httpService.post('station', newStation)

  // working with local

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
  if (!station) {
    throw new Error('Station parameter is undefined')
  }
  console.log('before song', song)
  // Create a new song object with the updated likedByUsers array
  const updatedSong = {
    ...song,
    likedByUsers: [...song.likedByUsers, loggedinUser.fullname],
  }
  console.log('after song', song)
  const updatedStation = {
    ...station,
    songs: station.songs.map((s) => (s.id === song.id ? updatedSong : s)),
  }
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
  return savedStation
}
