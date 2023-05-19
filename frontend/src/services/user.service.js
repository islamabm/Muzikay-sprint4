import { storageService } from './async-storage.service'
import { httpService } from './http.service'

// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from './socket.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  //   changeScore,
}

window.userService = userService

function getUsers() {
  return httpService.get(`user`)
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`)

  return user
}
function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function update(selectedSong, user) {
  const userCopy = { ...user }

  // console.log('Adding song to user in service', song)
  userCopy.LikedSongs.push(selectedSong)

  const savedUser = await httpService.put(`user/${userCopy._id}`, userCopy)

  if (getLoggedinUser()._id === savedUser._id) saveLocalUser(savedUser)
  return savedUser
}
async function login(userCred) {
  const user = await httpService.post('auth/login', userCred)

  return saveLocalUser(user)
  //   }
}
async function signup(userCred) {
  if (!userCred.imgUrl) {
    userCred.imgUrl =
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
  }

  const user = await httpService.post('auth/signup', userCred)

  return saveLocalUser(user)
}
async function logout() {
  return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    stations: [],
    imgUrl:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg',
    LikedSongs: [],
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
