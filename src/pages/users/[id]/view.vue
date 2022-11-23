<script setup lang="ts">
import {
  Form as AForm,
  PageHeader,
  Tag,
  Row,
  Col,
  FormItem,
  Button as AButton
} from 'ant-design-vue'
import { IUser, Nullable } from '~/interfaces'
import { useUserStore } from '~/store/stores/userStore'
import {
  getUserTypeColor,
  getUserTypeText,
  getUserVerifyStatusColor,
  getUserVerifyStatusText
} from '~/utils/formatter'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const id = computed(() => {
  return route.params.id as string
})

const user = ref<Nullable<IUser>>(null)

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
    title="Chi tiết người dùng"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  >
    <template #extra>
      <Tag :color="getUserVerifyStatusColor(user?.isVerified)">
        {{ getUserVerifyStatusText(user?.isVerified) }}
      </Tag>
    </template>
  </PageHeader>

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tên đăng nhập">
          <div>{{ user?.username }}</div>
        </FormItem>

        <FormItem label="Họ và tên">
          <div>{{ user?.fullName || '(Rỗng)' }}</div>
        </FormItem>

        <FormItem label="Loại tài khoản">
          <Tag :color="getUserTypeColor(user?.type)">
            {{ getUserTypeText(user?.type) }}
          </Tag>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            <router-link :to="`/users/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </AButton>
          <AButton>
            <router-link to="/users">Quay lại</router-link>
          </AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết người dùng
  requireAuth: true
  permissions: [0, 1]
</route>
