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
  <PageHeader title="Chỉnh sửa người dùng" @back="router.back"></PageHeader>

  <AForm
    name="basic"
    ref="formRef"
    v-bind="$attrs"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên đăng nhập"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ user?.username }}</div>
        </FormItem>

        <FormItem
          label="Họ và tên"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <AInput v-model:value="formState.fullName" />
        </FormItem>

        <FormItem
          label="Loại tài khoản"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
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

        <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Cập nhật loại nhà đất
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
