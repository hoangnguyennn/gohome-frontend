<script setup lang="ts">
import { Table, Divider, Modal, Button, Row, PageHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { IWard } from '../../interfaces'
import { usePostStore } from '../../store/stores/postStore'
import { useWardStore } from '../../store/stores/wardStore'

const postStore = usePostStore()
const { posts } = storeToRefs(postStore)

const columns = ref([
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: 'Created by',
    dataIndex: 'createdBy',
    key: 'createdBy'
  },
  {
    title: 'Commission',
    dataIndex: 'commission',
    key: 'commission'
  },
  {
    title: 'Verification Status',
    dataIndex: 'verifyStatus',
    key: 'verifyStatus'
  },
  {
    title: 'Deny Reason',
    dataIndex: 'denyReason',
    key: 'denyReason'
  },
  {
    title: 'Show/Hide',
    dataIndex: 'isHide',
    key: 'isHide'
  },
  {
    title: 'Hidden At (Latest)',
    dataIndex: 'hiddenAt',
    key: 'hiddenAt'
  },
  {
    title: 'Shown At (Latest)',
    dataIndex: 'shownAt',
    key: 'shownAt'
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt'
  },
  {
    title: 'Actions',
    key: 'actions'
  }
])

const itemWillDelete = ref<IWard | null>(null)
const isOpenConfirmDeletePost = ref(false)

const getLink = (id: string, action: 'view' | 'edit' | 'delete') => {
  return `/posts/${id}/${action}`
}

const onClickDelete = (item: IWard) => {
  itemWillDelete.value = item
  isOpenConfirmDeletePost.value = true
}

const onDelete = () => {
  console.log('delete')
  isOpenConfirmDeletePost.value = false
}

onMounted(() => {
  postStore.getPosts()
})
</script>

<template>
  <PageHeader
    title="Bài đăng"
    back-icon=""
    style="padding-left: 0; padding-right: 0"
  >
    <template #extra>
      <router-link to="/posts/create">
        <Button type="primary">Thêm bài đăng mới</Button>
      </router-link>
    </template>
  </PageHeader>

  <Table :columns="columns" :data-source="posts">
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
    v-model:visible="isOpenConfirmDeletePost"
    title="Delete a ward?"
    @ok="onDelete"
  >
    {{ itemWillDelete?.id }}
  </Modal>
</template>

<route lang="yaml">
meta:
  layout: default
  title: Danh sách bài đăng
</route>
