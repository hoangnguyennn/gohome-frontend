<script setup lang="ts">
import { Menu, SubMenu, MenuItem } from 'ant-design-vue'
import { menuItems } from '../constants'
import router from '../router'
import { useAuthStore } from '../store/stores/authStore'

const authStore = useAuthStore()

const selectedKeys = ref([menuItems[0].id])

const onLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <Menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
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

      <MenuItem v-else :key="menuItem.id">
        <router-link v-if="menuItem.link" :to="menuItem.link">
          {{ menuItem.title }}
        </router-link>
        <template v-else>
          {{ menuItem.title }}
        </template>
      </MenuItem>
    </template>
    <MenuItem :key="-1" @click="onLogout">Đăng xuất</MenuItem>
  </Menu>
</template>
