<script lang="ts">
export default {
  name: 'WardListPage'
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
import { WARD_TYPES } from '~/constants'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  IDataListFilter,
  IFormConfirmState,
  ISelectOption,
  IWard,
  Nullable
} from '~/interfaces'
import { WardTypes } from '~/interfaces/enums'
import { useWardStore } from '~/store/stores/wardStore'
import { isSearchChanged } from '~/utils/common'
import { removeUndefined } from '~/utils/formatter'

interface IFormSearch {
  name?: Nullable<string>
  type?: Nullable<string>
  districtId?: Nullable<string>
}

interface ISearchOptions extends IFormSearch, IDataListFilter {}

const wardStore = useWardStore()
const route = useRoute()
const { districts, wards } = storeToRefs(wardStore)

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

const columns: ColumnType<IWard>[] = [
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
    title: 'Quận huyện',
    dataIndex: 'district',
    key: 'district',
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Hành động',
    key: 'actions'
  }
]

const columnsComputed = computed<ColumnType<IWard>[]>(() => {
  return columns.map((column) => {
    if (column.key === sortBy.value) {
      return {
        ...column,
        sortOrder: sortDirection.value
      } as ColumnType<IWard>
    }

    return column
  })
})

const wardTypes: ISelectOption<WardTypes>[] = WARD_TYPES.map(
  ({ value, title }) => ({ value, label: title })
)

const districtOptions = computed<ISelectOption<string>[]>(() => {
  return districts.value.map((district) => ({
    value: district.id,
    label: `${district.type} ${district.name}`
  }))
})

const itemDelete = ref<IFormConfirmState<IWard>>({
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

  if (query.districtId) {
    params.districtId = query.districtId as string
  }

  return params
})

const formSearch = ref<IFormSearch>({
  name: '',
  type: '',
  districtId: null
})

const formRef = ref<FormInstance>()

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const { name, type, districtId } = route.query
  formSearch.value = {
    name: name as string,
    type: type as string,
    districtId: districtId as string
  }
}

const resetFormSearch = () => {
  formRef.value?.resetFields()
  onFinish(formRef.value?.getFieldsValue() as IFormSearch)
}

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/wards/${id}/${action}`
}

const onClickDelete = (item: IWard) => {
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
    type: values.type ?? undefined,
    districtId: values.districtId ?? undefined
  }

  if (isSearchChanged(removeUndefined(query), route.query)) {
    query.offset = undefined
  }

  pushRoute(removeUndefined(query))
}

const getWards = async () => {
  try {
    isLoading.value = true
    await wardStore.getWards(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

const filterOption = (input: string, option: ISelectOption<string>) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  initFromQuery()
  getWards()
  wardStore.getDistricts()
})

onBeforeUnmount(() => {
  wardStore.reset()
})

watch(route, () => {
  initDataListSearchFromQuery()
  getWards()
})
</script>

<template>
  <PageHeader
    title="Xã phường"
    backIcon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <RouterLink to="/wards/create">
        <AButton type="primary">Thêm xã phường mới</AButton>
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
            :options="wardTypes"
            :filterOption="filterOption"
          />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Quận huyện" name="districtId">
          <ASelect
            v-model:value="formSearch.districtId"
            allowClear
            showSearch
            :options="districtOptions"
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
    :dataSource="wards"
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
      <template v-else-if="column.key === 'district'">
        <RouterLink :to="`/districts/${record.district.id}/view`">
          {{ record.district.name }}
        </RouterLink>
      </template>
    </template>
  </ATable>

  <Modal
    v-model:visible="itemDelete.isOpen"
    title="Xóa xã phường?"
    @ok="onDelete"
  >
    Bạn có muốn xóa xã phường "{{ itemDelete.value?.name }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách xã phường
  requireAuth: true
  permissions: [0, 1]
</route>
