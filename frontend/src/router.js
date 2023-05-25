import { createRouter, createWebHashHistory } from 'vue-router'

import Search from './views/Search.vue'
import UserLibrary from './views/UserLibrary.vue'
import StationIndex from './views/StationIndex.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import StationDetails from './views/StationDetails.vue'
import StationCollection from './views/StationCollection.vue'
import UserDetails from './views/UserDetails.vue'
import Chat from './views/Chat.vue'

const routes = [
  {
    path: '/',
    redirect: '/station/collection',
  },
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
        path: '/station/collection/:category?',
        component: StationCollection,
      },
      {
        path: '/station/search',
        name: 'search',
        component: Search,
      },

      {
        path: '/station/chat',
        name: 'chat',
        component: Chat,
      },
      {
        path: '/station/library',
        name: 'Library',
        component: UserLibrary,
      },

      {
        path: '/user/:id',
        name: 'UserDetails',
        component: UserDetails,
      },
      {
        path: '/station/:stationId',
        name: 'station-details',
        component: StationDetails,
        props: true,
      },
    ],
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
})
