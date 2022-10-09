<script setup lang="ts">
import {
  PageHeader,
  Tag,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Button
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
    user.value = response.data.user
  } catch {
    router.push('/users')
  }
})
</script>

<template>
  <PageHeader title="Chỉnh sửa người dùng" @back="router.back"></PageHeader>

  <Form
    name="basic"
    ref="formRef"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
      <Col span="12">
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
          <Input v-model:value="formState.fullName" />
        </FormItem>

        <FormItem
          label="Loại tài khoản"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <Select v-model:value="formState.type">
            <SelectOption
              v-for="userType of USER_TYPES"
              :key="userType.value"
              :value="userType.value"
            >
              {{ userType.title }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">
            Cập nhật loại nhà đất
          </Button>
          <Button style="margin-left: 10px" @click="resetForm">
            Xóa tất cả
          </Button>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
  </Form>
</template>
