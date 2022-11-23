<script lang="ts">
export default {
  name: 'CategoryDetailPage'
}
</script>

<script setup lang="ts">
import {
  Form as AForm,
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
  <PageHeader
    title="Chi tiết loại nhà đất"
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
        <FormItem label="Tên loại">
          <div>{{ category?.name }}</div>
        </FormItem>

        <FormItem label="Mã loại">
          <div>{{ category?.code }}</div>
        </FormItem>

        <FormItem>
          <AButton
            type="primary"
            style="margin-right: 10px; margin-bottom: 10px"
          >
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
  </AForm>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Chi tiết loại nhà đất
  requireAuth: true
  permissions: [0, 1]
</route>
