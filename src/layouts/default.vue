<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import {
  Layout,
  LayoutSider,
  LayoutHeader,
  LayoutContent,
  Dropdown,
  Avatar,
  Menu,
  MenuItem
} from 'ant-design-vue'
import TheMenu from '~/components/TheMenu.vue'
import { useAuthStore } from '~/store/stores/authStore'

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

const collapsed = ref(false)
</script>

<template>
  <Layout id="layout-default">
    <LayoutSider v-model:collapsed="collapsed" collapsible :trigger="null">
      <div class="logo"></div>
      <TheMenu />
    </LayoutSider>
    <Layout>
      <LayoutHeader
        style="
          background: #fff;
          padding: 0;
          display: flex;
          justify-content: space-between;
          padding-right: 16px;
        "
      >
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <div>
          <Dropdown :trigger="['click']">
            <div style="cursor: pointer; display: flex; align-items: center">
              <Avatar :src="currentUser?.avatar" style="margin-right: 10px">
                {{ currentUser?.fullName || currentUser?.username }}
              </Avatar>
              <p style="margin: 0">
                {{ currentUser?.fullName || currentUser?.username }}
              </p>
            </div>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <router-link to="/account">Thông tin tài khoản</router-link>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </LayoutHeader>
      <LayoutContent
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
          overflow: 'auto'
        }"
      >
        <RouterView />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style lang="scss" scoped>
#layout-default {
  height: 100vh;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
  }

  .site-layout-background {
    background: #fff;
  }
}
</style>
