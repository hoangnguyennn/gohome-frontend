<script setup lang="ts">
import {
  FormItem,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'

import { useWardStore } from '~/store/stores/wardStore'
import { IWard, Nullable } from '~/interfaces'

interface IFormState {
  name: string
  type: string
  districtId: string
}

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
  <PageHeader title="Chi tiết xã phường" @back="router.back"></PageHeader>

  <Row v-bind="$attrs">
    <Col :span="24" :xl="12">
      <FormItem
        label="Tên"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <div>{{ ward?.name }}</div>
      </FormItem>
      <FormItem
        label="Loại"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <div>{{ ward?.type }}</div>
      </FormItem>

      <FormItem
        label="Quận huyện"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <router-link :to="`/districts/${ward?.district?.id}/view`">
          {{ ward?.district?.name }}
        </router-link>
      </FormItem>

      <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
        <AButton type="primary" style="margin-right: 10px; margin-bottom: 10px">
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
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
