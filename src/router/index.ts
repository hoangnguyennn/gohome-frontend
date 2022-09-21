import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

const routes = setupLayouts(generatedRoutes)

console.log({ routes })

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title as string

  document.title = title || 'GHNT'
  next()
})

export default router
