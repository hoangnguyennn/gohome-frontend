<script lang="ts">
export default {
  name: 'CategoryListPage'
}
</script>

<script setup lang="ts">
import {
  Button as AButton,
  Col,
  Divider,
  Form as AForm,
  FormInstance,
  FormItem,
  Input as AInput,
  Modal,
  PageHeader,
  Row,
  Table as ATable
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { LocationQueryRaw } from 'vue-router'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  ICategory,
  IDataListFilter,
  IFormConfirmState,
  Nullable
} from '~/interfaces'
import { useCategoryStore } from '~/store/stores/categoryStore'
import { isSearchChanged } from '~/utils/common'
import { removeUndefined } from '~/utils/formatter'

interface IFormSearch {
  name?: Nullable<string>
  code?: Nullable<string>
}

interface ISearchOptions extends IFormSearch, IDataListFilter {}

const categoryStore = useCategoryStore()
const route = useRoute()
const { categories } = storeToRefs(categoryStore)

const {
  sortBy,
  sortDirection,
  dataListSearchOptions,
  pagination,
  initFromQuery: initDataListSearchFromQuery,
  onChange,
  pushRoute
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
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Mã loại',
    dataIndex: 'code',
    key: 'code',
    sorter: true,
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
  const params: ISearchOptions = { ...dataListSearchOptions.value }
  const query = route.query

  if (query.name) {
    params.name = query.name as string
  }

  if (query.code) {
    params.code = query.code as string
  }

  return params
})

const formSearch = ref<IFormSearch>({
  name: '',
  code: ''
})

const formRef = ref<FormInstance>()

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const { name, code } = route.query
  formSearch.value = {
    name: name as string,
    code: code as string
  }
}

const resetFormSearch = () => {
  formRef.value?.resetFields()
  onFinish(formRef.value?.getFieldsValue() as IFormSearch)
}

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

const onFinish = async (values: IFormSearch) => {
  const query: LocationQueryRaw = {
    ...route.query,
    name: values.name ?? undefined,
    code: values.code ?? undefined
  }

  if (isSearchChanged(removeUndefined(query), route.query)) {
    query.offset = undefined
  }

  pushRoute(removeUndefined(query))
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

watch(route, () => {
  initDataListSearchFromQuery()
  getCategories()
})
</script>

<template>
  <PageHeader
    title="Loại nhà đất"
    backIcon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <RouterLink to="/categories/create">
        <AButton type="primary">Thêm loại nhà đất mới</AButton>
      </RouterLink>
    </template>
  </PageHeader>

  <Divider />

  <AForm
    name="basic"
    ref="formRef"
    layout="vertical"
    style="margin-bottom: 48px"
    :model="formSearch"
    @finish="onFinish"
  >
    <Row :gutter="24">
      <Col :span="24" :xl="6">
        <FormItem label="Tên loại" name="name">
          <AInput v-model:value="formSearch.name" allowClear />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Mã loại" name="code">
          <AInput v-model:value="formSearch.code" allowClear />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24">
        <AButton
          type="primary"
          htmlType="submit"
          style="margin-right: 10px; margin-bottom: 10px"
        >
          Tìm kiếm
        </AButton>
        <AButton @click="resetFormSearch">Xóa bộ lọc</AButton>
      </Col>
    </Row>
  </AForm>

  <Divider />

  <ATable
    :columns="columnsComputed"
    :dataSource="categories"
    :loading="isLoading"
    :pagination="pagination"
    @change="onChange"
  >
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <RouterLink :to="getLink(record.id, 'view')">Xem</RouterLink>
        <Divider type="vertical" />
        <RouterLink :to="getLink(record.id, 'edit')">Sửa</RouterLink>
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
