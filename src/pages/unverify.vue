<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { useAuthStore } from '~/store/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const onLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="unverify-page">
    <div class="unverify-box">
      <p>
        Tài khoản của bạn chưa được xác thực, vui lòng liên hệ quản trị viên để
        biết thêm chi tiết
      </p>
      <Button type="primary" @click="onLogout">Đăng xuất</Button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

<style scoped lang="scss">
.unverify-page {
  background-image: linear-gradient(
    to right top,
    #051937,
    #004d7a,
    #008793,
    #00bf72,
    #a8eb12
  );

  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .unverify-box {
    width: 400px;
    padding: 20px;
    background-color: #fff;
    text-align: center;

    .actions {
      text-align: center;
      margin-bottom: 0;
    }
  }
}
</style>
