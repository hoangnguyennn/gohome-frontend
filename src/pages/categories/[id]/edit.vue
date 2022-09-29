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

import { ICategory, ICategoryCreate, Nullable } from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'

interface IFormState {
  name: string
  code: string
}

const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string
const category = ref<Nullable<ICategory>>(null)

const formState = ref<IFormState>({
  name: '',
  code: ''
})

const formRef = ref<FormInstance>()

const onFinish = async (values: IFormState) => {
  await categoryStore.updateCategoryById(id, values as ICategoryCreate)
  router.push('/categories')
}

const resetForm = () => {
  setFormState(category.value as ICategory)
}

const setFormState = (category: ICategory) => {
  formState.value = {
    name: category.name,
    code: category.code
  }
}

watch(category, (newValue: Nullable<ICategory>) => {
  if (newValue) {
    setFormState(newValue)
  }
})

onMounted(async () => {
  try {
    const response = await categoryStore.getCategoryById(id)
    category.value = response.data.category
  } catch {
    router.push('/categories')
  }
})
</script>

<template>
  <PageHeader title="Chỉnh sửa loại nhà đất" @back="router.back"></PageHeader>

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
          <Button type="primary" html-type="submit">
            Cập nhật loại nhà đất
          </Button>
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
  title: Chỉnh sửa loại nhà đất
  requireAuth: true
</route>
