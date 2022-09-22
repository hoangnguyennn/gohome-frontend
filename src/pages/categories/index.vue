<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { ICategory, Nullable } from '../../interfaces'
import { useCategoryStore } from '../../store/stores/categoryStore'

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

const columns = ref([
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên loại',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Mã loại',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
])

const itemWillDelete = ref<Nullable<ICategory>>(null)
const isOpenConfirmDeleteCategory = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/categories/${id}/${action}`
}

const onClickDelete = (item: ICategory) => {
  itemWillDelete.value = item
  isOpenConfirmDeleteCategory.value = true
}

const onDelete = () => {
  console.log('delete')
  isOpenConfirmDeleteCategory.value = false
}

onMounted(() => {
  categoryStore.getCategories()
})
</script>

<template>
  <PageHeader
    title="Loại nhà đất"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/categories/create">
        <Button type="primary">Thêm loại nhà đất mới</Button>
      </router-link>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="categories">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteCategory"
    title="Xóa loại nhà đất?"
    @ok="onDelete"
  >
    Bạn có chắc chắn muốn xóa loại nhà đất "{{ itemWillDelete?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách loại nhà đất
</route>
