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
  PageHeader
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { IFormConfirmState, IWard } from '~/interfaces'
import { useWardStore } from '~/store/stores/wardStore'

const wardStore = useWardStore()
const { wards } = storeToRefs(wardStore)

const isLoading = ref(false)

const columns = ref<ColumnType<IWard>[]>([
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
])

const itemDelete = ref<IFormConfirmState<IWard>>({
  value: null,
  isOpen: false
})

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

const getWards = async () => {
  try {
    isLoading.value = true
    await wardStore.getWards()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => getWards())
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

  <ATable :columns="columns" :data-source="wards" :loading="isLoading">
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
