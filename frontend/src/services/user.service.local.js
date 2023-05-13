import { storageService } from './async-storage.service.js'

// const USER_KEY = 'loggedinUser'
export const userService = {
  login,
  getLoggedinUser,
}

function login() {
  const station = {}
  storageService.store('loggedinUser', station)

  //   return user
}
function getLoggedinUser() {
  return storageService.load('loggedinUser') || login()
}
