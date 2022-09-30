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

const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string
const category = ref<Nullable<ICategory>>(null)

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
  <PageHeader title="Chi tiết loại nhà đất" @back="router.back"></PageHeader>

  <div>
    <Row>
      <Col span="12">
        <FormItem
          label="Tên loại"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ category?.name }}</div>
        </FormItem>

        <FormItem
          label="Mã loại"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div>{{ category?.code }}</div>
        </FormItem>
      </Col>
      <Col span="12"></Col>
    </Row>
    <Row>
      <Col span="12">
        <FormItem :wrapper-col="{ offset: 8, span: 16 }">
          <Button type="primary">
            <router-link :to="`/categories/${id}/edit`">
              Đi tới trang chỉnh sửa
            </router-link>
          </Button>
          <Button style="margin-left: 10px">
            <router-link to="/categories">Quay lại</router-link>
          </Button>
        </FormItem>
      </Col>
    </Row>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết loại nhà đất
  requireAuth: true
  permissions: [0, 1]
</route>
