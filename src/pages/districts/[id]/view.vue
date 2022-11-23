<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'

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
    district.value = response.data.data
  } catch {
    router.push('/districts')
  }
})
</script>

<template>
  <PageHeader
    title="Chi tiết quận, huyện"
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
          <div>{{ district?.name }}</div>
        </FormItem>

        <FormItem label="Loại">
          <div>{{ district?.type }}</div>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            <router-link :to="`/districts/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </AButton>
          <AButton>
            <router-link to="/districts">Quay lại</router-link>
          </AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết quận, huyện
  requireAuth: true
  permissions: [0, 1]
</route>
