<script setup lang="ts">
import { Form, FormItem, Input, InputPassword, Button } from 'ant-design-vue'
import { useAuthStore } from '~/store/stores/authStore'

interface ILoginFormState {
  username: string
  password: string
}

const authStore = useAuthStore()
const router = useRouter()

const formState = ref<ILoginFormState>({
  username: '',
  password: ''
})

const onLogin = async (values: ILoginFormState) => {
  console.log('login', values)
  await authStore.login(values.username, values.password)
  await authStore.getCurrentUser()
  router.push('/')
}
</script>

<template>
  <div class="login-page">
    <Form
      :model="formState"
      name="login-form"
      autocomplete="off"
      class="login-form"
      @finish="onLogin"
    >
      <FormItem
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <Input v-model:value="formState.username" />
      </FormItem>
      <FormItem
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <InputPassword v-model:value="formState.password" />
      </FormItem>
      <FormItem>
        <Button block type="primary" html-type="submit">Đăng nhập</Button>
      </FormItem>
      <p class="actions">
        Không có tài khoản?
        <router-link to="/register">Đăng ký ngay</router-link>
      </p>
    </Form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  title: Đăng nhập
</route>

<style scoped lang="scss">
.login-page {
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

  .login-form {
    width: 400px;
    padding: 20px;
    background-color: #fff;

    .actions {
      text-align: center;
      margin-bottom: 0;
    }
  }
}
</style>
