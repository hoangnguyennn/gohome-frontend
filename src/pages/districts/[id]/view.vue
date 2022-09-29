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

import { DISTRICT_TYPES } from '~/constants'
import { useDistrictStore } from '~/store/stores/districtStore'
import { IDistrict, Nullable } from '~/interfaces'

const districtStore = useDistrictStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const district = ref<Nullable<IDistrict>>(null)

onMounted(async () => {
  try {
    const response = await districtStore.getDistrictById(id)
    district.value = response.data.district
  } catch {
    router.push('/districts')
  }
})
</script>

<template>
  <PageHeader title="Chỉnh sửa quận, huyện" @back="router.back"></PageHeader>

  <div>
    <Row>
      <Col span="12">
        <FormItem
          label="Tên"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ district?.name }}</div>
        </FormItem>
        <FormItem
          label="Loại"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ district?.type }}</div>
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary">
            <router-link :to="`/districts/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </Button>
          <Button style="margin-left: 10px">
            <router-link to="/districts">Quay lại</router-link>
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
  title: Chỉnh sửa quận, huyện
  requireAuth: true
</route>
