import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { useAuthStore } from '~/store/stores/authStore'

const routes = setupLayouts(generatedRoutes)

console.log({ routes })

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const title = to.meta.title as string

  document.title = title || 'GHNT'

  if (!to.meta.requireAuth) {
    return next()
  }

  const authStore = useAuthStore()

  if (authStore.currentUser) {
    return next()
  }

  try {
    await authStore.getCurrentUser()

    if (!authStore.currentUser) {
      return next('/login')
    }
  } catch {
    return next('/login')
  }

  next()
})

export default router
