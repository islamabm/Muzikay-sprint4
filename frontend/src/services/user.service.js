import { storageService } from './async-storage.service'
import { httpService } from './http.service'

// import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from './socket.service'
import { showSuccessMsg } from './event-bus.service'
import { utilService } from './util.service'
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
  // return storageService.query('user')
  return httpService.get(`user`)
}

// function onUserUpdate(user) {
//   showSuccessMsg(
//     `This user ${user.fullname} just got updated from socket, new score: ${user.score}`
//   )
//   store.dispatch({ type: 'setWatchedUser', user })
// }

async function getById(userId) {
  // const user = await storageService.get('user', userId)
  const user = await httpService.get(`user/${userId}`)

  // socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
  // socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
  // socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

  return user
}
function remove(userId) {
  // return storageService.remove('user', userId)
  return httpService.delete(`user/${userId}`)
}

async function update(song, user) {
  // const user = await storageService.get('user', _id)
  // let user = getById(_id)

  // user.LikedSongs.push(song)
  // await storageService.put('user', user)

  const savedUser = await httpService.put(`user/${user._id}`, user)

  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === savedUser._id) saveLocalUser(savedUser)
  return savedUser
}
{
  /* <input class="edit-name" id="name" type="text" v-model="transcript" /> */
}
async function login(userCred) {
  // const users = await storageService.query('user')
  // const user = users.find((user) => user.username === userCred.username)
  const user = await httpService.post('auth/login', userCred)
  //   if (user) {
  // socketService.login(user._id)

  return saveLocalUser(user)
  //   }
}
async function signup(userCred) {
  // console.log('service', userCred)
  //   userCred.score = 10000
  if (!userCred.imgUrl) {
    userCred.imgUrl =
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg'
  }

  // const user = await storageService.post('user', userCred)
  // const users = utilService.loadFromStorage('user')
  // console.log(users)
  const user = await httpService.post('auth/signup', userCred)

  return saveLocalUser(user)
}
async function logout() {
  // sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  // socketService.logout()
  return await httpService.post('auth/logout')
}

// async function changeScore(by) {
//   const user = getLoggedinUser()
//   if (!user) throw new Error('Not loggedin')
//   user.score = user.score + by || by
//   await update(user)
//   return user.score
// }

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

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()
