import { createRouter, createWebHashHistory } from 'vue-router'

import Search from './views/Search.vue'
import UserLibrary from './views/UserLibrary.vue'
import CreateStation from './views/CreateStation.vue'
import LikedSongs from './views/LikedSongs.vue'
import StationIndex from './views/StationIndex.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'

//  buttons for navigation

{
  /* <RouterLink to="/back">back</RouterLink> */
}
{
  /* <RouterLink to="/go">go</RouterLink> */
}

const routes = [
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: StationIndex,

    childern: [
      {
        path: 'search',
        name: 'search',
        component: Search,
      },
      {
        path: 'library',
        name: 'Library',
        component: UserLibrary,
      },
      {
        path: 'create',
        name: 'CreateStation',
        component: CreateStation,
      },
      {
        path: 'like',
        name: 'like',
        component: LikedSongs,
      },
    ],
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
