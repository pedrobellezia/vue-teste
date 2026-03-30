import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ConsultarView from '@/views/ConsultarView.vue'
import RegistrarView from '@/views/RegistrarView.vue'
import DevlogsView from '@/views/DevlogsView.vue'
import DevlogsResultView from '@/views/DevlogsResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/consultar',
      name: 'consultar',
      component: ConsultarView,
    },
    {
      path: '/registrar',
      name: 'registrar',
      component: RegistrarView,
    },
    {
      path: '/devlogs',
      name: 'devlogs',
      component: DevlogsView,
    },
    {
      path: '/devlogs/results',
      name: 'devlogs-results',
      component: DevlogsResultView,
    },
  ],
})

export default router
