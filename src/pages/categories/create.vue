<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  Row,
  Col,
  Button,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { ICategoryCreate } from '../../interfaces'
import { useCategoryStore } from '../../store/stores/categoryStore'

interface IFormState {
  name: string
  code: string
}

const categoryStore = useCategoryStore()
const router = useRouter()

const formState = ref<IFormState>({
  name: '',
  code: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await categoryStore.createCategory(values as ICategoryCreate)
  router.push('/categories')
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<template>
  <PageHeader title="Thêm loại nhà đất mới" @back="router.back"></PageHeader>

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
          label="Tên loại"
          name="name"
          :rules="[{ required: true, message: 'Tên loại là trường bắt buộc' }]"
        >
          <Input v-model:value="formState.name" />
        </FormItem>

        <FormItem
          label="Mã loại"
          name="code"
          :rules="[{ required: true, message: 'Mã loại là trường bắt buộc' }]"
        >
          <Input v-model:value="formState.code" />
        </FormItem>

        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary" html-type="submit">Tạo loại nhà đất</Button>
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
  title: Thêm loại nhà đất mới
</route>
