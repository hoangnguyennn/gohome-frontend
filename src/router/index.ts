import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import { useAuthStore } from '~/store/stores/authStore'
import { UserTypes } from '~/interfaces/enums'
import { IUser } from '~/interfaces'
import { message } from 'ant-design-vue'

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

  const permissions = (to.meta.permissions || []) as UserTypes[]
  if (permissions.length === 0) {
    return next()
  }

  const userType = (authStore.currentUser as IUser).type
  if (!permissions.includes(userType)) {
    message.error('Bạn không có quyền truy cập vào mục này')
    return next('/')
  }

  next()
})

export default router
