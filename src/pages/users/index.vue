<script setup lang="ts">
import { Table, Divider, Modal, Tag, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IUser, IFormConfirmState } from '~/interfaces'
import { UserTypes } from '~/interfaces/enums'
import { useUserStore } from '~/store/stores/userStore'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)

const columns = ref([
  {
    title: '#',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Họ tên',
    dataIndex: 'fullName',
    key: 'fullName'
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type'
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

const getUserTypeText = (record: IUser) => {
  switch (record.type) {
    case UserTypes.ROOT:
      return 'Root'
    case UserTypes.ADMIN:
      return 'Quản trị viên'
    case UserTypes.EMPLOYEE:
      return 'Nhân viên'
  }
}

const getUserTypeColor = (record: IUser) => {
  switch (record.type) {
    case UserTypes.ROOT:
      return 'error'
    case UserTypes.ADMIN:
      return 'success'
    case UserTypes.EMPLOYEE:
      return 'default'
  }
}

onMounted(() => {
  userStore.getUsers()
})
</script>

<template>
  <PageHeader
    title="Người dùng"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  ></PageHeader>

  <Table :columns="columns" :data-source="users">
    <template #bodyCell="{ column, record }">
      <Row v-if="column.key === 'actions'">
        <router-link :to="getLink(record.id, 'view')">Xem</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Sửa</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Xóa</a>
      </Row>
      <template v-else-if="column.key === 'type'">
        <Tag :color="getUserTypeColor(record)">
          {{ getUserTypeText(record) }}
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
</route>
