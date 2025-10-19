import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/Login.vue'),
      meta: { layout: 'auth', requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/Register.vue'),
      meta: { layout: 'auth', requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/pages/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/family-tree',
      name: 'FamilyTree',
      component: () => import('@/pages/FamilyTree.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/members',
      name: 'Members',
      component: () => import('@/pages/Members.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/pages/Settings.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (['Login', 'Register'].includes(to.name as string) && userStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
