<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Row,
  Col,
  Button,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { WARD_TYPES } from '~/constants'
import { useWardStore } from '~/store/stores/wardStore'
import { IWard, IWardRequest, Nullable } from '~/interfaces'
import { useDistrictStore } from '~/store/stores/districtStore'
import { storeToRefs } from 'pinia'

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
    ward.value = response.data.ward
  } catch {
    router.push('/wards')
  }
})
</script>

<template>
  <PageHeader title="Chi tiết xã phường" @back="router.back"></PageHeader>

  <div>
    <Row>
      <Col span="12">
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

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary">
            <router-link :to="`/wards/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </Button>
          <Button style="margin-left: 10px">
            <router-link to="/wards">Quay lại</router-link>
          </Button>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
