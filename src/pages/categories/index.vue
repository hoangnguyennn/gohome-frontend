<script setup lang="ts">
import { Table, Divider, Modal, Button, Row } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { ICategory } from '../../interfaces'
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Actions',
    key: 'actions'
  }
])

const itemWillDelete = ref<ICategory | null>(null)
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
  <Row justify="space-between" align="middle" style="margin-bottom: 50px">
    <h2 style="margin: 0">Loại nhà đất</h2>
    <router-link to="/categories/create">
      <Button type="primary">Thêm loại nhà đất mới</Button>
    </router-link>
  </Row>

  <Table :columns="columns" :data-source="categories">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">View</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Edit</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Delete</a>
      </Row>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteCategory"
    title="Delete a category?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>
