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
  <PageHeader title="Thêm quận, huyện mới" @back="router.back"></PageHeader>

  <Form
    name="basic"
    ref="formRef"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên"
          name="name"
          :rules="[{ required: true, message: 'Tên là trường bắt buộc' }]"
        >
          <Input v-model:value="formState.name" />
        </FormItem>
        <FormItem
          label="Loại"
          name="type"
          :rules="[{ required: true, message: 'Loại là trường bắt buộc' }]"
        >
          <Select v-model:value="formState.type">
            <SelectOption
              v-for="districtType of DISTRICT_TYPES"
              :key="districtType.value"
              :value="districtType.value"
            >
              {{ districtType.title }}
            </SelectOption>
          </Select>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Tạo quận huyện
          </Button>
          <Button @click="resetForm"> Xóa tất cả </Button>
        </FormItem>
      </Col>
      <Col :span="24" :xl="12"></Col>
    </Row>
  </Form>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thêm quận, huyện mới
  requireAuth: true
  permissions: [0, 1]
</route>
