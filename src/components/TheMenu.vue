<script setup lang="ts">
import { Menu, SubMenu, MenuItem } from 'ant-design-vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { menuItems } from '../constants'

const selectedKeys = ref([menuItems[0].id])
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

      <MenuItem v-else>
        <router-link v-if="menuItem.link" :to="menuItem.link">
          {{ menuItem.title }}
        </router-link>
        <template v-else>
          {{ menuItem.title }}
        </template>
      </MenuItem>
    </template>
    <MenuItem>Đăng xuất</MenuItem>
  </Menu>
</template>
