import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

// import { userService } from './user.service.js'
const gUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyA7mUfwc8_dAf8qblavJOThFcYsKufDt38&q=`
const STORAGE_KEY = 'station'
const SEARCH_KEY = 'videosDB'
let gSearchCache = utilService.loadFromStorage(SEARCH_KEY) || {}
_createStations()

export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  getVideos,
  createNewStation,
  addSongToStation,
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

// async function addStationMsg(stationId, name) {
//   // Later, this is all done by the backend
//   const station = await getById(stationId)
//   if (!station.msgs) station.msgs = []

//   const msg = {
//     id: utilService.makeId(),
//     by: userService.getLoggedinUser(),
//     name,
//   }
//   station.msgs.push(msg)
//   await storageService.put(STORAGE_KEY, station)

//   return msg
// }
// function getVideos(keyword) {
//   if (gSearchCache[keyword]) {
//     console.log('Loading from cache')
//     return Promise.resolve(gSearchCache[keyword])
//   }

//   return axios.get(urlYT + keyword).then(res => {
//     console.log('res', res)
//     const videos = res.data.items.map(item => _prepareData(item))
//     gSearchCache[keyword] = videos
//     saveToStorage(SEARCH_KEY, gSearchCache)
//     return videos
//   })
// }

function getEmptyStation() {
  return {
    //   _id: utilService.makeId(),
  }
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

function _prepareData(item) {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    url: `https://www.youtube.com/embed/${item.id.videoId}`, // Changed from 'item.snippet.thumbnails.default.url'
  }
}

function _createStations() {
  var stations = JSON.parse(localStorage.getItem(STORAGE_KEY))
  if (!stations || !stations.length) {
    const stationsList = [
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Funk'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Funk'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://assets.vogue.com/photos/5cdc3d9ac39901ae59dbfbe5/3:4/w_1773,h_2364,c_limit/00-promo-classical-music.jpg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/kgx4WGK0oNU/maxresdefault.jpg', //changed
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Funk'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://i.scdn.co/image/ab67616d0000b27319e9d00ec40455f230a217ad',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Funk'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Funk'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://static.onecms.io/wp-content/uploads/sites/6/2020/11/25/Best-Music-3.jpg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Happy'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://www.innocence-paris.com/files/revue-album-photo-https://i1.sndcdn.com/artworks-ZHCyxMGGVtXQZ68L-xLrrjQ-t500x500.jpggrand-format-noel-01_7f227be09e13b375ae99d211bec41616.jpeg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl:
              'https://cdn10.phillymag.com/wp-content/uploads/sites/3/2020/09/monthly-playlist.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Happy'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://www.billboard.com/wp-content/uploads/2022/12/winter-music-playlist-2022-billboard-1548.jpg?w=942&h=623&crop=1',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl:
              'https://cdn10.phillymag.com/wp-content/uploads/sites/3/2020/09/monthly-playlist.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Happy'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://www.innocence-paris.com/files/revue-album-photo-grand-format-noel-01_7f227be09e13b375ae99d211bec41616.jpeg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl:
              'https://cdn10.phillymag.com/wp-content/uploads/sites/3/2020/09/monthly-playlist.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Happy'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://marketplace.canva.com/EAFSNmv0C0k/1/0/1600w/canva-orange-illustration-relaxing-playlist-cover-G1lOYn2PS28.jpg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
      {
        _id: '5cksxjas89xjsa8xjsa8jxs09',
        name: 'Funky Monks',
        tags: ['Happy'],
        createdBy: {
          _id: 'u101',
          fullname: 'Puki Ben David',
          imgUrl: 'http://some-photo/',
        },
        likedByUsers: ['{minimal-user}', '{minimal-user}'],
        songs: [
          {
            id: 's1001',
            title: 'The Meters - Cissy Strut',
            url: 'youtube/song.mp4',
            imgUrl:
              'https://travel.home.sndimg.com/content/dam/images/travel/stock/2017/3/24/0/Shutterstock_393700531_BeachPlaylistGraphic.jpg.rend.hgtvcom.616.462.suffix/1491594774042.jpeg',
            addedBy: '{minimal-user}',
            addedAt: 162521765262,
          },
          {
            id: 'mUkfiLjooxs',
            title: "The JB's - Pass The Peas",
            url: 'youtube/song.mp4',
            imgUrl: 'https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg',
            addedBy: {},
          },
        ],
        msgs: [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?',
          },
        ],
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stationsList))
  }
}

function createNewStation() {
  const newStation = {
    _id: utilService.makeId(),
    name: '',
    tags: [],
    createdBy: {
      _id: '',
      fullname: '',
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
  }
  const stations = utilService.loadFromStorage(STORAGE_KEY)

  if (stations.length) stations.push(newStation)
  utilService.saveToStorage(STORAGE_KEY, stations)
  return newStation
}

async function addSongToStation(video, station) {
  console.log('video from addSongToStation', video)
  console.log('station from addSongToStation', station)
  const updatedStation = { ...station, songs: [...station.songs, video] }
  const savedStation = await save(updatedStation)
  return savedStation
}

