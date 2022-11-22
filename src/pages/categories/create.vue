<script setup lang="ts">
import {
  Form as AForm,
  FormItem,
  Input as AInput,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

import { ICategoryCreate } from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'

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

  <AForm
    name="basic"
    ref="formRef"
    v-bind="$attrs"
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    @finish="onFinish"
  >
    <Row>
      <Col :span="24" :xl="12">
        <FormItem
          label="Tên loại"
          name="name"
          :rules="[{ required: true, message: 'Tên loại là trường bắt buộc' }]"
        >
          <AInput v-model:value="formState.name" />
        </FormItem>

        <FormItem
          label="Mã loại"
          name="code"
          :rules="[{ required: true, message: 'Mã loại là trường bắt buộc' }]"
        >
          <AInput v-model:value="formState.code" />
        </FormItem>

        <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
          <AButton
            type="primary"
            html-type="submit"
            style="margin-right: 10px; margin-bottom: 10px"
          >
            Tạo loại nhà đất
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
  title: Thêm loại nhà đất mới
  requireAuth: true
  permissions: [0, 1]
</route>
