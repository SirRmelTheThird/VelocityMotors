import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/pages/Home.vue'
import Login from '../views/pages/Login.vue'
import Register from '../views/pages/Register.vue'
import Logout from '../views/components/Logout.vue'
import Create from '../views/pages/Create.vue'
import Items from '../views/pages/Items.vue'
import Item from '../views/components/Item.vue'
import BidHistory from '../views/components/BidHistory.vue'
import Profile from '../views/pages/Profile.vue'
import NotFound from '../views/pages/NotFound.vue'

const isAuthenticated = (to, from, next) => {
  const token = localStorage.getItem('session_token');
  if (!token) {
    return next('/login');
  }
  next();
};

const redirectIfLoggedIn = (to, from, next) => {
  const token = localStorage.getItem('session_token');
  if (token) {
    next('/');
  } else {
    next();
  }
};

const routes = [
  { path: '/', component: Home },
  { path: '/index', redirect: '/' },
  { path: '/login', component: Login, beforeEnter: redirectIfLoggedIn },
  { path: '/logout', component: Logout },
  { path: '/register', component: Register, beforeEnter: redirectIfLoggedIn },
  { path: '/create', component: Create, beforeEnter: isAuthenticated },
  { path: '/items', name: 'items', component: Items },
  { path: '/item/:id', name: 'item', component: Item },
  { path: '/item/:id/bid', name: 'bidHistory', component: BidHistory },
  { path: '/profile', component: Profile, beforeEnter: isAuthenticated },
  { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
