<script setup lang="ts">
import { Form, FormItem, Input, InputPassword, Button } from 'ant-design-vue'
import { Rule } from 'ant-design-vue/lib/form'
import { useAuthStore } from '~/store/stores/authStore'
import { isValidPassword } from '~/utils/common'

interface IRegisterFormState {
  username: string
  password: string
  confirmPassword: string
}

const authStore = useAuthStore()
const router = useRouter()

const formState = ref<IRegisterFormState>({
  username: '',
  password: '',
  confirmPassword: ''
})

const usernameValidator = (rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập tên tài khoản')
  }

  return Promise.resolve()
}

const passwordValidator = (rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập mật khẩu')
  }

  if (!isValidPassword(value)) {
    return Promise.reject(
      'Mật khẩu phải có tối thiểu 8 ký tự và bao gồm chữ hoa, chữ thường và số'
    )
  }

  return Promise.resolve()
}

const confirmPasswordValidator = (rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập lại mật khẩu')
  }

  if (value !== formState.value.password) {
    return Promise.reject('Mật khẩu không trùng khớp')
  }

  return Promise.resolve()
}

const rules: Record<keyof IRegisterFormState, Rule[]> = {
  username: [{ validator: usernameValidator }],
  password: [{ validator: passwordValidator }],
  confirmPassword: [{ validator: confirmPasswordValidator }]
}

const onRegister = async (values: IRegisterFormState) => {
  await authStore.register(values.username, values.password)
  await authStore.getCurrentUser()
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <Form
      :model="formState"
      name="register-form"
      autocomplete="off"
      class="register-form"
      :rules="rules"
      @finish="onRegister"
    >
      <FormItem name="username">
        <Input
          v-model:value="formState.username"
          placeholder="Tên tài khoản (*)"
        />
      </FormItem>
      <FormItem name="password">
        <InputPassword
          v-model:value="formState.password"
          placeholder="Mật khẩu (*)"
        />
      </FormItem>
      <FormItem name="confirmPassword">
        <InputPassword
          v-model:value="formState.confirmPassword"
          placeholder="Nhập lại mật khẩu (*)"
        />
      </FormItem>
      <FormItem>
        <Button block type="primary" html-type="submit">Đăng ký</Button>
      </FormItem>
      <p class="actions">
        Đã có tài khoản?
        <router-link to="/login">Đăng nhập</router-link>
      </p>
    </Form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
  title: Đăng ký
</route>

<style scoped lang="scss">
.register-page {
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

  .register-form {
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
