<script lang="ts">
export default {
  name: 'UserListPage'
}
</script>

<script setup lang="ts">
import {
  Table as ATable,
  Divider,
  Modal,
  Tag,
  Row,
  PageHeader,
  message
} from 'ant-design-vue'
import { ColumnType, TablePaginationConfig } from 'ant-design-vue/lib/table'
import { FilterValue, SorterResult } from 'ant-design-vue/lib/table/interface'
import { storeToRefs } from 'pinia'
import { LocationQueryRaw, RouteRecordName } from 'vue-router'
import { ITEMS_PER_PAGE_DEFAULT } from '~/constants'
import {
  IUser,
  IFormConfirmState,
  Nullable,
  IDataListFilter
} from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'
import { useAuthStore } from '~/store/stores/authStore'
import { useDataListStore } from '~/store/stores/dataListStore'
import { useUserStore } from '~/store/stores/userStore'
import { getAvatarLink, isAdmin } from '~/utils/common'
import {
  getUserTypeText,
  getUserTypeColor,
  getUserVerifyStatusColor,
  getUserVerifyStatusText
} from '~/utils/formatter'

const authStore = useAuthStore()
const userStore = useUserStore()
const dataListStore = useDataListStore()
const router = useRouter()
const route = useRoute()
const { currentUser } = storeToRefs(authStore)
const { users } = storeToRefs(userStore)
const { total, itemsPerPage, currentPage, sortBy, sortDirection } =
  storeToRefs(dataListStore)

const isLoading = ref(false)

const columns: ColumnType<IUser>[] = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar'
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
]

const columnsComputed = computed<ColumnType<IUser>[]>(() => {
  return columns.map((column) => {
    if (column.key === sortBy.value) {
      return {
        ...column,
        sortOrder: sortDirection.value
      } as ColumnType<IUser>
    }

    return column
  })
})

const itemDelete = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const itemVerify = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const pagination = computed<TablePaginationConfig>(() => {
  return {
    total: total.value,
    current: currentPage.value,
    pageSize: itemsPerPage.value
  }
})

const searchOptions = computed(() => {
  const result: IDataListFilter = {
    limit: itemsPerPage.value,
    offset: itemsPerPage.value * (currentPage.value - 1)
  }

  if (sortBy.value && sortDirection.value) {
    result.sortBy = sortBy.value
    result.sortDirection = sortDirection.value
  }

  return result
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

const onChange = (
  pagination: TablePaginationConfig,
  filter: Record<string, FilterValue | null>,
  sorter: SorterResult<IUser> | SorterResult<IUser>[]
) => {
  console.log(pagination, sorter)
  dataListStore.setCurrentPage(pagination?.current as number)
  dataListStore.setItemsPerPage(pagination?.pageSize as number)

  if (Object.keys(sorter).length) {
    const localSorter = sorter as SorterResult<IUser>
    dataListStore.setSortBy(localSorter.column?.key as Nullable<string>)
    dataListStore.setSortDirection(localSorter.order)
  } else {
    dataListStore.setSortBy(null)
    dataListStore.setSortDirection(null)
  }

  const query: LocationQueryRaw = {}

  if (itemsPerPage.value !== ITEMS_PER_PAGE_DEFAULT) {
    query.limit = itemsPerPage.value
  }

  if (currentPage.value !== 1) {
    query.offset = itemsPerPage.value * (currentPage.value - 1)
  }

  if (sortBy.value) {
    query.sortBy = sortBy.value
  }

  if (sortDirection.value) {
    query.sortDirection = sortDirection.value
  }

  pushRoute(query)
}

const pushRoute = (query?: LocationQueryRaw) => {
  router.push({ name: route.name as RouteRecordName, query })
  getUsers()
}

const getUsers = async () => {
  try {
    isLoading.value = true
    await userStore.getUsers(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  dataListStore.initFromQuery(route.query)
  getUsers()
})
</script>

<template>
  <PageHeader
    title="Người dùng"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  />

  <ATable
    :columns="columnsComputed"
    :data-source="users"
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
        <template v-if="isVerifiable(record)">
          <Divider type="vertical" />
          <a @click.prevent="onClickVerify(record)">Xác thực</a>
        </template>
      </Row>
      <template v-else-if="column.key === 'avatar'">
        <img
          v-if="record.avatar"
          :src="getAvatarLink(record.avatar)"
          alt=""
          width="100"
        />
      </template>
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
  </ATable>

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
