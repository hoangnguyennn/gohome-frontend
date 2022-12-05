<script lang="ts">
export default {
  name: 'DistrictListPage'
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
  Select as ASelect,
  Table as ATable
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { LocationQueryRaw } from 'vue-router'
import { DISTRICT_TYPES } from '~/constants'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  IDataListFilter,
  IDistrict,
  IFormConfirmState,
  ISelectOption,
  Nullable
} from '~/interfaces'
import { DistrictTypes } from '~/interfaces/enums'
import { useDistrictStore } from '~/store/stores/districtStore'
import { isSearchChanged } from '~/utils/common'
import { removeUndefined } from '~/utils/formatter'

interface IFormSearch {
  name?: Nullable<string>
  type?: Nullable<string>
}

interface ISearchOptions extends IFormSearch, IDataListFilter {}

const districtStore = useDistrictStore()
const route = useRoute()
const { districts } = storeToRefs(districtStore)

const {
  sortBy,
  sortDirection,
  pagination,
  dataListSearchOptions,
  initFromQuery: initDataListSearchFromQuery,
  onChange,
  pushRoute
} = useDataListSearch()

const isLoading = ref(false)

const columns: ColumnType<IDistrict>[] = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
]

const columnsComputed = computed<ColumnType<IDistrict>[]>(() => {
  return columns.map((column) => {
    if (column.key === sortBy.value) {
      return {
        ...column,
        sortOrder: sortDirection.value
      } as ColumnType<IDistrict>
    }

    return column
  })
})

const districtTypes: ISelectOption<DistrictTypes>[] = DISTRICT_TYPES.map(
  ({ value, title }) => ({
    value,
    label: title
  })
)

const itemDelete = ref<IFormConfirmState<IDistrict>>({
  value: null,
  isOpen: false
})

const searchOptions = computed(() => {
  const params: ISearchOptions = { ...dataListSearchOptions.value }
  const query = route.query

  if (query.name) {
    params.name = query.name as string
  }

  if (query.type) {
    params.type = query.type as string
  }

  return params
})

const formSearch = ref<IFormSearch>({
  name: '',
  type: ''
})

const formRef = ref<FormInstance>()

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const { name, type } = route.query
  formSearch.value = {
    name: name as string,
    type: type as string
  }
}

const resetFormSearch = () => {
  formRef.value?.resetFields()
  onFinish(formRef.value?.getFieldsValue() as IFormSearch)
}

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/districts/${id}/${action}`
}

const onClickDelete = (item: IDistrict) => {
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
    type: values.type ?? undefined
  }

  if (isSearchChanged(removeUndefined(query), route.query)) {
    query.offset = undefined
  }

  pushRoute(removeUndefined(query))
}

const getDistricts = async () => {
  try {
    isLoading.value = true
    await districtStore.getDistricts(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

const filterOption = (input: string, option: ISelectOption<string>) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  initFromQuery()
  getDistricts()
})

onBeforeUnmount(() => {
  districtStore.reset()
})

watch(route, () => {
  initDataListSearchFromQuery()
  getDistricts()
})
</script>

<template>
  <PageHeader
    title="Quận huyện"
    backIcon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <RouterLink to="/districts/create">
        <AButton type="primary">Thêm quận, huyện mới</AButton>
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
        <FormItem label="Tên" name="name">
          <AInput v-model:value="formSearch.name" allowClear />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Loại" name="type">
          <ASelect
            v-model:value="formSearch.type"
            allowClear
            showSearch
            :options="districtTypes"
            :filterOption="filterOption"
          />
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
    :dataSource="districts"
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
    title="Xóa quận huyện?"
    @ok="onDelete"
  >
    Bạn có muốn xóa quận huyện "{{ itemDelete.value?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách quận huyện
  requireAuth: true
  permissions: [0, 1]
</route>
