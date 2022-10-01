<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { ICategory, IFormConfirmState } from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const isLoading = ref(false)

const columns = ref<ColumnType<ICategory>[]>([
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên loại',
    dataIndex: 'name',
    key: 'name',
    sorter: {
      compare: (a, b) => {
        if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Mã loại',
    dataIndex: 'code',
    key: 'code',
    sorter: {
      compare: (a, b) => {
        if (a.code > b.code) {
          return 1
        } else if (a.code < b.code) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
])

const itemDelete = ref<IFormConfirmState<ICategory>>({
  value: null,
  isOpen: false
})

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/categories/${id}/${action}`
}

const onClickDelete = (item: ICategory) => {
  itemDelete.value = {
    value: item,
    isOpen: true
  }
}

const onDelete = async () => {
  itemDelete.value = {
    value: null,
    isOpen: false
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    await categoryStore.getCategories()
  } catch {}

  isLoading.value = false
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

  <Table :columns="columns" :data-source="categories" :loading="isLoading">
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
    v-model:visible="itemDelete.isOpen"
    title="Xóa loại nhà đất?"
    @ok="onDelete"
  >
    Bạn có muốn xóa loại nhà đất "{{ itemDelete.value?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách loại nhà đất
  requireAuth: true
  permissions: [0, 1]
</route>
