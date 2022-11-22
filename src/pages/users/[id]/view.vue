<script setup lang="ts">
import {
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
  <PageHeader title="Chi tiết người dùng" @back="router.back">
    <template #extra>
      <Tag :color="getUserVerifyStatusColor(user?.isVerified)">
        {{ getUserVerifyStatusText(user?.isVerified) }}
      </Tag>
    </template>
  </PageHeader>

  <Row v-bind="$attrs">
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
        <div>{{ user?.fullName || '(Rỗng)' }}</div>
      </FormItem>

      <FormItem
        label="Loại tài khoản"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <Tag :color="getUserTypeColor(user?.type)">
          {{ getUserTypeText(user?.type) }}
        </Tag>
      </FormItem>

      <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
        <AButton type="primary" style="margin-right: 10px; margin-bottom: 10px">
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
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết người dùng
  requireAuth: true
  permissions: [0, 1]
</route>
