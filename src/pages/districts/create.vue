<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { DISTRICT_TYPES } from '~/constants'
import { useDistrictStore } from '~/store/stores/districtStore'
import { IDistrictRequest } from '~/interfaces'

interface IFormState {
  name: string
  type: string
}

const districtStore = useDistrictStore()
const router = useRouter()

const formState = ref<IFormState>({
  name: '',
  type: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await districtStore.createDistrict(values as IDistrictRequest)
  router.push('/districts')
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <PageHeader
    title="Thêm quận, huyện mới"
    style="padding-left: 0; padding-right: 0"
    @back="router.back"
  />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    v-bind="$attrs"
    :colon="false"
    :model="formState"
    @finish="onFinish"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên"
          name="name"
          :rules="[{ required: true, message: 'Tên là trường bắt buộc' }]"
        >
          <AInput v-model:value="formState.name" />
        </FormItem>

        <FormItem
          label="Loại"
          name="type"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
        >
          <ASelect v-model:value="formState.type">
            <SelectOption
              v-for="districtType of DISTRICT_TYPES"
              :key="districtType.value"
              :value="districtType.value"
            >
              {{ districtType.title }}
            </SelectOption>
          </ASelect>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Tạo quận huyện
          </AButton>
          <AButton @click="resetForm">Xóa tất cả</AButton>
        </FormItem>
      </Col>
    </Row>
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thêm quận, huyện mới
  requireAuth: true
  permissions: [0, 1]
</route>
