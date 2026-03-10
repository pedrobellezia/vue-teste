import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ConsultarView from '@/views/ConsultarView.vue'
import RegistrarView from '@/views/RegistrarView.vue'

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
  ],
})

export default router
