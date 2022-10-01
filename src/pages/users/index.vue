<script setup lang="ts">
import { Table, Divider, Modal, Tag, Row, PageHeader } from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { IUser, IFormConfirmState } from '~/interfaces'
import { useUserStore } from '~/store/stores/userStore'
import {
  getUserTypeText,
  getUserTypeColor,
  getUserVerifyStatusColor,
  getUserVerifyStatusText
} from '~/utils/formatter'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)

const isLoading = ref(false)

const columns = ref<ColumnType<IUser>[]>([
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'username',
    key: 'username',
    sorter: {
      compare: (a, b) => {
        if (a.username > b.username) {
          return 1
        } else if (a.username < b.username) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Họ tên',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: {
      compare: (a, b) => {
        const aFullname = a.fullName || ''
        const bFullname = b.fullName || ''
        if (aFullname > bFullname) {
          return 1
        } else if (aFullname < bFullname) {
          return -1
        } else {
          return 0
        }
      }
    },
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Loại tài khoản',
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
    title: 'Xác thực',
    dataIndex: 'isVerified',
    key: 'isVerified',
    sorter: {
      compare: (a, b) => {
        if (a.isVerified > b.isVerified) {
          return 1
        } else if (a.isVerified < b.isVerified) {
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

const itemDelete = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/users/${id}/${action}`
}

const onClickDelete = (item: IUser) => {
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
    await userStore.getUsers()
  } catch {}

  isLoading.value = false
})
</script>

<template>
  <PageHeader
    title="Người dùng"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  ></PageHeader>

  <Table :columns="columns" :data-source="users" :loading="isLoading">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
      <template v-else-if="column.key === 'type'">
        <Tag :color="getUserTypeColor(record.type)">
          {{ getUserTypeText(record.type) }}
        </Tag>
      </template>
      <template v-else-if="column.key === 'isVerified'">
        <Tag :color="getUserVerifyStatusColor(record.isVerified)">
          {{ getUserVerifyStatusText(record.isVerified) }}
        </Tag>
      </template>
    </template>
  </Table>

  <Modal
    v-model:visible="itemDelete.isOpen"
    title="Xóa người dùng?"
    @ok="onDelete"
  >
    Bạn có muốn xóa người dùng "{{
      itemDelete.value?.fullName || itemDelete.value?.username
    }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách người dùng
  requireAuth: true
  permissions: [0, 1]
</route>
