<script lang="ts">
export default {
  name: 'WardDetailPage'
}
</script>

<script setup lang="ts">
import {
  Button as AButton,
  Col,
  Form as AForm,
  FormItem,
  PageHeader,
  Row
} from 'ant-design-vue'

import { useWardStore } from '~/store/stores/wardStore'
import { IWard, Nullable } from '~/interfaces'

const wardStore = useWardStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const ward = ref<Nullable<IWard>>(null)

onMounted(async () => {
  try {
    const response = await wardStore.getWardById(id)
    ward.value = response.data.data
  } catch {
    router.push('/wards')
  }
})
</script>

<template>
  <PageHeader
    title="Chi tiết xã phường"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem label="Tên">
          <div>{{ ward?.name }}</div>
        </FormItem>

        <FormItem label="Loại">
          <div>{{ ward?.type }}</div>
        </FormItem>

        <FormItem label="Quận huyện">
          <RouterLink :to="`/districts/${ward?.district?.id}/view`">
            {{ ward?.district?.name }}
          </RouterLink>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            <RouterLink :to="`/wards/${id}/edit`">
              Đi tới trang chỉnh sửa
            </RouterLink>
          </AButton>
          <AButton>
            <RouterLink to="/wards">Quay lại</RouterLink>
          </AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
