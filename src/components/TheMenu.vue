<script lang="ts">
export default {
  name: 'TheMenu'
}
</script>

<script setup lang="ts">
import { Menu, SubMenu, MenuItem } from 'ant-design-vue'
import { ExportOutlined } from '@ant-design/icons-vue'
import { menuItems } from '~/constants'
import { useAuthStore } from '~/store/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const { currentUser } = storeToRefs(authStore)

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
    v-if="currentUser"
    v-model:selectedKeys="selectedKeys"
    theme="dark"
    mode="inline"
    class="sidebar-menu"
  >
    <template v-for="menuItem in menuItems" :key="menuItem.id">
      <template v-if="menuItem.permissions?.includes(currentUser.type)">
        <SubMenu
          v-if="menuItem.children"
          :key="menuItem.id"
          :title="menuItem.title"
        >
          <template #icon>
            <component :is="menuItem.icon" />
          </template>
          <MenuItem v-for="child in menuItem.children" :key="child.id">
            <template v-if="child.permissions?.includes(currentUser.type)">
              <router-link v-if="child.link" :to="child.link">
                {{ child.title }}
              </router-link>
              <template v-else>
                {{ child.title }}
              </template>
            </template>
          </MenuItem>
        </SubMenu>

        <template v-else>
          <MenuItem :key="menuItem.id">
            <template #icon>
              <component :is="menuItem.icon" />
            </template>
            <router-link v-if="menuItem.link" :to="menuItem.link">
              {{ menuItem.title }}
            </router-link>
            <template v-else>
              {{ menuItem.title }}
            </template>
          </MenuItem>
        </template>
      </template>
    </template>
    <MenuItem :key="-1" @click="onLogout">
      <template #icon>
        <export-outlined />
      </template>
      Đăng xuất
    </MenuItem>
  </Menu>
</template>

<style scoped lang="scss">
.sidebar-menu {
  max-height: calc(100vh - 32px);
  overflow-y: auto;
}
</style>
