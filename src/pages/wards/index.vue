<script lang="ts">
export default {
  name: 'WardListPage'
}
</script>

<script setup lang="ts">
import {
  Table as ATable,
  Divider,
  Modal,
  Button as AButton,
  Row,
  Col,
  PageHeader,
  Form as AForm,
  FormItem,
  Input as AInput,
  Select as ASelect,
  SelectOption
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { LocationQueryRaw } from 'vue-router'
import { WARD_TYPES } from '~/constants'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  IDataListFilter,
  IFormConfirmState,
  IWard,
  Nullable
} from '~/interfaces'
import { useWardStore } from '~/store/stores/wardStore'
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
    sorter: {
      compare: (a, b) => {
        if (a.type > b.type) {
          return 1
        } else if (a.type < b.type) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    sorter: {
      compare: (a, b) => {
        if (a.type > b.type) {
          return 1
        } else if (a.type < b.type) {
          return -1
        } else {
          return 0
        }
      }
    }
  },
  {
    title: 'Quận huyện',
    dataIndex: 'district',
    key: 'district',
    sorter: {
      compare: (a, b) => {
        const aDistrictName = a.district?.name || ''
        const bDistrictName = b.district?.name || ''
        if (aDistrictName > bDistrictName) {
          return 1
        } else if (aDistrictName < bDistrictName) {
          return -1
        } else {
          return 0
        }
      }
    }
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

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const { name, type, districtId } = route.query
  formSearch.value = {
    name: name as string,
    type: type as string,
    districtId: districtId as string
  }
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
    name: values.name || undefined,
    type: values.type || undefined,
    districtId: values.districtId ?? undefined
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

onMounted(() => {
  initFromQuery()
  getWards()
  wardStore.getDistricts()
})

onBeforeUnmount(() => {
  wardStore.reset()
})

watch(route, getWards)
</script>

<template>
  <PageHeader
    title="Xã phường"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/wards/create">
        <AButton type="primary">Thêm xã phường mới</AButton>
      </router-link>
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
          <ASelect v-model:value="formSearch.type" allowClear>
            <SelectOption
              v-for="wardType of WARD_TYPES"
              :key="wardType.value"
              :value="wardType.value"
            >
              {{ wardType.title }}
            </SelectOption>
          </ASelect>
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Quận huyện" name="districtId">
          <ASelect v-model:value="formSearch.districtId" allowClear>
            <SelectOption
              v-for="district of districts"
              :key="district.id"
              :value="district.id"
            >
              {{ district.type }} {{ district.name }}
            </SelectOption>
          </ASelect>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="24">
        <AButton type="primary" html-type="submit">Tìm kiếm</AButton>
      </Col>
    </Row>
  </AForm>

  <Divider />

  <ATable
    :columns="columnsComputed"
    :data-source="wards"
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
      <template v-else-if="column.key === 'district'">
        <router-link :to="`/districts/${record.district.id}/view`">
          {{ record.district.name }}
        </router-link>
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
