<script setup lang="ts">
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import {
  Layout,
  LayoutSider,
  LayoutHeader,
  LayoutContent
} from 'ant-design-vue'
import TheMenu from '../components/TheMenu.vue'

const collapsed = ref(false)
</script>

<template>
  <Layout id="layout-default">
    <LayoutSider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo"></div>
      <TheMenu />
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
