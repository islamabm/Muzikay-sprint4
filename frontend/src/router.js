import { createRouter, createWebHashHistory } from 'vue-router'

// import Home from './views/Home.vue'
// import Chat from './views/Chat.vue'
// import CarIndex from './views/CarIndex.vue'
// import ReviewIndex from './views/ReviewIndex.vue'
// import LoginSignup from './views/LoginSignup.vue'
// import UserDetails from './views/UserDetails.vue'
import Search from './views/Search.vue'
import UserLibrary from './views/UserLibrary.vue'
import CreateStation from './views/CreateStation.vue'
import LikedSongs from './views/LikedSongs.vue'
import StationIndex from './views/StationIndex.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: StationIndex,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/library',
    name: 'Library',
    component: UserLibrary,
  },
  {
    path: '/create',
    name: 'CreateStation',
    component: CreateStation,
  },
  {
    path: '/like',
    name: 'like',
    component: LikedSongs,
  },

]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
