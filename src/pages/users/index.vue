<script setup lang="ts">
import {
  Table,
  Divider,
  Modal,
  Tag,
  Row,
  PageHeader,
  message
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { IUser, IFormConfirmState } from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'
import { useAuthStore } from '~/store/stores/authStore'
import { useUserStore } from '~/store/stores/userStore'
import { isAdmin } from '~/utils/common'
import {
  getUserTypeText,
  getUserTypeColor,
  getUserVerifyStatusColor,
  getUserVerifyStatusText
} from '~/utils/formatter'

const authStore = useAuthStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(authStore)
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

const itemVerify = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/users/${id}/${action}`
}

const isVerifiable = (item: IUser) => {
  return !item.isVerified && isAdmin(currentUser.value?.type as UserTypes)
}

const onClickDelete = (item: IUser) => {
  itemDelete.value = {
    value: item,
    isOpen: true
  }
}

const onClickVerify = (item: IUser) => {
  itemVerify.value = {
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

const onVerify = async () => {
  if (itemVerify.value.value) {
    try {
      await userStore.verifyUser(itemVerify.value.value.id)
      message.success('Xác thực người dùng thành công')

      getUsers()
    } finally {
      itemVerify.value = {
        value: null,
        isOpen: false
      }
    }
  }
}

const getUsers = async () => {
  try {
    isLoading.value = true
    await userStore.getUsers()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => getUsers())
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
        <template v-if="isVerifiable(record)">
          <Divider type="vertical" />
          <a @click.prevent="onClickVerify(record)">Xác thực</a>
        </template>
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
  <Modal
    v-model:visible="itemVerify.isOpen"
    title="Xác thực người dùng?"
    @ok="onVerify"
  >
    Bạn có muốn xác thực người dùng "{{
      itemVerify.value?.fullName || itemVerify.value?.username
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
