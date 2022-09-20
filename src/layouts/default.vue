<script setup lang="ts">
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import {
  Layout,
  LayoutSider,
  LayoutHeader,
  LayoutContent,
  Menu,
  MenuItem
} from 'ant-design-vue'

const collapsed = ref(false)
const selectedKeys = ref(['1'])
</script>

<template>
  <Layout id="layout-default">
    <LayoutSider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <Menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <MenuItem key="1">
          <user-outlined />
          <span>nav 1</span>
        </MenuItem>
        <MenuItem key="2">
          <video-camera-outlined />
          <span>nav 2</span>
        </MenuItem>
        <MenuItem key="3">
          <upload-outlined />
          <span>nav 3</span>
        </MenuItem>
      </Menu>
    </LayoutSider>
    <Layout>
      <LayoutHeader style="background: #fff; padding: 0">
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
      </LayoutHeader>
      <LayoutContent
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px'
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
