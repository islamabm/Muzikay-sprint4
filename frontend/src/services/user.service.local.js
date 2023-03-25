import { storageService } from './async-storage.service.js'

const USER_KEY = 'loggedinUser'
export const userService = {
  login,
  getLoggedinUser,
}

function login() {
  console.log('hi,login')
  const user = {
    fullName: 'guest',
    likedStations: [],
    likedSongs: null,
  }
  storageService.store(USER_KEY, user)

  //   return user
}
function getLoggedinUser() {
  return storageService.load(USER_KEY) || login()
}
