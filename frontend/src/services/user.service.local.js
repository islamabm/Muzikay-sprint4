import { storageService } from './async-storage.service.js'

export const userService = {
  login,
  getLoggedinUser,
}

function login() {
  const station = {}
  storageService.store('loggedinUser', station)
}
function getLoggedinUser() {
  return storageService.load('loggedinUser') || login()
}
