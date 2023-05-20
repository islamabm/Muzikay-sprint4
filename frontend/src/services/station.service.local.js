import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
import axios from 'axios'

import gStations from '../../data/station.json'
import gSearchStations from '../../data/search.json'
import { userService } from './user.service.js'

const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBLJ8UmMOnvqy-M98LebSWxelSiIT1XKb0&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
const VIDEOS_KEY = 'videosIdDB'
const SEARCH_STATIONS_KEY = 'searchDB'

let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}

_createSearchStations()

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
  getEmotion,
  generateSongs,
  generateStationName,
  // addSongToUserStation,
  // addUserToSong,
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
  return httpService.get('station')
}

async function querySearch() {
  // return httpService.get('search')
  var stations = await storageService.query(SEARCH_STATIONS_KEY)

  return stations
}

function getById(stationId) {
  return httpService.get(`station/${stationId}`)
  // return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
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
  console.log('song id from service', songId)
  return httpService.delete(`station/${stationId}/song/${songId}`)
}

function getVideos(keyword) {
  if (gSearchCache[keyword]) {
    return Promise.resolve(gSearchCache[keyword])
  }
  let videosIds = utilService.loadFromStorage(VIDEOS_KEY) || []

  const existTitle = videosIds.find((video) =>
    video.title.toLowerCase().includes(keyword.toLowerCase())
  )

  return axios.get(gUrl + keyword).then((res) => {
    const videos = res.data.items.map((item) => _prepareData(item))

    gSearchCache = videos

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
    imgUrl: item.snippet.thumbnails.default.url,
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

  return httpService.post('station', newStation)
}

async function addSongToStation(stationId, song) {
  return httpService.post(`station/${stationId}/song`, { song })
}

async function getEmotion(text) {
  return httpService.get('openai/getEmotion', { text })
}

async function generateSongs(emotion) {
  return httpService.post('openai/generateSongs', { emotion })
}

async function generateStationName(emotion) {
  return httpService.post('openai/generateStationName', { emotion })
}
