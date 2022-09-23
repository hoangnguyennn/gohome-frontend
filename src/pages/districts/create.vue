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
import { IDistrictCreate } from '~/interfaces'

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
  await districtStore.createDistrict(values as IDistrictCreate)
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
      <Col span="12">
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

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">Tạo quận huyện</Button>
          <Button style="margin-left: 10px" @click="resetForm">
            Xóa tất cả
          </Button>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
  </Form>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Thêm quận, huyện mới
</route>
