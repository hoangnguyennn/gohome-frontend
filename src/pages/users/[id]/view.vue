<script setup lang="ts">
import { PageHeader, Tag, Row, Col, FormItem, Button } from 'ant-design-vue'
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
    user.value = response.data.user
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

  <div>
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
      </Col>
      <Col span="12"></Col>
    </Row>

    <Row>
      <Col span="12">
        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary">
            <router-link :to="`/users/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </Button>
          <Button style="margin-left: 10px">
            <router-link to="/users">Quay lại</router-link>
          </Button>
        </FormItem>
      </Col>
    </Row>
  </div>
</template>
