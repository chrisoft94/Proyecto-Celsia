import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import UserManager from '../views/UserManager.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/users',
    name: 'UserManager',
    component: UserManager,
    meta: { requiresAuth: true } // ✅ Ruta protegida
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Protección de rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
