<script lang="ts">
export default {
  name: 'UserEditPage'
}
</script>

<script setup lang="ts">
import {
  PageHeader,
  Row,
  Col,
  Form as AForm,
  FormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption,
  Button as AButton
} from 'ant-design-vue'
import { USER_TYPES } from '~/constants'
import { IUser, Nullable } from '~/interfaces'
import { useUserStore } from '~/store/stores/userStore'

interface IFormState {
  fullName: string
  type: number
}

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const formState = ref<IFormState>({
  fullName: '',
  type: 0
})

const id = computed(() => {
  return route.params.id as string
})

const user = ref<Nullable<IUser>>(null)

const onFinish = async (values: IFormState) => {
  console.log('edit user', { values })
}

const resetForm = () => {
  setFormState(user.value as IUser)
}

const setFormState = (user: IUser) => {
  formState.value = {
    fullName: user.fullName || '',
    type: user.type
  }
}

watch(user, (newValue: Nullable<IUser>) => {
  if (newValue) {
    setFormState(newValue)
  }
})

onMounted(async () => {
  try {
    const response = await userStore.getUserById(id.value)
    user.value = response.data.data
  } catch {
    router.push('/users')
  }
})
</script>

<template>
  <PageHeader
    title="Chỉnh sửa người dùng"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
    :model="formState"
    @finish="onFinish"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tên đăng nhập">
          <div>{{ user?.username }}</div>
        </FormItem>

        <FormItem label="Họ và tên">
          <AInput v-model:value="formState.fullName" />
        </FormItem>

        <FormItem label="Loại tài khoản">
          <ASelect v-model:value="formState.type">
            <SelectOption
              v-for="userType of USER_TYPES"
              :key="userType.value"
              :value="userType.value"
            >
              {{ userType.title }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Cập nhật người dùng
          </AButton>
          <AButton @click="resetForm">Xóa tất cả</AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chỉnh sửa người dùng
  requireAuth: true
  permissions: [0, 1]
</route>
