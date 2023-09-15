import { createRouter, createWebHistory } from 'vue-router'


import Login from '../components/Login.vue'
import OrderM from '../components/OrderM.vue'
import Home from '../components/Home.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/order',
      name: 'order',
      component: OrderM
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})




export default router
