import { createRouter, createWebHashHistory } from 'vue-router'

import Search from './views/Search.vue'
import UserLibrary from './views/UserLibrary.vue'
import LikedSongs from './views/LikedSongs.vue'
import StationIndex from './views/StationIndex.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import StationDetails from './views/StationDetails.vue'
import StationCollection from './views/StationCollection.vue'
// import Modal from '../src/cmps/Modal.vue'

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
    path: '/station',
    name: 'Home',
    component: StationIndex,

    children: [
      {
        path: '/station/collection',
        name: 'collection',
        component: StationCollection,
      },
      // {
      //   path: '/station/modal',
      //   name: 'modal',
      //   component: Modal,
      // },
      {
        path: '/station/search',
        name: 'search',
        component: Search,
      },
      {
        path: '/station/library',
        name: 'Library',
        component: UserLibrary,
      },
      {
        path: '/station/like',
        name: 'like',
        component: LikedSongs,
      },
      {
        path: '/station/:stationId',
        name: 'station-details',
        component: StationDetails,
      },
    ],
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
})
