<script lang="ts">
export default {
  name: 'CategoryListPage'
}
</script>

<script setup lang="ts">
import {
  Table as ATable,
  Divider,
  Modal,
  Button as AButton,
  Row,
  PageHeader
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import useDataListSearch from '~/hooks/useDataListSearch'
import { ICategory, IFormConfirmState } from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'

const categoryStore = useCategoryStore()
const route = useRoute()
const { categories } = storeToRefs(categoryStore)

const {
  sortBy,
  sortDirection,
  dataListSearchOptions,
  pagination,
  initFromQuery,
  onChange
} = useDataListSearch()

const isLoading = ref(false)

const columns: ColumnType<ICategory>[] = [
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
]

const columnsComputed = computed<ColumnType<ICategory>[]>(() => {
  return columns.map((column) => {
    if (column.key === sortBy.value) {
      return {
        ...column,
        sortOrder: sortDirection.value
      } as ColumnType<ICategory>
    }

    return column
  })
})

const itemDelete = ref<IFormConfirmState<ICategory>>({
  value: null,
  isOpen: false
})

const searchOptions = computed(() => {
  return dataListSearchOptions.value
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

const getCategories = async () => {
  try {
    isLoading.value = true
    await categoryStore.getCategories(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initFromQuery()
  getCategories()
})

onBeforeUnmount(() => {
  categoryStore.reset()
})

watch(route, () => getCategories())
</script>

<template>
  <PageHeader
    title="Loại nhà đất"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/categories/create">
        <AButton type="primary">Thêm loại nhà đất mới</AButton>
      </router-link>
    </template>
  </PageHeader>

  <ATable
    :columns="columnsComputed"
    :data-source="categories"
    :loading="isLoading"
    :pagination="pagination"
    @change="onChange"
  >
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
    </template>
  </ATable>

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
