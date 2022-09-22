<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IUser, Nullable } from '../../interfaces'
import { useUserStore } from '../../store/stores/userStore'

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
    dataIndex: 'fullname',
    key: 'fullname'
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

const itemWillDelete = ref<Nullable<IUser>>(null)
const isOpenConfirmDeleteUser = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/users/${id}/${action}`
}

const onClickDelete = (item: IUser) => {
  itemWillDelete.value = item
  isOpenConfirmDeleteUser.value = true
}

const onDelete = () => {
  console.log('delete')
  isOpenConfirmDeleteUser.value = false
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
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteUser"
    title="Xóa người dùng?"
    @ok="onDelete"
  >
    Bạn có chắc chắn muốn xóa người dùng "{{
      itemWillDelete?.fullName || itemWillDelete?.username
    }}"?
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách người dùng
</route>
