<script setup lang="ts">
import { Menu, SubMenu, MenuItem } from 'ant-design-vue'
import { menuItems } from '~/constants'
import { useAuthStore } from '~/store/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const selectedKeys = ref<(number | string)[]>([])

const onLogout = () => {
  authStore.logout()
  router.push('/login')
}

const getMenuItemId = (path: string) => {
  let id = menuItems[0].id
  menuItems.forEach((menuItem) => {
    if (menuItem.link === path) {
      id = menuItem.id
      return
    }

    if (menuItem.children) {
      menuItem.children.forEach((child) => {
        if (child.link === path) {
          id = child.id
          return
        }
      })
    }
  })

  return id
}

watch(
  () => route.path,
  (newValue: string) => {
    selectedKeys.value = [getMenuItemId(newValue)]
  },
  { immediate: true }
)
</script>

<template>
  <Menu
    v-model:selectedKeys="selectedKeys"
    theme="dark"
    mode="inline"
    class="sidebar-menu"
  >
    <template v-for="menuItem in menuItems" :key="menuItem.id">
      <SubMenu
        v-if="menuItem.children"
        :key="menuItem.id"
        :title="menuItem.title"
      >
        <MenuItem v-for="child in menuItem.children" :key="child.id">
          <router-link v-if="child.link" :to="child.link">
            {{ child.title }}
          </router-link>
          <template v-else>
            {{ child.title }}
          </template>
        </MenuItem>
      </SubMenu>

      <template v-else>
        <MenuItem :key="menuItem.id">
          <router-link v-if="menuItem.link" :to="menuItem.link">
            {{ menuItem.title }}
          </router-link>
          <template v-else>
            {{ menuItem.title }}
          </template>
        </MenuItem>
      </template>
    </template>
    <MenuItem :key="-1" @click="onLogout">Đăng xuất</MenuItem>
  </Menu>
</template>

<style scoped lang="scss">
.sidebar-menu {
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}
</style>
