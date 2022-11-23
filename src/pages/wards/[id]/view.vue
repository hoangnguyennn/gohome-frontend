<script lang="ts">
export default {
  name: 'WardDetailPage'
}
</script>

<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Row,
  Col,
  Button as AButton,
  PageHeader
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
          <router-link :to="`/districts/${ward?.district?.id}/view`">
            {{ ward?.district?.name }}
          </router-link>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            <router-link :to="`/wards/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </AButton>
          <AButton>
            <router-link to="/wards">Quay lại</router-link>
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
