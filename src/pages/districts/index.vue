<script lang="ts">
export default {
  name: 'DistrictListPage'
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
import { IDistrict, IFormConfirmState } from '~/interfaces'
import { useDistrictStore } from '~/store/stores/districtStore'

const districtStore = useDistrictStore()
const route = useRoute()
const { districts } = storeToRefs(districtStore)

const {
  sortBy,
  sortDirection,
  pagination,
  dataListSearchOptions,
  initFromQuery,
  onChange
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
    },
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

const itemDelete = ref<IFormConfirmState<IDistrict>>({
  value: null,
  isOpen: false
})

const searchOptions = computed(() => {
  return dataListSearchOptions.value
})

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

const getDistricts = async () => {
  try {
    isLoading.value = true
    await districtStore.getDistricts(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initFromQuery()
  getDistricts()
})

onBeforeUnmount(() => {
  districtStore.reset()
})

watch(route, () => getDistricts())
</script>

<template>
  <PageHeader
    title="Quận huyện"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/districts/create">
        <AButton type="primary">Thêm quận, huyện mới</AButton>
      </router-link>
    </template>
  </PageHeader>

  <ATable
    :columns="columnsComputed"
    :data-source="districts"
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
