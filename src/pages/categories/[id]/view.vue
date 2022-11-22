<script setup lang="ts">
import {
  FormItem,
  Row,
  Col,
  Button as AButton,
  PageHeader
} from 'ant-design-vue'

import { ICategory, Nullable } from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'

const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const id = route.params.id as string
const category = ref<Nullable<ICategory>>(null)

onMounted(async () => {
  try {
    const response = await categoryStore.getCategoryById(id)
    category.value = response.data.data
  } catch {
    router.push('/categories')
  }
})
</script>

<template>
  <PageHeader title="Chi tiết loại nhà đất" @back="router.back"></PageHeader>

  <Row v-bind="$attrs">
    <Col :span="24" :lg="12">
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

      <FormItem :wrapper-col="{ span: 24, xl: { offset: 8, span: 16 } }">
        <AButton type="primary" style="margin-right: 10px; margin-bottom: 10px">
          <router-link :to="`/categories/${id}/edit`">
            Đi tới trang chỉnh sửa
          </router-link>
        </AButton>
        <AButton>
          <router-link to="/categories">Quay lại</router-link>
        </AButton>
      </FormItem>
    </Col>
  </Row>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết loại nhà đất
  requireAuth: true
  permissions: [0, 1]
</route>
