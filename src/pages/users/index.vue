<script lang="ts">
export default {
  name: 'UserListPage'
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
  message,
  Modal,
  PageHeader,
  Row,
  Select as ASelect,
  Table as ATable,
  Tag
} from 'ant-design-vue'
import { ColumnType } from 'ant-design-vue/lib/table'
import { storeToRefs } from 'pinia'
import { LocationQueryRaw } from 'vue-router'
import { USER_TYPES, USER_VERIFY_STATUSES } from '~/constants'
import useDataListSearch from '~/hooks/useDataListSearch'
import {
  IUser,
  IFormConfirmState,
  Nullable,
  IDataListFilter,
  ISelectOption
} from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'
import { useAuthStore } from '~/store/stores/authStore'
import { useUserStore } from '~/store/stores/userStore'
import { getAvatarLink, isAdmin, isSearchChanged } from '~/utils/common'
import {
  getUserTypeText,
  getUserTypeColor,
  getUserVerifyStatusColor,
  getUserVerifyStatusText,
  removeUndefined
} from '~/utils/formatter'

interface IFormSearch {
  username?: Nullable<string>
  fullName?: Nullable<string>
  type?: Nullable<UserTypes>
  isVerified?: Nullable<number>
}

interface ISearchOptions extends IFormSearch, IDataListFilter {}

const authStore = useAuthStore()
const userStore = useUserStore()
const route = useRoute()
const { currentUser } = storeToRefs(authStore)
const { users } = storeToRefs(userStore)

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
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Họ tên',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Loại tài khoản',
    dataIndex: 'type',
    key: 'type',
    sorter: true,
    showSorterTooltip: { title: 'Nhấn để sắp xếp' }
  },
  {
    title: 'Xác thực',
    dataIndex: 'isVerified',
    key: 'isVerified',
    sorter: true,
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

const userTypes: ISelectOption<UserTypes>[] = USER_TYPES.map(
  ({ value, title }) => ({ value, label: title })
)

const userVerifyStatuses: ISelectOption<number>[] = USER_VERIFY_STATUSES.map(
  ({ value, title }) => ({ value, label: title })
)

const itemDelete = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const itemVerify = ref<IFormConfirmState<IUser>>({
  value: null,
  isOpen: false
})

const searchOptions = computed(() => {
  const params: ISearchOptions = { ...dataListSearchOptions.value }
  const query = route.query

  if (query.username) {
    params.username = query.username as string
  }

  if (query.fullName) {
    params.fullName = query.fullName as string
  }

  if (query.type !== undefined) {
    params.type = query.type as unknown as UserTypes
  }

  if (query.isVerified !== undefined) {
    params.isVerified = Number(query.isVerified)
  }

  return params
})

const formSearch = ref<IFormSearch>({
  username: '',
  fullName: '',
  type: undefined,
  isVerified: undefined
})

const formRef = ref<FormInstance>()

const initFromQuery = () => {
  initDataListSearchFromQuery()

  const { username, fullName, type, isVerified } = route.query
  formSearch.value = {
    username: username as string,
    fullName: fullName as string,
    type: type !== undefined ? Number(type) : undefined,
    isVerified: isVerified !== undefined ? Number(isVerified) : undefined
  }
}

const resetFormSearch = () => {
  formRef.value?.resetFields()
  onFinish(formRef.value?.getFieldsValue() as IFormSearch)
}

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

const onFinish = async (values: IFormSearch) => {
  const query: LocationQueryRaw = {
    ...route.query,
    username: values.username ?? undefined,
    fullName: values.fullName ?? undefined,
    type: values.type !== undefined ? String(values.type) : undefined,
    isVerified:
      values.isVerified !== undefined ? String(values.isVerified) : undefined
  }

  if (isSearchChanged(removeUndefined(query), route.query)) {
    query.offset = undefined
  }

  pushRoute(removeUndefined(query))
}

const getUsers = async () => {
  try {
    isLoading.value = true
    await userStore.getUsers(searchOptions.value)
  } finally {
    isLoading.value = false
  }
}

const filterOption = (input: string, option: ISelectOption<string>) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

onMounted(() => {
  initFromQuery()
  getUsers()
})

onBeforeUnmount(() => {
  userStore.reset()
})

watch(route, () => {
  initDataListSearchFromQuery()
  getUsers()
})
</script>

<template>
  <PageHeader
    title="Người dùng"
    backIcon=""
    style="padding-left: 0; padding-right: 0"
  />

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
        <FormItem label="Tên đăng nhập" name="username">
          <AInput v-model:value="formSearch.username" allowClear />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Họ tên" name="fullName">
          <AInput v-model:value="formSearch.fullName" allowClear />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Loại tài khoản" name="type">
          <ASelect
            v-model:value="formSearch.type"
            allowClear
            showSearch
            :options="userTypes"
            :filterOption="filterOption"
          />
        </FormItem>
      </Col>
      <Col :span="24" :xl="6">
        <FormItem label="Xác thực" name="isVerified">
          <ASelect
            v-model:value="formSearch.isVerified"
            allowClear
            showSearch
            :options="userVerifyStatuses"
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
    :dataSource="users"
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
