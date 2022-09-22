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
    title: 'Username',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: 'Fullname',
    dataIndex: 'fullname',
    key: 'fullname'
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Actions',
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
        <router-link :to="getLink(record.id, 'view')">View</router-link>
        <Divider type="vertical" />
        <router-link :to="getLink(record.id, 'edit')">Edit</router-link>
        <Divider type="vertical" />
        <a @click.prevent="onClickDelete(record)">Delete</a>
      </Row>
    </template>
  </Table>

  <Modal
    v-model:visible="isOpenConfirmDeleteUser"
    title="Delete the user?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách người dùng
</route>
